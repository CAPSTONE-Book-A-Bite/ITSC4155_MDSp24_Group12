import pg from "pg";
import HttpError from "../models/http-error.js";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";

const db = new pg.Client({
  connectionString:
    "postgres://zcqtvzxv:DBBIBhx8y-dsnf6jhniVULbwo-pNxeE0@baasu.db.elephantsql.com/zcqtvzxv",
  ssl: {
    rejectUnauthorized: false, // Only set this if your ElephantSQL instance requires it
  },
});
// Just logging the connection
db.connect();

const getAdmins = async (req, res) => {
  let admins;
  try {
    admins = await db.query("select * from restaurants;");
  } catch (error) {
    res.send(error);
  }
  res.json({ users: admins.rows });
};

// working here in signup
const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  let existingAdmin;
  try {
    const result = await db.query(
      "SELECT EXISTS(SELECT 1 FROM restaurants WHERE email = $1);",
      [email]
    );
    existingAdmin = result.rows[0].exists;
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while checking for existing admin.");
  }

  if (existingAdmin) {
    const error = new HttpError(
      "Admin exists already, please login instead.",
      422
    );
    return res
      .status(422)
      .json({ message: "Admin exists already, please login instead." });
  }

  // change to sql
  const createdAdmin = {
    name,
    email,
    password: password,
  };

  let result;
  try {
    // Assuming db is your PostgreSQL client
    const queryText =
      "INSERT INTO restaurants (name, email, password) VALUES ($1, $2, $3) RETURNING *";
    const values = [
      createdAdmin.name,
      createdAdmin.email,
      createdAdmin.password,
    ];
    result = await db.query(queryText, values);

    // If you need to access the newly inserted user data, you can retrieve it from the result
    //const insertedUser = result.rows[0];

    // Further logic can be added here if needed
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return res
      .status(500)
      .json({ message: "Signing up failed, please try again later." });
  }

  res.status(201).json({ name: createdAdmin.name, email: createdAdmin.email });
};

const login = async (req, res, next) => {
  console.log(req.body);
  const { email, password } = req.body;

  let existingAdmin;

  try {
    existingAdmin = await db.query(
      "SELECT * FROM restaurants WHERE email = $1;",
      [email]
    );
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return res
      .status(500)
      .json({ message: "Logging in failed, please try again later." });
  }

  if (existingAdmin.rows.length === 0) {
    const error = new HttpError(
      "Invalid admin user, could not log you in.",
      403
    );
    return res
      .status(403)
      .json({ message: "Invalid admin user, could not log you in." });
  }

  let isValidPassword = false;
  try {
    if (password === existingAdmin.rows[0].password) {
      isValidPassword = true;
    }
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    );
    return res
      .status(500)
      .json({
        message:
          "Could not log you in, please check your credentials and try again.",
      });
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return res
      .status(403)
      .json({ message: "Invalid credentials, could not log you in." });
  }
  // succes message just to see it logged in
  return res
    .status(200)
    .json({
      hostId: existingAdmin.rows[0].id,
      hostName: existingAdmin.rows[0].name,
    });
};

function lastReservation(req, res, next) {
  const params = req.params;
  const name = params.name;
  db.query(
    "SELECT * FROM reservations WHERE restaurant = $1 ORDER BY created_at DESC LIMIT 1;",
    [name],
    (err, result) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .send("An error occurred while fetching the last reservation.");
      }
      res.json({ reservation: result.rows[0] });
    }
  );
}

export { getAdmins };
export { signup };
export { login };
export { lastReservation };
