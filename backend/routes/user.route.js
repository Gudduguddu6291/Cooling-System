import express from 'express';
import { getUser } from '../controllers/user.controllers.js';
import {isAuth} from '../middlewares/isAuth.js'
const userRouter = express.Router();
userRouter.get('/profile', isAuth, getUser);
export default userRouter;