import express from 'express';
import {
	deleteUserController,
	findUserController,
	updatePasswordController,
	updateProfilePictureController,
	updateUserNameController,
} from '../controllers/user';
import { authorize } from '../middlewares';
import { passwordValidator, usernameValidator } from '../validators/auth';

const router = express.Router();

router.get('/', authorize, findUserController);
router.put('/update/username', authorize, usernameValidator, updateUserNameController);
router.put('/update/password', authorize, passwordValidator, updatePasswordController);
router.put('/update/picture', authorize, updateProfilePictureController);
router.delete('/delete', authorize, deleteUserController);

export default router;
