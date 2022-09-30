import express from 'express';

import { getGames, postGame } from '../controllers/games.controller.js';
import { validateQueryFilterGames, validateGamesInput } from '../middlewares/games.middlewares.js';

const router = express.Router();

router.get('/games', validateQueryFilterGames, getGames);
router.post('/games', validateGamesInput, postGame);

export default router;