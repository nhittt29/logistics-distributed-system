import { Controller, Get, Param, Query } from '@nestjs/common';
import { ShippersService } from './shippers.service';

@Controller('shippers')
export class ShippersController {
  constructor(private readonly shippersService: ShippersService) {}

  @Get()
  async findAll(@Query('region') region: 'BAC' | 'TRUNG' | 'NAM') {
    return this.shippersService.findAllByRegion(region || 'NAM');
  }

  @Get('north')
  async getNorthShippers() {
    return this.shippersService.getNorthShippers();
  }

  @Get('stats')
  async getStats() {
    return this.shippersService.getGlobalStats();
  }

  @Get(':id/income')
  async getIncome(@Param('id') id: string) {
    return this.shippersService.getIncome(id);
  }
}
