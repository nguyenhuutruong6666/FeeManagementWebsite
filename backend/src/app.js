import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// import exampleRouter from './routes/example.route.js';
// app.use('/api/example', exampleRouter);

app.get('/', (req, res) => {
  res.json({ message: 'FeeManagement API is running!' });
});

export default app;
