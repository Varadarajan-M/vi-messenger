import express from 'express';

import {
	createMessageController,
	getChatMessagesController,
	getUnreadMessagesController,
} from '../controllers/message';
import { checkMembership } from '../middlewares';
import authorize from '../middlewares/auth';

const router = express.Router();

router
	.route('/:id')
	.get(authorize, checkMembership, getChatMessagesController)
	.post(authorize, checkMembership, createMessageController);

router.route('/unread/:id').get(authorize, checkMembership, getUnreadMessagesController);

export default router;
