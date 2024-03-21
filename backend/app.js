import express from 'express';
import bodyParser from 'body-parser';
import pg from "pg";
import { userRouter } from './routes/users-routes.js';
import { adminRouter } from './routes/admins-routes.js';
import { reservationRouter } from './routes/reservations-routes.js';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

app.use('/api/users', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/reservations', reservationRouter);

const db = new pg.Client({
  connectionString: process.env.CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false // Only set this if your ElephantSQL instance requires it
  }
});

// Just logging the connection
db.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Error connecting to PostgreSQL database:', err));

app.listen(3001, function () {
  console.log('App listening on port 3001!');
});