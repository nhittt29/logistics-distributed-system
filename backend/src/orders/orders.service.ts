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

  // Yêu cầu 7: Hàm đếm đơn hàng thất bại 2025 (Chuyển sang SP)
  async countFailedOrders2025(): Promise<number> {
    const query = `EXEC usp_DemDonThatBai_2025`;
    const result = await this.dataSource.query(query);
    return result[0]?.TotalFailed || 0;
  }

  // Yêu cầu 5: Thống kê doanh thu toàn hệ thống
  async getGlobalStats(): Promise<any> {
    const query = `EXEC usp_ThongKeDoanhThu`;
    const result = await this.dataSource.query(query);
    return result[0] || { Nam: 0, Bac: 0, Trung: 0 };
  }

  // --- MỚI: CRUD VẬN ĐƠN PHÂN TÁN ---

  private getRoutingInfo(maBC: string) {
    if (maBC?.startsWith('BCB')) {
      return { 
        ls: 'LS_HUB_BAC_Local', 
        db: 'Logistics_MienBac',
        fullTable: '[LS_HUB_BAC_Local].[Logistics_MienBac].[dbo].[DonHang]'
      };
    }
    if (maBC?.startsWith('BCT')) {
      return { 
        ls: 'LS_HUB_TRUNG_Local', 
        db: 'Logistics_MienTrung',
        fullTable: '[LS_HUB_TRUNG_Local].[Logistics_MienTrung].[dbo].[DonHang]'
      };
    }
    return { 
      ls: null, 
      db: 'Logistics_MienNam',
      fullTable: '[Logistics_MienNam].[dbo].[DonHang]'
    };
  }

  async create(data: any) {
    const { fullTable } = this.getRoutingInfo(data.MaBC_HienTai);
    // Lưu ý: NgayGui lấy GETDATE() tại SQL để đồng bộ
    const query = `
      INSERT INTO ${fullTable} (MaVanDon, NgayGui, TrongLuong, CuocPhi, MaTrangThai, MaKH_Gui, MaNV_Giao, MaDichVu, MaBC_HienTai)
      VALUES ('${data.MaVanDon}', GETDATE(), ${data.TrongLuong}, ${data.CuocPhi}, '${data.MaTrangThai}', '${data.MaKH_Gui}', 
      ${data.MaNV_Giao ? `'${data.MaNV_Giao}'` : 'NULL'}, '${data.MaDichVu}', '${data.MaBC_HienTai}')
    `;
    return this.dataSource.query(query);
  }

  async update(id: string, data: any) {
    // Để update, ta cần biết đơn hàng đang ở site nào. Ta dùng lại logic track.
    const tracking = await this.trackOrder(id);
    if (!tracking) throw new Error('Không tìm thấy đơn hàng để cập nhật');

    let target = '';
    if (tracking.KhuVuc === 'Miền Bắc') target = '[LS_HUB_BAC_Local].[Logistics_MienBac].[dbo].[DonHang]';
    else if (tracking.KhuVuc === 'Miền Trung') target = '[LS_HUB_TRUNG_Local].[Logistics_MienTrung].[dbo].[DonHang]';
    else target = '[Logistics_MienNam].[dbo].[DonHang]';

    let updateClauses: string[] = [];
    if (data.MaTrangThai) updateClauses.push(`MaTrangThai = '${data.MaTrangThai}'`);
    if (data.MaNV_Giao) updateClauses.push(`MaNV_Giao = '${data.MaNV_Giao}'`);
    if (data.CuocPhi) updateClauses.push(`CuocPhi = ${data.CuocPhi}`);

    if (updateClauses.length === 0) return;

    const query = `UPDATE ${target} SET ${updateClauses.join(', ')} WHERE MaVanDon = '${id}'`;
    return this.dataSource.query(query);
  }

  async remove(id: string) {
    const tracking = await this.trackOrder(id);
    if (!tracking) throw new Error('Không tìm thấy đơn hàng để xóa');

    let target = '';
    if (tracking.KhuVuc === 'Miền Bắc') target = '[LS_HUB_BAC_Local].[Logistics_MienBac].[dbo].[DonHang]';
    else if (tracking.KhuVuc === 'Miền Trung') target = '[LS_HUB_TRUNG_Local].[Logistics_MienTrung].[dbo].[DonHang]';
    else target = '[Logistics_MienNam].[dbo].[DonHang]';

    const query = `DELETE FROM ${target} WHERE MaVanDon = '${id}'`;
    return this.dataSource.query(query);
  }
}
