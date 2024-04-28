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
        return res.status(500).json({ error: error });
    }
    res.json({ reservations: reservation.rows });
};

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
        return res.status(500).json({ error: error });
    }

    if (!reservation) {
        const error = new HttpError(
          'Could not find reservation for the provided id.',
          404
        );
        return res.status(404).json({ error: error });
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
        return res.status(500).json({ error: error });
    }

    res.json({
        reservations: reservations.rows
    });
};

const createReservation = async (req, res, next) => {
    const { user_id, restaurant_id, num_guests, datetime } = req.body;

    let user;
    let restaurant;

    // Validate the input data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    let createdReservation;
    try {
        // Check if the user exists
        const userQuery = await db.query('SELECT * FROM users WHERE id = $1', [user_id]);
        user = userQuery.rows[0];
        if (!user) {
            // If the user does not exist, handle the error
            console.error('User not found for user_id:', user_id);
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check if Restaurant exists
        const restaurantQuery = await db.query('SELECT * FROM restaurants WHERE id = $1', [restaurant_id]);
        restaurant = restaurantQuery.rows[0];
        if (!restaurant) {
            // If the restaurant does not exist, handle the error
            console.error('Restaurant not found for restaurant_id:', restaurant_id);
            return res.status(404).json({ message: 'Restaurant not found.' });
        }

        // Check if a reservation already exists for the specified time and table number
        const existingReservation = await db.query(
            'SELECT * FROM reservations WHERE datetime = $1 AND restaurant = $2',
            [ datetime, restaurant_id]
        );

        if (existingReservation.rows.length > 0) {
            // If a reservation already exists, return an error response
            return res.status(409).json({ message: 'A reservation already exists for the specified restaurant, time and table number.' });
        }

        // Insert a new reservation into the database
        createdReservation = await db.query(
            `INSERT INTO reservations (user_id, table_number, num_guests, datetime, name, email, phone_number, restaurant) 
            VALUES ($1, null, $2, $3, $4, $5, $6, $7) 
            RETURNING *;`,
            [user_id, num_guests, datetime, user.name, user.email, user.phone_number, restaurant.name]
        );

        return res.json({ reservation: createdReservation.rows[0] })
    } catch (err) {
        console.error('Error creating reservation:', err);
        const error = new HttpError('Creating reservation failed, please try again.', 500);
        return res.status(500).json({ error: error });
    }

    const format = 'YYYY-MM-DD HH:mm:ss Z';
    //sendSMS("Hello " + user.name + "!" + " Your reservation has been created for " + restaurant.name + " " + moment(datetime, format).format('MMMM Do YYYY, h:mm:ss a') + ".", +18667219742, user.phone_number);
    res.status(201).json({ reservation: createdReservation.rows[0] });
};

const updateReservation = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
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
    
            return res.status(404).json({ message: 'Could not find reservation for the provided id.' });
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
        
        if (reservation.rowCount == 0) {
            const error = new HttpError('Could not find a reservation for this id.', 404);
            return res.status(404).json({ error: error });
        }

        return res.status(200).json({ message: 'Deleted reservation.' });

    } catch (err) {
        console.error('Error deleting reservation:', err);
        const error = new HttpError('Something went wrong, could not delete reservation.', 500);
        return res.status(500).json({ error: error });
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