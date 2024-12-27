import mongoose from "mongoose";

export const dbconnection =()=>{
    mongoose.connect(process.env.MONG0_URI,{
        dbName:"MERN_STACK_JOB_SEEKING"
    }).then(()=>{
        console.log('connected to database!')
    }).catch((err)=>{
        console.log(`Some errror occured while connecting to database:${err}`);
    });
};
