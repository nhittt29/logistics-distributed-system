import { Controller, Get, Param } from '@nestjs/common';
import { ShippersService } from './shippers.service';

@Controller('shippers')
export class ShippersController {
  constructor(private readonly shippersService: ShippersService) {}

  @Get('stats')
  getStats() {
    return this.shippersService.getGlobalStats();
  }

  @Get(':id/income')
  getIncome(@Param('id') id: string) {
    return this.shippersService.getIncome(id);
  }
}
