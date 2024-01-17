import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';


/**************** MONGO DB CONNECTION *********************** */

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
let db = async () => {
    await mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log("database connected");
    }).catch(err => {
        console.log('ERROR', err.message);
    });//connecting mongo -> THE NAME OF WHAT WE WILL LOOK FOR IN MONGO

}
db();


const app = express();

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});