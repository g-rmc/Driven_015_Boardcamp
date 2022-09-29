import express from 'express';
import pg from 'pg';

import { connection } from '../db/database.js';
//import { myFunction } from '../controllers/controller.js';
//import { myMiddleware } from '../middlewares/middleware.js';

const router = express.Router();

//router.use(myMiddleware);

router.get('/categories', (req,res) => {
    console.log('pai ta on');

    const query = connection.query('SELECT * FROM categories;');

    query.then(result => console.log(result.rows)).catch(error => console.log(error));

    res.sendStatus(200);
});

export default router;