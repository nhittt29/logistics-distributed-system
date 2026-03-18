import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class ShippersService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async getIncome(maNV: string): Promise<any> {
    // Lưu ý: Procedure này có thể nằm ở Hub Nam hoặc được gọi qua LS tùy thiết kế.
    // Dựa trên script mien_bac, nó so khớp local NV_P1 với Nam NV_P2.
    // Tại Hub Nam, chúng ta có thể join trực tiếp hoặc gọi SP local.
    const query = `EXEC usp_XemThuNhapShipper @MaNV = '${maNV}'`;
    const result = await this.dataSource.query(query);
    return result[0];
  }

  async getGlobalStats(): Promise<any> {
    const query = `
      SELECT N'Miền Bắc' AS KhuVuc, ISNULL(SUM(CuocPhi), 0) AS DoanhThu FROM [LS_HUB_BAC_Local].[Logistics_MienBac].[dbo].[DonHang]
      UNION ALL
      SELECT N'Miền Trung', ISNULL(SUM(CuocPhi), 0) FROM [LS_HUB_TRUNG_Local].[Logistics_MienTrung].[dbo].[DonHang]
      UNION ALL
      SELECT N'Miền Nam', ISNULL(SUM(CuocPhi), 0) FROM DonHang
    `;
    return this.dataSource.query(query);
  }
}
