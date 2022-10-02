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
    const rentalObj = res.locals.rentalObj;
    const { pricePerDay } = res.locals.gameObj;

    const originalPrice = rentalObj.daysRented * pricePerDay

    const rental = {
        ...rentalObj,
        rentDate: dayjs().format('YYYY-MM-DD'),
        returnDate: null,
        originalPrice,
        delayFee: null
    }
    
    try {
        await connection.query(`
            INSERT INTO rentals
            ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
            VALUES
            ($1, $2, $3, $4, $5, $6, $7)
        ;`,
        [
            rental.customerId,
            rental.gameId,
            rental.rentDate,
            rental.daysRented,
            rental.rentDate,
            rental.originalPrice,
            rental.delayFee
        ]
        );
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error);
    }
}

async function postFinishRental (req, res) {
    console.log('postFinishRental');
    res.sendStatus(200);
}

async function deleteRentalById (req, res) {
    console.log('deleteRentalById');
    res.sendStatus(200);
}

export {
    getRentals,
    postNewRental,
    postFinishRental,
    deleteRentalById
}