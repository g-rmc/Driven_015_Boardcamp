import { connection } from '../db/database.js';

async function getGames (req,res) {
    try {
        const games = await connection.query('SELECT * FROM games;');
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