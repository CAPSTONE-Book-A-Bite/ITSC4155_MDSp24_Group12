import express from 'express';
import { check } from 'express-validator';
import { getAdmins, signup, login, lastReservation } from '../controllers/admins-controller.js';
import bodyParser from 'body-parser';
const adminRouter = express.Router();

adminRouter.get('/', getAdmins);

adminRouter.post(
  '/signup',
  bodyParser.json(),
  [
    check('name')
      .not()
      .isEmpty(),
    check('email')
      .normalizeEmail()
      .isEmail(),
    check('password').isLength({ min: 6 })
  ],
  signup
);

adminRouter.post('/login', bodyParser.json(), login);

adminRouter.get('/lastUpdated/:name', lastReservation);

export { adminRouter };
