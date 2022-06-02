const { conn, sql } = require('../../connect');

module.exports = function(app) {

    app.get('/getFullSP', async function(req, res) {
        var pool = await conn;
        var sqlString = `SELECT *
        FROM HANGHOA
        ORDER BY CONVERT(int, SUBSTRING(MAHH,3,LEN(MAHH) -1))`
        return await pool.request().query(sqlString, function(err, data) {
            res.send(data.recordset);
        })
    })

    app.get('/getFullHDNH', async function(req, res) {
        var pool = await conn;
        var sqlString = `SELECT MAHDNH
        FROM HOADONNHAPHANG
        ORDER BY CONVERT(int, SUBSTRING(MAHDNH,5,LEN(MAHDNH) -1))`
        return await pool.request().query(sqlString, function(err, data) {
            res.send(data.recordset);
        })
    })

    app.get('/getSanPham', async function(req, res) {
        var pool = await conn;
        var sqlString = `SELECT MAHH, TENHH, GIAHH
        FROM HANGHOA
        WHERE MALHH = 'LHH2'`
        return await pool.request().query(sqlString, function(err, data) {
            res.send(data.recordset);
        })
    })

    app.get('/getHangHoa', async function(req, res) {
        var pool = await conn;
        var sqlString = `SELECT NV.MANV, NV.TENNV, HDNH.MAHDNH, HDNH.NGAYHDNH, CTNH.MAHH, CTNH.SOLUONG, CTNH.DONVI, NCC.MANCC, NCC.TEN, HH.TENHH, HH.GIAHH
        FROM NHANVIEN NV, HOADONNHAPHANG HDNH, CT_NHAPHANG CTNH, HANGHOA HH, LOAIHANGHOA LHH, NHACUNGCAP NCC
        WHERE NV.MANV = HDNH.MANV AND HDNH.MAHDNH = CTNH.MAHDNH AND CTNH.MAHH = HH.MAHH AND HH.MALHH = LHH.MALHH AND NCC.MANCC = HH.MANCC`
        return await pool.request().query(sqlString, function(err, data) {
            res.send(data.recordset);
        })
    })

    app.post('/postSanPham', async function(req, res) {
        var pool = await conn;
        var sqlString = `INSERT INTO HANGHOA(MAHH,TENHH,MALHH,GIAHH, MANCC) VALUES (@MAHH, @TENHH, @MALHH, @GIAHH, @MANCC)`;
        return await pool.request()
            .input('MAHH', sql.NVarChar, req.body.MAHH)
            .input('TENHH', sql.NVarChar, req.body.TENHH)
            .input('MALHH', sql.NVarChar, req.body.MALHH)
            .input('GIAHH', sql.NVarChar, req.body.GIAHH)
            .input('MANCC', sql.NVarChar, req.body.MANCC)
            .query(sqlString, function(err, data) {
                res.send({ result: req.body });
            })
    })

    app.post('/postHangHoa', async function(req, res) {
        var pool = await conn;
        var sqlString = `INSERT INTO HANGHOA(MAHH,TENHH,MALHH,GIAHH, MANCC) VALUES (@MAHH, @TENHH, @MALHH, @GIAHH, @MANCC)
        INSERT INTO HOADONNHAPHANG(MAHDNH, MANV, NGAYHDNH) VALUES (@MAHDNH, @MANV, @NGAYHDNH)
        INSERT INTO CT_NHAPHANG(MAHH, MAHDNH, SOLUONG, DONVI) VALUES (@MAHH, @MAHDNH, @SOLUONG, @DONVI)`;
        return await pool.request()
            .input('MAHH', sql.NVarChar, req.body.MAHH)
            .input('TENHH', sql.NVarChar, req.body.TENHH)
            .input('MALHH', sql.NVarChar, req.body.MALHH)
            .input('GIAHH', sql.NVarChar, req.body.GIAHH)
            .input('MANCC', sql.NVarChar, req.body.MANCC)
            .input('MANV', sql.NVarChar, req.body.MANV)
            .input('MAHDNH', sql.NVarChar, req.body.MAHDNH)
            .input('SOLUONG', sql.NVarChar, req.body.SOLUONG)
            .input('NGAYHDNH', sql.NVarChar, req.body.NGAYHDNH)
            .input('DONVI', sql.NVarChar, req.body.DONVI)
            .query(sqlString, function(err, data) {
                res.send({ result: req.body });
            })
    })

    app.put('/putSanPham', async function(req, res) {
        var pool = await conn;
        var sqlString = ` UPDATE HANGHOA SET TENHH = @TENHH, MALHH = @MALHH, GIAHH = @GIAHH, MANCC = @MANCC WHERE MAHH = @MAHH`;
        return await pool.request()
            .input('MAHH', sql.NVarChar, req.body.MAHH)
            .input('TENHH', sql.NVarChar, req.body.TENHH)
            .input('MALHH', sql.NVarChar, req.body.MALHH)
            .input('GIAHH', sql.NVarChar, req.body.GIAHH)
            .input('MANCC', sql.NVarChar, req.body.MANCC)
            .query(sqlString, function(err, data) {
                res.send({ result: req.body });
            })
    })

    app.put('/putHangHoa', async function(req, res) {
        var pool = await conn;
        var sqlString = `UPDATE HANGHOA SET TENHH = @TENHH, MALHH = @MALHH, GIAHH = @GIAHH, MANCC = @MANCC WHERE MAHH = @MAHH
        UPDATE HOADONNHAPHANG SET NGAYHDNH = @NGAYHDNH, MANV = @MANV WHERE MAHDNH = @MAHDNH
        UPDATE CT_NHAPHANG SET SOLUONG = @SOLUONG, DONVI = @DONVI WHERE MAHH = @MAHH AND MAHDNH = @MAHDNH`;
        return await pool.request()
            .input('MAHH', sql.NVarChar, req.body.MAHH)
            .input('TENHH', sql.NVarChar, req.body.TENHH)
            .input('MALHH', sql.NVarChar, req.body.MALHH)
            .input('GIAHH', sql.NVarChar, req.body.GIAHH)
            .input('MANCC', sql.NVarChar, req.body.MANCC)
            .input('MANV', sql.NVarChar, req.body.MANV)
            .input('MAHDNH', sql.NVarChar, req.body.MAHDNH)
            .input('SOLUONG', sql.NVarChar, req.body.SOLUONG)
            .input('NGAYHDNH', sql.NVarChar, req.body.NGAYHDNH)
            .input('DONVI', sql.NVarChar, req.body.DONVI)
            .query(sqlString, function(err, data) {
                res.send({ result: req.body });
            })
    })

    app.delete('/deleteSanPham', async function(req, res) {
        var pool = await conn;
        var sqlString = "DELETE FROM HANGHOA WHERE MAHH = @MAHH";
        return await pool.request()
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