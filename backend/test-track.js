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

async function testTrack() {
  let pool;
  try {
    pool = await mssql.connect(config);
    console.log('Connected to Nam Gateway.');
    
    console.log('--- Testing MD001 ---');
    const result = await pool.request().query("EXEC usp_TraCuuVanDon @MaVanDon = 'MD001'");
    console.log('Result:', result.recordset);

    console.log('--- Testing MDB01 ---');
    const result2 = await pool.request().query("EXEC usp_TraCuuVanDon @MaVanDon = 'MDB01'");
    console.log('Result 2:', result2.recordset);
  } catch (err) {
    console.error('SQL Error:', err.message);
  } finally {
    if (pool) await pool.close();
  }
}

testTrack();
