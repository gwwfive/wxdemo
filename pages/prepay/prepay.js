// pages/prepay/prepay.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: 0,
    order: {},
    address: null,
    total: 0,
    realTotal: 0,
    coupon: null,
    member: null
  },
  goToselectCoupon:function(){
    var that = this;
    wx.navigateTo({
      url: '/pages/coupon/coupon?flag=1&total=' + that.data.total,
      // success: function(res) {},
      // fail: function(res) {},
      // complete: function(res) {},
    })
  },
  // 调起支付
  prepay: function() {
    var that = this;
    const params = {
      orderId: this.data.orderId,
      userId: app.globalData.userId,
      address: that.data.address,
      coupon: that.data.coupon,
      discount: that.data.discount,
      realTotal: that.data.total - (that.data.coupon ? that.data.coupon.couponReduce:0) - (that.data.member?that.data.member.memberReduce:0),
      total: that.data.total,
      flag:2,
    };
    if(!params.address){
      wx.showModal({
        title: '',
        content: '亲，你还没有选择地址呢',
        showCancel: false,
        confirmText: '确认',
        confirmColor: '#9c3',
        // success: function(res) {},
        // fail: function(res) {},
        // complete: function(res) {},
      })
      return
    }
    wx.showLoading({
      title: '正在支付...',
      mask: true,
    })
    wx.request({
      url: app.globalData.web + 'v1/order/',
      data: params,
      header: {},
      method: 'PUT',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        wx.hideLoading();
        if (res.statusCode == 200 && res.data.status == 1) {
          // 调起微信支付
          wx.requestPayment({
            'timeStamp': res.data.res.timeStamp,
            'nonceStr': res.data.res.nonceStr,
            'package': res.data.res.package,
            'signType': res.data.res.signType,
            'paySign': res.data.res.paySign,
            'success': function(res) {
              if (res.errMsg == 'requestPayment:ok') {
                console.log('支付成功');
                setTimeout(function() {
                  wx.redirectTo({
                    url: '/pages/order/order?flag=2',
                  });
                }, 2000);
              }
            },
            'fail': function(res1) {
              if (res1.errMsg == 'requestPayment:fail cancel') {
                console.log('用户取消支付');
                that.cancelPay(res.data.res.out_trade_no,function() {
                  if(that.data.fromWhere=='order'){
                  wx.navigateBack({
                    delta:1,
                  });
                  }else{
                    wx.redirectTo({
                      url: '/pages/order/order?flag=1',
                    })
                  }
               
                });
              }
            },
            'complete': function(res) {}
          })
        } else if(res.data.status==2) {
         console.log('服务器支付失败');
         console.log(res.data.res.return_msg);
         wx.showToast({
           title: res.data.res.return_msg,
           icon: 'none',
           duration: 2000,
           mask: true,
         });
         setTimeout(function(){
           if(that.data.fromWhere=='order'){// 从订单列表过来
            wx.navigateBack({
              delta:1,
            });
           }else{
             wx.redirectTo({
               url: '/pages/order/order?flag=1',
             });
           }
         },2000);
        }
      },
      fail: function(res) {
        wx.hideLoading();
        wx.showToast({
          title: '提交订单失败',
          icon: 'none',
          duration: 1500,
          mask: true,
        })
      },
      complete: function(res) {},
    })
  },
  // 用户取消支付
  cancelPay:function(out_trade_no,callBack){
    var that = this;
    wx.request({
      url: app.globalData.web +'v1/order/',
      data: { out_trade_no: out_trade_no,status:0},
      header: {},
      method: 'PUT',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if(res.statusCode==200&&res.data.status==1){
          callBack();
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 加载会员信息
  getMember: function() {
    var that = this;
    wx.request({
      url: app.globalData.web + 'v1/member/',
      data: {
        userId: app.globalData.userId
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if (res.statusCode == 200 && res.data.status == 1) {
          var member = res.data.member;
          member.memberReduce = that.data.total*((10-member.discount)/10).toFixed(2);
          that.setData({
            member: member,
          },function(){

          })
        } else if (res.statusCode == 200 && res.data.status == 2) {
          //没有会员信息
          // that.set
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  // 选择地址
  selectAddress: function() {
    wx.navigateTo({
      url: '/pages/addressList/addressList',
    })
  },
  // 计算总价
  account: function() {
    var that = this;
    var orderSku = this.data.order.orderSku;
    var total = 0;
    for (var i = 0; i < orderSku.length; i++) {
      total = total + orderSku[i].skuPrice * orderSku[i].skuNum
    }
    // var realTotal = total - this.data.coupon || 0 - this.data.discount || 0
    this.setData({
      total: total,
      // realTotal: realTotal,
    },function(){
      that.getMember();
    });
  },
  // 加载地址
  getAddress: function() {
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
      success: function(res) {
        if (res.statusCode == 200 && res.data.status == 1) {
          that.setData({
            address: res.data.address,
          })
        } else if (res.statusCode == 200 && res.data.status == 2) {
          console.log('没有选择地址');
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 加载预订单数据
  getOrder: function() {
    var that = this;
    wx.request({
      url: app.globalData.web + 'v1/order/',
      data: {
        orderId: that.data.orderId
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if (res.statusCode == 200 && res.data.status == 1) {
          that.setData({
            order: res.data.order,
          }, function() {
            that.account();
          });
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },


  // 初始化
  init: function() {
    this.getOrder();
    // this.getMember();
    // this.getAddress();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    this.setData({
      orderId: options.orderId,
      fromWhere:options.from||0,
    }, function() {
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