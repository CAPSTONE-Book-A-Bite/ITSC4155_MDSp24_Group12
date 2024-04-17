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

const getAdmins = async (req, res) => {
  let admins;
  try {
    admins = await db.query('select * from restaurants;');
  } catch (error) {
    res.send(error);
  }
  res.json({ users: admins.rows });
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

  let existingAdmin;
  try {
    const result = await db.query('SELECT EXISTS(SELECT 1 FROM restaurants WHERE email = $1);', [email]);
    existingAdmin = result.rows[0].exists;
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while checking for existing admin.");
  }

  if (existingAdmin) {
    const error = new HttpError(
      'Admin exists already, please login instead.',
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      'Could not create admin, please try again.',
      500
    );
    return next(error);
  }

  // change to sql
  const createdAdmin = {
    name,
    email,
    password: hashedPassword
};

let result;
try {
    // Assuming db is your PostgreSQL client
    const queryText = 'INSERT INTO restaurants (name, email, password) VALUES ($1, $2, $3) RETURNING *';
    const values = [createdAdmin.name, createdAdmin.email, createdAdmin.password];
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
    .json({ name: createdAdmin.name, email: createdAdmin.email });
};

const login = async (req,res,next) => {
  const { email, password } = req.body;

  let existingAdmin;

  try {
    existingAdmin = await db.query('SELECT * FROM restaurants WHERE email = $1;', [email]);
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!existingAdmin) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      403
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingAdmin.rows[0].password);
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

export { getAdmins };
export { signup };
export { login };