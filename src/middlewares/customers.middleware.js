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

export { validateQueryFilterCustomers };