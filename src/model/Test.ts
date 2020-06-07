import { Record } from 'immutable';

import { ApiOptons } from './Common';
import { ServiceManager } from './Service';

/**
 * 简单类型
 */

const SimpleModelDefault = {
  a: 'test string',
  sex: 0,
};

interface SimpleModelParams {
  id: string;
}

export class SimpleModel extends Record(SimpleModelDefault) {
  static async get(params: SimpleModelParams, options?: ApiOptons) {
    return await ServiceManager.get<SimpleModel>(
      SimpleModel,
      'http://localhost:3000/test',
      params,
      options,
    );
  }

  static sexMap = {
    0: '保密',
    1: '男',
    2: '女',
  };

  sexText() {
    return SimpleModel.sexMap[this.sex] ?? '保密';
  }
}

const sexMap = {
  0: '保密',
  1: '男',
  2: '女',
};

const sexText = (sex: number) => {
  return sexMap[sex] ?? '保密';
};

/**
 * 复杂类型
 */

const ComplexChildOneDefault = {
  name: 'lyc',
  sex: 0,
  age: 18,
};

const ComplexChildTwoDefault = {
  count: 10,
  lastId: '20200607',
};

const ComplexChildThirdDefault = {
  count: 10,
  lastId: '20200607',
};

// const ComplexItemDefault = {
//   userNo: 'us1212',
//   userProfile: ComplexChildOneDefault,
//   extraFirst: ComplexChildTwoDefault,
//   extraTwo: ComplexChildThirdDefault,
// };

// 复合类型建议使用class，而不是上面的object。因为object里不能添加可选属性?
class ComplexItemDefault {
  userNo = 'us1212';
  userProfile = ComplexChildOneDefault;
  extraFirst? = ComplexChildTwoDefault;
  extraSecond? = ComplexChildThirdDefault;
}

// const ComplexListDefault = {
//   list: [],
//   pageNo: 1,
//   pageSize: 10,
//   pageTotal: 0,
// };

// 有数组的复合类型，如果要指定数组元素的Model，就必须用class
class ComplexListDefault {
  list: ComplexItemDefault[] = [];
  pageNo = 1;
  pageSize = 10;
  pageTotal = 0;
}

interface ComplexModelParams {
  id: string;
}

// 因为使用的class，所以需要 new 一个去初始化Record
export class ComplexModel extends Record(new ComplexListDefault()) {
  static async get(params: ComplexModelParams, options?: ApiOptons) {
    return await ServiceManager.get<ComplexModel>(
      ComplexModel,
      'http://localhost:3000/test2',
      params,
      options,
    );
  }
}

// const a = new ComplexModel({
//   list: [{ userNo: '1', userProfile: { name: 'lei', sex: 0, age: 19 } }],
// });
// console.log(
//   a instanceof Object,
//   a.toJS(),
//   a.list[0].userProfile instanceof Object,
// );
