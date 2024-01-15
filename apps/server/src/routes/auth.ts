import express from 'express';

import { loginController, registerController } from '../controllers/auth';
import { authValidators } from '../validators/auth';

const router = express.Router();

const [, emailValidator, passwordValidator] = authValidators;

router.route('/register').post(authValidators, registerController);

router
	.route('/login')
	.post([emailValidator, passwordValidator], loginController);

export default router;
