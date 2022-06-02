const { conn, sql } = require('../../connect');

module.exports = function(app) {
    app.get('/getKhachHang', async function(req, res) {
        var pool = await conn;
        var sqlString = `SELECT KH.MAKH, KH.TENKH,KH.SDT, KH.NGAYDK, LKH.MALKH, LKH.TENLKH
        FROM KHACHHANG KH, LOAIKHACHHANG LKH
        WHERE KH.MALKH = LKH.MALKH
        ORDER BY CONVERT(int, SUBSTRING(KH.MAKH,3,LEN(KH.MAKH) -1))`
        return await pool.request().query(sqlString, function(err, data) {
            res.send(data.recordset);
        })
    })

    app.post('/postKhachHang', async function(req, res) {
        var pool = await conn;
        var sqlString = `INSERT INTO KHACHHANG(MAKH,MALKH,TENKH,NGAYDK,SDT) VALUES (@MAKH, @MALKH, @TENKH, @NGAYDK, @SDT)`;
        return await pool.request()
            .input('MAKH', sql.NVarChar, req.body.MAKH)
            .input('MALKH', sql.NVarChar, req.body.MALKH)
            .input('TENKH', sql.NVarChar, req.body.TENKH)
            .input('NGAYDK', sql.NVarChar, req.body.NGAYDK)
            .input('SDT', sql.NVarChar, req.body.SDT)
            .query(sqlString, function(err, data) {
                res.send({ result: req.body });
            })
    })

    app.put('/putKhachHang', async function(req, res) {
        var pool = await conn;
        var sqlString = ` UPDATE KHACHHANG SET MALKH = @MALKH, TENKH = @TENKH, NGAYDK = @NGAYDK, SDT = @SDT WHERE MAKH = @MAKH`;
        return await pool.request()
            .input('MAKH', sql.NVarChar, req.body.MAKH)
            .input('MALKH', sql.NVarChar, req.body.MALKH)
            .input('TENKH', sql.NVarChar, req.body.TENKH)
            .input('NGAYDK', sql.NVarChar, req.body.NGAYDK)
            .input('SDT', sql.NVarChar, req.body.SDT)
            .query(sqlString, function(err, data) {
                res.send({ result: req.body });
            })
    })

    app.delete('/deleteKhachHang', async function(req, res) {
        var pool = await conn;
        var sqlString = "DELETE FROM KHACHHANG WHERE MAKH = @MAKH";
        return await pool.request()
            .input('MAKH', sql.NVarChar, req.body.MAKH)
            .query(sqlString, function(err, data) {
                if (!err) {
                    res.send({ result: "Success delete" })
                } else {
                    res.send({ result: "False" })
                }
            })
    })
}