const con = require('../../app/connect/connect');

//main function fot query sql
const querySQL = (sql) => {
    return new Promise(function (resolve, reject){
        con.query(sql , (err,results) => {
            if(err) throw reject(err);
            resolve(results);
        });
    });
}

module.exports = querySQL;