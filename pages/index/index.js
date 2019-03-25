//index.js
//获取应用实例
const util = require('../../utils/utilnew.js')
const api = require('../../utils/api.js')
const config = require('../../utils/config.js')
const app = getApp()
let share_course
Page({
  data: {
    
  },
  onLoad: function (options) {
    if (options.query_id) {
      wx.setStorageSync('query_id', options.query_id)
      wx.setStorageSync('query_name', options.query_name)
    }
    if (options.share_course) {
      share_course = options.share_course
    }else{
      share_course = ''
    }
    // if (options["id%20"]){
    //   share_course = options["id%20"]
    // }
    if(options.id){
      share_course = options.id
    }
  },
  onShow(){
    let openid = wx.getStorageSync('openid');
    let query_id = wx.getStorageSync('query_id');
    if (openid) { 
      this.getPin()
      return 
    }
    util.getOpenId(()=>{
      this.getPin()
    })
  },
  getPin() {
    let openid = wx.getStorageSync('openid')
    let help_records = wx.getStorageSync('help_records')
    let query_id = wx.getStorageSync('query_id')
    let query_name = wx.getStorageSync('query_name')
    if (!help_records || JSON.parse(help_records).YMD != util.YMD()) {
      //没有记录 或 记录过期
      //则清空记录
      console.log('没有记录 或 记录过期', wx.getStorageSync('help_records'))
      wx.setStorageSync('help_records', JSON.stringify({ YMD: "", lists: [] }))
    }
    help_records = JSON.parse(wx.getStorageSync('help_records'))
    api.$request(
      config.GetPinMsgs,
      "POST",
      {
        ActId: query_id ? query_id : 0,
        openId: wx.getStorageSync('openid')
      },
      (res)=>{
        console.log(config.GetPinMsgs, res)
        if (res.data.code) {
          //let money = res.data.x1.ataAmountWithdrawal
          //res.data.x3 = null
          if (res.data.x3 && res.data.x3.ataCreateTime){
            let date = +res.data.x3.ataCreateTime.replace(/[^0-9]/ig, "")
            let createId = res.data.x3.ataId
            let tixian = res.data.x3.ataataWithdrawalState
            let money = res.data.x3.ataAmountWithdrawal
            if (date) {
              wx.setStorageSync('status', 1)
              wx.setStorageSync('date', date + 1 * 24 * 60 * 60 * 1000)
              wx.setStorageSync('money', money)
              wx.setStorageSync('createId', res.data.x3.ataId)
              wx.setStorageSync('tixian', tixian)
            }
          }else{
            wx.setStorageSync('status', 0)
          }
          let lists = [];
          let help_max = res.data.x4.actChance
          app.globalData.intro_content = res.data.x4.actDescribe
          app.globalData.intro_title = res.data.x4.actTitle
          wx.setStorageSync('help_max', help_max)
          for (var i in res.data.x1) {
            if (!res.data.x1[i].ataId){return}
            lists.push(res.data.x1[i].ataId)
          }
          wx.setStorageSync('help_records', JSON.stringify({ YMD: util.YMD(), lists }))
        } else {

        }
      },
      err=>{
        console.log(err)
      },
      res=>{
        wx.hideLoading()
        if (share_course) {
          wx.redirectTo({
            url: `/pages/course/course?id=${share_course}`,
          })
          return
        }
        wx.redirectTo({
          url: `/pages/newindex/index?query_id=${query_id}&query_name=${query_name}`,
        })
      }
    )
  }
})