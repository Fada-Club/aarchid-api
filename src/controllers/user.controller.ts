import { Request, Response } from 'express';
import { generateAuthToken } from '../helpers/index.js';
import { getUsers, getUserById, getuserByEmail } from '../mongodb/models/user.js';
import { getValuePair, setValuePair } from '../utlils/redis.js';

export const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
  
  try {
    const users = await getUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const getUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    const redis = await getValuePair(`users/${id}`);


    if(redis){
      return res.json(redis);
    }

    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await setValuePair(`users/${id}`, user);
    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const { id } = req.params;
//     const deletedUser = await deleteUserById(id);
//     return res.json(deletedUser);
//   } catch (error) {
//     console.error(error);
//     return res.sendStatus(400);
//   }
// };

export const updateUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { plantSpecies } = req.body;
    if (!id) {
      return res.sendStatus(400);
    }

    const user = await getUserById(id);
    if (!user) {
      return res.sendStatus(404);
    }

    user.plantSpecies = plantSpecies;
    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
};

export const getUserByEmailAuth = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email } = req.params;
    const user = await getuserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = await generateAuthToken(user._id.toString());
    return res.json({ user, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getUserByEmail = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email } = req.params;
    const user = await getuserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};