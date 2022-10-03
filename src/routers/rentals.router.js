import express from 'express';

import { getRentals, postNewRental, postFinishRental, deleteRentalById, getRentalMetrics } from '../controllers/rentals.controller.js';
import { validateQueryFilterRentals, validateRentalInputs, validateRentalIdInput } from '../middlewares/rentals.middlewares.js';

const router = express.Router();

router.get('/rentals', validateQueryFilterRentals, getRentals);
router.post('/rentals', validateRentalInputs, postNewRental);
router.post('/rentals/:ID/return', validateRentalIdInput, postFinishRental);
router.delete('/rentals/:ID', validateRentalIdInput, deleteRentalById);

router.get('/rentals/metrics', getRentalMetrics);

export default router;