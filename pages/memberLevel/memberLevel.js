// pages/memberLevel/memberLevel.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    width:0,
    score:10,
    name:'',
    members:[],
    start:0,
    end:0,
  },
  // 计算
  account:function(){
      var members = this.data.members;
      var score = this.data.score;
      for(var i=0;i<members.length;i++){
          if(score<members[i].score){
            this.setData({
              start:score,
              end:members[i].score,
              width: 196 * (score / members[i].score)
            });
            break;
          } else if (score >= members[i].score&&i==(members.length-1)){
            this.setData({
              start: members[i].score,
              end: members[i].score,
              width:196,
            });
            break;
          }
      }

  },
  // 加载会员信息

  getMember:function(){
    var that = this;
    wx.request({
      url: app.globalData.web+'v1/member/',
      data: '',
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if(res.statusCode==200&&res.data.status==1){
          that.setData({
            members:res.data.members,
          },function(){
            that.account();
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
      name:options.name
    });
    this.getMember();
  
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