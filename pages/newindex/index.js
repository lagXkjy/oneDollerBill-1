// pages/newindex/index.js
"use strict";
const regenerator = require('../../utils/regenerator.js')
const util = require('../../utils/utilnew.js')
const api = require('../../utils/api.js')
const config = require('../../utils/config.js')
const calculate = require('../../utils/calculate.js')
const app = getApp()
//const help_max = 3; //帮助他人点击次数限制
let timer
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tixian: wx.getStorageSync('tixian'),
    width: 150,
    host: app.globalData.host,
    big: {},
    time: {
      hours: '--',
      minutes: '--',
      seconds: '--'
    },
    tips_title: "......", //login help helped
    tips_content: "您的待提现",
    rule: false,
    yue: false,
    help: false,
    hongbao: false,
    arr_helpme: [],
  },
  hidemask() {
    console.log('yincang');
    this.setData({
      rule: false,
      yue: false,
      help: false,
      hongbao: false
    });
    return false;
  },
  showyue() {
    console.log('xianshi');
    this.setData({
      rule: false,
      yue: true,
      hongbao: false,
      help: false
    })
    return false;
  },
  showrule() {
    console.log('xianshi');
    this.setData({
      rule: true,
      yue: false,
      hongbao: false,
      help: false
    })
    return false;
  },
  showhelp() {
    console.log('xianshi');
    this.setData({
      rule: false,
      yue: false,
      hongbao: false,
      help: true
    })
    return false;
  },
  showhongbao() {
    console.log('xianshi');
    this.setData({
      rule: false,
      yue: false,
      help: false,
      hongbao: true
    })
    return false;
  },
  tocourse(e) {
    let id = e.currentTarget.dataset.courseId
    console.log("e:", e)
    wx.navigateTo({
      url: `../course/course?id=${id}`,
    })
  },
  toOrder() {
    wx.navigateTo({
      url: `../mycourse/mycourse`,
    })
  },
  bill() {
    console.log("bill");
    let money = wx.getStorageSync('money');
    let openid = wx.getStorageSync('openid')
    let createId = wx.getStorageSync('createId')
    let tixian = wx.getStorageSync('tixian')
    if (tixian){
      util.showToast(`您已提现成功`, 'none', 3000)
      return;
    }
    if (money < 1) {
      util.showToast(`还差${this.data.money_left}元可提现`, 'none', 3000)
      return;
    }
    api.$http(
        config.Bill,
        "POST", {
          openid,
          prices: money,
          ataId: createId
        }
      )
      .then(res => {
        console.log(res)
        if (res.data.code) {
          util.showToast('提现成功', 'success', 3000)
          wx.setStorageSync('tixian', true)
          this.setData({
            tixian: 1,
            money:0,
            money_left:calculate.sub(1,0)
          })
        } else {
          if (res.statusCode == 200) {
            util.showToast(`${res.data.msg}`, 'none', 3000)
          } else {
            util.showModal('EROOR', `${res.statusCode},${config.Bill}`)
          }
        }
      })
      .catch(err => {
        console.log(err)
        util.showModal("提示", '网络异常')
        wx.hideLoading()
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let avatarUrl = wx.getStorageSync('avatarUrl')
    console.log(this.data.host)
    console.log('NEW_INDEX_OPTIONS:', options)
    //util.showModal('NEW_INDEX_OPTIONS:', JSON.stringify(options))
    if (options.query_id) {
      wx.setStorageSync('query_id', options.query_id)
      wx.setStorageSync('query_name', options.query_name)
    }
    this.getPin()
    //获取首页课程
    //this.getCourses();

    //this.getBilledUsers();
    if (!avatarUrl) {
      //util.showModal('提示', '请先获取用户头像');
      this.setData({
        tips_title: "请先登录",
        tips_content: "您的待提现"
      })
      this.showhelp();
      return
    }
    console.log('活动开始执行onshow......................')
    this.start();
  },
  getPin() {
    let that = this;
    let help_records = wx.getStorageSync('help_records')
    let query_id = wx.getStorageSync('query_id')
    if (!help_records || JSON.parse(help_records).YMD != util.YMD()) {
      //没有记录 或 记录过期
      //则清空记录
      console.log('没有记录 或 记录过期', wx.getStorageSync('help_records'))
      wx.setStorageSync('help_records', JSON.stringify({
        YMD: "",
        lists: []
      }))
    }
    help_records = JSON.parse(wx.getStorageSync('help_records'))
    api.$http(
      config.GetPinMsgs,
      "POST", {
        ActId: query_id ? query_id : 0,
        openId: wx.getStorageSync('openid')
      }
    ).then(res => {
      console.log(config.GetPinMsgs, res)
      if (res.data.code && res.data.x3.ataCreateTime) {
        let date = +res.data.x3.ataCreateTime.replace(/[^0-9]/ig, "")
        let createId = res.data.x3.ataId
        let money = res.data.x3.ataAmountWithdrawal
        let help_number = res.data.x3.actNumber
        let tixian = res.data.x3.ataataWithdrawalState
        let help_count_m = 0
        for (let i in res.data.x2) {
          help_count_m = calculate.add(help_count_m, res.data.x2[i].powMoney * 1)
        }
        console.log('res.data.x2', res.data.x2)
        that.setData({
          money: tixian ? 0 : money,
          tixian,
          money_left: calculate.sub(1, money),
          help_number,
          arr_helpme: res.data.x2,
          money_init: calculate.sub(money, help_count_m)
        })
        wx.setStorageSync('money', money)
        wx.setStorageSync('help_number', help_number)
        wx.setStorageSync('tixian', tixian)
      }
    }).catch(err => {
      console.log(err)
      //throw new Error(err)
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let avatarUrl = wx.getStorageSync('avatarUrl')
    let help_number = wx.getStorageSync('help_number')
    let money = wx.getStorageSync('money')
    let tixian = wx.getStorageSync('tixian')
    this.setData({
      avatarUrl,
      money: tixian ? 0 : money,
      money_left: calculate.sub(1, money),
      help_number: help_number,
      intro_title: app.globalData.intro_title,
      intro_content: app.globalData.intro_content
    })
    let that = this;
    let date = +wx.getStorageSync('date')
    let now = (new Date()).valueOf()
    if (date) {
      let left = date - now
      if (left <= 0) {
        console.log("ONSHOW过期")
        wx.setStorageSync('status', 2)
        wx.setStorageSync('money', 0)
        wx.setStorageSync('tixian', 0)
        that.setData({
          tixian: 0,
          money: 0,
          money_left: 1,
          money_init: 0,
        })
        // this.showhelp()
        // this.setData({ tips_title: "红包任务已过期" })
      } else {
        console.log("未过时开始计时")
        console.log('COUNT_0')
        clearTimeout(timer)
        this.count(date)
      }
    }
  },
  start() {
    console.log('活动执行ing......................')
    let avatarUrl = wx.getStorageSync('avatarUrl')
    let money = wx.getStorageSync('money')
    this.setData({
      money,
      money_left: calculate.sub(1, money)
    })
    let that = this;
    let help_records = wx.getStorageSync('help_records')
    if (!help_records || JSON.parse(help_records).YMD != util.YMD()) {
      wx.setStorageSync('help_records', JSON.stringify({
        YMD: "",
        lists: []
      }))
    }
    help_records = JSON.parse(wx.getStorageSync('help_records'))
    console.log('help_records:', help_records)
    let userid = wx.getStorageSync('userid');
    let menber = wx.getStorageSync('menber')
    let menber_h = wx.getStorageSync('menber_h')
    let status = wx.getStorageSync('status')
    let date = +wx.getStorageSync('date')
    let now = (new Date()).valueOf()
    let openid = wx.getStorageSync('openid')
    let query_id = wx.getStorageSync('query_id')
    let query_name = wx.getStorageSync('query_name')
    let createId = wx.getStorageSync('createId')
    let tixian = wx.getStorageSync('tixian')
    let help_max = wx.getStorageSync('help_max')
    if (date) {
      let left = date - now
      if (left <= 0) {
        console.log("START中设置为过期")
        wx.setStorageSync('status', 2)
        this.showhelp()
        this.setData({
          tips_title: "红包任务已过期"
        })
      } else {
        console.log("未过时开始计时")
        console.log('COUNT_2')
        clearTimeout(timer)
        this.count(date)
      }
    }
    if (!query_id || query_id == createId) {
      //自己进入小程序
      if (status == 1 && !tixian) {
        this.showyue()
      }
      //判断自己活动状态
      //0没有 1ing 2过期
      //0|2 创建新活动
      console.log("status:", status)
      console.log("CREATEACTIVITY_3")
      this.createActivity();
      return
    }
    //1.分享进入
    //此处判断已经帮助好友数组有return
    // console.log('can_help:',can_help)
    if (help_records.lists.length < help_max) {
      //我帮助次数没有超标
      for (var i in help_records.lists) {
        if (query_id == help_records.lists[i]) {
          //util.showModal('提示','今天帮助过')
          this.showhelp()
          this.setData({
            tips_title: `您已帮${query_name}助力过`,
            tips_content: '您的待提现'
          })
          return
        }
      }
      //开始帮助好友
      //let help_money = util.random(5, 8) / 100
      //util.showLoading('正在助力好友...')
      console.log('help_records:', JSON.parse(wx.getStorageSync('help_records')))
      api.$request(
        config.HelpFriends,
        "POST", {
          openid: wx.getStorageSync('openid'),
          userId: wx.getStorageSync('userid'),
          AtaId: +wx.getStorageSync('query_id'),
        },
        (res) => {
          console.log(config.HelpFriends, res);
          if (res.data.code) {
            let help_money = res.data.data.Money
            //util.showToast(`小伙伴+${help_money}元`, 'success')
            this.setData({
              help_money,
              tips_title: `您已帮${query_name}助力${help_money}元`,
              tips_content: "您的待提现"
            })
            //wx.setStorageSync('menber_h', menber_h * 1 + 1)
            let lists = help_records.lists
            lists.push(+query_id)
            console.log('lists:', lists, "query_id:", query_id)
            wx.setStorageSync('help_records', JSON.stringify({
              YMD: util.YMD(),
              lists
            }))
            console.log('help_records:', JSON.parse(wx.getStorageSync('help_records')))
            this.showhelp();
          } else {
            if (res.statusCode == 200) {
              //util.showModal('ERROR', `err msg:${res.msg},URL:${config.HelpFriends}`)
              this.setData({
                tips_title: `${res.data.msg}`,
                tips_content: "您的待提现"
              })
              this.showhelp();
            } else {
              util.showModal('ERROR', `statusCode:${res.statusCode},URL:${config.HelpFriends},userId:${wx.getStorageSync('userid')}`)
            }
          }
        },
        (err) => {
          console.log(config.HelpFriends, err);
          util.showModal('提示', '帮助好友失败')
        },
        (res) => {
          //wx.hideLoading();
          console.log("CREATEACTIVITY_4")
          this.createActivity(true);
        },
      )
    } else {
      console.log("CREATE_3")
      this.setData({
        tips_title: `每天最多可助力${help_max}人`,
        tips_content: '您的待提现'
      })
      this.showhelp()
      console.log("CREATEACTIVITY_5")
      this.createActivity(true);
    }
  },
  //倒计时
  count(end) {
    console.log("计时开始")
    let that = this;
    let query_id = wx.getStorageSync('query_id')
    let avatarUrl = wx.getStorageSync('avatarUrl')
    let status = wx.getStorageSync('status')
    counttimme();
    function counttimme() {
      clearTimeout(timer)
      timer = setTimeout(() => {
        let now = (new Date()).valueOf()
        let left = end - now
        if (left < 0) {
          console.log("计时过期")
          wx.setStorageSync('status', 2)
          wx.setStorageSync('money', 0)
          wx.setStorageSync('tixian', 0)
          that.setData({
            tixian:0,
            money:0,
            money_left:1,
            money_init:0,
          })
          // that.setData({
          //   tips_title: "红包任务已过期"
          // })
          // that.showhelp()
          if (avatarUrl && end) {
            //用户已经登陆且进入过有活动存在
            if (query_id) {
              console.log("CREATEACTIVITY_6")
              that.createActivity(true)
            } else {
              console.log("CREATEACTIVITY_7")
              that.createActivity()
            }
          }
        } else {
          counttimme();
        }
        let time = util.formatRestTime(new Date(end)); //2830595090335
        that.setData({
          time
        })
      }, 1000)
    }
  },
  helpFriends() {
    let query_id = wx.getStorageSync('query_id');
    let menber_h = wx.getStorageSync('menber_h');
  },
  createActivity(query_id = false) {
    //判断自己活动状态
    //0没有 1ing 2过期
    //0|2 可以创建新活动
    let that = this
    let status = wx.getStorageSync('status')
    let openid = wx.getStorageSync('openid')
    console.log('status:', status)
    if (status == 0) {
      console.log('creating...')
      //util.showLoading('给您发红包ing...')
      api.$request(
        config.CreateActivity,
        "POST", 
        {
          openid: wx.getStorageSync('openid')
        },
        (res) => {
          console.log(config.CreateActivity, res);
          if (res.data.code) {
            let help_money = res.data.data.AmountWithdrawal
            let create = +res.data.data.CreateTime.replace(/[^0-9]/ig, "")
            let createId = res.data.data.AtaId
            let help_number = res.data.data.Number
            wx.setStorageSync('status', 1)
            wx.setStorageSync('tixian', 0)
            wx.setStorageSync('money', help_money)
            wx.setStorageSync('date', create + 1 * 24 * 60 * 60 * 1000)
            wx.setStorageSync('createId', createId)
            wx.setStorageSync('help_number', help_number)
            let date = +wx.getStorageSync('date')
            //util.showToast(`获得+${help_money}元`, 'success')
            //util.showModal("提示", `你获得${help_money}元，快去找人助力吧`)
            //wx.setStorageSync('share_id', res.share_id)
            console.log('COUNT_3')
            clearTimeout(timer)
            this.count(date)
            this.setData({
              money: help_money,
              money_init: help_money,
              money_left: calculate.sub(1, help_money),
              tips_content: "谢谢您帮我，送您",
              tixian: 0,
              help_number,
            })
            console.log("FIRST_CREATE_ACTIVITY:", wx.setStorageSync('date'))
            console.log("开始计时")
            if (!query_id || query_id == createId) {
              //没有需要帮助的好友
              this.showhongbao();
              return
            }
            this.showhelp()
          } else {
            //发起失败清除 防止重复发起
            clearTimeout(timer)
            if (res.statusCode == 200) {
              util.showModal("提示", `${res.data.msg}`)
              return
            }
            util.showModal("ERROR", `statusCode:${res.data.msg},URL:${config.CreateActivity}`)
          }
        },
        (err) => {
          console.log(config.HelpFriends, err);
          util.showModal('提示', '活动创建失败')
          clearTimeout(timer)
        },
        (res) => {
         // wx.hideLoading();
        },
      )
    } else if (status == 2) {
      // this.showhelp()
      // this.setData({
      //   tips_title: "红包任务已过期"
      // })
      //util.showToast(`创建新的活动ing...`)
      //setTimeout(() => {
        console.log('recreating...')
        //let help_money = +util.random(50, 65) / 100
        //util.showLoading('正在给您发红包...')
        api.$request(
          config.CreateActivity,
          "POST", {
            openid: wx.getStorageSync('openid')
          },
          (res) => {
            console.log(config.CreateActivity, res);
            // res = {
            //   data:{
            //     code:true,
            //     data:{
            //       CreateTime: 'Date/1533714020000/',
            //       AtaId:2222,
            //       AmountWithdrawal:0.77,
            //     }
            //   }
            // }
            if (res.data.code) {
              let help_money = res.data.data.AmountWithdrawal
              let create = +res.data.data.CreateTime.replace(/[^0-9]/ig, "")
              let createId = res.data.data.AtaId
              let help_number = res.data.data.Number
              wx.setStorageSync('status', 1)
              wx.setStorageSync('tixian', 0)
              wx.setStorageSync('money', help_money)
              wx.setStorageSync('date', create + 1 * 24 * 60 * 60 * 1000)
              wx.setStorageSync('createId', createId)
              wx.setStorageSync('help_number', help_number)
              let date = +wx.getStorageSync('date')
              //util.showToast(`获得+${help_money}元`, 'success')
              console.log('COUNT_4')
              clearTimeout(timer)
              this.count(date)
              this.setData({
                money: help_money,
                money_init: help_money,
                money_left: calculate.sub(1, help_money),
                tips_content: "谢谢您帮我，送您",
                tixian:0,
                help_number,
              })
              console.log("FIRST_CREATE_ACTIVITY:", wx.getStorageSync('date'))
              if (!query_id || query_id == createId) {
                //没有需要帮助的好友
                this.showhongbao();
                return
              }
              this.showhelp()
            } else {
              clearTimeout(timer)
              if (res.statusCode == 200) {
                util.showModal("提示", `${res.data.msg}`)
                return
              }
              util.showModal("ERROR", `statusCode:${res.data.msg},URL:${config.CreateActivity}`)
            }
          },
          (err) => {
            clearTimeout(timer)
            console.log(config.HelpFriends, err);
            util.showModal('提示', '网络异常，活动创建失败')
          },
          (res) => {
           // wx.hideLoading();
          },
        )
     // }, 1500)
    }
  },
  getUserInfo(e) {
    console.log(e)
    let openid = wx.getStorageSync('openid');
    let query_id = wx.getStorageSync('query_id');
    let menber_h = wx.getStorageSync('menber_h');
    let avatarUrl = e.detail.userInfo.avatarUrl;
    let nickName = e.detail.userInfo.nickName;
    let help = +e.target.dataset.help;
    let create = false;
    let help_records = wx.getStorageSync('help_records')
    if (help_records) {
      help_records = JSON.parse(wx.getStorageSync('help_records'))
    }
    if (!avatarUrl) {
      return
    }
    util.showLoading('正在登录ing...')
    api.$http(
        config.SubmitUserInfo,
        "POST", 
        {
          Image: avatarUrl,
          Nick: nickName,
          openId: openid
        }).then(res => {
        console.log(config.SubmitUserInfo, res)
        if (res.data.code) {
          wx.setStorageSync('avatarUrl', avatarUrl)
          wx.setStorageSync('nickName', nickName)
          this.setData({
            avatarUrl,
            nickName
          })
          this.start();
        } else {
          if (res.statusCode == 200) {
            util.showModal('提示', `${res.data.msg}`)
            return
          }
          util.showModal('ERROR', `statusCode:${res.statusCode},URL:${config.SubmitUserInfo}`)
        }
      })
      .catch(err => {
        console.err('ERROR:', err)
      })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    util.showLoading('努力加载ing...')
    this.getPin()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(e) {
    console.log(e);
    this.hidemask();
    this.setData({
      yue: false
    })
    let that = this;
    let avatarUrl = wx.getStorageSync('avatarUrl')
    let userid = wx.getStorageSync('userid')
    let menber = wx.getStorageSync('menber')
    let menber_h = wx.getStorageSync('menber_h')
    let status = wx.getStorageSync('status')
    let last_date = wx.getStorageSync('date')
    let openid = wx.getStorageSync('openid')
    let nickName = wx.getStorageSync('nickName')
    let query_id = wx.getStorageSync('query_id')
    let createId = wx.getStorageSync('createId')
    let tixian = wx.getStorageSync('tixian')
    if (status != 1) {
      util.showModal('提示', '您还没有可以分享的活动哦~')
    }
    // if(e.from === "button"){
    //   console.log('按钮')
    // wx.showShareMenu({
    //   withShareTicket: true,
    //   success: function (res) {
    //     // 分享成功console.log('shareMenu share success' console.log('分享成功', res);
    //     //隐藏邀请
    //     util.showToast('分享成功,记得提醒你的小伙伴及时帮忙哦~')
    //     that.setData({
    //       help: false
    //     })
    //   },
    //   fail: function (res) {// 分享失败console.log('分享失败',res)
    //   },
    //   complete:()=>{
    //   }
    // })
    console.log("SHARE_ID==", createId)
    return {
      title: '提现活动',
      path: `/pages/index/index?query_id=${createId}&query_name=${nickName}`,
      //path: `/pages/newindex/index?query_id=vnwger15515ovwo94w`,
      success: function(res) {
        util.showToast('分享成功，快让好友行动起来吧', 'none', 3000)
        that.hidemask()
      },
      fail: function(res) {
        // 分享失败
        console.log(res)
        that.hidemask()
      }
    }
    // }else{
    //     return {
    //       title: '分享',
    //       path: '/pages/newindex/index?id=123'
    //     }
    // }
  },
  getCourses() {
    util.showLoading('获取课程ing...')
    try {
      api.$http(
        config.GetCourses,
        "POST", {}
      ).then((res) => {
        console.log(config.GetCourses, res)
        if (res.data.code) {
          this.setData({
            courses: res.data.data
          })
        } else {
          if (res.statusCode == 200) {
            util.showModal('提示', `${res.data.msg}`)
            return
          }
          util.showModal('ERROR', `statusCode:${res.statusCode}`)
        }
      })
    } catch (err) {
      util.showModal("ERROR", `statusCode:${err.statusCode},${config.GetCourses}`)
    } finally {
      wx.hideLoading();
      console.log('获取课程完成')
    }
  },
  getBilledUsers() {
    //util.showLoading('获取提现用户ing...')
    try {
      api.$http(
        config.GetBilledUsers,
        "POST", {}
      ).then((res) => {
        //console.log(config.GetBilledUsers, res)
        this.timerGetBilled()
        if (res.data.code) {
          this.setData({
            billedUsers: res.data.data
          })
        } else {
          if (res.statusCode == 200) {
            util.showModal('提示', `${res.data.msg}`)
            return
          }
          util.showModal('ERROR', `statusCode:${res.statusCode}`)
        }
      })
    } catch (err) {
      util.showModal("ERROR", `statusCode:${err.statusCode},${config.GetBilledUsers}`)
    } finally {
      //wx.hideLoading();
      //console.log('获取课程完成')
    }
  },
  timerGetBilled() {
    setTimeout(() => {
      this.getBilledUsers()
    }, 4000)
  },
  toBa(){
    wx.navigateToMiniProgram({
      appId: 'wx978aabc5088a48c3',
      path: 'Kecheng/Home/Home',
      extraData: {},
      envVersion: 'release',
      success(res) {
        // 打开成功
      }
    })
  }
})