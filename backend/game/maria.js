const mariadb = require('mariadb');
const pool = mariadb.createPool({
     host: process.env.DBHOST, 
     user: process.env.DBUSER, 
     password: process.env.DBPASSWORD,
     database: process.env.DBNAME,
     connectionLimit: 5,
     multipleStatements: true
});

module.exports = {
        query: function(queryText, objects){
            return new Promise(function(resolve, reject) {
                pool.getConnection().then(conn => {
                    conn.query(queryText, objects).then((rows) => {
                        conn.close();
                        resolve(rows);
                    })
                })
            }
        );
    }
}