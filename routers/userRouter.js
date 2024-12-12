import { Router } from "express";
import { UserController } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { securityQuestionMiddleware } from "../middlewares/securityQuestionMiddleware.js";
import { changePasswordMiddleware } from "../middlewares/changePasswordMiddleware.js";

export const userRouter = Router();

userRouter.post('/register',  UserController.registerUser);
userRouter.post('/login', UserController.loginUser);
userRouter.post('/logout', authMiddleware, UserController.logoutUser);
userRouter.post('/likeUser', authMiddleware, UserController.likeUser);
userRouter.get('/getUser', authMiddleware, UserController.getUser);
userRouter.get('/getInterestedIn', authMiddleware, UserController.getInterestedIn);
userRouter.put('/updateUser', authMiddleware, UserController.putUser);
userRouter.delete('/deleteAccount', authMiddleware, UserController.deleteUser);
userRouter.patch('/editDescription', authMiddleware, UserController.patchDescription);
userRouter.post('/setSecurityQuestion' ,UserController.setSecurityQuesion);
userRouter.post('/sendEmailRecovery', UserController.verifyEmail);
userRouter.get('/getSecurityQuestion', securityQuestionMiddleware, UserController.getSecurityQuestion);
userRouter.post('/answerSecurityQuestion', securityQuestionMiddleware ,UserController.answerSecurityQuestion);
userRouter.patch('/changePassword', securityQuestionMiddleware, changePasswordMiddleware, UserController.patchPassword);


