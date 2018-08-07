// pages/authorize/authorize.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseOpenSetting: wx.canIUse('button.open-type.openSetting'),
  },
  bindGetUserInfo: function(e) {
    console.log(e.detail.userInfo)
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      // app.uploadUserInfo()
      // 返回
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.showToast({
        title: '未授权获取资料',
        icon: 'none',
        duration: 5000,
        mask: true,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }
  },
  bindOpenSetting: function(e) {
    console.log(e.detail)
    // wx.authorize({
    //   scope: 'scope.userInfo',
    // });
    if (e.detail.authSetting["scope.userInfo"]) {//如果授权，就会为true
      // 用户授权了
      wx.getUserInfo({
        withCredentials: true,
        lang: 'zh_CN',
        success: res => {
          app.globalData.userInfo = res.userInfo;
          wx.navigateBack({
            delta: 1
          });
        },
        fail: function (res) { },
        complete: function (res) { },
      });
    }
  },
  openSetting: function() {
    console.log('h')
    wx.openSetting({
      success: function(res) {
        console.log(res);
        if (res.authSetting["scope.userInfo"]){
          // 用户授权了
          wx.getUserInfo({
            withCredentials: true,
            lang: 'zh_CN',
            success: res=> {
              app.globalData.userInfo = res.userInfo;
              wx.navigateBack({
                delta: 1
              });
            },
            fail: function(res) {},
            complete: function(res) {},
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  // onPullDownRefresh: function () {

  // },

  /**
   * 页面上拉触底事件的处理函数
   */
  // onReachBottom: function () {

  // },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})