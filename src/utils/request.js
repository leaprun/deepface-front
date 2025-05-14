// src/utils/request.js
import axios from 'axios';

// 创建 axios 实例
const service = axios.create({
  // 设置基础 URL 为后端的 IP 和端口
  baseURL: 'http://localhost:8000',
  timeout: 5000 // 请求超时时间
});

// 请求拦截器：在请求发送前做一些处理
service.interceptors.request.use(
  config => {
    // 从 localStorage 获取 token 并添加到请求头
    const token = localStorage.getItem('token');
    const Uuid =localStorage.getItem('Uuid')
    if (token) {
      config.headers['token'] = token;
      config.headers['Uuid']=Uuid;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// // 响应拦截器：在响应返回后做一些处理
// service.interceptors.response.use(
//   response => {
//     return response; // 返回响应数据
//   },
//   error => {
//     console.error('请求错误：', error);
//     return Promise.reject(error);
//   }
// );
// 响应拦截器：在响应返回后做一些处理
service.interceptors.response.use(
  response => {
    return response; // 返回响应数据
  },
  error => {
    // 自定义错误处理逻辑
    if (error.response) {
      // 服务器返回了响应，但状态码不是 2xx
      const msg = error.response.data?.msg || '请求失败'; // 获取后端返回的 msg 或默认消息
      console.log('后端返回错误：', msg);

      // 使用你的 UI 提示组件显示错误消息
      // 例如：this.$message.error(msg);

      return Promise.reject({ code: error.response.status, message: msg });
    } else if (error.request) {
      // 请求被发送但没有收到响应（如网络问题）
      console.log('请求无响应');
      // 提示用户网络错误
      // 例如：this.$message.error('网络请求失败，请检查您的网络连接');
    } else {
      // 在设置请求时发生了一些错误
      console.log('Error', error.message);
      // 提示用户请求出错
      // 例如：this.$message.error('请求出错，请稍后重试');
    }

    // 阻止错误继续向上抛出，避免默认的错误提示信息
    return Promise.reject(error);
  }
);

export default service; // 导出配置好的 axios 实例