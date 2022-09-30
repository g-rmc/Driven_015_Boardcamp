import { connection } from '../db/database.js';

async function getGames (req,res) {
    let filter = '';
    if (req.query.name) {
        filter = req.query.name.toLowerCase();
    }

    try {
        const games = await connection.query(
            `SELECT games.*, categories.name AS "categoryName"
            FROM games JOIN categories ON games."categoryId" = categories.id
            WHERE LOWER(games.name) LIKE $1;`,
            [filter+'%']
        );
        res.send(games.rows);
    } catch (error) {
        res.status(500).send(error);
    }
}

async function postGame (req,res) {
    const gameObj = res.locals.gameObj;
    try {
        await connection.query(
            `INSERT INTO games
            (name, image, "stockTotal", "categoryId", "pricePerDay")
            VALUES
            ($1, $2, $3, $4, $5)`,
            [gameObj.name, gameObj.image, gameObj.stockTotal, gameObj.categoryId, gameObj.pricePerDay]
        );
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error);
    }
}

export { getGames, postGame };