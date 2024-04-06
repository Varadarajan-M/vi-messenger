import express from 'express';
import { findUserController } from '../controllers/user';
import { authorize } from '../middlewares';

const router = express.Router();

router.get('/', authorize, findUserController);

export default router;
