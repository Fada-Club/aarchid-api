import express from "express";

import {getAllUsers,getUser,updateUser,getUserByEmail,getUserByEmailAuth} from '../controllers/user.controller.js';
import {isLoggedIn, isOwner} from "../middleware/index.js"


const router = express.Router();

router.route('/getUsers').get(isLoggedIn,getAllUsers);
router.route('/getUser/:id').get(isLoggedIn,isOwner,getUser);
router.route('/updateUser/:id').patch(isLoggedIn,isOwner,updateUser);
router.route('/getUserByEmailAuth/:email').get(getUserByEmailAuth);
router.route('/getUserByEmail/:email').get(isLoggedIn,getUserByEmail);


export default router;