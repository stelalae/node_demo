import { Record } from 'immutable';

import { ApiOptons, ResponseData, ResultDataType } from './Common';
import { ServiceManager } from './Service';

const TestModelDefault = {
  a: 1,
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

  sex() {
    return '男';
  }
}
