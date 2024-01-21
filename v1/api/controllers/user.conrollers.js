import bcryptjs from 'bcryptjs'
import User from '../models/user.model.js';
import { errorHandler } from '../utilities/error.js';


export const test = (req,res)=>{
    res.json({
        message:"Hello World hahahah"
    });
} ;


export const updateUser= async (req,res,next)=>{

    if(req.user.id !== req.params.id){
        return next(errorHandler(403, 'you can only update your own account'));
    }
    try {
        if(req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updateUser = await User.findByIdAndUpdate(
            req.params.id, 
            {
               $set:{
                     username:req.body.username,
                     email:req.body.email,
                     password:req.body.password,
                     avatar:req.body.avatar,
               }
            },
            {
                new:true
            }
        );
      
            const {password,...others} = updateUser._doc;  
            res
                .status(200)
                .json({
                    success:true,
                    data:others
                });

    } catch (error) {
       next(error);
    }
}