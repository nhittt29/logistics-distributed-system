import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async findAllByRegion(region: 'BAC' | 'TRUNG' | 'NAM'): Promise<any[]> {
    if (region === 'NAM') {
      const query = `
        SELECT MaVanDon, NgayGui, CuocPhi, t.TenTrangThai as TrangThai, bc.TenBC as BuuCuc
        FROM DonHang d
        JOIN TrangThaiDonHang t ON d.MaTrangThai = t.MaTrangThai
        JOIN BuuCuc bc ON d.MaBC_HienTai = bc.MaBC
      `;
      return this.dataSource.query(query);
    }

    const ls = region === 'BAC' ? 'LS_HUB_BAC_Local' : 'LS_HUB_TRUNG_Local';
    const db = region === 'BAC' ? 'Logistics_MienBac' : 'Logistics_MienTrung';
    
    const remoteQuery = `
      SELECT d.MaVanDon, d.NgayGui, d.CuocPhi, t.TenTrangThai as TrangThai, bc.TenBC as BuuCuc
      FROM [${ls}].[${db}].[dbo].[DonHang] d
      JOIN [${ls}].[${db}].[dbo].[TrangThaiDonHang] t ON d.MaTrangThai = t.MaTrangThai
      JOIN [${ls}].[${db}].[dbo].[BuuCuc] bc ON d.MaBC_HienTai = bc.MaBC
    `;
    
    return this.dataSource.query(remoteQuery);
  }

  // Yêu cầu 2: Truy vấn đơn hàng cước phí > 1.000.000 tại Miền Trung trong ngày
  async findHighValueCentral(): Promise<any[]> {
    const query = `
      SELECT d.MaVanDon, d.NgayGui, d.CuocPhi, t.TenTrangThai as TrangThai, bc.TenBC as BuuCuc
      FROM [LS_HUB_TRUNG_Local].[Logistics_MienTrung].[dbo].[DonHang] d
      JOIN [LS_HUB_TRUNG_Local].[Logistics_MienTrung].[dbo].[TrangThaiDonHang] t ON d.MaTrangThai = t.MaTrangThai
      JOIN [LS_HUB_TRUNG_Local].[Logistics_MienTrung].[dbo].[BuuCuc] bc ON d.MaBC_HienTai = bc.MaBC
      WHERE d.CuocPhi > 1000000 
      AND CAST(d.NgayGui AS DATE) = CAST(GETDATE() AS DATE)
    `;
    return this.dataSource.query(query);
  }

  // Yêu cầu 3: Stored Procedure tra cứu vận đơn xuyên Site
  async trackOrder(id: string): Promise<any> {
    const query = `EXEC usp_TraCuuVanDon @MaVanDon = '${id}'`;
    const result = await this.dataSource.query(query);
    return result ? result[0] : null;
  }

  // Yêu cầu 7: Hàm đếm đơn hàng thất bại 2025
  async countFailedOrders2025(): Promise<number> {
    const query = `SELECT Logistics_MienNam.dbo.fn_DemDonThatBai_2025() as TotalFailed`;
    const result = await this.dataSource.query(query);
    return result[0]?.TotalFailed || 0;
  }
}
