import express from 'express';
import { test , updateUser } from '../controllers/user.conrollers.js';
import { verifyToken } from '../utilities/verifyUser.js';
const router = express.Router();

router.get('/test',test);
router.post('/update/:id', verifyToken, updateUser);

export default router;