import express from 'express';

import { loginController, registerController } from '../controllers/auth';

import { authValidators } from '../validators/auth';

const router = express.Router();

const [, emailValidator, passwordValidator] = authValidators;

router.post('/register', authValidators, registerController);

router.post('/login', [emailValidator, passwordValidator], loginController);

export default router;
