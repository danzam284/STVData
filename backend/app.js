import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import pkg from "pg";
import axios from "axios";
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Set up PostgreSQL connection pool
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "put in your own password!",
  port: 5432,
});

//Fetch data from postgres
app.get("/data", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM sales");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.post("/websiteURL", async (req, res) => {
  try {
    if (!req.body) {
      throw `input is empty`;
    }
    let response = await axios.get(req.body.inputWebsite);
    if (!response) {
      throw `This website does not exist`;
    }
    return res.status(200).send("Request Successful");
  } catch (e) {
    res.status(400).send(e);
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
