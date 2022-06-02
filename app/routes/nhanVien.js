const { conn, sql } = require('../../connect');

module.exports = function(app) {
    app.get('/getNV', async function(req, res) {
        var pool = await conn;
        var sqlString = `SELECT NV.MANV, TENNV, GIOITINH, CHUCVU, NGAYVAOLAM, DIACHI, SDT, ND.TENUSER, MK.MATKHAU,PQ.TENPQ, PQ.MAPQ, MK.MAMK 
        FROM NHANVIEN NV, PHANQUYEN PQ, NGUOIDUNG ND, MATKHAU MK WHERE NV.MANV = PQ.MANV AND PQ.MAPQ = ND.MAPQ AND ND.TENUSER = MK.TENUSER
        ORDER BY CONVERT(int, SUBSTRING(NV.MANV,3,LEN(NV.MANV) -1))`;
        return await pool.request().query(sqlString, function(err, data) {
            res.send(data.recordset);
        })
    })

    app.post('/postNV', async function(req, res) {
        var pool = await conn;
        var sqlString = `INSERT INTO NHANVIEN (MANV, TENNV, GIOITINH, CHUCVU, NGAYVAOLAM, DIACHI, SDT) VALUES (@MANV, @TENNV, @GIOITINH, @CHUCVU, @NGAYVAOLAM, @DIACHI, @SDT) 
        INSERT INTO PHANQUYEN (MAPQ, MANV, TENPQ) VALUES (@MAPQ, @MANV, @TENPQ) 
        INSERT INTO NGUOIDUNG (TENUSER, MAPQ) VALUES (@TENUSER, @MAPQ)
        INSERT INTO MATKHAU (MAMK, MATKHAU, TENUSER) VALUES (@MAMK, @MATKHAU, @TENUSER)`;
        return await pool.request()
            .input('MANV', sql.NVarChar, req.body.MANV)
            .input('TENNV', sql.NVarChar, req.body.TENNV)
            .input('GIOITINH', sql.NVarChar, req.body.GIOITINH)
            .input('CHUCVU', sql.NVarChar, req.body.CHUCVU)
            .input('NGAYVAOLAM', sql.NVarChar, req.body.NGAYVAOLAM)
            .input('DIACHI', sql.NVarChar, req.body.DIACHI)
            .input('SDT', sql.NVarChar, req.body.SDT)
            .input('TENPQ', sql.NVarChar, req.body.TENPQ)
            .input('TENUSER', sql.NVarChar, req.body.TENUSER)
            .input('MATKHAU', sql.NVarChar, req.body.MATKHAU)
            .input('MAPQ', sql.NVarChar, req.body.MAPQ)
            .input('MAMK', sql.NVarChar, req.body.MAMK)
            .query(sqlString, function(err, data) {
                res.send({ result: req.body });
            })
    })

    app.put('/putNV', async function(req, res) {
        var pool = await conn;
        var sqlString = `UPDATE NHANVIEN SET TENNV = @TENNV, GIOITINH = @GIOITINH, CHUCVU = @CHUCVU, NGAYVAOLAM = @NGAYVAOLAM, DIACHI = @DIACHI, SDT = @SDT WHERE MANV = @MANV 
        UPDATE PHANQUYEN SET MANV = @MANV, TENPQ = @TENPQ WHERE MAPQ = @MAPQ 
        UPDATE NGUOIDUNG SET MAPQ = @MAPQ, TENUSER = @USER WHERE TENUSER = @TENUSER 
        UPDATE MATKHAU SET TENUSER = @USER, MATKHAU = @MATKHAU WHERE MAMK = @MAMK`;
        return await pool.request()
            .input('MANV', sql.NVarChar, req.body.MANV)
            .input('TENNV', sql.NVarChar, req.body.TENNV)
            .input('GIOITINH', sql.NVarChar, req.body.GIOITINH)
            .input('CHUCVU', sql.NVarChar, req.body.CHUCVU)
            .input('NGAYVAOLAM', sql.NVarChar, req.body.NGAYVAOLAM)
            .input('DIACHI', sql.NVarChar, req.body.DIACHI)
            .input('SDT', sql.NVarChar, req.body.SDT)
            .input('TENPQ', sql.NVarChar, req.body.TENPQ)
            .input('TENUSER', sql.NVarChar, req.body.TENUSER)
            .input('USER', sql.NVarChar, req.body.USER)
            .input('MATKHAU', sql.NVarChar, req.body.MATKHAU)
            .input('MAPQ', sql.NVarChar, req.body.MAPQ)
            .input('MAMK', sql.NVarChar, req.body.MAMK)
            .query(sqlString, function(err, data) {
                res.send({ result: req.body });
            })
    })

    app.delete('/deleteNV', async function(req, res) {
        var pool = await conn;
        var sqlString = "DELETE FROM NHANVIEN WHERE MANV = @MANV";
        return await pool.request()
            .input('MANV', sql.NVarChar, req.body.MANV)
            .query(sqlString, function(err, data) {
                if (!err) {
                    res.send({ result: "Success delete" })
                } else {
                    res.send({ result: "False" })
                }
            })
    })
}