import { stringify } from 'qs';
import { ApiCfg, ResponseData, TLottery, THolidayRecent } from '../defines';
import { request } from '../utils';

const apiBase = 'https://www.mxnzp.com/api';

export const apiAction = async (
  apiAlias: string,
  params: any = {},
): Promise<ResponseData> => {
  const apicfg: ApiCfg = services[apiAlias];
  if (!apicfg) {
    return Promise.resolve(
      new ResponseData({
        code: 901,
        msg: '未知接口调用',
      }),
    );
  }
  const { path, method, types, subtype } = apicfg;

  let options: any = null;
  if (method === 'get') {
    options = {
      method,
      url: `${apiBase}/${path}?${stringify(params)}`,
    };
  } else if (method === 'post') {
    options = {
      method,
      url: `${apiBase}/${path}`,
      data: JSON.stringify(params, (k, v) => {
        if (v !== null && v !== undefined) {
          return v;
        }
      }),
    };
  }
  if (!options) {
    return Promise.resolve(
      new ResponseData({
        code: 901,
        msg: '未支持的接口调用方式',
      }),
    );
  }

  const retJson = await request(options);
  if (subtype) {
    if (types === Array) {
      const data: [] = retJson.data instanceof Array ? retJson.data : [];
      retJson.data = data.map(item => new subtype(item));
    }
  } else {
    retJson.data = new types(retJson.data);
  }
  const retObj = new ResponseData(retJson);
  return retObj;
};

const services: {
  [propName: string]: ApiCfg;
} = {
  aimlottery: {
    path: '/lottery/common/aim_lottery',
    method: 'get',
    auth: false,
    types: TLottery,
  },
  holidayrecent: {
    path: '/holiday/recent/list',
    method: 'get',
    auth: false,
    types: Array,
    subtype: THolidayRecent,
  },
};

export default services;
