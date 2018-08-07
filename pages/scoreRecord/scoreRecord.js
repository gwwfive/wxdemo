// pages/scoreRecord/scoreRecord.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    score:0,
    page:0,
    list:[],
  },

getRecord:function(){
  var that = this;
  var page = that.data.page;
  wx.request({
    url: app.globalData.web +'v1/sign/',
    data: {userId:app.globalData.userId,page:page},
    header: {},
    method: 'GET',
    dataType: 'json',
    responseType: 'text',
    success: function(res) {
      if(res.statusCode==200&&res.data.status==1){
        var list = that.data.list;
        if(page==0){
          list = []
        }
        if(res.data.list.length>0){
          list = list.concat(res.data.list);
          page++;
        }
        that.setData({
          list:list,
          page:page,
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
    this.setData({
      score:options.score,
    });
    this.getRecord();
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
     this.getRecord();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})