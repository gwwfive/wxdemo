const util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    total: 0,
    flag: 0,
    tabs: [{
      tab: '未使用',
      count: 0
    }, {
      tab: '已使用',
      count: 0
    }, {
      tab: '已过期',
      count: 0
    }, ],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    sliderWidth: 0,
    coupons: [{
      list: [],
      page: 0,
      count: 0,
      dataReady: false
    }, {
      list: [],
      page: 0,
      count: 0,
      dataReady: false
    }, {
      list: [],
      page: 0,
      count: 0,
      dataReady: false
    }],
  },
  tabClick: function(e) {
    var that = this;
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    }, function() {
      if (that.data.coupons[e.currentTarget.id].list.length == 0) {
        that.getCoupons(e.currentTarget.id);
      }
    });
  },
  // 
  getCoupons: function(index) {
    var that = this;
    var coupons = that.data.coupons;
    var page = coupons[index].page;
    wx.request({
      url: app.globalData.web + 'v1/coupon/',
      data: {
        flag: index,
        userId: app.globalData.userId,
        page: page
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if (res.data.status == 1 && res.statusCode == 200) {
          var list = coupons[index].list;
          if (page == 0) {
            list = [];
          }
          if (res.data.coupons.length > 0) {
            list = list.concat(res.data.coupons);
            page++;
          }
          coupons[index].list = list;
          coupons[index].page = page;
          coupons[index].dataReady = true;
          that.setData({
            coupons: coupons,
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {
        // wx.stopPullDownRefresh();
        wx.hideLoading();
      },
    })
  },
  // 加载粉丝数量
  getCouponsCount(index, cb) {
    var that = this;
    var coupons = that.data.coupons;
    var tabs = that.data.tabs;
    wx.request({
      url: app.globalData.web + 'v1/coupon/',
      data: {
        flag: parseInt(index) + 3,
        userId: app.globalData.userId,
        // page: page
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if (res.data.status == 1 && res.statusCode == 200) {
          coupons[index].count = res.data.count;
          tabs[index].count = res.data.count;
          that.setData({
            coupons: coupons,
            tabs: tabs,
          }, function() {
            cb();
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  // 使用优惠券
  goToUse: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var p = {};
      if (that.data.flag == 1) {
        // 是从预支付过来的
        // 判断优惠券的类型
        var coupon = that.data.coupons[0].list[index];
        var pages = getCurrentPages();
        var prePage = pages[pages.length - 2];
        if (coupon.coupon__timeType == 0) {
          // 比较当前时间和优惠券的截止日期
          if (util.compareTime(new Date(), coupon.coupon__endTime)) {
            // 如果当前时间比结束时间大说明过期
            wx.showModal({
              content: '亲~优惠券已过期,选择其他的吧',
              showCancel: false,
              confirmText: '确认',
              confirmColor: '#9c3',
            });
            return false;
          } else {
            if (coupon.coupon__couponType == 0) {
              // 是满减券
              if (that.data.total >= coupon.coupon__fullAmount) {
                p = {
                  even: '满' + coupon.coupon__fullAmount + '减' + coupon.coupon__reduceAmount,
                  id: coupon.coupon_id,
                  couponReduce: coupon.coupon__reduceAmount
                }
                // 可以满减
                prePage.setData({
                  coupon: p,
                }, function () {
                  wx.navigateBack({
                    delta: 1,
                  });
                });
              } else {
                wx.showModal({
                  content: '亲~订单金额不够哦~',
                  showCancel: false,
                  confirmText: '确认',
                  confirmColor: '#9c3',
                });
                return false;
              }
            } else if (coupon.coupon__couponType == 1) {
              // 是立减
              if (that.data.total > coupon.coupon__onceAmount) {
                // 可以减
                p = {
                  even: '立满' + coupon.coupon__onceAmount,
                  id: coupon.coupon_id,
                  couponReduce: coupon.coupon__onceAmount
                }
                prePage.setData({
                  coupon: p,
                }, function () {
                  wx.navigateBack({
                    delta: 1,
                  });
                });
              } else {
                wx.showModal({
                  content: '亲~订单金额不够哦~',
                  showCancel: false,
                  confirmText: '确认',
                  confirmColor: '#9c3',
                });
                return false;
              }

            } else if (coupon.coupon__couponType == 2) {
              // 是折扣

              p = {
                even: coupon.coupon__discount + '折,最多减' + coupon.coupon__disCountUpLimit,
                id: coupon.coupon_id,
                couponReduce: (that.data.total * (coupon.coupon__discount / 10)).toFixed(2) < coupon.coupon__disCountUpLimit ? (that.data.total * ((10-coupon.coupon__discount) / 10)).toFixed(2) : coupon.coupon__disCountUpLimit
              }
              prePage.setData({
                coupon: p,
              },function(){
                wx.navigateBack({
                  delta: 1,
                });
              });
            }
          }

        } else if (coupon.coupon__timeType == 1 || coupon.coupon__timeTyp == 2) {
          var receiveTime = new Date(coupon.createTime.replace(/-/g, "\/")); // 领取日期
          var nowDate = new Date(); // 当前日期
          if (receiveTime.getFullYear() == nowDate.getFullYear() && receiveTime.getMonth() == nowDate.getMonth() && receiveTime.getDate() == nowDate.getDate()) {
            // 有效
            if (coupon.coupon__couponType == 0) {
              // 是满减券
              if (that.data.total >= coupon.coupon__fullAmount) {
                p = {
                  even: '满' + coupon.coupon__fullAmount + '减' + coupon.coupon__reduceAmount,
                  id: coupon.coupon_id,
                  couponReduce: coupon.coupon__reduceAmount
                }
                // 可以满减
                prePage.setData({
                  coupon: p,
                }, function() {
                  wx.navigateBack({
                    delta: 1,
                  });
                });
              } else {
                wx.showModal({
                  content: '亲~订单金额不够哦~',
                  showCancel: false,
                  confirmText: '确认',
                  confirmColor: '#9c3',
                });
                return false;
              }
            } else if (coupon.coupon__couponType == 1) {
              // 是立减
              if (that.data.total > coupon.coupon__onceAmount) {
                // 可以减
                p = {
                  even: '立满' + coupon.coupon__onceAmount,
                  id: coupon.coupon_id,
                  couponReduce: coupon.coupon__onceAmount
                }
                prePage.setData({
                  coupon: p,
                }, function() {
                  wx.navigateBack({
                    delta: 1,
                  });
                });
              } else {
                wx.showModal({
                  content: '亲~订单金额不够哦~',
                  showCancel: false,
                  confirmText: '确认',
                  confirmColor: '#9c3',
                });
                return false;
              }

            } else if (coupon.coupon__couponType == 2) {
              // 是折扣

              p = {
                even: coupon.coupon__discount + '折,最多减' + coupon.coupon__disCountUpLimit,
                id: coupon.coupon_id,
                couponReduce: (that.data.total * (coupon.coupon__discount / 10)).toFixed(2) < coupon.coupon__disCountUpLimit ? (that.data.total * ((10-coupon.coupon__discount )/ 10)).toFixed(2) : coupon.coupon__disCountUpLimit
              }
              prePage.setData({
                coupon: p,
              },function(){
                wx.navigateBack({
                  delta: 1,
                });
              });
            }
          } else {
            wx.showModal({
              content: '亲~优惠券已过期',
              showCancel: false,
              confirmText: '确认',
              confirmColor: '#9c3',
            });
            return;
          }
        }

      }

  },

  init: function() {
    var that = this;
    this.getCouponsCount(0, function() {
      that.getCouponsCount(1, function() {
        that.getCouponsCount(2, function() {});
      });
    });
    this.getCoupons(0);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        var sliderWidth = res.windowWidth / that.data.tabs.length - 10
        that.setData({
          sliderWidth: sliderWidth,
          sliderLeft: 5,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    this.setData({
      flag: options.flag || 0,
      total: options.total || 0,
    })
    this.init();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

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
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    this.getFans(this.data.activeIndex);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})