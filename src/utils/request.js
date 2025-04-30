// src/utils/request.js
import axios from 'axios';

// 创建 axios 实例
const service = axios.create({
  // 设置基础 URL 为后端的 IP 和端口
  baseURL: 'http://10.243.140.27:8000',
  timeout: 5000 // 请求超时时间
});

// 请求拦截器：在请求发送前做一些处理
service.interceptors.request.use(
  config => {
    // 从 localStorage 获取 token 并添加到请求头
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['token'] = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器：在响应返回后做一些处理
service.interceptors.response.use(
  response => {
    return response; // 返回响应数据
  },
  error => {
    console.error('请求错误：', error);
    return Promise.reject(error);
  }
);

export default service; // 导出配置好的 axios 实例