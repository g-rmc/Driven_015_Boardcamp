import { connection } from '../db/database.js';

async function getCustomers (req, res) {
    const filter = res.locals.filter + '%';
    try {
        const customers = await connection.query(
            `SELECT * FROM customers
            WHERE cpf LIKE $1;`,
            [filter]
        );
        res.send(customers.rows);
    } catch (error) {
        res.status(500).send(error);
    }
};

async function getCustomerById (req, res) {
    res.send(res.locals.customer[0]);
};

async function postNewCustomer (req, res) {
    console.log('postNewCustomer');
    res.sendStatus(200);
};

async function editCustomerById (req, res) {
    console.log('editCustomerById');
    res.sendStatus(200);
};

export { 
    getCustomers,
    getCustomerById,
    postNewCustomer,
    editCustomerById
}