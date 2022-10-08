import { stripHtml } from 'string-strip-html';

import { connection } from '../db/database.js';
import { customerSchema } from '../schemas/customer.schema.js';

async function validateQueryFilterCustomers (req, res, next) {
    let filter = '';
    if (req.query.cpf){
        filter = stripHtml(req.query.cpf).result;
    };
    res.locals.filter = filter;
    next();
}

async function validateCustomerId (req, res, next) {
    const id = stripHtml(req.params.ID).result;

    try {
        const validCustomer = await connection.query(
            `SELECT * FROM customers
            WHERE id = $1`,
            [id]
        );
        if (validCustomer.rows.length === 0){
            return res.status(404).send('customer id not found');
        } else {
            res.locals.customer = validCustomer.rows;
        }
    } catch (error) {
        res.sendStatus(500);
    }
    
    res.locals.id = id;
    next();
}

async function validateCustomerObj (req, res, next) {
    const customerObj = req.body;
    const validation = customerSchema.validate(customerObj, {abortEarly: false});
    if(validation.error){
        return res.status(400).send(validation.error.details.map(err => err.message));
    };

    res.locals.customerObj = customerObj;
    next();
}

async function validateNewCpf (req, res, next) {
    const customerObj = res.locals.customerObj;
    const id = res.locals.id;

    try {
        const validCpf = await connection.query(
            `SELECT * FROM customers WHERE cpf = $1`,
            [stripHtml(customerObj.cpf).result]
        );
        if (validCpf.rows.length !== 0){
            if (!id || Number(id) !== Number(validCpf.rows[0].id)){
                return res.status(409).send('cpf already exists');
            }
        }
    } catch (error) {
        return res.sendStatus(500);
    }

    res.locals.customerObj = {...customerObj,
        name: stripHtml(customerObj.name).result
    }
    next();
}

export {
    validateQueryFilterCustomers,
    validateCustomerId,
    validateCustomerObj,
    validateNewCpf
};