const { conn, sql } = require('../../connect');

module.exports = function(app) {
    app.get('/getCa', async function(req, res) {
        var pool = await conn;
        var sqlString = `DECLARE @NGAYDAUTUAN DATETIME
        SET @NGAYDAUTUAN  = DATEADD(WEEK, DATEDIFF(week, 0, getdate()-1), 0);
        DECLARE @NGAYCUOITUAN DATETIME
        SET @NGAYCUOITUAN  = DATEADD(WEEK, DATEDIFF(week, 0, getdate()) + 1, 0);
        SELECT NV.TENNV, NV.MANV, NV.SDT, CLV.TENCLV, CLV.MACLV, CLV.GIOBD, CLV.GIOKT
        FROM NHANVIEN NV, CT_LUONGNV CTL, CALAMVIEC CLV
        WHERE NV.MANV = CTL.MANV AND CTL.MACLV = CLV.MACLV AND CLV.GIOBD >= @NGAYDAUTUAN AND GIOKT < @NGAYCUOITUAN
        ORDER BY CLV.GIOBD DESC`
        return await pool.request().query(sqlString, function(err, data) {
            res.send(data.recordset);
        })
    })

    app.get('/getTopCa', async function(req, res) {
        var pool = await conn;
        var sqlString = `SELECT NV.TENNV, NV.MANV, NV.SDT, CLV.TENCLV, CLV.MACLV, CLV.GIOBD, CLV.GIOKT
        FROM NHANVIEN NV, CT_LUONGNV CTL, CALAMVIEC CLV
        WHERE NV.MANV = CTL.MANV AND CTL.MACLV = CLV.MACLV
        ORDER BY CONVERT(int, SUBSTRING(CLV.MACLV,2,LEN(CLV.MACLV) -1))`
        return await pool.request().query(sqlString, function(err, data) {
            res.send(data.recordset);
        })
    })


    app.get('/getLuong', async function(req, res) {
        var pool = await conn;
        var sqlString = `DECLARE @NGAYDAU DATE
        SET @NGAYDAU =  DATEADD (DAY, -1 * (DAY(GETDATE()) - 1), GETDATE())
        SELECT NV.MANV, NV.TENNV, NV.SDT, CLV.TENCLV, CLV.MACLV, CTL.THANHTIEN, CTL.HESOLUONG, CLV.GIOBD
        FROM NHANVIEN NV, CT_LUONGNV CTL, CALAMVIEC CLV
        WHERE NV.MANV = CTL.MANV AND CTL.MACLV = CLV.MACLV AND CLV.GIOBD > @NGAYDAU 
        ORDER BY CLV.GIOBD DESC`
        return await pool.request().query(sqlString, function(err, data) {
            res.send(data.recordset);
        })
    })

    app.get('/getLuongNV', async function(req, res) {
        var pool = await conn;
        var sqlString = `DECLARE @NGAYDAU DATE
        SET @NGAYDAU =  DATEADD (DAY, -1 * (DAY(GETDATE()) - 1), GETDATE())
        SELECT  SUM(CTL.THANHTIEN) AS TONG, NV.MANV, TENNV, COUNT(CLV.MACLV) AS TONGCA, TONGGIO = (COUNT(CLV.MACLV) * 5 ), CTL.HESOLUONG, MIN(CLV.GIOBD) AS NGAYLAM
        FROM NHANVIEN NV, CT_LUONGNV CTL, CALAMVIEC CLV
        WHERE NV.MANV = CTL.MANV AND CTL.MACLV = CLV.MACLV AND CTL.NGAYLAM >= @NGAYDAU
        GROUP BY NV.MANV , NV.MANV, NV.TENNV, CTL.HESOLUONG `
        return await pool.request()
            .input('MANV', sql.NVarChar, req.body.MANV)
            .query(sqlString, function(err, data) {

                res.send(data.recordset);
            })
    })

    app.post('/postCa', async function(req, res) {
        var pool = await conn;
        var sqlString = `INSERT INTO CALAMVIEC(MACLV,TENCLV, GIOBD, GIOKT) VALUES (@MACLV, @TENCLV, @GIOBD, @GIOKT)
        INSERT INTO CT_LUONGNV(MANV, MACLV, THANHTIEN, HESOLUONG, NGAYLAM) VALUES (@MANV, @MACLV, @THANHTIEN, @HESOLUONG, @NGAYLAM)`;
        return await pool.request()
            .input('MANV', sql.NVarChar, req.body.MANV)
            .input('MACLV', sql.NVarChar, req.body.MACLV)
            .input('TENCLV', sql.NVarChar, req.body.TENCLV)
            .input('GIOBD', sql.NVarChar, req.body.GIOBD)
            .input('GIOKT', sql.NVarChar, req.body.GIOKT)
            .input('HESOLUONG', sql.Int, req.body.HESOLUONG)
            .input('THANHTIEN', sql.Int, req.body.THANHTIEN)
            .input('NGAYLAM', sql.NVarChar, req.body.NGAYLAM)
            .query(sqlString, function(err, data) {
                res.send({ result: req.body });
            })
    })

    app.put('/putCa', async function(req, res) {
        var pool = await conn;
        var sqlString = ` UPDATE CALAMVIEC SET TENCLV = @TENCLV, GIOBD = @GIOBD, GIOKT = @GIOKT WHERE MACLV = @MACLV
        UPDATE CT_LUONGNV SET MANV = @MANV WHERE MACLV = @MACLV AND MANV = @MANV_CU`;
        return await pool.request()
            .input('MANV_CU', sql.NVarChar, req.body.MANV_CU)
            .input('MANV', sql.NVarChar, req.body.MANV)
            .input('MACLV', sql.NVarChar, req.body.MACLV)
            .input('TENCLV', sql.NVarChar, req.body.TENCLV)
            .input('GIOBD', sql.NVarChar, req.body.GIOBD)
            .input('GIOKT', sql.NVarChar, req.body.GIOKT)
            .query(sqlString, function(err, data) {
                res.send({ result: req.body });
            })
    })

    app.delete('/deleteCa', async function(req, res) {
        var pool = await conn;
        var sqlString = "DELETE FROM CALAMVIEC WHERE MACLV = @MACLV";
        return await pool.request()
            .input('MACLV', sql.NVarChar, req.body.MACLV)
            .query(sqlString, function(err, data) {
                if (!err) {
                    res.send({ result: "Success delete" })
                } else {
                    res.send({ result: "False" })
                }
            })
    })
}