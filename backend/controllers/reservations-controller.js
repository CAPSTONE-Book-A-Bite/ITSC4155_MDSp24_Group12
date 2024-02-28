import pg from "pg";
import moment from 'moment';
import { validationResult } from "express-validator";

import HttpError from "../models/http-error.js";
import { sendSMS } from "../util/smsSender.js";

const db = new pg.Client({
    connectionString: 'postgres://zcqtvzxv:DBBIBhx8y-dsnf6jhniVULbwo-pNxeE0@baasu.db.elephantsql.com/zcqtvzxv',
    ssl: {
      rejectUnauthorized: false // Only set this if your ElephantSQL instance requires it
    }
});

// Just logging the connection
db.connect()

const getReservations = async (req,res,next) => {
    let reservation;
    try {
        reservation = await db.query('select * from reservations;');
    } catch (err) {
        const error = new HttpError(
          'Something went wrong, could not find a reservation.',
          500
        );
        return next(error);
    }
    res.json({ reservations: reservation.rows });
};

// Function to get a reservation by its id
const getReservationById = async (req,res,next) => {
    const reservationId = req.params.rid;
    //console.log(reservationId);

    let reservation;
    try {
        reservation = await db.query('SELECT * FROM reservations WHERE id = $1;', [reservationId]);
        console.log(reservation.rows)
    } catch (err) {
        const error = new HttpError(
          'Something went wrong, could not find a reservation.',
          500
        );
        return next(error);
    }

    if (!reservation) {
        const error = new HttpError(
          'Could not find reservation for the provided id.',
          404
        );
        return next(error);
    }
    
    res.json({ reservation: reservation.rows });
};

const getReservationsByUserId = async (req,res,next) => {
    const userId = req.params.uid;
    let reservations;
    try{
        reservations = await db.query('SELECT * FROM reservations WHERE user_id = $1;', [userId]);
    } catch (err) {
        const error = new HttpError(
            'Fetching reservation failed, please try again later.',
            500
        );
        return next(error);
    }

    res.json({
        reservations: reservations.rows
    });
};

const createReservation = async (req, res, next) => {
    const { userId, table_number, num_guests, datetime } = req.body;

    // Validate the input data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    let createdReservation;
    try {
        // Insert a new reservation into the database
        createdReservation = await db.query(
            `INSERT INTO reservations (user_id, table_number, num_guests, datetime, name, email) 
            SELECT $1, $2, $3, $4, u.name, u.email 
            FROM users AS u 
            WHERE u.id = $1 
            RETURNING *;`,
            [userId, table_number, num_guests, datetime]
        );
    } catch (err) {
        const error = new HttpError(
            'Creating reservation failed, please try again.',
            500
        );
        return next(error);
    }
    const format = 'YYYY-MM-DD HH:mm:ss Z';
    //sendSMS("Hello " + createdReservation.rows[0].name + "!" + " Your reservation has been created for " + moment(datetime, format).format('MMMM Do YYYY, h:mm:ss a') + ".", +18667219742, +19517335079);
    //console.log(moment(datetime, format).format('MMMM Do YYYY, h:mm:ss a'));
    res.status(201).json({ reservation: createdReservation.rows[0] });
};

const updateReservation = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { table_number, num_guests } = req.body;
    const reservationId = req.params.rid;
    try {
        // Fetch the reservation
        const reservationQuery = await db.query(
            'SELECT * FROM reservations WHERE id = $1',
            [reservationId]
        );
        const reservation = reservationQuery.rows[0];

        // If reservation not found
        if (!reservation) {
            return next(new HttpError('Reservation not found.', 404));
        }

        // Check if the user is authorized to update the reservation
        //if (reservation.user_id !== req.userData.userId) {
        //    return next(new HttpError('You are not allowed to edit this reservation.', 401));
        //}

        // Update reservation details
        const updateReservationQuery = await db.query(
            'UPDATE reservations SET table_number = $1, num_guests = $2 WHERE id = $3',
            [table_number, num_guests, reservationId]
        );

        res.status(200).json({ message: 'Reservation updated successfully.' });
    } catch (err) {
        console.error('Error updating reservation:', err);
        return next(new HttpError('Something went wrong, could not update reservation.', 500));
    }
};

const deleteReservation = async (req, res, next) => {
    const reservationId = req.params.rid;

    try {
        const reservation = await db.query('DELETE FROM reservations WHERE id = $1', [reservationId]);
        
        if (reservation.rowCount === 0) {
            const error = new HttpError('Could not find a reservation for this id.', 404);
            return next(error);
        }

        res.status(200).json({ message: 'Deleted reservation.' });
    } catch (err) {
        console.error('Error deleting reservation:', err);
        const error = new HttpError('Something went wrong, could not delete reservation.', 500);
        return next(error);
    }

    // if (place.creator.id !== req.userData.userId) {
    //     const error = new HttpError(
    //       'You are not allowed to delete this place.',
    //       401
    //     );
    //     return next(error);
    // }
};


export { getReservations };
export { getReservationById };
export { getReservationsByUserId };
export { createReservation };
export { updateReservation };
export { deleteReservation };