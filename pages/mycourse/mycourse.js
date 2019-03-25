// pages/mycourse/mycourse.js
"use strict";
const regenerator = require('../../utils/regenerator.js')
const util = require('../../utils/utilnew.js')
const api = require('../../utils/api.js')
const config = require('../../utils/config.js')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    host:app.globalData.host
  },
  toDetail(e){
    let o = e.currentTarget.dataset
    console.log('o:',o)
    wx.navigateTo({
      url: `../orderdetail/orderdetail?courseid=${o.courseid}&orderid=${o.orderid}`,
    })
  },
  getMyOrders(){
    let openid = wx.getStorageSync('openid')
    util.showLoading('努力加载ing...')
    api.$http(
      config.AllOrders,
      "POST",
      {
        openId:openid
      }
    ).then(res=>{
      console.log(config.AllOrders,res)
      if(res.data.code){
        this.setData({
          orders:res.data.data
        })
      }else{

      }
    }).catch(err=>{
      console.error(config.AllOrders, res)
    })
  },
  init(){
    this.setData({
      orders:{}
    })
    
  },
 

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getMyOrders();
  },
  onPullDownRefresh: function () {
    this.init()
    this.getMyOrders();
  },
  onShareAppMessage: function () {
    return {
      title: '提现活动',
      path: `/pages/index/index`,
    }
  }
})