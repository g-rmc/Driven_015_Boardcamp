import express from 'express';

import { getGames, postGame } from '../controllers/games.controller.js';
import { validateQueryFilterGames, validadeNewGame } from '../middlewares/games.middlewares.js';

const router = express.Router();

router.get('/games', validateQueryFilterGames, getGames);
router.post('/games', validadeNewGame, postGame);

export default router;