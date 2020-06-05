import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiOptons, ResponseData, ResultDataType } from './Common';

/**
 * 模拟UI loading
 */
class Toast {
  static loading(txt: string, time: number = 3) {
    console.log(txt, time);
    return 1;
  }
  static info(txt: string, time: number = 3) {
    console.log(txt, time);
    return 1;
  }
  static remove(toastId: number) {
    console.log(toastId);
  }
}

/**
 * 未知(默认)错误码
 */
const codeUnknownTask = -999;

/**
 * 接口请求封装基类
 */
export class InterfaceService {
  /**
   * todo
   */
  private static userProfile: { sysToken?: '' } = {};
  public static setUser(_user: any) {
    InterfaceService.userProfile = _user;
  }

  constructor(props: ApiOptons) {
    this.options = props;
  }
  /**
   * 默认配置
   */
  public options = new ApiOptons();

  /**
   * todo
   */
  public get sysToken(): string {
    return InterfaceService.userProfile?.sysToken ?? '';
  }

  /**
   * 构建header
   */
  public get headers(): Object {
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      'app-info-key': 'xxx', // 自定义字段
    };
  }

  /**
   * 请求前置条件。可根据自己情况重构此函数
   */
  preCheck() {
    if (this.options.loading && this.options.loadingTime > 0) {
      return Toast.loading('加载中...', this.options?.loadingTime ?? 3);
    }
    return -1;
  }

  /**
   * 下载json，返回对象
   */
  public static async getJSON(url: string) {
    try {
      const res = await fetch(url);
      return await res.json();
    } catch (e) {
      console.log(e);
      return {};
    }
  }
}

/**
 * 接口请求封装(axios版，也可以封装其他版本的请求)
 */
export class InterfaceAxios extends InterfaceService {
  constructor(props: ApiOptons) {
    super(props);
  }

  /**
   * 封装axios
   */
  private request = (requestCfg: AxiosRequestConfig): Promise<ResponseData> => {
    return axios(requestCfg)
      .then(this.checkStatus)
      .catch((err: any) => {
        // 后台接口异常，如接口不通、http状态码非200、data非json格式，判定为fatal错误
        console.log(requestCfg, err);
        return {
          code: 408,
          message: '网络异常',
        };
      });
  };

  /**
   * 检查网络响应状态码
   */
  private checkStatus(response: AxiosResponse<ResponseData>) {
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }
    return {
      code: 408,
      message: '网络数据异常',
    };
  }

  /**
   * 发送POST请求
   */
  public async post(url: string, data?: any) {
    const toastId = this.preCheck();
    const ret = await this.request({
      url,
      headers: this.headers,
      method: 'POST',
      data: Object.assign({ sysToken: this.sysToken }, data),
    });
    ret.toastId = toastId;

    return ret;
  }

  /**
   * 发送GET请求
   */
  public async get(url: string, params?: any) {
    const toastId = this.preCheck();
    const ret = await this.request({
      url,
      headers: this.headers,
      method: 'GET',
      params: Object.assign({ sysToken: this.sysToken }, params),
    });
    ret.toastId = toastId;
    return ret;
  }
}

export class ServiceManager {
  /**
   * 检查接口数据
   */
  public hasNoError(res: ResponseData) {
    if (res.toastId > 0) {
      Toast.remove(res.toastId);
    }
    if (res?.code !== 0 && res.code !== codeUnknownTask) {
      Toast.info(res?.message ?? '服务器出错');
      return false;
    }
    return true;
  }

  /**
   * 解析响应
   */
  public static parse<T>(
    modal: { new (x: any): T },
    response: any,
    options: ApiOptons,
  ): ResultDataType<T> {
    if (!response || !response.data) {
      response.data = new modal({});
    } else {
      if (response.data instanceof Array) {
        response.data = response.data.map((item: T) => new modal(item));
      } else if (response.data instanceof Object) {
        response.data = new modal(response.data);
      }
      return options.onlyData ? response.data : response;
    }
  }

  /**
   * post接口请求
   */
  public static async post<T>(
    modal: { new (x: any): T },
    url: string,
    body?: any,
    options: ApiOptons = new ApiOptons(),
  ): Promise<ResultDataType<T>> {
    // 使用合并，减少外部传入配置
    options = Object.assign(new ApiOptons(), options);

    const request = new InterfaceAxios(options);
    if (options.auth && !request.sysToken) {
      return {
        code: 403,
        message: '未授权',
      };
    }

    try {
      const response = await request.post(url, body);
      return ServiceManager.parse<T>(modal, response, options);
    } catch (err) {
      return err;
    }
  }

  /**
   * get接口请求
   */
  public static async get<T>(
    modal: { new (x: any): T },
    url: string,
    params?: any,
    options: ApiOptons = new ApiOptons(),
  ): Promise<ResultDataType<T>> {
    // 使用合并，减少外部传入配置
    options = Object.assign(new ApiOptons(), options);

    const a = new InterfaceAxios(options);
    const request = new InterfaceAxios(options);
    if (options.auth && !request.sysToken) {
      return {
        code: 403,
        message: '未授权',
      };
    }

    try {
      const response = await a.get(url, params);
      return ServiceManager.parse<T>(modal, response, options);
    } catch (err) {
      return err;
    }
  }
}
