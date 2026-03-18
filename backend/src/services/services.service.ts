import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class ServicesService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  // Yêu cầu 6: Xóa dịch vụ - Kích hoạt Trigger tr_KiemTraXoaDichVu tại Hub Nam
  async deleteService(id: string): Promise<any> {
    const query = `DELETE FROM BangGia WHERE MaDichVu = '${id}'`;
    return this.dataSource.query(query);
  }
}
