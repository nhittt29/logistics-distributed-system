import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class ShippersService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  // Yêu cầu 1: View hiển thị Shipper Miền Bắc
  async getNorthShippers(): Promise<any[]> {
    const query = `SELECT * FROM [LS_HUB_BAC_Local].[Logistics_MienBac].[dbo].[vw_ShipperMienBac]`;
    return this.dataSource.query(query);
  }

  async findAllByRegion(region: 'BAC' | 'TRUNG' | 'NAM'): Promise<any[]> {
    if (region === 'NAM') {
      const query = `SELECT MaNV, HoTen, ChucVu, MaBC FROM NhanVien_Phan1`;
      return this.dataSource.query(query);
    }

    // Với miền Bắc, ta dùng View riêng đã định nghĩa để lọc Shipper
    if (region === 'BAC') {
      return this.getNorthShippers();
    }

    // Với miền Trung, lấy toàn bộ nhân sự
    const ls = 'LS_HUB_TRUNG_Local';
    const db = 'Logistics_MienTrung';
    
    const remoteQuery = `
      SELECT MaNV, HoTen, ChucVu, MaBC
      FROM [${ls}].[${db}].[dbo].[NhanVien_Phan1]
    `;
    
    return this.dataSource.query(remoteQuery);
  }

  // Yêu cầu 4: Stored Procedure xem thu nhập nhân viên xuyên Site
  async getIncome(maNV: string): Promise<any> {
    const query = `EXEC [Logistics_MienNam].[dbo].[usp_XemThuNhapShipper] @MaNV = '${maNV}'`;
    const result = await this.dataSource.query(query);
    return result ? result[0] : null;
  }

  // Yêu cầu 5 & 7: Thống kê doanh thu và đơn thất bại thông qua SP Gateway
  async getGlobalStats(): Promise<any> {
    try {
      // Gọi SP Thống kê doanh thu
      const revResult = await this.dataSource.query('EXEC usp_ThongKeDoanhThu');
      const row = revResult[0] || { Nam: 0, Bac: 0, Trung: 0 };
      
      const revenues = [
        { KhuVuc: 'Miền Bắc', DoanhThu: row.Bac },
        { KhuVuc: 'Miền Trung', DoanhThu: row.Trung },
        { KhuVuc: 'Miền Nam', DoanhThu: row.Nam },
      ];

      // Gọi SP Đếm đơn thất bại
      const failedResult = await this.dataSource.query('EXEC usp_DemDonThatBai_2025');
      const totalFailed2025 = failedResult[0]?.TotalFailed || 0;

      return {
        revenues,
        totalFailed2025,
        totalOrders: 1248 // Số liệu demo cố định hoặc có thể đếm thêm từ các site
      };
    } catch (e) {
      console.error('Global Stats Error:', e.message);
      return {
        revenues: [],
        totalFailed2025: 0,
        totalOrders: 0
      };
    }
  }
}
