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

async function check() {
  let pool;
  try {
    pool = await mssql.connect(config);
    let r1 = await pool.request().query("SELECT * FROM TrangThaiDonHang");
    console.table(r1.recordset);
    
    let r2 = await pool.request().query("SELECT COUNT(*) as Cnt FROM DonHang WHERE YEAR(NgayGui) = 2025 AND MaTrangThai = 'TT04'");
    console.log("TT04 count Local:", r2.recordset[0].Cnt);
    
    // Check all tables quickly
    let r3 = await pool.request().query("SELECT MaVanDon, MaTrangThai, NgayGui FROM DonHang");
    console.log("Orders:", r3.recordset);
  } catch(e) {
    console.error(e.message);
  } finally {
    if(pool) await pool.close();
  }
}
check();
