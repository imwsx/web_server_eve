const mysql = require('mysql');

const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '260452',
    database: 'db_eve'
});

/* 检查是否连接成功 */
// db.query('select 1', (err, results) => {
//     console.log(results);
// });


module.exports = db;