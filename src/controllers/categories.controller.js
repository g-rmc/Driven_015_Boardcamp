import { connection } from '../db/database.js';

async function getCategories (req, res) {
    try {
        const categories = await connection.query('SELECT * FROM categories;');
        res.send(categories.rows);
    } catch (error) {
        res.status(500).send(error);
    }
}

async function postCategory (req, res) {
    const name = req.body.name;

    if (!name){
        return res.status(400).send('name not found');
    }

    try {
        const sameCategory = await connection.query('SELECT * FROM categories WHERE name = $1', [name]);
        if(sameCategory.rows.length !== 0){
            return res.status(409).send('name must be unique');
        }

        await connection.query('INSERT INTO categories (name) VALUES ($1);', [name]);
        res.sendStatus(201);

    } catch (error) {
        res.status(500).send(error);
    }
}

export { getCategories, postCategory };