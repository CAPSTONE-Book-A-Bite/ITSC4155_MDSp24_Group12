import express from 'express';
import { check } from 'express-validator';
import { getReservations, getReservationById, getReservationsByUserId, createReservation, updateReservation, deleteReservation } from '../controllers/reservations-controller.js'
import bodyParser from 'body-parser';
const reservationRouter = express.Router();

// Get all reservations
reservationRouter.get('/', getReservations);

reservationRouter.get('/:rid', getReservationById);

reservationRouter.get('/user/:uid', getReservationsByUserId);

reservationRouter.post(
  '/', bodyParser.json(),
  createReservation);

reservationRouter.patch(
  '/:rid',
  bodyParser.json(),
  [
    check('table_number')
      .not()
      .isEmpty(),
    check('num_guests')
      .not()
      .isEmpty()
  ],
  updateReservation
);

reservationRouter.delete('/:rid', deleteReservation);

export { reservationRouter };