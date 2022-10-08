import { stripHtml } from 'string-strip-html';

import { connection } from '../db/database.js';
import { gameSchema } from '../schemas/game.schema.js';

async function validateQueryFilterGames (req, res, next) {
    let filter = '';

    if (req.query.name) {
        filter = stripHtml(req.query.name.toLowerCase()).result;
    };
    
    res.locals.filter = filter;
    next();
}

async function validadeNewGame (req, res, next) {
    const gameObj = req.body;

    const validation = gameSchema.validate(gameObj, {abortEarly: false});
    if(validation.error){
        return res.status(400).send(validation.error.details.map(err => err.message));
    };

    try {
        const validId = await connection.query(
            `SELECT * FROM categories WHERE id = $1`,
            [gameObj.categoryId]
        );
        if (validId.rows.length === 0){
            return res.status(400).send('categoryId not found');
        }
    } catch (error) {
        return res.status(500);
    };

    try {
        
        const validName = await connection.query(
            `SELECT * FROM games WHERE name = $1`,
            [stripHtml(gameObj.name).result]
        );
        if (validName.rows.length !== 0){
            return res.status(409).send('name already exists');
        }
    } catch (error) {
        return res.status(500);
    };

    res.locals.gameObj = {...gameObj,
        name:stripHtml(gameObj.name).result,
        image:stripHtml(gameObj.image).result
    };
    next();
};

export { validateQueryFilterGames, validadeNewGame };