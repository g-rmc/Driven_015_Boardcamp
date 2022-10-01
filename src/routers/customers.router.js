import express from 'express';

import { getCustomers, getCustomerById, postNewCustomer, editCustomerById } from '../controllers/customers.controller.js';
import { validateQueryFilterCustomers } from '../middlewares/customers.middleware.js';

const router = express.Router();

router.get('/customers', validateQueryFilterCustomers, getCustomers);
router.get('/customers/:id', getCustomerById);
router.post('/customers', postNewCustomer);
router.put('/customers/:id', editCustomerById);

export default router;