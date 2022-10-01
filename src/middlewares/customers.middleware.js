import joi from 'joi';
import { stripHtml } from 'string-strip-html';

import { connection } from '../db/database.js';

const customerSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().min(10).max(11).pattern(/^[0-9]+$/, 'number').required(),
    cpf: joi.string().length(11).pattern(/^[0-9]+$/, 'numbers').required(),
    birthday: joi.string().pattern(/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/, 'aaaa-mm-dd').required(),
});

async function validateQueryFilterCustomers (req, res, next) {
    let filter = '';
    if (req.query.cpf){
        filter = stripHtml(req.query.cpf).result;
    };
    res.locals.filter = filter;
    next();
}

async function validateCustomerId (req, res, next) {
    let id = stripHtml(req.params.ID).result;

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
        res.status(500).send(error);
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

async function validateNewCustomer (req, res, next) {
    const customerObj = res.locals.customerObj;

    try {
        const validCpf = await connection.query(
            `SELECT * FROM customers WHERE cpf = $1`,
            [stripHtml(customerObj.cpf).result]
        );
        if (validCpf.rows.length !== 0){
            return res.status(409).send('cpf already exists');
        }
    } catch (error) {
        return res.status(500).send(error);
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
    validateNewCustomer
};