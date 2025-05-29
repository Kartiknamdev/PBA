import mongoose from "mongoose";
import { type } from "os";

const taskSchema = new mongoose.Schema({
  taskTitle: {
    type: String,
    required: true
  },
  requirements: {  
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  budget: {
    type: Number,   
    required: true
  },
  deadline: {
    type: String, 
    required: true
  },
  category: {
    type: String,  
    enum: [
      "ProofReading", "Editing", "Formating", "transcription",
      "Resume", "Legal", "Academic", "Bussiness", "Other"
    ],
    required: true
  },
  tags: {
    type: [String],  
    required: true
  },
  attachments: {  
    type: [String],
    required: true
  },
  createdBy: { 
    type:String,
    required: true
  },
  status: {
    type: String,
    enum: ["open", "in progress", "completed", "cancelled"],
    default: "open"
  },
}, { timestamps: true });  

export const Task = mongoose.model("Task", taskSchema);
