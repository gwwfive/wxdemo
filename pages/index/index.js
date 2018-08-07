//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    carousels:[],
    recommentList:[],
    shop:{},
    signupimg:'/img/signup.png',
    imgsrc: 'http://trip-1253553328.file.myqcloud.com/edu3567457dfgdfshdfgj.jpg',
    shareId:0// 分享者id
    // url: "/pages/productDetail/productDetail",
  },
  // 打开地图
  openMap:function(){
    var that = this;
    wx.openLocation({
      latitude: parseFloat(that.data.shop.lat), 
      longitude: parseFloat(that.data.shop.lng),
      name:that.data.shop.shopName,
      address:that.data.shop.shopAddress,
      scale: 28
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // 加载轮播图
  carousel:function(){
    var that = this;
    wx.request({
      url: app.globalData.web+'v1/carousel/',
      data: '',
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if(res.statusCode==200&&res.data.status==1){
          that.setData({
            carousels: res.data.carousels
          })
        }
      },
    })
  },
  // 加载商店信息
  shopInfo:function(){
    var that = this;
    wx.request({
      url: app.globalData.web + 'v1/shop/',
      data: '',
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if(res.statusCode==200&&res.data.status==1){
          that.setData({
            shop:res.data.shop,
          })
        }
      },
      
    })
  },
  //加载推荐购买--根据销售数量来排序
  getRecommentProducts:function(){
    var that = this;
    wx.request({
      url: app.globalData.web+'v1/product/',
      data: {flag:1},
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if(res.statusCode==200&&res.data.status==1){
          that.setData({
            recommentList:res.data.products,
          })
        }
      },
     
    })
  },
// 加载团购活动--
getCollage:function(){

},
// 加载秒杀




  // 上传分享者信息
  upShareUserid:function(){
    var that = this;
    if (!app.globalData.userId) {
      console.log('userId还没有准备好');
      // userId 还没有准备好
      setTimeout(function () {
        that.upShareUserid();
      }, 1500);
      return;
    }else{
      wx.request({
        url: app.globalData.web+'v1/user/',
        data: {userId:app.globalData.userId,
        shareId:that.data.shareId,flag:1
        },
        header: {},
        method: 'PUT',
        dataType: 'json',
        responseType: 'text',
        success: function(res) {
          if(res.statusCode==200&&res.data.status==1){
            console.log('更新分享信息成功');
          }else{
            console.log('更新分享信息失败');
          }
        },
        fail: function(res) {
          console.log('更新分享信息失败1');
        },
        complete: function(res) {},
      })
    }
  },
  // 初始化
  init:function(){
    this.carousel();
    this.shopInfo();
    this.getRecommentProducts();
    this.upShareUserid();
  },
  onLoad: function (options) {
   //
   var shareId = 0;
    // 获取用户进入的分享路径
    if (options.shareId) {
      // 通过转发进入
      console.log('通过转发进入')
      console.log('shareId:' + options.shareId)
      // this.upShareUserid(options.shareId)
      shareId = options.shareId||0;
    } else if (options.scene) {
      // 通过分享二维码进入
      // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
      var scene = decodeURIComponent(options.scene)
      console.log('通过扫码进入scene', scene)
      //console.log('通过转发进入', scene.shareId)
      // this.upShareUserid(scene)
      shareId = scene||0;
    } else {
      // 通过官方二维码进入
      // this.upShareUserid(0)  // 修改用户shareState
      shareId = 0
    }
    this.setData({
      shareId:shareId,
    })
    this.init();
    return;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onPullDownRefresh(){
    this.init();
    setTimeout(function(){
      wx.stopPullDownRefresh();
    },3000)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    console.log("分享：", res)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    // 执行了分享
    console.log('分享')
    var that = this
    return {
      title: that.data.product.productName,
      path: '/pages/productDetail/productDetail?id=' + that.data.id + '&shareId=' + app.globalData.userId,
      // imageUrl:'',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})
