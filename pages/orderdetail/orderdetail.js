// pages/orderdetail/orderdetail.js
"use strict";
const regenerator = require('../../utils/regenerator.js')
const util = require('../../utils/utilnew.js')
const api = require('../../utils/api.js')
const config = require('../../utils/config.js')
const WxParse = require('../../wxParse/wxParse.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    host:app.globalData.host
  },
  getDetailOrder(orderid,course_id){
    
    
  },
  init(orderid, course_id){
    this.setData({
      order:{},
      createTime:'`:::: - :: - ::  :: - :: - ::`',
      payTime: '`:::: - :: - ::  :: - :: - ::`',
      phone:'::: - :::::::',
      location:''
    })
    if (!orderid || !course_id) {
      util.showModal('错误', '传入orderid或course_id为空')
      return
    }
    let openid = wx.getStorageSync('openid')
    util.showLoading('努力加载ing...')
    api.$http(
      config.OrderDetail,
      "POST",
      {
        openId: openid,
        orderId: orderid,
        CouId: course_id
      }
    ).then(res => {
      console.log(config.OrderDetail, res)
      if(res.data.code){
        this.setData({
          order:res.data.data,
          createTime: util.formatTime(new Date(+res.data.data.CreateTime.replace(/[^0-9]/ig, ""))),
          payTime: util.formatTime(new Date(+res.data.data.ZhiFuTime.replace(/[^0-9]/ig, ""))),
          props:{
            phone: res.data.data.CouPhone,
            location: res.data.data.CouSite,
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options:',options)
    this.setData({
      orderid: options.orderid,
      courseid: options.courseid
    })
    this.init(this.data.orderid, this.data.courseid)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.init(this.data.orderid, this.data.courseid)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
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