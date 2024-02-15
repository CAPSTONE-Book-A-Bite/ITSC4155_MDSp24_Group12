import express from 'express';
import { check } from 'express-validator';
import { getReservations, getReservationById, getReservationsByUserId, createReservation, updateReservation, deleteReservation} from '../controllers/reservations-controller.js'

const reservationRouter = express.Router();

// Get all reservations
reservationRouter.get('/', getReservations);

reservationRouter.get('/:rid', getReservationById);

reservationRouter.get('/user/:uid', getReservationsByUserId);

reservationRouter.post(
  '/',
  [
    check('table_number')
        .not()
        .isEmpty(),
    check('num_guests')
        .not()
    .isEmpty(),
    check('datetime')
        .not()
        .isEmpty()
  ],
  createReservation
);

reservationRouter.patch(
  '/:rid',
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