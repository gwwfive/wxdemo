// import { $wuxPrompt } from '../../components/wux'
// const sliderWidth = 65;
//# 0未支付 1支付完成(待收货) 2收货完成(待评价) 3(评价完成-订单完成) 4(取消支付或者支付超时) 5(未点签收时)(申请退款中) 6(退款完成)
const app = getApp();
Page({
  data: {
    tabs: ['全部', '待付款', '待收货', '待评价', '已完成'],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    sliderWidth: 65,
    orders: [{
      'list': [],
      page: 0,
      'dataReady': false,
    }, {
      'list': [],
      page: 0,
      'dataReady': false,
    }, {
      'list': [],
      page: 0,
      'dataReady': false,
    }, {
      'list': [],
      page: 0,
      'dataReady': false,
    }, {
      'list': [],
      page: 0,
      'dataReady': false,
    }],
  },

  // 计算待付款剩余时间
  countResiduc: function() {
    var that = this;
    var list = that.data.orders[1].list;
    list.forEach((item) => {
      console.log('计算时间');
      var dateBegin = new Date(item.createTime.replace(/-/g, "/")); //replace方法将-转为/
      var dateEnd = new Date();
      var dateDiff = (86400000 - (dateEnd.getTime() - dateBegin.getTime())) //时间差的毫秒数
      if (dateDiff < 0) {
        console.log('小于0')
        item.payResidualHour = 0;
        item.payResidualMin = 0;
      } else {
        var hours = Math.floor(dateDiff / (3600 * 1000)) //计算出小时数
        //计算相差分钟数
        var leave1 = dateDiff % (3600 * 1000) //计算小时数后剩余的毫秒数
        var minutes = Math.floor(leave1 / (60 * 1000)) //计算相差分钟数
        item.payResidualHour = hours;
        item.payResidualMin = minutes;
      }

    });
    var orders = that.data.orders;
    orders[1].list = list;
    that.setData({
      orders: orders,
    });
    setTimeout(function() {
      that.countResiduc;
    }, 60000); // 每分钟更新
  },

  // 确认收货
  receiveGoods: function(e) {
    var that = this;
    var flag = e.currentTarget.dataset.flag;
    var index = e.currentTarget.dataset.index;
    var orderId = e.currentTarget.dataset.orderid;
    wx.request({
      url: app.globalData.web + 'v1/order/',
      data: {
        orderId: orderId,
        flag: 3,
      },
      header: {},
      method: 'PUT',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if (res.statusCode == 200 && res.data.status == 1) {
          // 确认收货
          wx.showToast({
            title: '确认收货成功',
            icon: 'success',
            duration: 1500,
            mask: true,
          });
          var orders = that.data.orders;
          var orderList = orders[flag].list;
          orderList.splice(index, 1);
          orders[flag].list = orderList;
          that.setData({
            orders: orders,
          });
        } else {
          wx.showModal({
            content: '确认收货失败',
            showCancel: false,
            confirmText: '确认',
            confirmColor: '#9c3',
          });
        }
      },
      fail: function(res) {
        wx.showModal({
          content: '确认收货失败',
          showCancel: false,
          confirmText: '确认',
          confirmColor: '#9c3',
        });
      },
      complete: function(res) {},
    });
  },


  // 评论
  goToComment: function(e) {
    wx.navigateTo({
      url: '/pages/orderRate/orderRate?flag=' + e.currentTarget.dataset.flag + '&index=' + e.currentTarget.dataset.index,
    });
  },
  // 再次购买
  buyAgain: function(e) {
    var that = this;
    wx.request({
      url: app.globalData.web + 'v1/order/',
      data: {
        orderId: e.currentTarget.dataset.id,
        userId: app.globalData.userId
      },
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if (res.statusCode == 200 && res.data.status == 1) {
          if (res.data.order) {
            wx.navigateTo({
              url: '/pages/prepay/prepay?orderId=' + res.data.order + '&from=order',
            });
          }
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 用户取消支付
  cancelPay: function(out_trade_no, status, callBack) {
    var that = this;
    wx.request({
      url: app.globalData.web + 'v1/order/',
      data: {
        out_trade_no: out_trade_no,
        status: status
      },
      header: {},
      method: 'PUT',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        wx.hideLoading()
        if (res.statusCode == 200 && res.data.status == 1) {
          callBack();
        } else {
          wx.showToast({
            title: '取消失败',
            icon: 'none',
            duration: 1500,
          });
        }
      },
      fail: function(res) {
        wx.hideLoading();
        wx.showToast({
          title: '取消失败',
          icon: 'none',
          duration: 1500,
        });
      },
      complete: function(res) {},
    })
  },
  // 取消订单
  cancelOrder: function(e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否取消订单？',
      showCancel: true,
      cancelText: '否',
      cancelColor: '#000000',
      confirmText: '是',
      confirmColor: '#9c3',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在取消',
            mask: true,
          })
          that.cancelPay(e.currentTarget.dataset.outtradeno, 5, function() {
            //  刷新列表
            var orders = that.data.orders;
            var orderList = orders[e.currentTarget.dataset.flag].list;
            orderList[e.currentTarget.dataset.index].status = 5;
            orderList[e.currentTarget.dataset.index].statusDesc = '取消订单';
            orders[e.currentTarget.dataset.flag].list = orderList;
            that.setData({
              orders: orders,
            });
            wx.showToast({
              title: '取消成功',
              icon: 'success',
              duration: 1000,
              mask: true,
              success: function(res) {},
              fail: function(res) {},
              complete: function(res) {},
            })
          });
        }
      },
    })
  },
  // 立即支付
  goToPay: function(e) {
    var that = this;
    wx.request({
      url: app.globalData.web + 'v1/order/',
      data: {
        orderId: e.currentTarget.dataset.orderid,
        userId: app.globalData.userId,
        flag: 1,
      },
      header: {},
      method: 'PUT',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        // if (res.statusCode == 200 && res.data.status == 1) {
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
                //删除这一条记录
                var orders = that.data.orders;
                var orderList = orders[e.currentTarget.dataset.flag].list;
                orderList.splice(e.currentTarget.dataset.index, 1);
                orders[e.currentTarget.dataset.flag].list = orderList;
                that.setData({
                  orders: orders,
                });
              }
            },
            'fail': function(res1) {
              if (res1.errMsg == 'requestPayment:fail cancel') {
                console.log('用户取消支付');
                that.cancelPay(res.data.res.out_trade_no, 0, function() {
                  wx.showToast({
                    title: '已取消支付',
                    icon: 'none',
                    duration: 1500,
                    mask: true,
                  });
                });
              }
            },
            'complete': function(res) {}
          })
        } else if (res.data.status == 2) {
          console.log('服务器支付失败');
          console.log(res.data.res.return_msg);
          wx.showToast({
            title: res.data.res.return_msg,
            icon: 'none',
            duration: 2000,
            mask: true,
          });
        }
        // }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 加载相关订单
  getOrder: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true,
    })
    var that = this;
    var orders = that.data.orders;
    var page = orders[that.data.activeIndex].page;
    wx.request({
      url: app.globalData.web + 'v1/order/',
      data: {
        flag: that.data.activeIndex,
        userId: app.globalData.userId,
        page: page,
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        wx.hideLoading();
        if (res.statusCode == 200 && res.data.status == 1) {
          var orderList = orders[that.data.activeIndex].list;
          if (page == 0) {
            orderList = []
          }
          if (res.data.orders.length > 0) {
            var resOrders = res.data.orders
            resOrders.forEach((item) => {
              // console.log(item);
              if (item.status == 0) {
                item.statusDesc = '未付款';
              } else if (item.status == 1) {
                if(item.orderType==1){
                  item.statusDesc = '拼团支付成功';
                }else{
                  item.statusDesc = '未发货';
                }
              } else if (item.status == 2) {
                item.statusDesc = '未收货';
              } else if (item.status == 3) {
                item.statusDesc = '未评价';
              } else if (item.status == 4) {
                item.statusDesc = '已完成';
              } else if (item.status == 5) {
                item.statusDesc = '取消订单';
              } else if (item.status == 6) {
                item.statusDesc = '申请退款';
              } else if (item.status == 7) {
                item.statusDesc = '退款完成';
              } else if (item.status == 8) {
                item.statusDesc = '拼团成功-等待发货';
              } else if (item.status == 10) {
                item.statusDesc = '处理中';
              }
            });
            orderList = orderList.concat(res.data.orders);
            page++;
          }
          orders[that.data.activeIndex].list = orderList;
          orders[that.data.activeIndex].page = page;
          orders[that.data.activeIndex].dataReady = true;
          that.setData({
            orders: orders,
          }, function() {
            that.countResiduc();
          });
        }
      },
      fail: function(res) {
        wx.hideLoading();
      },
      complete: function(res) {
        wx.stopPullDownRefresh();
      },
    })
  },
  // 初始化
  init: function() {
    this.getOrder();
  },
  onLoad(options) {
    var that = this;
    this.getSystemInfo();
    var sliderOffset = 0;

    this.setData({
      activeIndex: options.flag || 0,
      sliderOffset: ((that.data.sliderWidth + 10) || 75) * (options.flag || 0),
    }, function() {
      that.init();

    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.getOrder();
  },
  // 下拉刷新
  onPullDownRefresh: function() {
    var orders = this.data.orders;
    var that = this;
    orders[that.data.activeIndex].page = 0;
    orders[that.data.activeIndex].dataReady = false;
    that.setData({
      orders: orders,
    }, function() {
      that.getOrder();
    });

  },
  getSystemInfo() {
    const that = this
    wx.getSystemInfo({
      success(res) {
        var sliderWidth = res.windowWidth / that.data.tabs.length - 10;
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderWidth: sliderWidth,
        })
      }
    })
  },
  tabClick(e) {
    var that = this;
    console.log(e);
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
    }, function() {
      var orders = that.data.orders;
      if (orders[e.currentTarget.id].list.length == 0) {
        that.getOrder();
      }
    })
  },
})