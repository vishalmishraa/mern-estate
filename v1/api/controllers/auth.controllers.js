import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { error } from '../utilities/error.js';
export const signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.json('User added');
        console.log("----------------------------");
        console.log(newUser);
        console.log("----------------------------");
    } catch (err) {
        next(err);
    }
};
