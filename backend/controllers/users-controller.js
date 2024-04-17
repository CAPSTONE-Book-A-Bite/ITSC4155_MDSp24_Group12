import pg from "pg";
import HttpError from "../models/http-error.js";
import bcrypt from 'bcrypt';
import { validationResult } from "express-validator";

const db = new pg.Client({
  connectionString: 'postgres://zcqtvzxv:DBBIBhx8y-dsnf6jhniVULbwo-pNxeE0@baasu.db.elephantsql.com/zcqtvzxv',
  ssl: {
    rejectUnauthorized: false // Only set this if your ElephantSQL instance requires it
  }
});
// Just logging the connection
db.connect()

const getUsers = async (req, res) => {
  let users;
  try {
    users = await db.query('select * from users;');
  } catch (error) {
    res.send(error);
  }
  res.json({ users: users.rows });
};

// working here in signup
const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { name, email, password, phone } = req.body;

  let existingUser;
  try {
    const result = await db.query('SELECT EXISTS(SELECT 1 FROM users WHERE email = $1);', [email]);
    existingUser = result.rows[0].exists;
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred while checking for existing user.");
  }

  if (existingUser) {
    const error = new HttpError(
      'User exists already, please login instead.',
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      'Could not create user, please try again.',
      500
    );
    return next(error);
  }

  // change to sql
  const createdUser = {
    name,
    email,
    password: hashedPassword,
    phone
};

let result;
try {
    const queryText = 'INSERT INTO users (name, email, password, phone_number) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [createdUser.name, createdUser.email, createdUser.password, createdUser.phone];
    result = await db.query(queryText, values);
    
    // If you need to access the newly inserted user data, you can retrieve it from the result
    //const insertedUser = result.rows[0];
    
} catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  res
    .status(201)
    .json({ name: createdUser.name, email: createdUser.email, phone: createdUser.phone});
};

const login = async (req,res,next) => {
  const { email, password } = req.body;
  console.log(email, password)

  let existingUser;

  try {
    existingUser = await db.query('SELECT * FROM users WHERE email = $1;', [email]);
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  if (existingUser === undefined || existingUser.rows.length === 0) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      403
    );
    return res.status(403).json({error: "Invalid credentials, could not log you in."});
  }

  // success message just to see it logged in
  const success = "Logged in!";
  console.log(success)
  res.status(200).json({message: success, user: existingUser.rows[0]});
};

export { getUsers };
export { signup };
export { login };