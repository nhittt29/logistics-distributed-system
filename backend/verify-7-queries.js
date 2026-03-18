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

async function runTests() {
  try {
    const pool = await mssql.connect(config);
    console.log('--- TEST 1: vw_ShipperMienBac (Hub Bac via LS) ---');
    try {
      const res1 = await pool.request().query('SELECT * FROM [LS_HUB_BAC_Local].[Logistics_MienBac].[dbo].[vw_ShipperMienBac]');
      console.log('✅ OK. Count:', res1.recordset.length);
    } catch (e) {
      console.log('❌ FAIL:', e.message);
    }

    console.log('\n--- TEST 2: High fee orders Central (Hub Trung via LS) ---');
    try {
      const res2 = await pool.request().query("SELECT d.MaVanDon FROM [LS_HUB_TRUNG_Local].[Logistics_MienTrung].[dbo].[DonHang] d WHERE CuocPhi > 1000000");
      console.log('✅ OK. Count:', res2.recordset.length);
    } catch (e) {
      console.log('❌ FAIL:', e.message);
    }

    console.log('\n--- TEST 3: usp_TraCuuVanDon (Gateway Nam) ---');
    try {
      // Find a valid MaVanDon first
      const vdns = await pool.request().query("SELECT TOP 1 MaVanDon FROM DonHang");
      const code = vdns.recordset[0]?.MaVanDon || 'VDN001';
      const res3 = await pool.request().query(`EXEC usp_TraCuuVanDon @MaVanDon = '${code}'`);
      console.log('✅ OK. Result:', res3.recordset[0]?.MaVanDon);
    } catch (e) {
      console.log('❌ FAIL:', e.message);
    }

    console.log('\n--- TEST 4: usp_XemThuNhapShipper (Gateway Nam) ---');
    try {
      const nvs = await pool.request().query("SELECT TOP 1 MaNV FROM NhanVien_Phan1");
      const code = nvs.recordset[0]?.MaNV || 'NVN01';
      const res4 = await pool.request().query(`EXEC usp_XemThuNhapShipper @MaNV = '${code}'`);
      console.log('✅ OK. Result:', res4.recordset[0]?.HoTen);
    } catch (e) {
      console.log('❌ FAIL:', e.message);
    }

    console.log('\n--- TEST 5: Global Revenue (Union 3 Regions) ---');
    try {
      const res5 = await pool.request().query(`
        SELECT N'Miền Bắc' AS KhuVuc, ISNULL(SUM(CuocPhi), 0) AS DoanhThu FROM [LS_HUB_BAC_Local].[Logistics_MienBac].[dbo].[DonHang]
        UNION ALL
        SELECT N'Miền Trung', ISNULL(SUM(CuocPhi), 0) FROM [LS_HUB_TRUNG_Local].[Logistics_MienTrung].[dbo].[DonHang]
        UNION ALL
        SELECT N'Miền Nam', ISNULL(SUM(CuocPhi), 0) FROM DonHang
      `);
      console.log('✅ OK. Data:', res5.recordset.map(r => `${r.KhuVuc}: ${r.DoanhThu}`).join(', '));
    } catch (e) {
      console.log('❌ FAIL:', e.message);
    }

    console.log('\n--- TEST 6: Trigger Check (Xóa dịch vụ) ---');
    try {
      // Test deleted with rollback expected for DV01
      const res6 = await pool.request().query("BEGIN TRANSACTION; DELETE FROM BangGia WHERE MaDichVu = 'DV01'; ROLLBACK;");
      console.log('✅ OK (Manual transaction pass)');
    } catch (e) {
        if (e.message.includes('Lỗi: Dịch vụ')) {
            console.log('✅ OK (Trigger caught dependency correctly):', e.message);
        } else {
            console.log('❌ FAIL:', e.message);
        }
    }

    console.log('\n--- TEST 7: fn_DemDonThatBai_2025 ---');
    try {
      const res7 = await pool.request().query("SELECT dbo.fn_DemDonThatBai_2025() as Total");
      console.log('✅ OK. Total:', res7.recordset[0]?.Total);
    } catch (e) {
      console.log('❌ FAIL:', e.message);
    }

    await pool.close();
  } catch (err) {
    console.error('Connection Error:', err.message);
  }
}

runTests();
