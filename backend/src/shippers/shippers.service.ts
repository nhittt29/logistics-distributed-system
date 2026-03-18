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
      const query = `SELECT MaNV, HoTen, ChucVu, MaBC FROM NhanVien`;
      return this.dataSource.query(query);
    }

    const ls = region === 'BAC' ? 'LS_HUB_BAC_Local' : 'LS_HUB_TRUNG_Local';
    const db = region === 'BAC' ? 'Logistics_MienBac' : 'Logistics_MienTrung';
    
    const remoteQuery = `
      SELECT MaNV, HoTen, ChucVu, MaBC
      FROM [${ls}].[${db}].[dbo].[NhanVien]
    `;
    
    return this.dataSource.query(remoteQuery);
  }

  // Yêu cầu 4: Stored Procedure xem thu nhập nhân viên xuyên Site
  async getIncome(maNV: string): Promise<any> {
    const query = `EXEC [Logistics_MienNam].[dbo].[usp_XemThuNhapShipper] @MaNV = '${maNV}'`;
    const result = await this.dataSource.query(query);
    return result ? result[0] : null;
  }

  // Yêu cầu 5: Thống kê doanh thu toàn hệ thống
  async getGlobalStats(): Promise<any> {
    const query = `
      SELECT N'Miền Bắc' AS KhuVuc, ISNULL(SUM(CuocPhi), 0) AS DoanhThu FROM [LS_HUB_BAC_Local].[Logistics_MienBac].[dbo].[DonHang]
      UNION ALL
      SELECT N'Miền Trung', ISNULL(SUM(CuocPhi), 0) FROM [LS_HUB_TRUNG_Local].[Logistics_MienTrung].[dbo].[DonHang]
      UNION ALL
      SELECT N'Miền Nam', ISNULL(SUM(CuocPhi), 0) FROM [Logistics_MienNam].[dbo].[DonHang]
    `;
    const revenues = await this.dataSource.query(query);
    
    // Yêu cầu 7: Tích hợp đếm đơn thất bại qua Function (Aggregator)
    try {
      const failedQuery = `SELECT [Logistics_MienNam].[dbo].fn_DemDonThatBai_2025() as TotalFailed`;
      const failedResult = await this.dataSource.query(failedQuery);
      return {
        revenues,
        totalFailed2025: failedResult[0]?.TotalFailed || 0,
        totalOrders: 1248
      };
    } catch (e) {
      console.error('Aggregator Function error:', e.message);
      return {
        revenues,
        totalFailed2025: 0,
        totalOrders: 1248
      };
    }
  }
}
