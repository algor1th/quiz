const mariadb = require('mariadb');
const pool = mariadb.createPool({
     host: 'localhost', 
     user:'root', 
     password: "Q7*i'/Hy>/:g$YZd",
     database: 'CYSECPROJECT',
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