import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { ResponseData, ApiOptons, SimpleModel, ComplexModel } from './model';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/test')
  test() {
    return { code: 0, message: '1', data: { a: 'hello world', sex: 1 } };
  }

  @Get('/test2')
  test2() {
    return {
      code: 0,
      message: '1',
      data: {
        list: [{ userNo: '1', userProfile: { name: 'lei', sex: 0, age: 19 } }],
      },
    };
  }

  @Get('/data')
  data() {
    // 返回类型请见 ResultDataType
    console.log('默认接口配置项：', new ApiOptons());

    SimpleModel.get().then((data: ResponseData) =>
      setTimeout(
        () =>
          console.log(
            '因需授权导致内部异常，返回 ResponseData：',
            typeof data,
            data,
          ),
        1000,
      ),
    );

    SimpleModel.get(
      {},
      { auth: false, onlyData: false },
    ).then((data: ResponseData<SimpleModel>) =>
      setTimeout(
        () =>
          console.log(
            '设置返回全部数据，返回 ResponseData<T> 或 ResponseData<T[]>',
            typeof data,
            data,
          ),
        2000,
      ),
    );

    SimpleModel.get(
      {},
      { auth: false, onlyData: true },
    ).then((data: SimpleModel) =>
      setTimeout(
        () =>
          console.log(
            '仅返回关键数据data，返回 T 或 T[]：',
            typeof data,
            data,
            data.sexText(),
          ),
        3000,
      ),
    );
    return 'ok';
  }

  @Get('/data2')
  data2() {
    // 返回类型请见 ResultDataType
    console.log('默认接口配置项：', new ApiOptons());

    ComplexModel.get().then((data: ResponseData) =>
      setTimeout(
        () =>
          console.log(
            '因需授权导致内部异常，返回 ResponseData：',
            typeof data,
            data,
          ),
        1000,
      ),
    );

    ComplexModel.get(
      {},
      { auth: false, onlyData: false },
    ).then((data: ResponseData<ComplexModel>) =>
      setTimeout(
        () =>
          console.log(
            '设置返回全部数据，返回 ResponseData<T> 或 ResponseData<T[]>',
            typeof data,
            data.data.toJSON(),
          ),
        2000,
      ),
    );

    ComplexModel.get(
      {},
      { auth: false, onlyData: true },
    ).then((data: ComplexModel) =>
      setTimeout(
        () =>
          console.log(
            '仅返回关键数据data，返回 T 或 T[]：',
            typeof data,
            data.toJSON(),
          ),
        3000,
      ),
    );
    return 'ok';
  }
}
