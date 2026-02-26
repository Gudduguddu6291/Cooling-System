import express from 'express';
import { googleauth, logout } from '../controllers/auth.controllers.js';
import { isAuth } from '../middlewares/isAuth.js';

const authRouter = express.Router();
authRouter.post('/googleauth',  googleauth);
authRouter.get('/logout',  logout);

export default authRouter;