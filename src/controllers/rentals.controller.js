import dayjs from 'dayjs';
import { connection } from "../db/database.js";

const dateFormat = 'YYYY-MM-DD';

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
            rentDate: dayjs(rental.rentDate).format(dateFormat),
            daysRented: rental.daysRented,
            returnDate: rental.returnDate? dayjs(rental.returnDate).format(dateFormat) : null,
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
        res.status(500);
    }
}

async function postNewRental (req, res) {
    const rentalObj = res.locals.rentalObj;
    const { pricePerDay } = res.locals.gameObj;

    const originalPrice = rentalObj.daysRented * pricePerDay

    const rental = {
        ...rentalObj,
        rentDate: dayjs().format(dateFormat),
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
            rental.returnDate,
            rental.originalPrice,
            rental.delayFee
        ]
        );
        res.sendStatus(201);
    } catch (error) {
        res.status(500);
    }
}

async function postFinishRental (req, res) {
    const rentalObj = res.locals.rentalObj;
    const rentalDuration = dayjs().diff(dayjs(rentalObj.rentDate), 'day');
    let delayFee = 0;

    if (rentalDuration > rentalObj.daysRented) {
        const delay = rentalDuration - rentalObj.daysRented;
        delayFee = delay * Math.abs(rentalObj.originalPrice/rentalObj.daysRented);
    };

    const returnObj = {
        ...rentalObj,
        rentDate: dayjs(rentalObj.rentDate).format(dateFormat),
        returnDate: dayjs().format(dateFormat),
        delayFee
    }

    try {
        await connection.query(
            `UPDATE rentals
            SET
                "returnDate" = $1,
                "delayFee" = $2
            WHERE
                id = $3
            ;`,
            [
                returnObj.returnDate,
                returnObj.delayFee,
                returnObj.id
            ]
        );
        res.sendStatus(200);
    } catch (error) {
        res.status(500);
    }
}

async function deleteRentalById (req, res) {
    const { id } = res.locals.rentalObj;
    try {
        await connection.query(
            `DELETE FROM rentals
            WHERE id = $1;`,
            [id]
        );
        res.sendStatus(200);
    } catch (error) {
        res.status(500);
    }
}

async function getRentalMetrics (req, res) {

    try {
        const metricsData = await connection.query(`
        SELECT
            SUM("originalPrice") AS "rentalsTotal",
            SUM("delayFee") AS "feesTotal",
            COUNT(id) AS "rentalsQnt"
        FROM
            rentals;
        `);
        const aux = metricsData.rows[0];
        const metricsObj = {
            revenue: Number(aux.rentalsTotal) + Number(aux.feesTotal),
            rentals: Number(aux.rentalsQnt),
            average: (Number(aux.rentalsTotal) + Number(aux.feesTotal)) / Number(aux.rentalsQnt)
        };
        res.send(metricsObj);
    } catch (error) {
        res.status(500);
    }
}

export {
    getRentals,
    postNewRental,
    postFinishRental,
    deleteRentalById,
    getRentalMetrics
}