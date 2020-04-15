import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// type Pick<T, K extends keyof T> = {
//   [P in K]: T[P];
// };

enum PassengerType {
  ADT = '成人',
  CHD = '儿童',
  INF = '婴儿',
}

class Identity {
  static map = <T extends object>(o: T) => {
    const ret = new Map();
    for (const key in o) {
      ret.set(o[key], key);
    }
    return ret;
  };

  static get = <T extends object, K extends keyof T>(o: T, name: K) => {
    return o[name];
  };
}

console.log(Identity.map(PassengerType));
console.log(Identity.get(PassengerType, 'ADT'));

// const dad = Identity < PassengerType > console.log(__dirname);

/**
 * 1、新建一个空{}，检测Obj
 * 2、先遍历tripProfiles，拿到origin、destination对应的一个节点A。
 * 3、使用immer将存入Obj，即 { 'origin、destination': [A] }。如果之前Obj已有'origin、destination'，则追加。
 * 4、最后将Obj追加到原始对象promotionDetailSummary上
 */

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
// bootstrap();
