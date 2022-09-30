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
    const obj = req.body;
    console.log(obj);
    const validInputs = obj.name?.length > 0 && obj.stockTotal > 0 && obj.pricePerDay > 0;
     try {
        const validId = await connection.query('SELECT * FROM categories WHERE id = $1',[obj.categoryId]);
        if (!validInputs || validId.length === 0){
            return res.status(400).send('invalid inputs');
        }
    } catch (error) {
        return res.status(500).send(error);
    } 

    console.log('postGame');
    res.sendStatus(200);
}

export { getGames, postGame };