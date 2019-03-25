//app.js
const config = require('./utils/config.js')
const util = require('./utils/utilnew.js')
App({
  onLaunch: function (options) {
    // 展示本地存储能力

    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // console.log("APP_onLaunch_options:",options)
    // let query_id = options.query.query_id// ////;
    // wx.setStorageSync('query_id', query_id)
  },
  onShow(e){
    console.log('分享信息：',e.query);
    let query_id = e.query.query_id// 'fffffffffffffffffff'// ////;
    let query_name = e.query.query_name
    wx.setStorageSync('query_id', query_id)
    wx.setStorageSync('query_name', query_name)
    console.log("APP-IN-QUERY_ID:", query_id)
    // let openid = wx.getStorageSync('openid');
    // console.log('非首次进入openid：', openid)
    // if(openid){return}
    // util.getOpenId(
    //   ()=>{
    //     console.log('首次进入openid：',openid)
    //     wx.redirectTo({
    //       url: '/pages/newindex/index',
    //     })
    //   }
    // )
  },
  globalData: {
    userInfo: null,
    host:'https://hd.1-zhao.cn',
    http:'http://hd.1-zhao.cn',
    course_id:'',
    course_banner:'',
    course_price:0,
    course_originPrice:0,
  }
})