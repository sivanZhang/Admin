/**
 * 
 * @file 封装axios请求的配置
 *  
 */

import axios from 'axios'
import qs from 'qs'
import {
  MessageBox,
  Message
} from 'element-ui'
import store from '@/store'
import {
  getToken
} from '@/utils/auth'
// create an axios instance
const AXIOS = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 0,
  transformRequest: [data => {
    return qs.stringify(data)
  }]
})
AXIOS.defaults.headers['Access-Control-Allow-Origin'] = '*'
AXIOS.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers.common['Authorization'] = `JWT ${getToken()}`
    }
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)
AXIOS.interceptors.response.use(
  /**
   * If you want to get AXIOS information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by AXIOS Status Code
   */
  response => {
    const res = response
    // if the custom code is not 20000, it is judged as an error.
    console.log('res.status', res.status);

    if (res.status !== 200) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      if (res.status === 401) {
        // to re-login
        MessageBox.confirm('抱歉，您没有权限', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('error.response', error.response, 'error', error);
    /* if (!!error.response && !!error.response.status) {
    switch (error.response.status) {
      case 403:
        router.replace("/403");
        break;
      case 404:
        router.replace("/404");
        break;
    }
  }
  if (!!error.response && !!error.response.data.error && !!error.response.data.error.message && error.response.data.error.details) {
    vm.$Notice.error({ title: error.response.data.error.message, desc: error.response.data.error.details, duration: 5 })
  } else if (!!error.response && !!error.response.data.error && !!error.response.data.error.message) {
    vm.$Notice.error({ title: window.abp.localization.localize("LoginFailed"), desc: error.response.data.error.message, duration: 5 })
  } else if (!error.response) {
    vm.$Notice.error({ title: window.abp.localization.localize('UnknownError'), desc: '', duration: 5 })
  } else {
    vm.$Notice.error({ title: error.response.status, desc: error.response.data, duration: 5 })
  }
  //关闭加载中的提示
    vm.$Message.destroy(); */
    Message({
      message: error.response.statusText,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default AXIOS
