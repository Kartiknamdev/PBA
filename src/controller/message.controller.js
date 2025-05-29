import mongoose, { isValidObjectId } from "mongoose";
import { Message } from "../models/message.model.js";
import { Conversation } from "../models/Conversation.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utility/ApiError.js";
import { ApiResponse } from "../utility/ApiResponse.js";
import { asyncHandler } from "../utility/asynchHandler.js";
// ✅ Create Conversation
const createConversation = asyncHandler(async (req, res) => {
  const { senderId, recieverId } = req.body;

  // console.log("Reached backend createConversation senderId:", senderId);

  if (!senderId || !recieverId) {
    return res
      .status(400)
      .json(new ApiError(400, "Sender ID and Receiver ID are required"));
  }

  // Check if conversation already exists
  const existingConversation = await Conversation.findOne({
    participants: { $all: [senderId, recieverId] },
  });

  if (existingConversation) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          existingConversation,
          "Conversation already exists"
        )
      );
  }

  // Create new conversation
  const newConversation = await Conversation.create({
    sender: senderId,
    participants: [senderId, recieverId],
  });

  if (!newConversation) {
    return res
      .status(500)
      .json(new ApiError(500, "Failed to create conversation"));
  }
  //  console.log("New conversation created:", newConversation);
  return res
    .status(201)
    .json(
      new ApiResponse(201, newConversation, "Conversation created successfully")
    );
});

// ✅ Load All Conversations
const loadAllConversations = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  // console.log("Reached backend loadAllConversations userId:", userId);
  if (!userId || !isValidObjectId(userId)) {
    return res
      .status(400)
      .json(new ApiError(400, "Invalid or missing user ID"));
  }
  const senderObjectId = new mongoose.Types.ObjectId(userId);
  // Find conversations for the user
  // console.log("sendeObjectId:", senderObjectId);
  const conversations = await Conversation.find({ 
    participants:{$in: [senderObjectId]}
   });
  // console.log("Conversations found:", conversations);
  if (!conversations || conversations.length === 0) {
    return res.status(404).json(new ApiError(404, "No conversations found"));
  }

  const conversationData = conversations.map((conversation) => {
    const recieverId = conversation.participants.find(
      (id) => id.toString() !== userId
    );

    return {
      _id: conversation._id,
      recieverId,
      lastMessage: conversation.lastMessage,
    };
  });

  return res
    .status(200)
    .json(new ApiResponse(200, conversationData, "Conversations loaded"));
});

// ✅ Load Opponent Details
const loadRecieverDetails = asyncHandler(async (req, res) => {
  const { recieverIds } = req.body;
  if (!recieverIds || !Array.isArray(recieverIds) || recieverIds.length === 0) {
    return res
      .status(400)
      .json(new ApiError(400, "Opponent user IDs not provided"));
  }

  const opponentUsers = await User.find({
    _id: { $in: recieverIds },
  }).select("_id photo fullName updatedAt");
   if (!opponentUsers || opponentUsers.length === 0) {
    return res.status(404).json(new ApiError(404, "Opponent users not found"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        opponentUsers,
        "Opponent user details loaded successfully"
      )
    );
});

// ✅ Load Messages
const loadMessages = asyncHandler(async (req, res) => {
  const { senderId, conversationId, timeStamp, limit } = req.body;

  if (
    !senderId ||
    !isValidObjectId(senderId) ||
    !conversationId ||
    !isValidObjectId(conversationId)
  ) {
    return res
      .status(400)
      .json(new ApiError(400, "Invalid or missing conversation ID"));
  }

  const query = { 
     conversation: conversationId,
    };

  if (timeStamp) {
    query.createdAt = { $lt: new Date(timeStamp) };
  }

  const messages = await Message.find(query)
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .lean();
  // console.log(messages);
  return res
    .status(200)
    .json(new ApiResponse(200, messages.reverse(), "Messages loaded"));
});

// ✅ Send Message
const sendMessage = asyncHandler(async (req, res) => {
  const { content, conversationId, senderId, recieverId } = req.body;
  if (!content || !conversationId || !senderId || !recieverId) {
    return res.status(400).json(new ApiError(400, "All fields are required"));
  }

  const newMessage = await Message.create({
    content,
    conversation: conversationId,
    sender: senderId,
    reciever: recieverId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newMessage, "Message sent successfully"));
});

export {
  createConversation,
  loadAllConversations,
  loadRecieverDetails,
  loadMessages,
  sendMessage,
};
