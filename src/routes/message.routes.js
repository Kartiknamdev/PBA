import { Router } from "express";
import verifyJwt from "../middleware/auth.middleware.js";
import {
  createConversation,
  loadAllConversations,
  loadMessages,
  loadRecieverDetails,
  sendMessage,
} from "../controller/message.controller.js";

const messageRouter = Router();
messageRouter.route("/create-conversation").post( createConversation);
messageRouter.route("/get-all-conversations").get( loadAllConversations);
messageRouter.route("/get-all-reciever-details").post(loadRecieverDetails);
messageRouter.route("/get-messages").post(loadMessages);
messageRouter.route("/send-message").post(sendMessage);
export default messageRouter;
