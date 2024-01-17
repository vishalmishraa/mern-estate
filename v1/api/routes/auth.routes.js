import express from 'express';
import { signin, signup } from '../controllers/auth.controllers.js';
import exp from 'constants';
const router = express.Router();

router.post('/signup',signup);
router.post('/signin',signin);

export default router;