import { Request, Response } from 'express';
import { getPlants, getPlantById, getPlantsByUserId, createPlant, deletePlantById, updatePlantById } from '../mongodb/models/plant.js';
import { uploadOnCloudinary } from '../utlils/cloudinary.js';
import { getValuePair, setValuePair } from '../utlils/redis.js';

export const getAllPlants = async (req: Request, res: Response): Promise<Response> => {
  try {
    const plants = await getPlants();
    return res.status(200).json(plants);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const getPlant = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'No id provided' });
    }

    const redis = await getValuePair(`plant/${id}`);


    if(redis){
      return res.json(redis);
    }


    const plant = await getPlantById(id);
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    await setValuePair(`plant/${id}`, plant);
    return res.json(plant);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getPlantsByuserId = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'No user_id provided' });
    }
    const redis = await getValuePair(`plants/user/${id}`);

    if(redis){
      return res.json(redis);
    }

    const plants = await getPlantsByUserId(id);
    if (!plants) {
      return res.status(404).json({ message: 'Plants not found' });
    }
    await setValuePair(`plants/user/${id}`, plants);
    return res.json(plants);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const createNewPlant = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { user_id, name, species, dateOfPlanting, comment } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }
    const { path } = req.file;
    if (!user_id || !name || !species || !dateOfPlanting) {
      return res.status(400).json({ message: 'User ID, name, species, and date of planting are required' });
    }
    const imageURL = await uploadOnCloudinary(path);
    if (!imageURL) {
      return res.status(500).json({ message: 'Failed to upload image' });
    }
    const image = imageURL.secure_url;
    const plant = await createPlant({ user_id, name, species, dateOfPlanting, comment, image });
    return res.status(201).json(plant);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deletePlant = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const deletedPlant = await deletePlantById(id);
    return res.json(deletedPlant);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const updatePlant = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { user_id, name, species, dateOfPlanting, comment, image } = req.body;
    if (!user_id || !name || !species || !dateOfPlanting) {
      return res.sendStatus(400);
    }
    const updatedPlant = await updatePlantById(id, { user_id, name, species, dateOfPlanting, comment, image });
    return res.status(200).json(updatedPlant);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};