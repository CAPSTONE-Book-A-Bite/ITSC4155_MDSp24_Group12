import express from 'express';
import { check } from 'express-validator';
import { getAdmins, signup, login } from '../controllers/admins-controller.js'

const adminRouter = express.Router();

adminRouter.get('/', getAdmins);

adminRouter.post(
  '/signup',
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

adminRouter.post('/login', login);

export { adminRouter };
