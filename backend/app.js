import cors from "cors";
import bodyParser from "body-parser";
import axios from "axios";
import express from 'express';
import pkg from 'pg';
import { fetchAndSaveCsv } from './fetchCsvData.js';
import { sendPrompt } from "./prompt.js";
import { Server } from "socket.io";
import { createServer } from "http";
const { Pool } = pkg;

const app = express();

app.use(cors());
app.use(bodyParser.json());

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

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
    if (!req.body.inputWebsite) {
      throw `input is empty`;
    }
    let response = await axios.get(req.body.inputWebsite);
    if (!response) {
      throw `This website does not exist`;
    }
    await fetchAndSaveCsv(req.body.inputWebsite, "data.csv");

    return res.status(200).send("Request Successful");
  } catch (e) {
    res.status(400).send(e);
  }
});

async function APIOrURL(link) {
  try {
    const response = await axios.get(link, { validateStatus: () => true });

    if (response.status === 200) {
      const contentType = response.headers['content-type'];

      if (contentType.includes('application/json')) {
        if (!response.data.error && !response.data.message) {
          return "Public API";
        }
        return "Private API";
      } else if (contentType.includes('text/html')) {
        return "URL";
      }
    } else if (response.status === 401 || response.status === 403 || response.status === 215 || response.status === 400) {
      return "Private API";
    } else if (response.status === 404) {
      return "Does not exist";
    }
    return "Unknown";
  } catch(e) {
    if (error.response && error.response.status === 404) {
      return "Does not exist";
    } else {
      return e;
    }
  }
}

io.on('connection', (socket) => {

  socket.on('fileUpload', async (fileData) => {
    const buffer = Buffer.from(fileData);
    const fileContent = buffer.toString('utf-8');

    const lines = fileContent.split('\n');
    const number = lines.length;

    for (let i = 0; i < number; i++) {
      try {
        const ruling = await sendPrompt(lines[i]);

        let converted = lines[i];
        if (ruling.toLowerCase().includes("public")) {
          converted = `${converted} is a public API`;
        } else if (ruling.toLowerCase().includes("private")) {
          converted = `${converted} is a private API`;
        } else {
          converted = `${converted} is a website`;
        }

        socket.emit("update", i, number, converted);
      } catch(e) {
        console.log(e);
        i--;
      }
    }
  });

});

httpServer.listen(3000, () => {
  console.log("Server running on port 3000");
});
