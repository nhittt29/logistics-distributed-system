import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async findAllByRegion(region: 'BAC' | 'TRUNG' | 'NAM'): Promise<any[]> {
    const baseQuery = `
      SELECT 
        d.MaVanDon, d.NgayGui, d.CuocPhi, 
        t.TenTrangThai as TrangThai, 
        bc.TenBC as BuuCuc
      FROM DonHang d
      JOIN TrangThaiDonHang t ON d.MaTrangThai = t.MaTrangThai
      JOIN BuuCuc bc ON d.MaBC_HienTai = bc.MaBC
    `;

    if (region === 'NAM') {
      return this.ordersRepository.query(baseQuery);
    }

    const linkedServer = region === 'BAC' ? 'LS_HUB_BAC_Local' : 'LS_HUB_TRUNG_Local';
    const remoteDb = region === 'BAC' ? 'Logistics_MienBac' : 'Logistics_MienTrung';
    
    const remoteQuery = `
      SELECT 
        d.MaVanDon, d.NgayGui, d.CuocPhi, 
        t.TenTrangThai as TrangThai, 
        bc.TenBC as BuuCuc
      FROM [${linkedServer}].[${remoteDb}].[dbo].[DonHang] d
      JOIN [${linkedServer}].[${remoteDb}].[dbo].[TrangThaiDonHang] t ON d.MaTrangThai = t.MaTrangThai
      JOIN [${linkedServer}].[${remoteDb}].[dbo].[BuuCuc] bc ON d.MaBC_HienTai = bc.MaBC
    `;
    
    return this.ordersRepository.query(remoteQuery);
  }

  async findHighValueCentral(): Promise<Order[]> {
    const query = `SELECT * FROM [LS_HUB_TRUNG_Local].[Logistics_MienTrung].[dbo].[DonHang] 
                   WHERE CuocPhi > 1000000 AND CAST(NgayGui AS DATE) = CAST(GETDATE() AS DATE)`;
    return this.ordersRepository.query(query);
  }

  async trackOrder(id: string): Promise<any> {
    const query = `EXEC usp_TraCuuVanDon @MaVanDon = '${id}'`;
    const result = await this.ordersRepository.query(query);
    // Lưu ý: Kết quả có thể là mảng, lấy phần tử đầu tiên
    return result[0];
  }
}
