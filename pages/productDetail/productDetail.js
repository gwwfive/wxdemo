// pages/trip/trip.js
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isCollage: false, // 是否是拼团
    tabs: ["详情", "评价"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 5,
    sliderWidth: 0,
    product: {
      // 'carousel': ['/img/bg.jpg', ]
    },
    commentBar: [{
      'title': '好评',
      'page': 0,
      'list': [],
      dataReady:false,
    }, {
      'title': '中评',
      'page': 0,
      'list': [],
        dataReady: false,
    }, {
      'title': '差评',
      'page': 0,
      'list': [],
        dataReady: false,
    }, {
      'title': '全部',
      'page': 0,
      'list': [],
        dataReady: false,
    }],
    commentActiveIndex: 0,
    // 详情：介绍，规格，和售后
    productInfoIndex: 0,
    showMask: false,
    skuSelectIndex: 0, // sku选择索引
    address:null,
    // isCollect:false,
  },

  // 加载地址
  getAddress: function () {
    var that = this;
    wx.request({
      url: app.globalData.web + 'v1/address/',
      data: {
        userId: app.globalData.userId,
        isNormal: true
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if (res.statusCode == 200 && res.data.status == 1) {
          that.setData({
            address: res.data.address,
          })
        } else if (res.statusCode == 200 && res.data.status == 2) {
          console.log('没有选择地址');
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // 用户取消支付
  cancelPay: function (out_trade_no, callBack) {
    var that = this;
    wx.request({
      url: app.globalData.web + 'v1/order/',
      data: {
        out_trade_no: out_trade_no,
        status: 0
      },
      header: {},
      method: 'PUT',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if (res.statusCode == 200 && res.data.status == 1) {
          callBack();
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

// 立即购买
  payNow: function () {
    var that = this;
    if (!that.data.address) {
      wx.showModal({
        content: '亲~你还没有选择收货地址呢',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '去选择',
        confirmColor: '#9c3',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/addressList/addressList',
            })
          }
        },
        fail: function (res) { },
        complete: function (res) { },
      });
      return;
    }
    wx.showLoading({
      title: '正在提交',
      mask: true,
    });
    var address = that.data.address;
    wx.request({
      url: app.globalData.web + 'v1/order/',
      data: {
        skuId: that.data.product.sku[that.data.skuSelectIndex].id,
        userId: app.globalData.userId,
        province: address.province,
        city: address.city,
        area: address.area,
        address: address.address,
        name: address.name,
        phoneNum: address.phoneNum,
        flag: 1,
      },
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        wx.hideLoading();
        if (res.statusCode == 200 && res.data.status == 1) {
          // 调起微信支付
          wx.requestPayment({
            'timeStamp': res.data.res.timeStamp,
            'nonceStr': res.data.res.nonceStr,
            'package': res.data.res.package,
            'signType': res.data.res.signType,
            'paySign': res.data.res.paySign,
            'success': function (res) {
              if (res.errMsg == 'requestPayment:ok') {
                console.log('支付成功');
                setTimeout(function () {
                  wx.redirectTo({
                    url: '/pages/order/order?flag=2',
                  });
                }, 2000);
              }
            },
            'fail': function (res1) {
              if (res1.errMsg == 'requestPayment:fail cancel') {
                console.log('用户取消支付');
                that.cancelPay(res.data.res.out_trade_no, function () {
                  if (that.data.fromWhere == 'order') {
                    wx.navigateBack({
                      delta: 1,
                    });
                  } else {
                    wx.redirectTo({
                      url: '/pages/order/order?flag=1',
                    });
                  }
                });
              }
            },
            'complete': function (res) { }
          })
        } else if (res.statusCode == 200 && res.data.status == 2) {
          wx.showModal({
            content: res.data.message,
            showCancel: false,
            confirmText: '确认',
            confirmColor: '#9c3',
          });
        } else {
          wx.showModal({
            content: '购买失败',
            showCancel: false,
            confirmText: '确认',
            confirmColor: '#9c3',
          });
        }
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showModal({
          content: '购买失败',
          showCancel: false,
          confirmText: '确认',
          confirmColor: '#9c3',
        });
      },
      complete: function (res) { },
    })



  },

  // 评论栏切换
  commentBarClick: function(e) {
    var that = this;
    this.setData({
      commentActiveIndex: e.currentTarget.dataset.index,
    });
    // 加载评论
    if (that.data.commentBar[that.data.commentActiveIndex].list.length == 0) {
      that.getComment(that.data.commentActiveIndex);
    }
  },
  // 切换选项栏
  tabClick: function(e) {
    var that = this;
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    console.log(e);
    if(e.currentTarget.id==1){
      // 加载评论
      if (that.data.commentBar[that.data.commentActiveIndex].list.length==0){
        that.getComment(that.data.commentActiveIndex);
      }
    }
  },
  // 选择商品介绍 规格、售后
  chooseInfo: function(e) {
    this.setData({
      productInfoIndex: e.currentTarget.dataset.index,
    })
  },
  // 立即购买
  showPopup: function() {
    this.setData({
      showMask: true,
    })
  },
  // 隐藏弹窗
  hidePopup: function() {
    this.setData({
      showMask: false,
    })
  },
  // 选择sku
  selectSku: function(e) {
    this.setData({
      skuSelectIndex: e.currentTarget.dataset.index,
    })
  },
  // 添加到购物车
  addToCart: function() {
    var that = this;
    wx.showLoading({
      title: '正在添加',
      mask: true,
    });
    wx.request({
      url: app.globalData.web + 'v1/cart/',
      data: {
        userId: app.globalData.userId,
        skuId: that.data.product.sku[that.data.skuSelectIndex].id
      },
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        wx.hideLoading();
        if (res.statusCode == 200 && res.data.status == 1) {
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 1500,
            mask: true,
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000,
            mask: true,
          })
        }
      },
      fail: function(res) {
        wx.hideLoading();
        wx.showToast({
          title: '添加失败',
          icon: 'none',
          duration: 1000,
          mask: true,
        })
      },
      complete: function(res) {},
    })
  },
  // 加载产品信息
  getProduct: function() {
    var that = this
    wx.request({
      url: app.globalData.web + 'v1/product/',
      data: {
        id: that.data.id,
        flag: 2,
        userId: app.globalData.userId || 0,
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if (res.statusCode == 200 && res.data.status == 1) {
          var resProduct = res.data.product;
          var allComment = 0;
          var rate = 0;
          resProduct.sku.forEach((item)=>{
            allComment += item.commentNum;
            rate += item.rate;
          });
          allComment==0?allComment=1:'';
          rate == 0 ? rate=5:'';
          resProduct.rate = (rate/allComment).toFixed(1);
          resProduct.ratePercent = (100*(rate / allComment)/5).toFixed(2);

          that.setData({
            product: resProduct,
          }, function() {
            var product = that.data.product;
            product.introduce = WxParse.wxParse('introduce', 'html', that.data.product.introduce, that, 5);
            that.setData({
              product: product,
            },function(){
              wx.setNavigationBarTitle({
                title: that.data.product.productName,
              });
            })
          })
        }
      },

    })
  },
  // 收藏
  collect: function() {
    var that = this;
    var product = that.data.product;
    wx.request({
      url: app.globalData.web + 'v1/product/',
      data: {
        userId: app.globalData.userId,
        productId: product.id,
        // collectStatus: product.isCollect?"0":"1",
      },
      header: {},
      method: 'PUT',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if(res.data.status==1&&res.statusCode==200){
          product.isCollect = !product.isCollect;
          that.setData({
            product: product,
          });
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  // 加载评价
  getComment: function(index) {
    var that = this;
    var page = that.data.commentBar[index].page;
    wx.request({
      url: app.globalData.web +'v1/order/comment/',
      data: {
        page:page,
        flag:index,
        productId:that.data.product.id,
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if(res.data.status==1&&res.statusCode==200){
          var commentBar = that.data.commentBar
          var list = commentBar[index].list;
          if(page==0){
            list = [];
          }
          if(res.data.comments.length>0){
            list = list.concat(res.data.comments);
            page++;
          }
          commentBar[index].list = list;
          commentBar[index].page = page;
          commentBar[index].dataReady = true;
          that.setData({
            commentBar: commentBar,
          }); 
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })


  },
  upShareUserid(){
    var that = this;
    wx.request({
        url: app.globalData.web+'v1/user/',
        data: {userId:app.globalData.userId,
        shareId:that.data.shareId,flag:1},
        header: {},
        method: 'PUT',
        dataType: 'json',
        responseType: 'text',
        success: function(res) {
          if(res.statusCode==200&&res.data.status==1){
            console.log('更新分享状态成功');
          }else{
            console.log('更新分享状态成功');
          }
        },
        fail: function(res) {
          console.log('更新分享状态成功1');
        },
        complete: function(res) {},
      });
  },
  // 初始化
  init: function() {
    var that = this;
    if(!app.globalData.userId){
      setTimeout(function(){
        that.init();
      },2000)
      return false;
    }else{
      // userId 准备好了
      this.upShareUserid();// 更新分享者
      // 加载产品信息
      this.getProduct();
    }
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sliderWidth: res.windowWidth / that.data.tabs.length - 10,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    // var that = this;
    var id = 0;
    var shareId = 0;
    console.log(options);
    if (options.id) {
      // 直接跳转进入(或转发进入)
      id = options.id;
      shareId=options.shareId||0;
    } else if (options.scene) {
      // 通过分享二维码进入
      // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
      var scene = decodeURIComponent(options.scene);
      var scenes = scene.split('?');
      id = scene[0]||0;
      shareId = scenes[1]||0
    } else {
      console.log('扫码进入id为:' + id);
    }
    that.setData({
      id: id,
      shareId: shareId,
    }, function () {
      console.log(that.data.id);
      that.init();
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
    this.getAddress();
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
  // onPullDownRefresh: function () {

  // },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.getComment(this.data.commentActiveIndex);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
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
      path: '/pages/productDetail/productDetail?id=' + that.data.id +'&shareId='+app.globalData.userId,
      // imageUrl:'',
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
 
})