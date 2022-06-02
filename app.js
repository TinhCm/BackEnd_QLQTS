var express = require('express');
var app = express();
var bodyParser = require('body-parser')

const cors = require("cors");
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions))

//Chạy modun
app.use(bodyParser.json());

// Router nhân viên
require('./app/routes/nhanVien')(app);

// Router ca làm việc
require('./app/routes/caLamViec')(app);

// Router khách hàng
require('./app/routes/khachHang')(app);

// Router hàng hóa
require('./app/routes/hangHoa')(app);

// Router nhà cung cấp
require('./app/routes/nhaCungCap')(app);

// Router bán hàng
require('./app/routes/banHang')(app);
//Mở cổng server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('JSON Server is running')
})