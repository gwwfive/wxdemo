// pages/recieveCoupon/recieveCoupon.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    page:0,
    dataReady:false,
  },
  // 加载可用优惠券
  getCoupon:function(){
    var that = this;
    
    var page = that.data.page;
    wx.request({
      url: app.globalData.web+'v1/coupon/',
      data: {userId:app.globalData.userId,flag:10,page:page},
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if(res.statusCode==200&&res.data.status==1){
          var list = that.data.list;
          if(page==0){
            list = [];
          }
          if(res.data.coupons.length>0){
            list = list.concat(res.data.coupons);
            page++;
          }
          that.setData({
            list:list,
            page:page,
            dataReady:true,
          });
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 领取优惠券
  goTorecieve:function(e){
    var that = this;
      var index = e.currentTarget.dataset.index;
      var list = that.data.list;
      wx.request({
        url: app.globalData.web+'v1/coupon/',
        data: {userId:app.globalData.userId,couponId:list[index].id},
        header: {},
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function(res) {
          if(res.statusCode==200&&res.data.status==1){
            list[index].hasReceive = true;
            that.setData({
              list:list,
            });
            wx.showToast({
              title: '已领取',
              icon: 'success',
              duration: 1500,
              mask: true,
            });
          } else if (res.statusCode == 200 && res.data.status == 2){
            wx.showModal({
              title: '提示',
              content: '余量不足~下次早点哦~',
              showCancel: false,
              confirmText: '确认',
              confirmColor: '#9c3',
            });
          }
        },
        fail: function(res) {},
        complete: function(res) {},
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCoupon();
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
   this.getCoupon();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})