import { ApiError } from "../utility/ApiError.js";
import { ApiResponse } from "../utility/ApiResponse.js";
import { asyncHandler } from "../utility/asynchHandler.js";
import { uploadOnCloudinary } from "../utility/cloudinary.js"
import { Task } from "../models/task.model.js";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";
const createTask = asyncHandler(async (req, res) => {
  const {
    taskTitle,
    requirements,
    description,
    category,
    budget,
    deadline,
    createdBy,
    status,
    tags,
    attachments,
  } = req.body;
  const userId = req.user._id;
  const currentUser = await User.findById(userId);
  if (!currentUser) throw new ApiError(404, "User not found");

  let attachmentUrls = [];
  if (req.files && req.files.length > 0) {
    console.log("files in createTask controller: ",req.files)
    for (const file of req.files) {
      try {
        
      const result = await uploadOnCloudinary(file.buffer);
      console.log("result in task controller: ",result);
      attachmentUrls.push(result); // use .url if result is a full object
      } catch (error) {
        // console.log(error)
        throw new ApiError(500, "Failed to upload attachments");
      }
    }
  }
  // Generate a unique TaskId
  const task = await Task.create({
    taskTitle,
    requirements,
    description,
    category,
    budget,
    deadline,
    tags,
    createdBy: userId,
    status,
    attachments: attachmentUrls,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task created successfully"));
});

const BrowseOpenTasks = asyncHandler(async (req, res) => {
  // console.log("BrowseOpenTasks called");
  // Check if the user is logged in
  const { userId } = req.query;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Invalid or missing userId"));
  }

  try {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const tasks = await Task.find({
      status: "open",
      createdBy: { $ne: userObjectId }, // Exclude tasks created by the logged-in user
    }).sort({ createdAt: -1 });
    // Check if tasks exist
    if (!tasks || tasks.length === 0) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "No open tasks found"));
    }
    // console.log("Fetched tasks:", tasks);
    return res
      .status(200)
      .json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
  } catch (error) {
    // Handle errors properly, log them, and send an appropriate response
    console.error("Error fetching tasks:", error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, null, "Failed to fetch tasks: " + error.message)
      ); //Include the error message
  }
});
export { 
    createTask,
     BrowseOpenTasks
    }; 
