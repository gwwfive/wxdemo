// pages/memberCenter/memberCenter.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSign:false,
    member:{},
    score:'',
  },

  // 加载会员信息
  getMember:function(){
    var that = this;
    wx.request({
      url: app.globalData.web+'v1/member/',
      data: {userId:app.globalData.userId},
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if(res.statusCode==200&&res.data.status==1){
            that.setData({
              member:res.data.member,
              score:res.data.score,
              isSign: res.data.isSign,
            });
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  // 签到
  signDay:function(){
    var that = this;
      wx.request({
        url: app.globalData.web+'v1/sign/',
        data: {userId:app.globalData.userId},
        header: {},
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function(res) {
          if(res.statusCode==200&&res.data.status==1){
            that.setData({
              isSign:true,
            });
            wx.showToast({
              title: '签到成功',
              icon: 'success',
              duration: 1000,
              mask: true,
            });
            setTimeout(function(){
              wx.showToast({
                title: '积分+5',
                icon: 'none',
                duration: 1500,
                mask: true,
              });
            },1000);
          }
        },
        fail: function(res) {},
        complete: function(res) {},
      })
  },
  //去购物
  goToBuy:function(){
    wx.switchTab({
      url: '/pages/index/index',
    });
  },
  // 去评价
  goToComment:function(){
    wx.redirectTo({
      url: '/pages/order/order?flag=3',
    })
  },

  //  查看积分详情
  goToScoreRecord:function(){
    var that = this;
    wx.navigateTo({
      url: '/pages/scoreRecord/scoreRecord?score='+that.data.score,
    });
  },
  // 查看会员等级
  goToMemberLevel:function(){
    var that = this;
    wx.navigateTo({
      url: '/pages/memberLevel/memberLevel?score=' + that.data.score + '&name=' + that.data.member.memberName,
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMember()
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