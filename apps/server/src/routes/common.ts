import express from 'express';

import { searchController } from '../controllers/common';

import authorize from '../middlewares/auth';

const router = express.Router();

router.route('/search/entities').get(authorize, searchController);

export default router;
