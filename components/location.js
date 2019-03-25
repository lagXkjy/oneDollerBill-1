// pages/components/map.js

const QQMapWX = require('../utils/qqmap-wx-jssdk.min.js');
const qqmapsdk = new QQMapWX({
  key: '2UIBZ-WE2K3-5VA3G-YBZ34-J2OYO-DEBG4'
});
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    datas:{
      type:Object,
      value:{
        phone: "默认电话",
        location: '默认地址',
        latitude: 31.22114,
        longitude: 121.54409,
      }//没有数据展示的默认数据
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    dd:"内部数据",//组件内部数据
  },
  /**
   * 组件的方法列表
   */
  methods: {
    call() {
      console.log('component-map-this:',this)
      let phone = this.properties.datas.phone
      //let phone = '021-58303589';
      // wx.showModal({
      //   title: '电话咨询',
      //   confirmText: '呼叫',
      //   content: phone,
      //   success: function (sm) {
      //     if (sm.confirm) {
      wx.makePhoneCall({
        phoneNumber: phone
      })
      //     }
      //   }
      // });
    },
    showlocation() {
      //31.22114 121.54409
      let address = this.properties.datas.location
      qqmapsdk.geocoder({
        address,
        success:(res)=>{
          console.log("qqmapsdk.geocoder", res.result.location)
          wx.openLocation({
            latitude: res.result.location.lat,
            longitude: res.result.location.lng,
            scale: 18,
            address,
            name:"地址"
          })
          //res.result.location//.lat|.lng
        },
        fail:(err)=>{
          wx.showModal({
            title: '提示',
            content: '前往位置失败，请稍后再试',
          })
        },
        complete:(res)=>{
          //wx.hideLoading()
        }
      })
      
      // wx.getLocation({
      //   type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      //   success: function (res) {
      //     var latitude = res.latitude
      //     var longitude = res.longitude
      //     console.log(latitude, longitude)

      //   }
      // })
    }

  }
})
