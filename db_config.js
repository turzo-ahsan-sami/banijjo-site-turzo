const mysql = require("mysql");
const { promisify } = require("util");

const dev_config = {
  connectionLimit : 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "microfin_ecommerce_3"
};

const bd_config = {
  connectionLimit : 10,
  host: "localhost",
  user: "microfin_ecom",
  password: "sikder!@#",
  database: "microfin_ecommerce"
};

const com_config = {
  connectionLimit : 10,
  host: "localhost",
  user: "microfin_ecom",
  password: "sikder!@#",
  database: "microfin_banijjo"
};

const process_env = "development";
// const process_env = "production_com";
// const process_env = "production_bd";

let DB_Config;

if (process_env === "development")
  DB_Config = mysql.createPool(dev_config);
else if (process_env === "production_com")
  DB_Config = mysql.createPool(com_config);
else if (process_env === "production_bd")
  DB_Config = mysql.createPool(bd_config);

DB_Config.getConnection(err => {
  if (err) {
    throw err;
  }
  console.log("Connected to Database...");
});

const query = promisify(DB_Config.query).bind(DB_Config);

module.exports = { query };
