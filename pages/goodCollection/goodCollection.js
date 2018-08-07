// pages/goodCollection/goodCollection.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dataReady: true,
    list: [],
    page: 0,
  },
  gotoProduct: function(e) {
    var product = this.data.list[e.currentTarget.dataset.index];
    wx.navigateTo({
      url: '/pages/productDetail/productDetail?id=' + product.product_id,
    });
  },
  goToIndex: function() {
    wx.switchTab({
      url: '/pages/index/index',
    });
  },

  // 加载收藏的商品
  getCollect: function() {
    var that = this;
    var page = that.data.page;
    wx.request({
      url: app.globalData.web + 'v1/product/',
      data: {
        userId: app.globalData.userId,
        flag: 4,
        page: page
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if (res.statusCode == 200 && res.data.status == 1) {
          var list = that.data.list;
          if (page == 0) {
            list = [];
          }
          if (res.data.userProduct.length > 0) {
            list = list.concat(res.data.userProduct);
            page++;
          }
          that.setData({
            list: list,
            page: page,
            dataReady: true,
          });
        }

      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 长按删除
  deleteCollect: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '是否删除',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000',
      confirmText: '确认',
      confirmColor: '#9c3',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.web + 'v1/product/',
            data: {
              userId: app.globalData.userId,
              productId: that.data.list[index].product_id,
            },
            header: {},
            method: 'PUT',
            dataType: 'json',
            responseType: 'text',
            success: function(res) {
              if (res.data.status == 1 && res.statusCode == 200) {
                var list = that.data.list;
                list.splice(index, 1);
                that.setData({
                  list: list,
                });
              }
            },
            fail: function(res) {},
            complete: function(res) {},
          })
        }
      },

    })


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getCollect();
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
    this.getCollect();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})