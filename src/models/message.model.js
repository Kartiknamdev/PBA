import { timeStamp } from "console";
import { read } from "fs";
import mongoose from "mongoose";
const messageSchema = mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    conversation:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required:true
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    reciever:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    read:{
        type:Boolean,
        default:false
    },
},{timestamps:true});
export const Message = mongoose.model("Message",messageSchema);