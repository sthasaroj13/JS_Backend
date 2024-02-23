//require('dotenv').config({path:'./env'})

//this is more improve version

import dotenv from 'dotenv'
import connectDB from "./db/index.js";
dotenv.config({
    path:'./env'
})



connectDB()

/* this is first approach to connect data base

import { express } from "express";
const app =express()
(async()=>{

    try {
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       app.on('error',(error)=>{
        console.log('error in app',error);

       })
       app.listen(process.env.PORT,()=>{
        console.log(`app is listing  on port ${process.env.PORT}`);
        
       })
        
    } catch (error) {
        console.error("ERROR:",error);
    }

})() */