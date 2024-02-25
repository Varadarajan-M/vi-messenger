import express from 'express';

import authRouter from './auth';
import chatRouter from './chat';
import commonRouter from './common';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/common', commonRouter);
router.use('/chat', chatRouter);

export default router;
