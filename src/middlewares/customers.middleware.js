import joi from 'joi';
import { stripHtml } from 'string-strip-html';

import { connection } from '../db/database.js';

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

export {
    validateQueryFilterCustomers,
    validateCustomerId
};