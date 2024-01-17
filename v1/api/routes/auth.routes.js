import express from 'express';
import { signup } from '../controllers/auth.controllers.js';
import exp from 'constants';
const router = express.Router();

router.post('/signup',signup);

export default router;