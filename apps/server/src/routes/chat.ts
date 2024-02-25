import express from 'express';

import { findOrCreateChatController } from '../controllers/chat';

const router = express.Router();

router.post('/find-or-create', findOrCreateChatController);

export default router;
