import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import pkg from 'pg';
import { fetchAndSaveCsv } from './fetchCsvData.js';
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(bodyParser.json());

const apiUrl = 'URL'; // Replace with your API URL
const outputFilePath = 'filename.csv'; // Replace with desired output file path
const limit = 1000; // Adjust limit per request as needed

fetchAndSaveCsv(apiUrl, outputFilePath, limit);
// Set up PostgreSQL connection pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'put in your own password!',
  port: 5432,
});

//Fetch data from postgres
app.get('/data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sales');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


app.listen(3000, () => {
  console.log("Server running on port 3000");
});