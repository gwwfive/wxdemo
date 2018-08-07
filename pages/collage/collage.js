// pages/collage/collage.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collageList:[],
    page:0,
    dataReady:false,
  },
  // 加载拼团
  getCollage:function(){
    var that = this;
    var page = this.data.page;
    wx.request({
      url: app.globalData.web+'v1/collage/product/',
      data: {page:page},
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if(res.statusCode==200&&res.data.status==1){
          var collageList = that.data.collageList;
          if(page==0){
            collageList=[];
          }
          if(res.data.collage.length>0){
            collageList = collageList.concat(res.data.collage);
            page++;
          }
          that.setData({
            page:page,
            collageList:collageList,
            dataReady:true
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

// 初始化
init:function(){
  this.getCollage()
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.init();
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