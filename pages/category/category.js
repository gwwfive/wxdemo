// pages/classify/classify.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0, //对应样式变化
    scrollTop: 0, //用作跳转后右侧视图回到顶部
    categoryList: [], //左侧导航栏内容
    page:0,
    dataReady:false,
    // currentCategoryId: "", //后台查询需要的字段
    productList: [], //右侧内容
  },
  //  加载分类
  getcategory: function() {
    var that = this;
    wx.request({
      url: app.globalData.web + 'v1/category/',
      data: '',
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if (res.statusCode == 200 && res.data.status == 1) {
          that.setData({
            categoryList: res.data.category,
          },function(){
            that.getProduct();
          })
        }
      },
    })
  },
  // 初始化
  init: function() {
    this.getcategory();
  },
  onLoad: function(options) {
    var that = this;
    this.init();

  },
  // 加载数据
  getProduct: function() {
    var that = this;
    var page = that.data.page
    wx.request({
      url: app.globalData.web + 'v1/product/',
      data: {
        categoryId: that.data.categoryList[that.data.currentTab].id,
        page: page,
        flag:3,
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
          if(res.statusCode==200&&res.data.status==1){
            var productList = that.data.productList;
            if (page==0){
              productList = []
            }
            if(res.data.products.length>0){
              productList = productList.concat(res.data.products);
              page++;
            }
            that.setData({
              productList: productList,
              dataReady:true,
            })
          }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  navbarTap: function(e) {
    var that = this;
    console.log(e);
    this.setData({
      currentTab: e.currentTarget.id, //按钮CSS变化
      currentCategoryId: e.currentTarget.dataset.screenid,
      scrollTop: 0, //切换导航后，控制右侧滚动视图回到顶部
    })
    //刷新右侧内容的数据
    that.setData({
      page:0,
      dataReady:false,
    },function(){
      that.getProduct();
    });
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})