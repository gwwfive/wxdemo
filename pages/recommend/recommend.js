// pages/recommend/recommend.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  //加载推荐购买--根据销售数量来排序
  getRecommentProducts: function () {
    var that = this;
    wx.request({
      url: app.globalData.web + 'v1/product/',
      data: { flag: 1 },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if (res.statusCode == 200 && res.data.status == 1) {
          that.setData({
            recommentList: res.data.products,
          })
        }
      },

    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRecommentProducts()
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})