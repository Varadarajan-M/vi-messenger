import express from 'express';

import {
	createMessageController,
	deleteMessageController,
	getChatMessagesController,
	getUnreadMessagesController,
	updateMessageController,
} from '../controllers/message';
import { checkMembership } from '../middlewares';
import authorize from '../middlewares/auth';

const router = express.Router();

router
	.route('/:id')
	.get(authorize, checkMembership, getChatMessagesController)
	.post(authorize, checkMembership, createMessageController);

router
	.route('/:id/:mid')
	.patch(authorize, checkMembership, updateMessageController)
	.delete(authorize, checkMembership, deleteMessageController);

router.route('/unread/:id').get(authorize, checkMembership, getUnreadMessagesController);

export default router;
