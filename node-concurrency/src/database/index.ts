import mysql from 'mysql2/promise';

export const client = mysql.createConnection({
  host: 'localhost',
  port: 3307,
  user: 'test',
  password: 'test',
  database: 'test',
});
