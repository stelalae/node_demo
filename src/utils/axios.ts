import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

class Toast {
  static loading(txt: string, time: number = 3) {
    console.log(txt, time);
    return 1;
  }
  static info(txt: string, time: number = 3) {
    console.log(txt, time);
    return 1;
  }
}

class Portal {
  static remove(toastId: number) {
    console.log(toastId);
  }
}

const codeUnknownTask = -999;
const userAgent = '';

/**
 * 用户信息
 */
export class UserInfoProps {
  sysToken = 'bb92fea3d2f642a6bd1004befdb9613f';
  userName = 'LeiYin';
  userNo = 'us2053071165325101';
}

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
 * 接口请求封装
 */
export class ServiceBase {
  constructor(props: ApiOptons) {
    this.options = props;
  }
  /**
   * 默认配置
   */
  public options = new ApiOptons();

  /**
   * 当前用户信息
   */
  private static _userInfo: UserInfoProps;
  public static set userInfo(v: any) {
    ServiceBase._userInfo = v ?? {};
  }

  /**
   * 返回用户token
   */
  public get sysToken(): string {
    return ServiceBase._userInfo?.sysToken ?? null;
  }

  /**
   * 构建header
   */
  public get headers(): Object {
    const sysToken = this.sysToken;
    const ua = `${userAgent}${sysToken ?? ''}`;
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      'app-info-key': ua,
    };
  }

  /**
   * 请求前置条件
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
    // try {
    //   const res = await fetch(url);
    //   return await res.json();
    // } catch (e) {
    //   console.log(e);
    //   return {};
    // }
  }
}

/**
 * 接口请求封装
 */
export class ServiceAxios extends ServiceBase {
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

export class Service {
  constructor() {}

  /**
   * 接口地址
   */
  public static url = '';

  /**
   * 检查接口数据
   */
  public hasNoError?(res: ResponseData) {
    if (res.toastId > 0) {
      Portal.remove(res.toastId);
    }
    if (res?.code !== 0 && res.code !== codeUnknownTask) {
      Toast.info(res?.message ?? '服务器出错');
      return false;
    }
    return true;
  }
}


export class TestModel extends Service {
  constructor(data: TestModel) {
    super();
    console.log('=== constructor', data.a);
  }
  static url = 'http://localhost:3000/test';

  a = 1;
}

export class ServiceManager {
  public static set userInfo(v: any) {
    ServiceBase.userInfo = v ?? {};
  }

  /**
   * 解析响应
   */
  private static parse<T extends Service>(
    modal: { new (x: any): T },
    response: ResponseData,
    options: ApiOptons,
  ) {
    if (!response || !response.data) {
      response.data = new modal({});
    } else {
      if (response.data instanceof Array) {
        response.data = response.data.map(item => new modal(item));
      } else if (response.data instanceof Object) {
        response.data = new modal(response.data);
      }
      return options.onlyData ? response.data : response;
    }
  }

  /**
   * 接口请求
   */
  public static async post(
    modal: typeof Service,
    body?: any,
    options: ApiOptons = new ApiOptons(),
  ) {
    // 使用合并，减少外部传入配置
    options = Object.assign(new ApiOptons(), options);

    const request = new ServiceAxios(options);
    if (options.auth && !request.sysToken) {
      console.log('===', 403);
      return;
    }

    try {
      const response = await request.post(modal.url, body);
      return ServiceManager.parse(modal, response, options);
    } catch (err) {
      return err;
    }
  }

  public static async get(
    modal: typeof Service,
    params?: any,
    options: ApiOptons = new ApiOptons(),
  ) {
    // 使用合并，减少外部传入配置
    options = Object.assign(new ApiOptons(), options);

    const a = new ServiceAxios(options);

    try {
      const response = await a.get(modal.url, params);
      return ServiceManager.parse(modal, response, options);
    } catch (err) {
      return err;
    }
  }
}
