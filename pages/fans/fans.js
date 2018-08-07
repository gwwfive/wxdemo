// pages/fans/fans.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["一级粉丝", "二级粉丝"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    sliderWidth: 0,
    fans: [{
      list: [],
      page: 0,
      count: 0,
      dataReady: false
    }, {
      list: [],
      page: 0,
      count: 0,
      dataReady: false
    }],
  },
  tabClick: function(e) {
    var that = this;
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    },function(){
      if(that.data.fans[e.currentTarget.id].list.length==0){
        that.getFans(e.currentTarget.id);
      }
    });
  },
  // 加载粉丝详情
  getFans: function(index) {
    var that = this;
    var fans = that.data.fans;
    var page = fans[index].page;
    wx.request({
      url: app.globalData.web + 'v1/agent/',
      data: {
        fans: index==0?2:3,
        userId: app.globalData.userId,
        page: page
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if (res.data.status == 1 && res.statusCode == 200) {
          var list = fans[index].list;
          if (page == 0) {
            list = [];
          }
          if (res.data.fans.length > 0) {
            list = list.concat(res.data.fans);
            page++;
          }
          fans[index].list = list;
          fans[index].page = page;
          fans[index].dataReady = true;
          that.setData({
            fans: fans,
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {
        // wx.stopPullDownRefresh();
        wx.hideLoading();
        },
    })
  },
  // 加载粉丝数量
  getFansCount(index){
    var that = this;
    var fans = that.data.fans;
    wx.request({
      url: app.globalData.web + 'v1/agent/',
      data: {
        fans: index == 0 ? 0 : 1,
        userId: app.globalData.userId,
        // page: page
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if (res.data.status == 1 && res.statusCode == 200) {
          fans[index].count = res.data.fansCount
          that.setData({
            fans: fans,
          })
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  init:function(){
    this.getFansCount(0);
    this.getFans(0);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        var sliderWidth = res.windowWidth / that.data.tabs.length - 10
        that.setData({
          sliderWidth: sliderWidth,
          sliderLeft: 5,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    this.init();
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
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
   this.getFans(this.data.activeIndex);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})