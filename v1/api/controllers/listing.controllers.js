import Listing from '../models/listing.model.js';
import { errorHandler } from '../utilities/error.js';


export const createListing = async (req, res,next) => {

    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json({
            success: true,
            data: listing
        });
    } catch (error) {
            next(error);
    }


}

export const deleteListing = async (req, res,next) => {
    const listing = await Listing.findById(req.params.id);
    if(!listing){
        return res.status(404).json({
            success: false,
            error: "Listing not found found"
        });
    }

    if(req.user.id != listing.userRef){
        return res.status(401).json({
            success: false,
            error: "You are not authorized to delete this listing"
        });
    }

    try {
        await Listing.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            success: true,
            message : "Listing deleted"
        });
    } catch (error) {
        next(error);
    }

}

export const updateListing = async (req, res,next) => {
    const listing = await Listing.findById(req.params.id);
    if(!listing){
        return next(new errorHandler(404,"Listing not found"));
    }

    if(req.user.id != listing.userRef){
        return next(new errorHandler(401,"You are not authorized to update this listing"));
    }

    try {
        const updatedListing =  await Listing.findByIdAndUpdate(req.params.id,req.body,{new:true});
        return res.status(200).json({
            success: true,
            message : "Listing updated",
            data: updatedListing
        });
    } catch (error) {
        next(error);
    }
}

export const getListing = async (req, res,next) => {
    const listing = await Listing.findById(req.params.id);
    if(!listing){
        return next( errorHandler(404,"Listing not found"));
    }

    try {
        return res.status(200).json(

              listing
        );
    } catch (error) {
        next(error);
    }   
}

export const getListings = async (req, res,next) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;

        let offer = req.query.offer;
        if(offer==undefined || offer == "false"){
            offer = {$in: [false,true]};
        }

        let furnished = req.query.furnished;
        if(furnished==undefined || furnished == "false"){
            furnished = {$in: [false,true]};
        }

        let parking = req.query.parking;
        if(parking==undefined || parking == "false"){
            parking = {$in: [true,false]};
        }

        let type = req.query.type;
        if(type==undefined || type=="all"){
            type = {$in: ["rent","sale"]};
        }

        const searchTerm = req.query.searchTerm || '';
        const sort = req.query.sort || 'createdAt';
        const order = req.query.order || 'desc';

        const listing =  await Listing.find({
            title: {$regex: searchTerm, $options: 'i'},//regex is builtin search function in mongodb . options i means case insensitive , it doesnt care about upper or lower case,
            offer,
            furnished,
            parking,
            type
        }).sort({
            [sort]: order
        }).limit(limit).skip(startIndex);
        
        return res.status(200).json(
            listing
        );

    } catch (error) {
        next(error);
    }
}