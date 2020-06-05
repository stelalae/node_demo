/**
 * 接口响应，最外层统一格式
 */
export class ResponseData<T = any> {
  code? = 0;
  message? = '操作成功';
  toastId? = -1;
  data?: T;
}

/**
 * api配置信息
 */
export class ApiOptons {
  headers?: any = {}; // 额外请求头
  loading?: boolean = true; // 是否显示loading
  loadingTime?: number = 2; // 显示loading时间
  auth?: boolean = true; // 是否需要授权
  onlyData?: boolean = true; // 只返回data
}

/**
 * 枚举接口能返回的类型
 * - T、T[] 在 ApiOptons.onlyData 为true时是生效
 * - ResponseData<T>、ResponseData<T[]> 在 ApiOptons.onlyData 为false时是生效
 * - ResponseData 一般在接口内部发生异常时生效
 */
export type ResultDataType<T> =
  | T
  | T[]
  | ResponseData<T>
  | ResponseData<T[]>
  | ResponseData;
