import express from 'express';

import { getCustomers, getCustomerById, postNewCustomer, editCustomerById } from '../controllers/customers.controller.js';
import { validateQueryFilterCustomers, validateCustomerId, validateCustomerObj, validateNewCpf } from '../middlewares/customers.middleware.js';

const router = express.Router();

router.get('/customers', validateQueryFilterCustomers, getCustomers);
router.get('/customers/:ID', validateCustomerId, getCustomerById);

router.use(validateCustomerObj);
router.post('/customers', validateNewCpf, postNewCustomer);
router.put('/customers/:ID', validateCustomerId, validateNewCpf, editCustomerById);

export default router;