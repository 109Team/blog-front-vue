import axios from 'axios';

import * as AUTH_TOKEN from '../common/authToken';
const CONFIG = require('../config/config.json');

axios.defaults.baseURL = CONFIG.baseURL;
axios.defaults.timeout = 5000;
axios.defaults.headers.common['Authoriation'] = AUTH_TOKEN.getAuthToken();
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

// 请求拦截器
axios.interceptors.request.use(
    config => {
        // 开始执行加载动画 loading...
        return config;
    },
    err => {
        // 结束加载动画
        return Promise.reject(err);
    }
);

// 响应拦截器
axios.interceptors.response.use(
    response => {
        // 结束加载动画
        return Promise.resolve(response.data)
    },
    err => {
        // 结束加载动画
        return Promise.reject(err);
    }
);


export default {
    post(url: string, params?: object): Promise<any>{
        return axios.post(url, params);
    },

    get(url: string, params?: object): Promise<any>{
        return axios.get(url, {params: params});
    },

    put(url: string, params?: object): Promise<any>{
        return axios.put(url, params);
    },

    delete(url: string, params?: object): Promise<any>{
        return axios.delete(url, {params: params});
    }
}