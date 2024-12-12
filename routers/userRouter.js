import { Router } from "express";
import { UserController } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { securityQuestionMiddleware } from "../middlewares/securityQuestionMiddleware.js";
import { changePasswordMiddleware } from "../middlewares/changePasswordMiddleware.js";

export const userRouter = Router();

userRouter.post('/register', UserController.registerUser);
userRouter.post('/login', UserController.loginUser);
userRouter.post('/logout', authMiddleware, UserController.logoutUser);
userRouter.post('/likeUser', authMiddleware, UserController.likeUser);
userRouter.post('/sendEmailRecovery', UserController.verifyEmail);
userRouter.post('/answerSecurityQuestion', securityQuestionMiddleware ,UserController.answerSecurityQuestion);
userRouter.post('/setSecurityQuestion' ,UserController.setSecurityQuesion);

userRouter.get('/getUser', authMiddleware, UserController.getUser);
userRouter.get('/getInterestedIn', authMiddleware, UserController.getInterestedIn);
userRouter.get('/getSecurityQuestion', securityQuestionMiddleware, UserController.getSecurityQuestion);
userRouter.get('/getMatches', authMiddleware, UserController.getMatches);
userRouter.get('/getChats', authMiddleware, UserController.getChats);
userRouter.get('/getMessages/:chatId', authMiddleware, UserController.getMessages);

userRouter.put('/updateUser', authMiddleware, UserController.putUser);

userRouter.delete('/deleteAccount', authMiddleware, UserController.deleteUser);

userRouter.patch('/editDescription', authMiddleware, UserController.patchDescription);
userRouter.patch('/changePassword', securityQuestionMiddleware, changePasswordMiddleware, UserController.patchPassword);


