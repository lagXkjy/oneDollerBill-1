// pages/buyed/buyed.js
"use strict";
const util = require('../../utils/utilnew.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    host:app.globalData.host,
  },
  watchOrder(e){
    let orderId = e.target.dataset.orderId;
    wx.navigateTo({
      url: `../mycourse/mycourse?orderId=${orderId}`,
    })
  },
  onShow(){
    console.log('BUYED_APP',app)
    this.setData({
      course_id: app.globalData.course_id,
      course_title: app.globalData.course_title,
      course_banner: app.globalData.course_banner,
      course_price: app.globalData.course_price,
      course_originPrice: app.globalData.course_originPrice,
      props:{
        location:app.globalData.course_address,
        phone:app.globalData.course_phone
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '提现活动',
      path: `/pages/index/index`,
    }
  }
})