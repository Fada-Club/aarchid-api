import { Request, Response } from 'express'; // Import Request and Response types
import { getuserByEmail, createUser } from '../mongodb/models/user';
import { generateAuthToken } from '../helpers/index';
import { uploadOnCloudinary } from '../utlils/cloudinary';

export const register = async (req: Request, res: Response) => { // Add explicit types for req and res
    try {
        console.log(req.body);
        const { email, name, plantSpecies } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: 'Image file is required' });
          }
        const { path } = req.file;

        if (!email || !name || !plantSpecies) {
            return res.sendStatus(400);
        }

        const userExists = await getuserByEmail(email);

        if (userExists) {
            return res.status(409).send('Email already exists');
        }

        const imageURL = await uploadOnCloudinary(path);
        if (!imageURL) { // Check if imageURL is not null
            return res.status(500).send('Failed to upload image');
        }
        const image = imageURL.secure_url;

        const newUser = await createUser({
            email: email,
            name: name,
            image: image,
            plantSpecies: plantSpecies
        });

        const token = await generateAuthToken(newUser._id.toString()); // Convert ObjectId to string
        console.log(token);
        return res.status(200).json({ newUser, token }).end();

    } catch (e) {
        console.log(e);
        res.status(500).send('Server error');
    }
};