import { Request, Response } from 'express';
import {
  getHealthLogs,
  getHealthLogById,
  gethealthLogsByUserId,
  gethealthLogsByPlantId,
  createHealthLog,
  deleteHealthLogById,
  updateHealthLogById,
} from '../mongodb/models/healthlog.js';
import { getPlantById } from '../mongodb/models/plant.js';
import { uploadOnCloudinary } from '../utlils/cloudinary.js';
import { convertoBuffer, provideHealthlog } from '../utlils/gemini.js';
import { getValuePair, setValuePair } from '../utlils/redis.js';

export const getAllHealthLogs = async (req: Request, res: Response): Promise<Response> => {
  try {

    const healthLogs = await getHealthLogs();
    return res.status(200).json(healthLogs);
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
};

export const getHealthLog = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'No id provided' });
    }

    const redis = await getValuePair(`healthlog/${id}`);

    if(redis){
      return res.json(redis);
    }
    const healthLog = await getHealthLogById(id);
    if (!healthLog) {
      return res.status(404).json({ message: 'HealthLog not found' });
    }
    await setValuePair(`healthlog/${id}`, healthLog);
    return res.json(healthLog);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getHealthLogsByUserId = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'No user_id provided' });
    }
    
    const redis = await getValuePair(`healthlogs/user/${id}`);

    if(redis){
      return res.json(redis);
    }

    
    const healthLogs = await gethealthLogsByUserId(id);
    if (!healthLogs) {
      return res.status(404).json({ message: 'HealthLogs not found' });
    }
    await setValuePair(`healthlogs/user/${id}`, healthLogs);
    return res.json(healthLogs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getHealthLogsByPlantId = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'No plant_id provided' });
    }

    const redis = await getValuePair(`healthlogs/plant/${id}`);

    if(redis){
      return res.json(redis);
    }
    const healthLogs = await gethealthLogsByPlantId(id);
    if (!healthLogs) {
      return res.status(404).json({ message: 'HealthLogs not found' });
    }
    await setValuePair(`healthlogs/plant/${id}`, healthLogs);
    return res.json(healthLogs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const createNewHealthLog = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { user_id, plant_id, comment, dateOfDiagnosis, name } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: 'File is required' });
    }
    console.log(req.body);

    if (!user_id || !plant_id || !dateOfDiagnosis) {
      return res.status(400).json({ message: 'User ID, Plant ID, and date of diagnosis are required' });
    }

    const plant = await getPlantById(plant_id);
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }
    const supportData = `dateofPlanting${plant.dateOfPlanting.toISOString()}${plant.comment}${comment}`;
    console.log(supportData);

    const bufferData = convertoBuffer(req.file.path, req.file.mimetype);
    console.log("bufferData", bufferData.inlineData.data);

    const diagnosisByModel = await provideHealthlog(supportData, bufferData);
    console.log(diagnosisByModel);

    const image = await uploadOnCloudinary(req.file.path);
    if (!image || !image.secure_url) {
      return res.status(500).json({ message: 'Failed to upload image' });
    }
    const imageLink = image.secure_url;

    const healthLog = await createHealthLog({
      user_id,
      plant_id,
      attachment: imageLink,
      name,
      comment,
      dateOfDiagnosis,
      diagnosisByModel,
    });

    return res.status(201).json(healthLog);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deleteHealthLog = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const deletedHealthLog = await deleteHealthLogById(id);
    return res.json(deletedHealthLog);
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
};

export const updateHealthLog = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { user_id, plant_id, attachment, comment, dateOfDiagnosis, diagnosisByModel } = req.body;

    if (!user_id || !plant_id || !dateOfDiagnosis) {
      return res.sendStatus(400);
    }

    const updatedHealthLog = await updateHealthLogById(id, {
      user_id,
      plant_id,
      attachment,
      comment,
      dateOfDiagnosis,
      diagnosisByModel,
    });

    return res.status(200).json(updatedHealthLog);
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
};