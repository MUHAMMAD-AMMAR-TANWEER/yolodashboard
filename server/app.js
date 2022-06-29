const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");
const https = require("https");
const fs = require("fs-extra");
require("./db/conn");

app.use(cors());
app.use(cors({ origin: true, credentials: true }));
app.options(
  "*",
  cors({ origin: "http://localhost:3000", optionsSuccessStatus: 200 })
);
app.use(express.json());

// const User = require('./models/userSchema');

app.use(require("./router/auth"));
//Middleware
dotenv.config({ path: "./config.env" });
const DB = process.env.DB;
const PORT = process.env.PORT;
console.log(DB);

const middleware = (req, res, next) => {
  console.log(`Hello My middleware`);
  next();
};

https
  .createServer(
    {
      key: fs.readFileSync(
        "/etc/letsencrypt/live/dashboard.advergeanalytics.com/fullchain.pem"
      ),
      cert: fs.readFileSync("/etc/letsencrypt/live/tradeape.co/fullchain.pem"),
    },
    app
  )
  .listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
