import express from "express";

import { getAllHealthLogs, getHealthLog, getHealthLogsByUserId, getHealthLogsByPlantId, createNewHealthLog, deleteHealthLog, updateHealthLog } from '../controllers/healthlog.controller.js';
import { isLoggedIn, isOwner, upload } from "../middleware/index.js";

const router = express.Router();

router.route('/getAllHealthLogs').get(isLoggedIn, getAllHealthLogs);
router.route('/getHealthLog/:id').get(isLoggedIn, getHealthLog);
router.route('/getHealthLogsByUserId/:id').get(isLoggedIn, isOwner, getHealthLogsByUserId);
router.route('/getHealthLogsByPlantId/:id').get(isLoggedIn, getHealthLogsByPlantId);
router.route('/createNewHealthLog').post(isLoggedIn,  upload.single('attachment'), createNewHealthLog);
router.route('/deleteHealthLog/:id').delete(isLoggedIn, isOwner, deleteHealthLog);
router.route('/updateHealthLog/:id').patch(isLoggedIn, isOwner, updateHealthLog);

export default router;