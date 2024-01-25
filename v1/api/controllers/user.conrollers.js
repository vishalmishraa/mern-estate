import bcryptjs from 'bcryptjs'
import User from '../models/user.model.js';
import { errorHandler } from '../utilities/error.js';
import Listing from '../models/listing.model.js';


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

export const deleteUser = async (req,res,next)=>{  
            if(req.user.id !== req.params.id){
                return next(errorHandler(403, 'you can only delete your own account'));
            }
            try {
                await User.findByIdAndDelete(req.params.id);
                res
                    .clearCookie('access_token')
                    .status(200)
                    .json({
                        success:true,
                        message:'user has been deleted'
                    });
                    
               
            } catch (error) {
                next(error);
            }
}

export const getUserListings = async (req,res,next)=>{
    if(req.user.id === req.params.id){
        try {
            const listing  = await Listing.find({userRef:req.params.id});
            res.status(200).json(listing);
        } catch (error) {
            next(error);
        }
    }else{
        console.log({
            message:'you can only view your own listings',
            re22: req.user.id,
            re21:req.params.id
        })
        return next(errorHandler(403, 'you can only view your own listings'));
    }
}