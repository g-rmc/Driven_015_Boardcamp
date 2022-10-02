import express from 'express';

import { getRentals, postNewRental, postFinishRental, deleteRentalById } from '../controllers/rentals.controller.js';
import { validateQueryFilterRentals, validateRentalInputs } from '../middlewares/rentals.middlewares.js';

const router = express.Router();

router.get('/rentals', validateQueryFilterRentals, getRentals);
router.post('/rentals', validateRentalInputs, postNewRental);
router.post('/rentals/:ID/return', postFinishRental);
router.delete('/rentals/:ID', deleteRentalById);

export default router;