// component/tripList/tripList.js
// var $ = require("../../utils/utilx.js");
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Object,
      value: ' ',
    },
    state: { // 属性名
      type: Number, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: 0, // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    flag: {// 
      type: Number,
      value: 0,

    },
    // 行程的所属人
    tripUser:{
      type:Number,
      value:0
    },
    // 当前的用户id
    userId:{
      type:Number,
      value:0
    }
    
    // showMask:{
    //   type:Boolean,
    //   value:true
    // }

  },

  /**
   * 组件的初始数据
   */
  data: {
    list: [],
    showMask: false,
    item: {},
    userId:0
  },


  /**
   * 组件的方法列表
   */
  methods: {
    hasread: function (e) {
      console.log(e);
      console.log(this.data.list)
      var that = this
      var index = e.currentTarget.dataset.index
      var list = this.data.list
      if (list[index].msg.msgNum == 0) { return; }
      // 联网
      wx.request({
        url: app.globalData.web + 'notify',
        data: {
          userId: app.getUserId(),
          tripId: list[index].id,
        },
        header: {},
        method: 'PUT',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          if (res.statusCode == 200) {
            console.log('notify')
            list[index].msg.msgNum = 0
            that.setData({
              list: list
            })
          }
        },
        fail: function (res) { },
        complete: function (res) { },
      });

      // 
      wx.navigateTo({
        url: '/pages/trip/trip?id=' + e.currentTarget.dataset.id + '&flag=3',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    },
    editagain: function (e) {
      console.log(e);
      console.log('重新编辑');

      wx.navigateTo({
        url: '/pages/publish/publish?flag=1&index=' + e.currentTarget.dataset.index,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    },
    showDetails: function (e) {
      // 1.设置显示的内容
      var index = e.currentTarget.dataset.index;
      var that = this;
      // 2.显示
      this.setData({
        showMask: true,
        item: that.data.list[index]
      })
    },
    hideMask: function (e) {
      this.setData({
        showMask: false,
      })
    },
    coolsCarState: function (e) {
      var that = this;
      var state = e.currentTarget.dataset.state;
      var coolsCarId = e.currentTarget.dataset.id;
      var index = e.currentTarget.dataset.index;
      wx.request({
        url: app.globalData.web + 'coolscar',
        data: {
          coolsCarId: coolsCarId,
          userId: app.getUserId(),
          state: state,
        },
        header: {},
        method: 'PUT',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          if (res.statusCode == 200 && res.data.return_code == 'SUCCESS') {
            //  修改成功
            var list = that.data.list;
            list[index].state = state;
            that.setData({
              list: list,
            });
          }
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    },
    attendCoolsCar: function (e) {
      var that = this;
      // 判断类型和时间
      
      if ($.compareTime(new Date(), e.currentTarget.dataset.startime)&&e.currentTarget.dataset.type==0){
        wx.showModal({
          title: '提示',
          content: '该拼车已过期, 无法拼车或取消',
          showCancel: false,
          confirmText: '确认',
          confirmColor: '#9c3',
        })
        return;
      }
      wx.request({
        url: app.globalData.web + 'coolscar',
        data: {
          flag: e.currentTarget.dataset.flag,
          userId: app.getUserId(),
          coolsCarId: e.currentTarget.dataset.id
        },
        header: {},
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          if (res.statusCode == 200 && res.data.return_code == "SUCCESS") {
            wx.showModal({
              title: e.currentTarget.dataset.flag == '1' ? '提交成功' : '取消成功',
              content: e.currentTarget.dataset.flag == '1' ? '请尽快联系车主吧~' : '',
              showCancel: false,
              confirmText: '确认',
              confirmColor: '#9c3',
              success: function (res) {
                if (res.confirm && e.currentTarget.dataset.flag == '0') {
                  var list = that.data.list;
                  list.splice(e.currentTarget.dataset.index, 1);
                  that.setData({
                    list: list,
                  })
                }
              }
            })
          }
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    },

    copy:function(e){
      wx.setClipboardData({
        data: e.currentTarget.dataset.contact,
        success: function(res) {
          wx.showToast({
            title: '已复制',
            icon: 'success',
            // image: '',
            duration: 1000,
            mask: true,
            
          })
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    },

  }
})
