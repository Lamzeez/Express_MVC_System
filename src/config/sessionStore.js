const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
require("dotenv").config();

const store = new MySQLStore({
  host: process.env.DB_HOST,
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  schema: {
    tableName: "sessions"
  }
});

module.exports = store;
