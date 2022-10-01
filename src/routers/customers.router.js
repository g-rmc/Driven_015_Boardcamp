import express from 'express';

import { getCustomers, getCustomerById, postNewCustomer, editCustomerById } from '../controllers/customers.controller.js';
import { validateQueryFilterCustomers, validateCustomerId } from '../middlewares/customers.middleware.js';

const router = express.Router();

router.get('/customers', validateQueryFilterCustomers, getCustomers);
router.get('/customers/:ID', validateCustomerId, getCustomerById);
router.post('/customers', postNewCustomer);
router.put('/customers/:ID', validateCustomerId, editCustomerById);

export default router;