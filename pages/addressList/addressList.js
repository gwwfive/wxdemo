// pages/addressList/addressList.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
    page:0
  },
  // 编辑
  goToedit:function(e){
    wx.navigateTo({
      url: '/pages/addAddress/addAddress?id='+e.currentTarget.dataset.id,
    });
  },
  //  选择
  select:function(e){
    var that = this;
    var addressList = this.data.addressList;
    wx.request({
      url: app.globalData.web+'v1/address/',
      data: {addressId:addressList[e.currentTarget.dataset.index].id,
        isNormal: !addressList[e.currentTarget.dataset.index].isNormal,
        userId:app.globalData.userId},
      header: {},
      method: 'PUT',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if(res.statusCode==200&&res.data.status==1){
          if(!addressList[e.currentTarget.dataset.index].isNormal){
              for(var i=0;i<addressList.length;i++){
                addressList[i].isNormal = false;
              }
            addressList[e.currentTarget.dataset.index].isNormal = true;
          }else{
            addressList[e.currentTarget.dataset.index].isNormal = false;
          }
          that.setData({
            addressList:addressList,
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  // 加载地址列表
  getAddress:function(){
    var that = this;
    var page = this.data.page;
    wx.request({
      url: app.globalData.web+'v1/address/',
      data: { userId: app.globalData.userId, page: page},
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if(res.statusCode==200&&res.data.status==1){
          var addressList = that.data.addressList;
          if(page==0){
            addressList = [];
          }
          if(res.data.addressList.length>0){
            addressList = addressList.concat(res.data.addressList);
            page++;
          }
          that.setData({
            addressList: addressList,
            page:page,
          });
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

init:function(){
  this.setData({
    page:0,
  })
  this.getAddress();
},

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
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
    this.init();
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