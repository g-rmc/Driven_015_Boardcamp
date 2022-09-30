import express from 'express';

import { getCategories, postCategory } from '../controllers/categories.controller.js';
import { validateCategoriesInput } from '../middlewares/categories.middlewares.js';

const router = express.Router();

router.get('/categories', getCategories);
router.post('/categories', validateCategoriesInput, postCategory);

export default router;