import { Test, TestingModule } from '@nestjs/testing';
import { ShippersController } from './shippers.controller';

describe('ShippersController', () => {
  let controller: ShippersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShippersController],
    }).compile();

    controller = module.get<ShippersController>(ShippersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
