import { Router } from "express";
import verifyJwt from "../middleware/auth.middleware.js";
import {
    BrowseOpenTasks,
    createTask,
} from "../controller/task.controller.js";
import { upload } from "../middleware/multer.middleware.js";
const taskRouter = Router();
taskRouter.route("/create-task").post(
    verifyJwt,
    upload.array("attachments"),
    createTask
);
taskRouter.route("/browse-task").get(BrowseOpenTasks); //http://localhost:3000/api/v1/tasks/browse-task?userId=682b4523bff8040a1fd13f8f

export default taskRouter;