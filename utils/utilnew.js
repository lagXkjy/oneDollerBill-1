"use strict";
const config = require('./config.js')
const api = require('./api.js')


const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatRestTime = (date) =>{
  let now = (new Date()).valueOf();
  date = (new Date(date)).valueOf();
  let leftTime = date - now;
  if(leftTime < 0){
    return {
      hours:"--",
      minutes: "--",
      seconds: "--"
    }
  }
  let day = formatNumber(Math.floor(leftTime / 1000 / 60 / 60 / 24));
  let hours = formatNumber(Math.floor(leftTime / 1000 / 60 / 60 % 24));
  let minutes = formatNumber(Math.floor(leftTime / 1000 / 60 % 60));
  let seconds = formatNumber(Math.floor(leftTime / 1000 % 60));
  return {
    hours,
    minutes,
    seconds
  }
}

const YMD = ()=>{
  let date = new Date()
  let Y = date.getFullYear()
  let M = date.getMonth() +1
  let D = date.getDate()
  return [Y,M,D].map(formatNumber).join('-')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const random = (min , max)=>{
  return Math.floor((Math.random()*(max - min + 1) + min))
}

const showModal = (title,content)=>{
  wx.showModal({
    title: title,
    content: content,
    showCancel: false
  })
}

const showToast = (title, icon, duration = 3000)=>{
  wx.hideLoading();
  icon = icon === undefined ? 'none' : icon;
  wx.showToast({
    title,
    icon,
    duration
  })
}

const showLoading = (title)=>{
  wx.hideLoading();
  wx.showLoading({
    title: title
  })
}

const getOpenId = function (callback) {
  callback = typeof (callback) === 'function' ? callback : function (res) { };
  let openid = wx.getStorageSync('openid');
  if (openid) return;
  wx.login({
    complete: (res) => {
      if (res.code) {
        let code = res.code;
        console.log("code:", code);
        //return;
        showLoading('努力加载ing....')
        api.$request(
          config.GetOpenId,
          "POST",
          {
            code: code
          },
          (res) => {
            console.log(res);
            if(res.data.code){
              console.log(">>>>>>>>>>>>>>")
              wx.setStorageSync('openid', res.data.data.openId)
              wx.setStorageSync('userid', res.data.data.userId)
              wx.setStorageSync('avatarUrl', res.data.data.Image)
              wx.setStorageSync('nickName', res.data.data.Nick)
              wx.setStorageSync('permission', res.data.data.StatusCode)
              console.log(wx.getStorageSync('avatarUrl'))
              if (!res.data.data.StatusCode) {
                wx.hideLoading();
                wx.showModal({
                  title: '提示',
                  content: '您已被禁用',
                  showCancel:false,
                  success:(res)=>{
                    callback();
                  }
                })
              }else{
                callback();
              }
            }else{
              if(res.statusCode == 200){
                showModal('提示', `${res.data.msg}`)
              }else{
                showModal('ERROR', `statusCode:${res.statusCode},URL:${config.GetOpenId}`)
              }
            }
          },
          (err) => {
            //showModel("网络异常", '请稍后再试');
            console.log("ERROR", err)
            showModal('ERROR',`网络异常，请稍后再试`)
          },
          (res) => {
            
          }
        );
      }
    }
  })
}
//防抖
let timeout;
function debounce(func, delay) {
  typeof func === 'function' ? func : function func(){}
  delay ? delay : 300;
  clearTimeout(timeout);
  timeout = setTimeout(function(){
    func();
  },delay)
};
//节流

let stamp;
function throttle(fn,limit,tip){
  typeof fn === 'function' ? fn : function func() { }
  typeof tip === 'function' ? tip : function func() { }
  limit ? limit : 300;
  let now = new Date().valueOf()
  if (now - stamp < limit){
    if(!tip){
      showModal('提示', `请不要重复点击`)
      return
    }
    tip()
    return
  }
  fn()
  stamp = now
}

module.exports = {
  formatRestTime,
  formatTime,
  showModal,
  showLoading,
  getOpenId,
  showToast,
  random,
  YMD,
  debounce,
  throttle
}
