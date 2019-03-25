// pages/tosureorder/tosureorder.js
const util = require('../../utils/utilnew.js')
const config = require('../../utils/config.js')
const api = require('../../utils/api.js')
const app = getApp()
let timer
Page({
  /**
   * 页面的初始数据
   */
  data: {
    name:wx.getStorageSync('name'),
    phone:wx.getStorageSync('phone'),
    age: wx.getStorageSync('age'),
    note:'',
    course_id:app.globalData.course_id,
    course_title: app.globalData.course_title,
    course_banner: app.globalData.course_banner,
    course_price: app.globalData.course_price,
    course_originPrice: app.globalData.course_originPrice,
  },
  buy(){
    let openid = wx.getStorageSync('openid')
    let userid = wx.getStorageSync('userid')
    let name = this.data.name
    let phone = this.data.phone
    let age = this.data.age
    let note = this.data.note
    let reg = /^1[3,5,7,8,9][0-9]{9}$/
    if (!name) {
      util.showModal('提示', '请输入您的姓名')
      return
    }
    if (!reg.test(phone)) {
      util.showModal('提示', '请输入正确的手机号码')
      return
    }
    util.throttle(()=>{
      // wx.navigateTo({
      //   url: '../buyed/buyed',
      // })
      // return;
      wx.setStorageSync('name', name)
      wx.setStorageSync('phone', phone)
      wx.setStorageSync('age', age)
      //util.showLoading('努力加载ing...')
      let params = {}
      api.$http(
        config.BuyCourse,
        "POST",
        {
          userId: userid,
          openId: openid,
          phone,
          UserName: name,
          UserAge: age,
          UserRemark: note,
          price: app.globalData.course_price,
          CouId: app.globalData.course_id
        }
      ).then(res => {
        console.log(config.BuyCourse, res)
        if (res.data.code) {
          params = res.data.data
          // params.odrId,//订单id
          // params.odrPrice,//购买价格
          // params.odrOuttrdeno//订单编号
          return params
        } else {
          util.showModal('ERROR', `statusCode:${res.statusCode},url:${config.BuyCourse}`)
        }
      }).then(params => {
        
        api.$http(
          config.GetPayId,
          "POST",
          {
            orderId: params.odrId
          }
        ).then(res=>{
          console.log(config.GetPayId,res)
          if(res.data.code){
            wx.requestPayment({
              'timeStamp': res.data.paras.timeStamp,
              'nonceStr': res.data.paras.nonceStr,
              'package': res.data.paras.package,
              'signType': 'MD5',
              'paySign': res.data.paras.paySign,
              'success': (res) => {
                console.log(res)
                // api.$request(
                //   config.PaySuccess,
                //   "POST",
                //   {
                //     orderS: params.odrOuttrdeno
                //   },
                //   (res)=>{
                //     console.log('PAY success',res)
                //   },
                //   (err)=>{
                //     console.log("PAY err",err)
                //   },
                //   (res)=>{
                    
                    wx.navigateTo({
                      url: '../buyed/buyed',
                    })
                //   }
                // )
              },
              'fail': (err) => {
                console.log(err)
                //util.showModal('提示','支付失败')
              }
            })
            return res
          }else{
            util.showModal('提示',`${res.data.msg}`)
          }
        })
        
      }).then(res=>{
        
      })
        .catch(err => {
          console.log("ERR::::::::::", err)
        })

    },1500,()=>{
      util.showToast('请不要重复点击')
    }) 
  },
  inpName(e){
    let name = e.detail.value
    this.setData({
      name
    })
  },
  inpPhone(e) {
    let phone = e.detail.value
    let reg = /^1(3|5|7|8|9)[0-9]{9}$/
    this.setData({
      phone
    })
    util.debounce(()=>{
      console.log(reg.test(phone))
      if (reg.test(phone)){
        return
      }
      util.showToast('请输入正确的手机号码')
    },1000)
  },
  blurPhone(e){
    
  },
  inpAge(e) {
    let age = e.detail.value
    this.setData({
      age
    })
  },
  inpNote(e) {
    let note = e.detail.value
    this.setData({
      note
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      name: wx.getStorageSync('name'),
      phone: wx.getStorageSync('phone'),
      age: wx.getStorageSync('age'),
    })
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
    this.setData({
      course_id: app.globalData.course_id,
      course_title: app.globalData.course_title,
      course_banner: app.globalData.course_banner,
      course_price: app.globalData.course_price,
      course_originPrice: app.globalData.course_originPrice,
    })
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
