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

  const { name, email, password } = req.body;

  let existingUser;
  try {
    const result = await db.query('SELECT EXISTS(SELECT 1 FROM users WHERE email = $1);', [email]);
    existingUser = result.rows[0].exists;
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while checking for existing user.");
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
    reservation_ids: []
};

let result;
try {
    // Assuming db is your PostgreSQL client
    const queryText = 'INSERT INTO users (name, email, password, reservation_ids) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [createdUser.name, createdUser.email, createdUser.password, createdUser.reservation_ids];
    result = await db.query(queryText, values);
    
    // If you need to access the newly inserted user data, you can retrieve it from the result
    //const insertedUser = result.rows[0];
    
    // Further logic can be added here if needed
} catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  res
    .status(201)
    .json({ name: createdUser.name, email: createdUser.email });
};

const login = async (req,res,next) => {
  const { email, password } = req.body;

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

  if (!existingUser) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      403
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.rows[0].password);
  } catch (err) {
    const error = new HttpError(
      'Could not log you in, please check your credentials and try again.',
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      403
    );
    return next(error);
  }
  // succes message just to see it logged in
  const success = "Logged in!";
  res.json({
    email: email,
    message: success
  });
};

export { getUsers };
export { signup };
export { login };