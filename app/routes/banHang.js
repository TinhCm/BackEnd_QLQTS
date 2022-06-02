const { conn, sql } = require('../../connect');

module.exports = function(app) {
    app.get('/getHoaDon', async function(req, res) {
        var pool = await conn;
        var sqlString = `SELECT HDBH.MAHDBH, NV.MANV, KH.MAKH,LKH.MALKH, SOLUONG, NV.TENNV, KH.TENKH, HDBH.NGAYHDBH, CTBH.THANHTIEN, HH.TENHH, HH.GIAHH, HH.MAHH
        FROM HOADONBANHANG HDBH, CT_BANHANG CTBH, NHANVIEN NV, KHACHHANG KH, LOAIKHACHHANG LKH, HANGHOA HH
        WHERE HDBH.MAHDBH = CTBH.MAHDBH AND HDBH.MANV = NV.MANV AND HDBH.MAKH = KH.MAKH AND KH.MALKH = LKH.MALKH AND CTBH.MAHH = HH.MAHH
        ORDER BY CONVERT(int, SUBSTRING(HDBH.MAHDBH,5,LEN(HDBH.MAHDBH) -1))`
        return await pool.request().query(sqlString, function(err, data) {
            res.send(data.recordset);
        })
    })

    app.get('/getHoaDonThang', async function(req, res) {
        var pool = await conn;
        var sqlString = `DECLARE @NGAYDAU DATE
        SET @NGAYDAU =  DATEADD (DAY, -1 * (DAY(GETDATE()) - 1), GETDATE())
        SELECT HDBH.MAHDBH, NV.MANV, KH.MAKH,LKH.MALKH, SOLUONG, NV.TENNV, KH.TENKH, HDBH.NGAYHDBH, CTBH.THANHTIEN, HH.TENHH, HH.GIAHH, HH.MAHH
        FROM HOADONBANHANG HDBH, CT_BANHANG CTBH, NHANVIEN NV, KHACHHANG KH, LOAIKHACHHANG LKH, HANGHOA HH
        WHERE HDBH.MAHDBH = CTBH.MAHDBH AND HDBH.MANV = NV.MANV AND HDBH.MAKH = KH.MAKH AND KH.MALKH = LKH.MALKH AND CTBH.MAHH = HH.MAHH AND NGAYHDBH >= @NGAYDAU
        ORDER BY CONVERT(int, SUBSTRING(HDBH.MAHDBH,5,LEN(HDBH.MAHDBH) -1))`
        return await pool.request().query(sqlString, function(err, data) {
            res.send(data.recordset);
        })
    })

    app.get('/getHoaDonTuan', async function(req, res) {
        var pool = await conn;
        var sqlString = `DECLARE @NGAYDAUTUAN DATE
        SET @NGAYDAUTUAN  = DATEADD(WEEK, DATEDIFF(week, 0, getdate()- 1), 0);
        SELECT HDBH.MAHDBH, NV.MANV, KH.MAKH,LKH.MALKH, SOLUONG, NV.TENNV, KH.TENKH, HDBH.NGAYHDBH, CTBH.THANHTIEN, HH.TENHH, HH.GIAHH, HH.MAHH
        FROM HOADONBANHANG HDBH, CT_BANHANG CTBH, NHANVIEN NV, KHACHHANG KH, LOAIKHACHHANG LKH, HANGHOA HH
        WHERE HDBH.MAHDBH = CTBH.MAHDBH AND HDBH.MANV = NV.MANV AND HDBH.MAKH = KH.MAKH AND KH.MALKH = LKH.MALKH AND CTBH.MAHH = HH.MAHH AND HDBH.NGAYHDBH >= @NGAYDAUTUAN
        ORDER BY CONVERT(int, SUBSTRING(HDBH.MAHDBH,5,LEN(HDBH.MAHDBH) -1))`
        return await pool.request().query(sqlString, function(err, data) {
            res.send(data.recordset);
        })
    })

    app.get('/getHoaDon2', async function(req, res) {
        var pool = await conn;
        var sqlString = `SELECT HDBH.MAHDBH,HDBH.NGAYHDBH, SUM(CTBH.THANHTIEN) AS TONGTIEN, SUM(CTBH.SOLUONG) AS TONGSP
        FROM HOADONBANHANG HDBH, CT_BANHANG CTBH
        WHERE HDBH.MAHDBH = CTBH.MAHDBH
        GROUP BY HDBH.NGAYHDBH, HDBH.MAHDBH
		ORDER BY CONVERT(int, SUBSTRING(HDBH.MAHDBH,5,LEN(HDBH.MAHDBH) -1))`
        return await pool.request().query(sqlString, function(err, data) {
            res.send(data.recordset);
        })
    })

    app.get('/getHoaDon2Thang', async function(req, res) {
        var pool = await conn;
        var sqlString = `DECLARE @NGAYDAU DATE
        SET @NGAYDAU =  DATEADD (DAY, -1 * (DAY(GETDATE()) - 1), GETDATE())
        SELECT HDBH.MAHDBH,HDBH.NGAYHDBH, SUM(CTBH.THANHTIEN) AS TONGTIEN, SUM(CTBH.SOLUONG) AS TONGSP
        FROM HOADONBANHANG HDBH, CT_BANHANG CTBH
        WHERE HDBH.MAHDBH = CTBH.MAHDBH AND NGAYHDBH >= @NGAYDAU
        GROUP BY HDBH.NGAYHDBH, HDBH.MAHDBH
        ORDER BY CONVERT(int, SUBSTRING(HDBH.MAHDBH,5,LEN(HDBH.MAHDBH) -1))`
        return await pool.request().query(sqlString, function(err, data) {
            res.send(data.recordset);
        })
    })

    app.get('/getHoaDon2Tuan', async function(req, res) {
        var pool = await conn;
        var sqlString = `DECLARE @NGAYDAUTUAN DATETIME
        SET @NGAYDAUTUAN  = DATEADD(WEEK, DATEDIFF(week, 0, getdate()- 1), 0);
        SELECT HDBH.MAHDBH,HDBH.NGAYHDBH, SUM(CTBH.THANHTIEN) AS TONGTIEN, SUM(CTBH.SOLUONG) AS TONGSP
        FROM HOADONBANHANG HDBH, CT_BANHANG CTBH
        WHERE HDBH.MAHDBH = CTBH.MAHDBH AND NGAYHDBH >= @NGAYDAUTUAN
        GROUP BY HDBH.NGAYHDBH, HDBH.MAHDBH
        ORDER BY CONVERT(int, SUBSTRING(HDBH.MAHDBH,5,LEN(HDBH.MAHDBH) -1))`
        return await pool.request().query(sqlString, function(err, data) {
            res.send(data.recordset);
        })
    })

    app.get('/getMaxMa', async function(req, res) {
        var pool = await conn;
        var sqlString = `SELECT MAHDBH
        FROM HOADONBANHANG
        ORDER BY CONVERT(int, SUBSTRING(MAHDBH,5,(LEN(MAHDBH) - 1))), MAHDBH`
        return await pool.request().query(sqlString, function(err, data) {
            res.send(data.recordset);
        })
    })

    app.get('/getDoanhThu', async function(req, res) {
        var pool = await conn;
        var sqlString = `SELECT SUM(TONGTIEN) AS TONGTIEN FROM HOADONBANHANG`
        return await pool.request().query(sqlString, function(err, data) {
            res.send(data.recordset);
        })
    })

    app.get('/getDoanhThuTuan', async function(req, res) {
        var pool = await conn;
        var sqlString = `DECLARE @NGAYDAUTUAN DATETIME
        SET @NGAYDAUTUAN  = DATEADD(WEEK, DATEDIFF(week, 0, getdate()- 1), 0);
        SELECT SUM(TONGTIEN) AS TONGTIEN FROM HOADONBANHANG
        WHERE NGAYHDBH >= @NGAYDAUTUAN`
        return await pool.request().query(sqlString, function(err, data) {
            res.send(data.recordset);
        })
    })

    app.get('/getDoanhThuThang', async function(req, res) {
        var pool = await conn;
        var sqlString = `DECLARE @NGAYDAU DATE
        SET @NGAYDAU =  DATEADD (DAY, -1 * (DAY(GETDATE()) - 1), GETDATE())
        SELECT SUM(TONGTIEN) AS TONGTIEN FROM HOADONBANHANG
        WHERE NGAYHDBH >= @NGAYDAU`
        return await pool.request().query(sqlString, function(err, data) {
            res.send(data.recordset);
        })
    })

    app.get('/getGiaSP', async function(req, res) {
        var pool = await conn;
        var sqlString = `SELECT MAHH, GIAHH
        FROM HANGHOA`
        return await pool.request().query(sqlString, function(err, data) {
            res.send(data.recordset);
        })
    })

    app.post('/postHDBH', async function(req, res) {
        var pool = await conn;
        var sqlString = `INSERT INTO HOADONBANHANG(MAHDBH, MANV, NGAYHDBH, TONGTIEN, MAKH) VALUES (@MAHDBH, @MANV, @NGAYHDBH, @TONGTIEN, @MAKH)`;
        return await pool.request()
            .input('MAHDBH', sql.NVarChar, req.body.MAHDBH)
            .input('MANV', sql.NVarChar, req.body.MANV)
            .input('NGAYHDBH', sql.NVarChar, req.body.NGAYHDBH)
            .input('TONGTIEN', sql.NVarChar, req.body.TONGTIEN)
            .input('MAKH', sql.NVarChar, req.body.MAKH)
            .query(sqlString, function(err, data) {
                res.send({ result: req.body });
            })
    })

    app.post('/postCTBH', async function(req, res) {
        var pool = await conn;
        var sqlString = `INSERT INTO CT_BANHANG(MAHDBH, MAHH, SOLUONG, THANHTIEN) VALUES (@MAHDBH, @MAHH, @SOLUONG, @THANHTIEN)`;
        return await pool.request()
            .input('MAHDBH', sql.NVarChar, req.body.MAHDBH)
            .input('MAHH', sql.NVarChar, req.body.MAHH)
            .input('SOLUONG', sql.NVarChar, req.body.SOLUONG)
            .input('THANHTIEN', sql.NVarChar, req.body.THANHTIEN)
            .query(sqlString, function(err, data) {
                res.send({ result: req.body });
            })
    })

    app.put('/putHDBH', async function(req, res) {
        var pool = await conn;
        var sqlString = `UPDATE HOADONBANHANG SET TONGTIEN = @TONGTIEN WHERE MAHDBH = @MAHDBH`;
        return await pool.request()
            .input('MAHDBH', sql.NVarChar, req.body.MAHDBH)
            .input('TONGTIEN', sql.NVarChar, req.body.TONGTIEN)
            .query(sqlString, function(err, data) {
                res.send({ result: req.body });

            })
    })

    app.delete('/deleteBanHang', async function(req, res) {
        var pool = await conn;
        var sqlString = "DELETE FROM CT_BANHANG WHERE MAHDBH = @MAHDBH AND MAHH = @MAHH";
        return await pool.request()
            .input('MAHDBH', sql.NVarChar, req.body.MAHDBH)
            .input('MAHH', sql.NVarChar, req.body.MAHH)
            .query(sqlString, function(err, data) {
                if (!err) {
                    res.send({ result: "Success delete" })
                } else {
                    res.send({ result: "False" })
                }
            })
    })
}