import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app = express();
import mongoose from 'mongoose';
import UserRoutes from './routes/user.routes.js'; 


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
app.use('/api/user',UserRoutes);



/* app routes */
app.listen(3000, () => {
    console.log('Server is running on: http://localhost:3000');
});