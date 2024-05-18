import express from 'express';

import {
	chatWithAIController,
	createMessageController,
	deleteMessageController,
	getChatMessagesController,
	getMessageReactionController,
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

router.route('/:id/ai').post(authorize, checkMembership, chatWithAIController);

router
	.route('/:id/:mid')
	.patch(authorize, checkMembership, updateMessageController)
	.delete(authorize, checkMembership, deleteMessageController);

router.route('/:id/:mid/reactions').get(authorize, checkMembership, getMessageReactionController);

router.route('/unread/:id').get(authorize, checkMembership, getUnreadMessagesController);

export default router;
