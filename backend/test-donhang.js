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

async function testDonHang() {
  let pool;
  try {
    pool = await mssql.connect(config);
    // Nam
    const res1 = await pool.request().query("SELECT TOP 3 MaVanDon FROM DonHang");
    console.log('Orders on Nam:', res1.recordset);
    // Bac
    const res2 = await pool.request().query("SELECT TOP 3 MaVanDon FROM [LS_HUB_BAC_Local].[Logistics_MienBac].[dbo].[DonHang]");
    console.log('Orders on Bac:', res2.recordset);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    if (pool) await pool.close();
  }
}
testDonHang();
