import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../mongodb/models/user.js';
import multer from "multer";
import { CustomRequest } from './types.js';



export const isLoggedIn = async (req: CustomRequest, res: Response, next: NextFunction) => {
  // console.log(req.header('Authorization'));

  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Please login to access resource',
    });
  }
 
  try {
    if (!process.env.AUTH_SECRET) {
      throw new Error('AUTH_SECRET is not set');
    }
    const decoded = jwt.verify(token, process.env.AUTH_SECRET) as JwtPayload;
    
 
    if (!decoded._id) {
      throw new Error('Invalid token payload');
    }
 
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    //ts-ignore
    req.user = user;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const isOwner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const token = req.header('Authorization');
    if (!token || !process.env.AUTH_SECRET) {
      throw new Error('Authentication required');
    }

    const decodedToken = jwt.verify(token, process.env.AUTH_SECRET) as JwtPayload;
    const currentUserId = decodedToken._id;

    if (!id || !currentUserId) {
      return res.status(400).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    if (currentUserId.toString() !== id) {
      return res.status(403).json({
        success: false,
        message: 'User not authorized',
      });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: 'Server error',
    });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

export const upload = multer({ storage });