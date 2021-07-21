import express from "express";
import { getEdit, getUpload, postEdit, postUpload, watch, deleteVideo } from "../controllers/videoController";
import { videoUpload } from "../localsMiddleware";

const videoRouter = express.Router();

videoRouter.route('/upload').get(getUpload).post(videoUpload.fields([{ name: "video", maxCount: 1 }, { name: "thumb", maxCount: 1 }]), postUpload);
videoRouter.get('/:id([0-9a-f]{24})', watch);
videoRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit);
videoRouter.route("/:id([0-9a-f]{24})/delete").get(deleteVideo);



export default videoRouter;