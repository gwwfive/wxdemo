// pages/shopInfo/shopInfo.js
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '',
    shop: {},
  },
  /**
   * 加载商店信息
   */
  shopInfo: function() {
    var that = this;
    wx.request({
      url: app.globalData.web + 'v1/shop/',
      data: '',
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if (res.statusCode == 200 && res.data.status == 1) {
          that.setData({
            shop: res.data.shop,
            content: res.data.shop.shopIntroduce,
          }, function() {
            var temp = WxParse.wxParse('content', 'html', that.data.content, that, 5);
            that.setData({
              content: temp
            })

          });
        }
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.shopInfo()
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
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})