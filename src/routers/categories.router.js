import express from 'express';

import { getCategories, postCategory } from '../controllers/categories.controller.js';
//import { myMiddleware } from '../middlewares/middleware.js';

const router = express.Router();

//router.use(myMiddleware);

router.get('/categories', getCategories);
router.post('/categories', postCategory);

export default router;