import axios from 'axios';

// axios.defaults.timeout = 10000;

const parseJSON = (response: any) => {
  const dataString = JSON.stringify(response);
  const dataObj = JSON.parse(dataString, (k: any, v: any) => {
    if (v === null) {
      return undefined;
    }
    return v;
  });
  return dataObj;
};

const parseResponse = (response: any) => {
  if (response.status >= 200 && response.status < 300) {
    return response.data;
  }
  return {};
};

export const request = async (options: any): Promise<any> => {
  // return Promise.resolve({
  //   code: 999,
  //   msg: '网络超时',
  // });
  try {
    const resp = await axios(options);
    const data = await parseResponse(resp);
    return parseJSON(data);
  } catch (err) {
    return Promise.resolve({
      code: 999,
      msg: '网络超时',
    });
  }
};
