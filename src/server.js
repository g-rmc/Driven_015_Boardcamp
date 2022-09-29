import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import categoriesRouter from './routers/categories.router.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use(categoriesRouter);

app.listen(process.env.PORT, () => console.log(`Listening on ${process.env.PORT}`));