import joi from 'joi';
import { stripHtml } from 'string-strip-html';

import { connection } from '../db/database.js';

async function validateQueryFilterRentals (req, res, next) {
    let customerFilter = -1;
    let gameFilter = -1;

    if (!isNaN(Number(req.query.customerId))) {
        customerFilter = Number(req.query.customerId);
    };
    if (!isNaN(Number(req.query.gameId))) {
        gameFilter = Number(req.query.gameId);
    };

    res.locals.customerFilter = customerFilter;
    res.locals.gameFilter = gameFilter;
    next();
}

export {
    validateQueryFilterRentals,
}