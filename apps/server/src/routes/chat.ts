import express from 'express';

import {
	addMembersToGroupChatController,
	createGroupChatController,
	deleteGroupChatController,
	deletePrivateChatController,
	getGroupChatController,
	getGroupChatMembersController,
	getOrCreatePrivateChatController,
	removeMembersFromGroupChatController,
	updateGroupChatController,
} from '../controllers/chat';

import { authorize, checkAdminPrivilege, checkMembership } from '../middlewares';

const router = express.Router();

// --------------------- PRIVATE CHATS ----------------------

router
	.route('/private/:id')
	.all(authorize, checkMembership)
	.post(getOrCreatePrivateChatController)
	.delete(deletePrivateChatController);

// ----------------------- GROUP CHATS ----------------------

router.post('/group', createGroupChatController);

router
	.route('/group/:id')
	.get(authorize, checkMembership, getGroupChatController)
	.all(authorize, checkAdminPrivilege)
	.patch(updateGroupChatController)
	.delete(deleteGroupChatController);

router
	.route('/group/:id/members')
	.get(authorize, checkMembership, getGroupChatMembersController)
	.all(authorize, checkAdminPrivilege)
	.post(addMembersToGroupChatController)
	.delete(removeMembersFromGroupChatController);

export default router;
