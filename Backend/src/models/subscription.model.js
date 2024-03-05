import mongoose, { Schema }  from "mongoose"
const subscriptionSchema = new mongoose.Schema({
subscriber :{
    type:Schema.Types.ObjectId, //one who is subscribing
    ref :'User'
},
channel:{
    type:Schema.Types.ObjectId, //one who is subscriber is subscribing
    ref :'User'
}


},{timestamps:true})


export const Subscription = new mongoose.model("Subscription",subscriptionSchema)