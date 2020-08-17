const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const api = require("./server/api");

const app = express();

app.use(fileUpload());

app.use(cors());

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );
  next();
});

app.use(cookieParser());

app.use(
  session({ secret: "banijjo", saveUninitialized: false, resave: false })
);

app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

app.use(morgan("dev"));

app.use("/api", api);

app.listen(3001, () =>
  console.log("Express server is running on localhost:3001")
);
