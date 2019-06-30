const express = require("express");

const app = express();
const bodyParser = require("body-parser");
const db = require("./database/connection");
const authRouter = require("./routes/authentication");
const catRouter = require("./routes/category");
const devRouter = require("./routes/developer");

//allow cross origin
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, Origin,Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,OPTIONS,PATCH,DELETE"
  );
  next();
});

//handle json and urlencoded requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/categories", catRouter);
app.use("/api/v1/developers", devRouter);
module.exports = app;
