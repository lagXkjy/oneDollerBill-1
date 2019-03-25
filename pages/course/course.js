// pages/course/course.js
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
    postShow:false,
    host:app.globalData.host,
    props:{
      phone: "",
      location: ''
    }
  },
  buy(){
    wx.navigateTo({
      url: '../tosureorder/tosureorder',
    })
  },
  shareQuan(){
    this.setData({
      postShow: true
    })
  },
  hidePost(){
    this.setData({
      postShow: false
    })
  },
  showPost(){
    this.setData({
      postShow: true
    })
  },
  //保存海报
  savepost(){
    let that = this
    let src = this.data.host + this.data.datas.Couimage
    console.log('保存海报');
    wx.getImageInfo({
      src,//that.data.haibao,
      success: function (res) {
        var path = res.path;
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success(res) {
            console.log(res)
            util.showToast('海报保存成功','success')
          },
          fail(err){
            //util.showToast('点击海报长按之后保存')
          },
          complete(res){
            console.log("COMPLETE_SAVE_RES",res)
            that.hidePost()
          }
        })
      },
      fail:(err)=>{
        console.log(err)
        // util.showModal('提示',`${err.errMsg}`)
        // util.showToast('请点击海报,长按之后保存')
      }
    });
  },
  //获取课程详细信息
  getDatas(id){
    let that = this
    util.showLoading('努力加载ing...')
    api.$http(
      config.GetDetailCourse,
      "POST",
      {
        CouId:id
      }
    ).then(res=>{
      console.log(config.GetDetailCourse,res)
      if(res.data.code){
        app.globalData.course_id = res.data.data.CouId;
        app.globalData.course_banner = app.globalData.host+res.data.data.CouImages[0];
        app.globalData.course_title = res.data.data.CourseTitle;
        app.globalData.course_price = res.data.data.CouPrice;
        app.globalData.course_originPrice = res.data.data.CouOriginalPrice;
        app.globalData.course_address = res.data.data.CouSite
        app.globalData.course_phone = res.data.data.CouPhone
        console.log('app.globalData', app.globalData)
        this.setData({
          datas:res.data.data,
          props:{
            phone: res.data.data.CouPhone,
            location: res.data.data.CouSite,
          }
        })
        let html = res.data.data.CouIntroduce
        let src = /src=[\'\"]?/ig
        let ddd = html.match(src)
        html = html.replace(src, `src = "${app.globalData.http}`)
        console.log(html)
        WxParse.wxParse('article', 'html', html, that, 5);
      }
    }).catch(err=>{
      util.showModal("ERROR",`网络异常，请稍后再试。err:${err}`)
    })
  },
  init(){
    this.setData({
      datas: {},
      props: {
        phone: "",
        location: "",
      }
    })
  },
  toIndex(){
    wx.navigateTo({
      url:'../newindex/index'
    })
  },
  preImage(){
    let src = this.data.host + this.data.datas.Couimage
    let img = [];
    img.push(src)
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: img // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    console.log(options)
    let course_id = options.id
    if (course_id){
      this.getDatas(course_id)
      this.setData({
        course_id
      })
    }
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
    let openid = wx.getStorageSync('openid');
    if (openid) {
      console.log('非首次进入openid：', openid)
      // wx.navigateTo({
      //   url: '/pages/newindex/index',
      // })
      return
    }
    util.getOpenId(
      () => {
        console.log('首次进入openid：', openid)
      }
    )
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },
  onPullDownRefresh: function () {
    this.init()
    this.getDatas(this.data.course_id);
  },
  onShareAppMessage: function () {
    return {
      title: '提现活动',
      path: `/pages/index/index?share_course=${this.data.course_id}`,
    }
  }
})