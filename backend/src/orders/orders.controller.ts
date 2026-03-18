import { Controller, Get, Query, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(@Query('region') region: 'BAC' | 'TRUNG' | 'NAM') {
    return this.ordersService.findAllByRegion(region || 'NAM');
  }

  @Get('high-value-central')
  findHighValueCentral() {
    return this.ordersService.findHighValueCentral();
  }

  @Get('central-high-fee')
  async getHighValueCentral() {
    return this.ordersService.findHighValueCentral();
  }

  @Get('track/:id')
  async trackOrder(@Param('id') id: string) {
    return this.ordersService.trackOrder(id);
  }

  @Get('failed-count-2025')
  async getFailedCount() {
    return this.ordersService.countFailedOrders2025();
  }
}
