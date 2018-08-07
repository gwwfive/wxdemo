// pages/mine/mine.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // userInfo: {},
    isInputSign: false,
    user: {},
    allNotify: 0,

  },


  // // 获取消息通知
  // getNotify: function() {
  //   var that = this;
  //   if (!app.globalData.userId) {
  //     setTimeout(function() {
  //       that.getNotify();
  //       return;
  //     }, 1000)
  //     return;
  //   }
  //   wx.request({
  //     url: app.globalData.web + 'notify',
  //     data: {
  //       'userId': app.getUserId(),
  //     },
  //     header: {},
  //     method: 'GET',
  //     dataType: 'json',
  //     responseType: 'text',
  //     success: function(res) {
  //       if (res.statusCode == 200) {
  //         that.setData({
  //           tripMsg: res.data.tripMsg,
  //           allNotify: res.data.allNotify,
  //         })
  //       }
  //     },
  //     fail: function(res) {},
  //     complete: function(res) {},
  //   })

  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // var userInfo = app.globalData.userInfo
    this.setData({
      userInfo: app.globalData.userInfo,
    })
    // this.getUserInfo()
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
    // this.getNotify();
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