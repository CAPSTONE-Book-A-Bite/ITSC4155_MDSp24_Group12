import express from 'express';
import pg from "pg";
import { userRouter } from './routes/users-routes.js';
import { adminRouter } from './routes/admins-routes.js';
import { reservationRouter } from './routes/reservations-routes.js';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';


dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Enable CORS
app.use(cors({
  origin: '*',
}));

const resizeAndSaveImage = (req, res, next) => {
  if (!req.file) return next(); // No file uploaded

  const filePath = `frontend/uploads/${req.file.filename}`;
  sharp(filePath)
    .resize(400, 200)
    .toFile(`frontend/uploads/resized-${req.file.filename}`, (err) => {
      if (err) {
        console.error('Sharp resizing error:', err);
        return next(err);
      }

      console.log('Image resized and saved successfully');
      next();
    });
};



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'frontend/uploads')
  },
  filename: function (req, file, cb) {
    console.log('file' + file.originalname);
    let restaurantName = req.body.restaurantName.replace(/\s/g, ''); // Remove spaces from restaurant name
    console.log('restaurantName:', restaurantName)
    cb(null, restaurantName + '.' +file.mimetype.split('/')[1]);
  }
});


const upload = multer({ storage: storage });


app.post('/api/upload', upload.single('image'), resizeAndSaveImage, (req, res) => {
  res.status(201).json({ message: 'File uploaded successfully' });
});

app.get('/api/images/:restaurantName', async (req, res) => {
  const { restaurantName } = req.params;
  console.log('restaurantName:', restaurantName)
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const directoryPath = path.join(__dirname, 'frontend/uploads');
  const extensions = ['jpeg', 'jpg', 'png', 'gif', 'webp']; // List of possible extensions

  try {
    for (let ext of extensions) {
      const filePath = path.join(directoryPath, `resized-${restaurantName}.${ext}`);
      try {
        await fs.access(filePath);  // Check if file exists
        return res.sendFile(filePath); // Send the file if it exists
      } catch (error) {
        // Continue checking next extension if current one fails
      }
    }
    // If no file is found, send a 404 response
    res.status(404).send('Image not found');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


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

app.get('/confirmation', (req, res) => {
  res.sendFile(__dirname + '/frontend/html/confirmation.html');
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
});


