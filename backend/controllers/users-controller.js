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

const getUsers = async (req, res) => {
  let users;
  try {
    users = await db.query("select * from users;");
  } catch (error) {
    res.send(error);
  }
  res.json({ users: users.rows });
};

// working here in signup
const signup = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { name, email, password, phone } = req.body;

  let existingUser;
  try {
    const result = await db.query(
      "SELECT EXISTS(SELECT 1 FROM users WHERE email = $1);",
      [email]
    );
    existingUser = result.rows[0].exists;
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send("An error occurred while checking for existing user.");
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return res
      .status(422)
      .json({ error: "User exists already, please login instead." });
  }

  // change to sql
  const createdUser = {
    name,
    email,
    password: password,
    phone,
  };

  let result;
  try {
    const queryText =
      "INSERT INTO users (name, email, password, phone_number) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [
      createdUser.name,
      createdUser.email,
      createdUser.password,
      createdUser.phone,
    ];
    result = await db.query(queryText, values);

    // If you need to access the newly inserted user data, you can retrieve it from the result
    //const insertedUser = result.rows[0];
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return res
      .status(500)
      .json({ error: "Signing up failed, please try again later." });
  }

  res.status(200).json({ message: "User created!", user: result.rows[0] });
};

const login = async (req, res, next) => {
  console.log("login", req.body);
  const { email, password } = req.body;
  console.log(email, password);

  let existingUser;

  try {
    existingUser = await db.query("SELECT * FROM users WHERE email = $1;", [
      email,
    ]);
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return res
      .status(500)
      .json({ error: "Logging in failed, please try again later." });
  }

  if (existingUser === undefined || existingUser.rows.length === 0) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return res
      .status(403)
      .json({ error: "Invalid credentials, could not log you in." });
  }

  let isValidPassword = false;
  try {
    if (password === existingUser.rows[0].password) {
      isValidPassword = true;
    }
  } catch (err) {
    return res.status(500).json({
      error:
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
      .json({ error: "Invalid credentials, could not log you in." });
  }
  // success message just to see it logged in
  const success = "Logged in!";
  console.log(success);
  res.status(200).json({ message: success, user: existingUser.rows[0] });
};

const getUserById = async (req, res) => {
  const userId = req.params.uid;
  let user;
  try {
    user = await db.query("SELECT * FROM users WHERE id = $1;", [userId]);
  } catch (error) {
    res.send;
  }
  res.json({ user: user.rows[0] });
};

const updateUser = async (req, res) => {
  const userId = req.params.uid;
  const { name, email, phone, password } = req.body;
  let user;
  try {
    user = await db.query(
      "UPDATE users SET name = $1, email = $2, phone_number = $3, password = $4 WHERE id = $5 RETURNING *;",
      [name, email, phone, password, userId]
    );
  } catch (error) {
    res.send;
  }
  res.json({ user: user.rows[0] });
};

export { getUsers };
export { signup };
export { login };
export { getUserById };
export { updateUser };
