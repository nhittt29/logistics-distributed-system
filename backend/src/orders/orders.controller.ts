import { Controller, Get, Query, Param, Post, Body, Patch, Delete } from '@nestjs/common';
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

  @Get('stats')
  async getStats() {
    return this.ordersService.getGlobalStats();
  }

  @Post()
  async create(@Body() data: any) {
    return this.ordersService.create(data);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.ordersService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
