import dayjs from 'dayjs';
import { connection } from "../db/database.js";

async function getRentals (req, res) {
    const customerFilter = res.locals.customerFilter;
    const gameFilter = res.locals.gameFilter;

    try {
        const rentalsDB = await connection.query(
            `SELECT 
                rentals.*,

                customers.id AS customer_id,
                customers.name AS customer_name,

                games.id AS game_id,
                games.name AS game_name,
                games."categoryId" AS "game_categoryId",

                categories.name AS "game_categoryName"

            FROM rentals

            JOIN customers
                ON rentals."customerId" = customers.id

            JOIN games
                ON rentals."gameId" = games.id

            JOIN categories
                ON games."categoryId" = categories.id
            
            WHERE
                "customerId" ${customerFilter === -1? "!=" : "="} $1
                AND
                "gameId" ${gameFilter === -1? "!=" : "="} $2
            ;`,
            [customerFilter, gameFilter]
        );

        const rentals = rentalsDB.rows.map(rental => ({
            id: rental.id,
            customerId: rental.customerId,
            gameId: rental.gameId,
            rentDate: dayjs(rental.rentDate).format('YYYY-MM-DD'),
            daysRented: rental.daysRented,
            retunDate: rental.retunDate? dayjs(rental.retunDate).format('YYYY-MM-DD') : null,
            originalPrice: rental.originalPrice,
            delayFee: rental.delayFee,
            customer: {
                id: rental.customer_id,
                name: rental.customer_name
            },
            game: {
                id: rental.game_id,
                name: rental.game_name,
                categoryId: rental.game_categoryId,
                categoryName: rental.game_categoryName
            }
        }));

        res.send(rentals);
    } catch (error) {
        res.status(500).send(error);
    }
}

async function postNewRental (req, res) {
    console.log('getRentals');
    res.sendStatus(200);
}

async function postFinishRental (req, res) {
    console.log('getRentals');
    res.sendStatus(200);
}

async function deleteRentalById (req, res) {
    console.log('getRentals');
    res.sendStatus(200);
}

export {
    getRentals,
    postNewRental,
    postFinishRental,
    deleteRentalById
}