import express from "express";
import { deleteUser, finishGithub, getChangePassword, getEdit, githubLoginStart, logout, postChangePassword, postEdit, see } from "../controllers/userController";
import { protectorMiddleware, avatarUpload } from "../localsMiddleware";

const userRouter = express.Router();


userRouter.get('/github/start', githubLoginStart);
userRouter.get('/github/finish', finishGithub);
userRouter.route('/edit-profile').all(protectorMiddleware).get(getEdit).post(avatarUpload.single('avatar'), postEdit);
userRouter.route('/change-password').all(protectorMiddleware).get(getChangePassword).post(postChangePassword);
userRouter.get('/logout', protectorMiddleware, logout);
userRouter.get('/:id', see);
userRouter.get('/:id(\\d+)/delete', protectorMiddleware, deleteUser);

export default userRouter;
