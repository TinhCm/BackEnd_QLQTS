const { conn, sql } = require('../../connect');

module.exports = function(app) {
    app.get('/getNCC', async function(req, res) {
        var pool = await conn;
        var sqlString = `SELECT *
        FROM NHACUNGCAP
        ORDER BY CONVERT(int, SUBSTRING(MANCC,4,LEN(MANCC) -1))`
        return await pool.request().query(sqlString, function(err, data) {
            res.send(data.recordset);
        })
    })

    app.post('/postNCC', async function(req, res) {
        var pool = await conn;
        var sqlString = `INSERT INTO NHACUNGCAP(MANCC, TEN, DIACHI, SDT) VALUES (@MANCC, @TEN, @DIACHI, @SDT)`;
        return await pool.request()
            .input('MANCC', sql.NVarChar, req.body.MANCC)
            .input('TEN', sql.NVarChar, req.body.TEN)
            .input('DIACHI', sql.NVarChar, req.body.DIACHI)
            .input('SDT', sql.NVarChar, req.body.SDT)
            .query(sqlString, function(err, data) {
                res.send({ result: req.body });
            })
    })

    app.put('/putNCC', async function(req, res) {
        var pool = await conn;
        var sqlString = ` UPDATE NHACUNGCAP SET TEN = @TEN, DIACHI = @DIACHI, SDT = @SDT WHERE MANCC = @MANCC`;
        return await pool.request()
            .input('MANCC', sql.NVarChar, req.body.MANCC)
            .input('TEN', sql.NVarChar, req.body.TEN)
            .input('DIACHI', sql.NVarChar, req.body.DIACHI)
            .input('SDT', sql.NVarChar, req.body.SDT)
            .query(sqlString, function(err, data) {
                res.send({ result: req.body });
            })
    })

    app.delete('/deleteNCC', async function(req, res) {
        var pool = await conn;
        var sqlString = "DELETE FROM NHACUNGCAP WHERE MANCC = @MANCC";
        return await pool.request()
            .input('MANCC', sql.NVarChar, req.body.MANCC)
            .query(sqlString, function(err, data) {
                if (!err) {
                    res.send({ result: "Success delete" })
                } else {
                    res.send({ result: "False" })
                }
            })
    })
}