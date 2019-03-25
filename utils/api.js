"use strict";
const config = require('./config.js');
let flag = false;//是否拦截请求



const $request = (url, method, data, success, fail, complete) => {
  success = typeof (success) === 'function' ? success : function success(res) { };
  fail = typeof (fail) === 'function' ? fail : function () { };
  complete = typeof (complete) === 'function' ? complete : function () { };
  if (flag) {
    let res;
    if (url == config.GetOpenId) {
      res = {
        statusCode: 200,
        Results: {
          openid: 'xxxxxxxxxxxxxxxxxxxx',
          userid: 'abcdefghijklmgopqrst',
          avatarUrl:"",// "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJ6jFZc6c1mFDnvRqDflrc1fZfNhv3lDDz7oqfSsZxCGjk9Z6gcLJNtPib77bEWo19lW4UdnGAK5Og/132",
          nickName: '张三',
          Status: 0,
          menber: 5,
          menber_h: 0,
          menber_c: 0,
          chuo: '1532995852817'
        }
      }
      setTimeout(() => {
        success(res);
        complete(res);
      }, 800)



    } 
    else if (url == config.SubmitUserInfo) {
      res = {
        statusCode: 200,
        Results: {
          Status: true,
        }
      }
      setTimeout(() => {
        success(res);
        complete(res);
      }, 800)



    } 
    else if (url == config.HelpFriends) {
      res = {
        statusCode: 200,
        Results: {
          Status: true,
          Results: '帮助成功'
        }
      }
      setTimeout(() => {
        success(res);
        complete(res);
      }, 800)



    } 
    else if (url == config.CreateActivity) {
      res = {
        statusCode: 200,
        Results: {
          Status: true,
          Results: '创建成功'
        }
      }
      setTimeout(() => {
        success(res);
        complete(res);
      }, 800)
    }
    else if (url == config.GetCourses) {
      res = {
        statusCode: 200,
        Results: {
          Status: true,
          Results: '获取课程成功'
        }
      }
      setTimeout(() => {
        success(res);
        complete(res);
      }, 800)
    }
  } else {
    wx.request({
      url: url,
      method: method,
      data: data,
      header: { 'content-type': 'application/json' },
      success: success,
      fail: fail,
      complete: complete
    })
  }
}

const $http = (url, method, data) => {
    return new Promise((resolve, reject) => {
      $request(
        url,
        method,
        data,
        res=>{
          //console.log(`$http>_url:${url}`, res)
          resolve(res);
        },
        err=>{
          //console.log(`$http>_url:${url}`, err)
          reject(err);
        },
        res => {
         wx.hideLoading();
         wx.stopPullDownRefresh();
        },
      )
  })
}
module.exports =  {$request,$http}