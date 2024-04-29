import express from "express";
import { check } from "express-validator";
import {
  getUsers,
  signup,
  login,
  getUserById,
  updateUser,
} from "../controllers/users-controller.js";
import bodyParser from "body-parser";

const userRouter = express.Router();

userRouter.get("/", getUsers);

userRouter.post(
  "/signup",
  bodyParser.json(), // added this line
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  signup
);

userRouter.post("/login", bodyParser.json(), login);

userRouter.get("/:uid", getUserById);

userRouter.put("/:uid", bodyParser.json(), updateUser);

export { userRouter };
