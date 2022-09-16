import Vue from 'vue';
import Axios from 'axios';
import { getSessionStorage } from '@/utils/tools';

const { ip, projectName } = window.projectConfig;

// Axios.defaults.headers['Access-Control-Allow-Origin'] = '*';
// Axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8';
// Axios.defaults.withCredentials = true;
Axios.defaults.baseURL = ip;

function goLogin() {
  window.location.href = `/${projectName}/#/login`;
}

// 请求开始
Axios.interceptors.request.use((config) => {
  const token = getSessionStorage('token') || null;

  if (token) {
    config.headers.Authorization = token;
  }

  return config;
}, (error) => {
  Vue.prototype.$confirm(error, '警告', {
    confirmButtonText: '确定',
    showCancelButton: false,
    type: 'error',
  }).then(() => {}).catch(() => {});
  return Promise.reject(error);
});

// 请求结束
Axios.interceptors.response.use((resp) => {
  // 300 登录过期
  if (resp.data.code === 300) {
    const token = getSessionStorage('token') || null;
    // 如果没有 session 数据则表示第一次打开页面，且不是登录页面，所以直接返回登录页面
    if (!token) {
      goLogin();
      return resp;
    }

    Vue.prototype.$confirm(resp.data.message, '提示', {
      confirmButtonText: '确定',
      showCancelButton: false,
      type: 'info',
    }).then(goLogin).catch(goLogin);

    return resp;
  }

  if (resp.data.code > 1) {
    Vue.prototype.$confirm(resp.data.message, '警告', {
      confirmButtonText: '确定',
      showCancelButton: false,
      type: 'warning',
    }).then(() => {}).catch(() => {});
  }

  if (resp.data.code === 1) {
    Vue.prototype.$message.warning(resp.data.message);
  }

  return resp.data;
}, (error) => {
  Vue.prototype.$confirm(error, '警告', {
    confirmButtonText: '确定',
    showCancelButton: false,
    type: 'error',
  }).then(() => {}).catch(() => {});
  return Promise.reject(error);
});

Vue.prototype.$axios = {
  get(url, data) {
    return Axios.get(url, { params: { ...data } });
  },
  post(url, data) {
    return Axios.post(url, data);
  },
  delete(url) {
    return Axios.delete(url);
  },
  put(url, data) {
    return Axios.put(url, data);
  },
};
