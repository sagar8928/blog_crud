import mysql from 'mysql2';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'sagar@8928',
  database: 'blogdb',
});

db.connect((err) => {
  if (err) {
    console.error('mysql connection error', err.message);
    throw err;
  } else {
    console.log('mysql connected');
  }
});
// const [rows] = await db.execute(`select * from blogs`);
// console.log(rows);

export default db;
