const mysql = require('mysql');
const genPassword = require('../config/passwordUtils').genPassword;


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

connection = mysql.createPool(options);

connection.getConnection((err, connect) => {
  if (err) throw (err)
  console.log('DB connected successful ' + connect.threadId);  
});

function addNewUser(req, res){
  console.log('addNewUser');
  const saltHash = genPassword(req.body.password);
  
  const salt = saltHash.salt;
  const hash = saltHash.hash;
  
  const insertQuery = "INSERT INTO users (first_name, last_name, phone, email, salt, hash) VALUES ('" + req.body.firstName + "','" + req.body.lastName + "','" +  req.body.phone + "','" +  req.body.email + "','" +  salt + "','" +  hash + "')";
  
  connection.query(insertQuery, (err) => {
    if(err){
      console.log(err);
    }
    else{
      console.log('successfully entered');
    }
  });
}

module.exports = connection;
module.exports.addNewUser = addNewUser;