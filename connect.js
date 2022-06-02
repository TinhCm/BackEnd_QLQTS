var sql = require('mssql/msnodesqlv8');

var config = {
    server: "192.168.2.1",
    user: "sa",
    password: "0989828t",
    database: "QLQUANTRASUA",
    driver: "msnodesqlv8"
};

const conn = new sql.ConnectionPool(config).connect().then(pool => {
    return pool;
});

module.exports = {
    conn: conn,
    sql: sql
}