import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

import { ResponseData, TestModel, ServiceManager } from './utils';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/test')
  test(): ResponseData<TestModel> {
    return { code: 0, message: '1', data: { a: 2 } };
  }

  @Get('/data')
  data() {
    ServiceManager.get(TestModel, {}, { onlyData: false }).then(data =>
      console.log(typeof data, data),
    );
    return 'ok';
  }
}
