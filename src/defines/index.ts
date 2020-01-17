import { Record } from 'immutable';

/**
 * api配置信息
 */
export class ApiCfg {
  path: string; // api路径
  method: string = 'post'; // 请求方式
  types: any; // 响应的数据模型
  subtype?: any; // 响应的数据子模型
  auth?: boolean = true; // 是否需要授权
  headers?: any = {}; // 额外请求头
}

/**
 * 接口响应，最外层统一格式
 */
export interface IResponseData<T = any> {
  code: number;
  msg: string;
  data?: T;
}

const IResponseDataDefault: IResponseData = {
  code: 0,
  msg: '操作成功',
  data: null,
};

export class ResponseData extends Record(IResponseDataDefault) {}

/**
 * 指定期号通用中奖号码
 */
interface ILottery {
  /**
   * 本期中奖号码
   */
  openCode: string;

  /**
   * 彩票编号标识
   */
  code: string;

  /**
   * 彩票期号
   */
  expect: string;

  /**
   * 彩票名称
   */
  name: string;

  /**
   * 发布时间
   */
  time: string;
}

const TLotteryDefault: ILottery = {
  openCode: '',
  code: '',
  expect: '',
  name: '',
  time: '',
};

export class TLottery extends Record(TLotteryDefault) {}

/**
 * 最近前后七个节日信息
 */
export class IHolidayRecent {
  /**
   * 节日日期
   */
  date: string;

  /**
   * 节日农历日期
   */
  lunarDate: string;

  /**
   * 节日名称
   */
  holidayName: string;

  /**
   * 距离今日的天数，已经过的节日为负数
   */
  residueDays: string;

  /**
   * 是否是农历节日
   */
  lunarHoliday: string;
}

const HolidayRecentDefault: IHolidayRecent = {
  date: '',
  lunarDate: '',
  holidayName: '',
  residueDays: '',
  lunarHoliday: '',
};

export class THolidayRecent extends Record(HolidayRecentDefault) {}
