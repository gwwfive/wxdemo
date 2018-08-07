// pages/cashCenter/cashCenter.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataReady:false,
    isAgent:false,
    score:0,
    agentCountMonth:{},
  },
  // 申请成为代理
  goToAgentApply:function(){
    wx.redirectTo({
      url: '/pages/agentApply/agentApply',
    });

  },
  // 申请提现
  goToApplyCash:function(){
    var that = this;
    wx.navigateTo({
      url: '/pages/applyCash/applyCash?residue=' + that.data.agent.residue+'&agentId='+that.data.agent.id,
    });
  },
  // 加载代理数据
  getAgent:function(){
    var that = this;
    wx.request({
      url: app.globalData.web+'v1/agent/',
      data: {userId:app.globalData.userId},
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if(res.data.status==1&&res.statusCode==200){
         that.setData({
           isAgent:res.data.isAgent,
           agent:res.data.agent||{},
           dataReady:true,
           score:res.data.score||0,
         },function(){
           if(that.data.agent){
             that.getAgentCountMonth(that.data.agent.id)
           }  
         })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })

  },
  // 加载代理月收益
  getAgentCountMonth:function(agentId){
    var that = this;
    wx.request({
      url: app.globalData.web+'v1/agent/',
      data: { agentId: agentId,flag:1},
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if(res.data.status==1&&res.statusCode==200){
          var agentCountMont = {
            total:0,
            firstFans:0,
            secondFans:0,
          };
          res.data.agentCount.forEach((item)=>{
            agentCountMont.total += item.total;
            agentCountMont.firstFans += item.firstFans;
            agentCountMont.secondFans += item.secondFans;
          });
          that.setData({
            agentCountMonth: agentCountMont,
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
    this.getAgent();
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