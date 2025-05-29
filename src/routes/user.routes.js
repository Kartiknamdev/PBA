import { Router } from "express";
import verifyJwt from "../middleware/auth.middleware.js";
import {  loginUser, logoutUser, registerUser,updateDetails } from "../controller/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { get } from "mongoose";

const userRouter = Router();

userRouter.route("/register").post(registerUser)// done
userRouter.route("/login").post(loginUser)// done
userRouter.route("/logout").post(verifyJwt,logoutUser)// done
userRouter.route("/update_details").post(verifyJwt,upload.single("photo"),updateDetails)// done
 
export default userRouter;
