import express from 'express';
import { check } from 'express-validator';
import { getUsers, signup, login } from '../controllers/users-controller.js'

const userRouter = express.Router();

userRouter.get('/', getUsers);

userRouter.post(
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

userRouter.post('/login', login);

export { userRouter };
