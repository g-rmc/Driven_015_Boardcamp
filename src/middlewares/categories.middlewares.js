import { stripHtml } from 'string-strip-html';

import { connection } from '../db/database.js';

async function validateCategoriesInput (req, res, next) {
    let name = req.body.name;

    if (!name){
        return res.status(400).send('name not found');
    }

    try {
        const sameCategory = await connection.query('SELECT * FROM categories WHERE name = $1', [stripHtml(name).result]);
        if(sameCategory.rows.length !== 0){
            return res.status(409).send('name must be unique');
        }
    } catch (error) {
        return res.status(500).send(error);
    }

    res.locals.name = stripHtml(name).result;
    next();
};

export { validateCategoriesInput };