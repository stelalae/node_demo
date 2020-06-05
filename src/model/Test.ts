import { Record } from 'immutable';

import { ApiOptons, ResponseData, ResultDataType } from './Common';
import { ServiceManager } from './Service';

const TestModelDefault = {
  a: 'test string',
  sex: 0,
};

export class TestModel extends Record(TestModelDefault) {
  static async get(params: any, options?: ApiOptons) {
    return await ServiceManager.get<TestModel>(
      TestModel,
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
    return TestModel.sexMap[this.sex] ?? '保密';
  }
}
