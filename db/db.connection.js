import mongoose from "mongoose";


export function dbConnection(){ mongoose.connect(process.env.DB_online).then(()=>{
    console.log("connect successfully");
}).catch((err)=>{
    console.log("faild to connect there are error" + err);
})}

export default dbConnection

