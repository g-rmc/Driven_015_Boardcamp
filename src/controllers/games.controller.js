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
    console.log('postGame');
    res.sendStatus(200);
}

export { getGames, postGame };