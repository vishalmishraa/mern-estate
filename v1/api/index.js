import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app = express();
import mongoose from 'mongoose';
import UserRoutes from './routes/user.routes.js'; 
import authRoutes from './routes/auth.routes.js';


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
app.use(express.json());
app.use('/api/user',UserRoutes);
app.use('/api/auth',authRoutes);

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
app.listen(3000, () => {
    console.log('Server is running on: http://localhost:3000');
});