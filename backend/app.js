import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import pkg from 'pg';
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(bodyParser.json());

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