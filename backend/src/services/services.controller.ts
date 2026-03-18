import { Controller, Delete, Param } from '@nestjs/common';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.servicesService.deleteService(id);
  }
}
