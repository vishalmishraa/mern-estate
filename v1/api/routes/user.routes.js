import express from 'express';
import { test , updateUser, deleteUser  , getUserListings,getUser} from '../controllers/user.conrollers.js';
import { verifyToken } from '../utilities/verifyUser.js';
import { signOut } from '../controllers/auth.controllers.js';
const router = express.Router();

router.get('/test',test);
router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/signout', signOut);
router.get('/listings/:id',verifyToken,getUserListings);
router.get('/get/:id',verifyToken,getUser);

export default router;