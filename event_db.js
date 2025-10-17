const mysql = require('mysql2');


const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'charityevents_db'
};

let conn;

const getConnection = () => {
  if (!conn) {
    conn = mysql.createConnection(dbConfig);
    console.log("MySQL connected");
  }
  return conn;
};

module.exports = { getConnection };
