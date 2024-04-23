import express from 'express';
import bodyParser from 'body-parser';
import pg from "pg";
import { userRouter } from './routes/users-routes.js';
import { adminRouter } from './routes/admins-routes.js';
import { reservationRouter } from './routes/reservations-routes.js';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';


dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Enable CORS
app.use(cors({
  origin: '*',
}));



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'frontend/uploads')
  },
  filename: function (req, file, cb) {
    console.log('file' + file.originalname);
    const restaurantName = req.body.restaurantName;
    cb(null, restaurantName + '.' +file.mimetype.split('/')[1]);
  }
});


const upload = multer({ storage: storage });


app.post('/api/upload', upload.single('image'), (req, res) => {
  console.log('requestBody' + JSON.stringify(req.body));
  // logic to call signup function for host with information from req.body
  
});

app.get('/api/images/:restaurantName', (req, res) => {
  const restaurantName = req.params.restaurantName
  res.sendFile(__dirname + `/frontend/uploads/${restaurantName}.jpeg`);
}
);


app.use(express.static(__dirname + '/frontend'));

app.get('/api/images/:restaurantName', (req, res) => {
  const restaurantName = req.params.restaurantName
  res.sendFile(__dirname + `/frontend/uploads/${restaurantName}.jpeg`);
}
);
//route frontend hrefs to correct files
app.get('/index', (req, res) => {
  res.sendFile(__dirname + '/frontend/index.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/frontend/html/login.html');
});

app.get('/hostLogin', (req, res) => {
  res.sendFile(__dirname + '/frontend/html/hostLogin.html');
});

app.get('/about', (req, res) => {
  res.sendFile(__dirname + '/frontend/html/about.html');
});

app.get('/customer', (req, res) => {
  res.sendFile(__dirname + '/frontend/html/customer.html');
} );

app.get('/book', (req, res) => {
  res.sendFile(__dirname + '/frontend/html/book.html');
}
);



app.get('/signout', (req, res) => {
  res.sendFile(__dirname + '/frontend/html/signout.html');
});

app.get('/hostHome', (req, res) => {
  res.sendFile(__dirname + '/frontend/html/host.html');
});

app.get('/signup', (req, res) => { 
  res.sendFile(__dirname + '/frontend/html/signup.html');
});

app.get('/hostRegister', (req, res) => {
  res.sendFile(__dirname + '/frontend/html/hostRegister.html');
});


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
  console.log('Press Ctrl+C to quit.')
  console.log('go to http://localhost:3001/api/users to see users')
});

app.get('/', (req, res) => { 
  res.sendFile(__dirname + '/frontend/index.html');
}

);
