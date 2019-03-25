const host = 'https://hd.1-zhao.cn';

module.exports = {
  /**
   * 拼团
   */
  //获取openid
  GetOpenId: `${host}/meet/OneHomePage/OneActOpenId`,
  //提交用户信息
  SubmitUserInfo: `${host}/meet/OneHomePage/PostNick_Image`,
  //获取拼团信息
  GetPinMsgs: `${host}/meet/OneHomePage/GetMy`,
  //给自己创建拼团信息
  CreateActivity: `${host}/meet/OneHomePage/GetActivityInitiated`,
  //帮助好友拼团
  HelpFriends: `${host}/meet/OneHomePage/GetAssistSponsor`,
  //定时获取已经提现的用户
  GetBilledUsers: `${host}/meet/OneHomePage/GetTiXian`,
  //用户提现
  Bill: `${host}/meet/OneHomePage/TiPay`,
  /**
   * 课程
   */
  //获取首页课程
  GetCourses: `${host}/meet/CourseInfo/GetCourse`,
  //获取课程详细信息
  GetDetailCourse: `${host}/meet/CourseInfo/GetServiceAreaInfo`,
  //提交购买课程信息
  BuyCourse: `${host}/meet/CourseInfo/PostCouInfo`,
  //确认订单购买课程
  ConfirmOrder: `${host}/meet/CourseInfo/GetServeInfos`,
  //查看我的所有订单
  AllOrders: `${host}/meet/CourseInfo/GetCourseInfoBM`,
  //查看单个订单
  OrderDetail: `${host}/meet/CourseInfo/GetCourseInfoXQ`,
  //zhifu
  PayMOney: `${host}/meet/OneHomePage/PutZhifu`,
  //
  GetPayId: `${host}/meet/CourseInfo/PutZhifu`,
  //支付成功
  PaySuccess: `${host}/meet/CourseInfo/PayMentCallBack`,
  //支付失败
  PayFail: `${host}/PayFail`,
}