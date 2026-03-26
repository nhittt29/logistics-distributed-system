const mssql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT),
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

async function testCentral() {
  let pool;
  try {
    pool = await mssql.connect(config);
    console.log('--- Tất cả Đơn hàng Miền Trung ---');
    const result1 = await pool.request().query("SELECT TOP 5 MaVanDon, NgayGui, CuocPhi FROM [LS_HUB_TRUNG_Local].[Logistics_MienTrung].[dbo].[DonHang] ORDER BY CuocPhi DESC");
    console.log(result1.recordset);
  } catch (err) {
    console.error('SQL Error:', err.message);
  } finally {
    if (pool) await pool.close();
  }
}

testCentral();
