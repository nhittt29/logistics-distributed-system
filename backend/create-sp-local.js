const mssql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME, // Gateway Connects to Logistics_MienNam
  port: parseInt(process.env.DB_PORT),
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

const sqlScripts = [
  {
    name: 'SP Tra Cuu Thu Nhap (Hub Mien Bac)',
    query: `
      EXEC ('
        USE Logistics_MienBac;
        EXEC (''
            CREATE OR ALTER PROCEDURE usp_XemThuNhapShipper
                @MaNV VARCHAR(10)
            AS
            BEGIN
                SET NOCOUNT ON;
                
                -- JOIN Local table (NhanVien_Phan1) vs Remote table (Logistics_MienNam.dbo.NhanVien_Phan2)
                SELECT p1.MaNV, p1.HoTen, p1.MaBC, p2.Luong
                FROM Logistics_MienBac.dbo.NhanVien_Phan1 p1
                JOIN Logistics_MienNam.dbo.NhanVien_Phan2 p2 ON p1.MaNV = p2.MaNV
                WHERE p1.MaNV = @MaNV AND p1.ChucVu = N''''Shipper''''
            '')
      ') AT [LS_HUB_BAC_Local];
    `
  },
  {
    name: 'SP Tra Cuu Thu Nhap (Hub Mien Trung)',
    query: `
      EXEC ('
        USE Logistics_MienTrung;
        EXEC (''
            CREATE OR ALTER PROCEDURE usp_XemThuNhapShipper
                @MaNV VARCHAR(10)
            AS
            BEGIN
                SET NOCOUNT ON;
                
                -- JOIN Local table vs Remote table
                SELECT p1.MaNV, p1.HoTen, p1.MaBC, p2.Luong
                FROM Logistics_MienTrung.dbo.NhanVien_Phan1 p1
                JOIN Logistics_MienNam.dbo.NhanVien_Phan2 p2 ON p1.MaNV = p2.MaNV
                WHERE p1.MaNV = @MaNV AND p1.ChucVu = N''''Shipper''''
            '')
      ') AT [LS_HUB_TRUNG_Local];
    `
  }
];

async function deployLocalSPs() {
  let pool;
  try {
    pool = await mssql.connect(config);
    console.log('--- Đang triển khai SQL SP tại các Hub Local ---');
    
    for (const script of sqlScripts) {
      try {
        await pool.request().query(script.query);
        console.log(`✅ Thành công khởi tạo: ${script.name}`);
      } catch (e) {
        console.error(`❌ Lỗi [${script.name}]:`, e.message);
      }
    }

    // Test thu nhập nhân viên miền Bắc (NVB02) qua Linked Server (since we are connected to Nam!)
    console.log('\\n--- Test Tra Cứu Thu Nhập NVB02 (Qua Linked Server LS_HUB_BAC_Local) ---');
    const test1 = await pool.request()
        .query("EXEC [LS_HUB_BAC_Local].[Logistics_MienBac].[dbo].[usp_XemThuNhapShipper] @MaNV = 'NVB02'");
    console.log(test1.recordset);

  } catch(e) {
    console.error('❌ Lỗi kết nối tổng:', e.message);
  } finally {
    if(pool) await pool.close();
  }
}

deployLocalSPs();
