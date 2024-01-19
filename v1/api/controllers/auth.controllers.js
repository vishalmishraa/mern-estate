import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utilities/error.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

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

export const signin = async (req, res, next) => {
    const {email,password} = req.body;
    try {
        const validUser = await User.findOne({email});
        if(!validUser){
            return next(errorHandler(404, 'User not found'));
        }
        const validPassword = await bcryptjs.compareSync(password, validUser.password);
        if(!validPassword){
            return next(errorHandler(400, 'Wrong Credentials'));
        }
        //making token because user is valid and password is valid too and it needed because we need to send token to the client so that client can use it to access protected routes
        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET);
        const {password: pass, ...user} = validUser._doc;//we are destructuring password from user object and storing it in pass variable and storing rest of the user object in user variable
        res  
            .cookie('access_token', token, {httpOnly: true})
            .status(200)
            .json(user);
        console.log("------------USER LOGIN----------------");
        console.log(user);
        console.log("----------------------------");

    } catch (error) {
        next(error);
    }
};


export const google = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if(user){
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
            const {password: pass, ...rest} = user._doc;//we are destructuring password from user object and storing it in pass variable and storing rest of the user object in user variable
            res  
                .cookie('access_token', token, {httpOnly: true})
                .status(200)
                .json(rest);
        }else{
            const generatedPassword = Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8);
            const hashedPassword = await bcryptjs.hash(generatedPassword, 10);
            
            const newUser = new User({
                username: req.body.name.split(" ").join("").toLowerCase()+"_"+Math.random().toString(36).slice(-4),
                email: req.body.email, password: hashedPassword , 
                avatar: req.body.photo , google: true
            });
            await newUser.save();

            //making token because user is valid and password is valid too and it needed because we need to send token to the client so that client can use it to access protected routes
            const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET);
            const {password: pass, ...rest} = newUser._doc;//we are destructuring password from user object and storing it in pass variable and storing rest of the user object in user variable
            //res for sending token to the client
            res  
                .cookie('access_token', token, {httpOnly: true})
                .status(200)
                .json(rest);

        }
        
    } catch (error) {
        next(error);
    }
}