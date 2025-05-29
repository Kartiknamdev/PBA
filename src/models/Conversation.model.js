import mongoose from "mongoose";
const conversationSchema = mongoose.Schema({  
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  ],
  lastMessage: {
    type: String,
    default: ''
  }

});
export const Conversation = mongoose.model("Conversation", conversationSchema);
