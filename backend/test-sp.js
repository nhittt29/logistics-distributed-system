const mssql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME, // Logistics_MienNam
  port: parseInt(process.env.DB_PORT),
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

async function testSP() {
  let pool;
  try {
    pool = await mssql.connect(config);
    console.log('--- Đang lấy cấu trúc bảng vận hành ---');
    const r1 = await pool.request().query('SELECT TOP 1 * FROM DonHang');
    const r2 = await pool.request().query('SELECT TOP 1 * FROM BangGia');
    const r3 = await pool.request().query('SELECT TOP 1 * FROM BuuCuc');
    console.log('DonHang:', r1.recordset[0] ? Object.keys(r1.recordset[0]).join(', ') : 'Empty');
    console.log('BangGia:', r2.recordset[0] ? Object.keys(r2.recordset[0]).join(', ') : 'Empty');
    console.log('BuuCuc:', r3.recordset[0] ? Object.keys(r3.recordset[0]).join(', ') : 'Empty');
  } catch(e) {
    console.error('❌ Lỗi:', e.message);
  } finally {
    if(pool) await pool.close();
  }
}
testSP();
