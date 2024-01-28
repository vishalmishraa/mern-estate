import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app = express();
import mongoose from 'mongoose';
import UserRoutes from './routes/user.routes.js'; 
import authRoutes from './routes/auth.routes.js';
import listingRoutes from './routes/listing.routes.js';
import cookieParser from 'cookie-parser';
import path from 'path';


/**************** MONGO DB CONNECTION *********************** */

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
let db = async () => {
    await mongoose.connect(process.env.DB_URL).then(() => {
        console.log("database connected");
    }).catch(err => {
        console.log('ERROR', err.message);
    });//connecting mongo -> THE NAME OF WHAT WE WILL LOOK FOR IN MONGO

}
db();

/* app uses */

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/api/user',UserRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/listing',listingRoutes);
app.use(express.static(path.join(path.resolve(), '/client/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(path.resolve(), '/client/dist/index.html'));
})


//************* midleware *************** */

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;//500 means internal server error
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
       success:false,
       statusCode ,
    message
    });
});

/* app routes */
app.listen(process.env.PORT, () => {
    console.log('Server is running on: http://localhost:3000');
});