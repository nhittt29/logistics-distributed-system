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

async function createSP() {
  let pool;
  try {
    pool = await mssql.connect(config);
    console.log('--- Đang cài đặt SP usp_XemThuNhapShipper vào Gateway Nam ---');
    
    const createQuery = `
      CREATE OR ALTER PROCEDURE usp_XemThuNhapShipper
          @MaNV VARCHAR(10)
      AS
      BEGIN
          SET NOCOUNT ON;
      
          IF @MaNV LIKE 'NVB%'
          BEGIN
              SELECT p2.MaNV, p1.HoTen, p1.MaBC, p2.Luong
              FROM NhanVien_Phan2 p2
              JOIN [LS_HUB_BAC_Local].[Logistics_MienBac].[dbo].[NhanVien_Phan1] p1 ON p2.MaNV = p1.MaNV
              WHERE p2.MaNV = @MaNV AND p1.ChucVu = N'Shipper';
          END
          ELSE IF @MaNV LIKE 'NVT%'
          BEGIN
              SELECT p2.MaNV, p1.HoTen, p1.MaBC, p2.Luong
              FROM NhanVien_Phan2 p2
              JOIN [LS_HUB_TRUNG_Local].[Logistics_MienTrung].[dbo].[NhanVien_Phan1] p1 ON p2.MaNV = p1.MaNV
              WHERE p2.MaNV = @MaNV AND p1.ChucVu = N'Shipper';
          END
          ELSE
          BEGIN
              SELECT p2.MaNV, p1.HoTen, p1.MaBC, p2.Luong
              FROM NhanVien_Phan2 p2
              JOIN NhanVien_Phan1 p1 ON p2.MaNV = p1.MaNV
              WHERE p2.MaNV = @MaNV AND p1.ChucVu = N'Shipper';
          END
      END
    `;
    
    await pool.request().query(createQuery);
    console.log('✅ Cài đặt SP thành công!');

    // Test thu nhập nhân viên miền Bắc (NVB02)
    console.log('\\n--- Test Tra Cứu Thu Nhập NVB02 ---');
    const test1 = await pool.request()
        .input('MaNV', mssql.NVarChar, 'NVB02')
        .execute('usp_XemThuNhapShipper');
    console.log(test1.recordset);

    // Test thu nhập nhân viên miền Nam (NV01)
    console.log('\\n--- Test Tra Cứu Thu Nhập NV01 (Nam) ---');
    const test2 = await pool.request()
        .input('MaNV', mssql.NVarChar, 'NV01')
        .execute('usp_XemThuNhapShipper');
    console.log(test2.recordset);

  } catch(e) {
    console.error('❌ Lỗi:', e.message);
  } finally {
    if(pool) await pool.close();
  }
}

createSP();
