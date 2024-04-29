import express from 'express';

import {
	addMembersToGroupChatController,
	createGroupChatController,
	deleteGroupChatController,
	deletePrivateChatController,
	getChatController,
	getGroupChatController,
	getGroupChatMembersController,
	getOrCreatePrivateChatController,
	getUserChatsController,
	removeMembersFromGroupChatController,
	updateGroupChatController,
} from '../controllers/chat';

import { authorize, checkAdminPrivilege, checkMembership } from '../middlewares';

const router = express.Router();

router.get('/details/:id', authorize, checkMembership, getChatController);

// ----------------------- ALL CHATS ----------------------

router.route('/user-chats').get(authorize, getUserChatsController);

// --------------------- PRIVATE CHATS ----------------------

router
	.route('/private/:id')
	.all(authorize)
	.post(getOrCreatePrivateChatController)
	.delete(checkMembership, deletePrivateChatController);

// ----------------------- GROUP CHATS ----------------------

router.post('/group', authorize, createGroupChatController);

router
	.route('/group/:id')
	.get(authorize, checkMembership, getGroupChatController)
	.all(authorize, checkAdminPrivilege)
	.put(updateGroupChatController)
	.delete(deleteGroupChatController);

router
	.route('/group/:id/members')
	.get(authorize, checkMembership, getGroupChatMembersController)
	.all(authorize, checkAdminPrivilege)
	.post(addMembersToGroupChatController)
	.delete(removeMembersFromGroupChatController);

export default router;
