import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { IResponseData, TLottery, THolidayRecent } from './defines';
import { apiAction } from './services';

const retssq = apiAction('aimlottery', { expect: '2018135', code: 'ssq' });
retssq.then(({ data }: IResponseData<TLottery>) => {
  console.log(data);
  // console.log(data.code);
});

const retholiday = apiAction('holidayrecent');
retholiday.then(({ data }: IResponseData<THolidayRecent[]>) => {
  // console.log(typeof data);
  console.log(data);
  // console.log(data[0].date);
});

console.log(__dirname);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
