import express from 'express';
import { addTemperature,getTemperatures } from '../controllers/temp.controllers.js';
import { isAuth } from '../middlewares/isAuth.js';
const tempRouter = express.Router();

tempRouter.post('/', isAuth, addTemperature);
tempRouter.get('/history', isAuth, getTemperatures);

export default tempRouter;
