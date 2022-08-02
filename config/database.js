const mysql = require('mysql');


// mysql Database connection
require('dotenv').config();
const DB_HOST = process.env.DB_HOST
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_MYSQL = process.env.DB_MYSQL
const DB_PORT = process.env.DB_PORT

const options = {
  connectionLimit: 100,
  password: DB_PASSWORD,
  user: DB_USER,
  database: DB_MYSQL,
  host: DB_HOST,
  port:  DB_PORT,
  createDatabaseTable: true
}

const connection = mysql.createPool(options);

connection.getConnection((err, connect) => {
  if (err) throw (err)
  console.log('DB connected successful ' + connect.threadId);  
});

module.exports = connection;