// pages/trip/trip.js
var WxParse = require('../../wxParse/wxParse.js');
// var util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // isCollage:false,// 是否是拼团
    tabs: ["详情"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 5,
    sliderWidth: 0,
    residueDay: 0,
    residueHour: 0,
    residueMin: 0,
    residueSec: 0,
    product: {},
    productInfoIndex: 0,
    showMask: false,
    showCollageMask: false,
    intervalId: null,
    address: null,
    collager: {
      list: [],
      dataReady: false
    },
  },
  // 参团
  attendCollage: function(e) {
    var that = this;
    if(!that.data.address){
      wx.showModal({
        content: '亲~你还没有选择收货地址呢',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '去选择',
        confirmColor: '#9c3',
        success: function(res) {
          if(res.confirm){
            wx.navigateTo({
              url: '/pages/addressList/addressList',
            })
          }
        },
        fail: function(res) {},
        complete: function(res) {},
      });
      return;
    }
    wx.showModal({
      content: '是否参加他的团',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '参加',
      confirmColor: '#9c3',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在提交',
            mask: true,
          });
          var address = that.data.address;
          wx.request({
            url: app.globalData.web + 'v1/collage/order/',
            data: {
              collageSkuId: e.currentTarget.dataset.collageskuid,
              collagerId: e.currentTarget.dataset.collagerid,
              userId: app.globalData.userId,
              province:address.province,
              city:address.city,
              area:address.area,
              address:address.address,
              name:address.name,
              phoneNum:address.phoneNum,
              flag:1,
            },
            header: {},
            method: 'POST',
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
                  content: '参团失败',
                  showCancel: false,
                  confirmText: '确认',
                  confirmColor: '#9c3',
                });
              }
            },
            fail: function(res) {
              wx.hideLoading();
              wx.showModal({
                content: '参团失败',
                showCancel: false,
                confirmText: '确认',
                confirmColor: '#9c3',
              });
            },
            complete: function(res) {},
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 加载正在等待的团长
  getCollager: function() {
    var that = this;
    // var page
    wx.request({
      url: app.globalData.web + 'v1/collage/product/',
      data: {
        collageSkuId: that.data.product.collageSku.id,
        // page:
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if (res.data.status == 1 && res.statusCode == 200) {
          var collager = that.data.collager;
          collager.list = res.data.collageUser;
          collager.dataReady = true
          that.setData({
            collager: collager,
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
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

  // 用户取消支付
  cancelPay: function(out_trade_no, callBack) {
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
      success: function(res) {
        if (res.statusCode == 200 && res.data.status == 1) {
          callBack();
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  // 立即开团
  goToPayForStartCollage: function() {
    // 判断开团数量石否足够
    var that = this;
    if (!that.data.address) {
      wx.showModal({
        title: '提示',
        content: '还没有添加收货地址哦亲',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '去添加',
        confirmColor: '#9c3',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/addressList/addressList',
              success: function(res) {},
              fail: function(res) {},
              complete: function(res) {},
            })
          } else {

          }
        },
        fail: function(res) {},
        complete: function(res) {},
      });
      return;
    }
    if (that.data.product.collageSku.residualNum > 0) {
      // 判断时间是否到期
      if (new Date() > (new Date(that.data.product.collage.endTime.replace(/-/g, "\/")))) {
        // 已经过期了
        wx.showModal({
          content: '亲~拼团期限已到，下次早点',
          showCancel: false,
          confirmText: '确认',
          confirmColor: '#9c3',
        });
        return false;
      }
      var address = that.data.address;
      wx.showLoading({
        title: '正在提交',
        mask: true,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      });
      // 可以发起拼团
      wx.request({
        url: app.globalData.web + 'v1/collage/order/',
        data: {
          userId: app.globalData.userId,
          collageSkuId: that.data.product.collageSku.id,
          province: address.province,
          city: address.city,
          area: address.area,
          address: address.address,
          name: address.name,
          phoneNum: address.phoneNum,
        },
        header: {},
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function(res) {
          wx.hideLoading();
          if (res.statusCode == 200 && res.data.status == 1) {
            // wx.showToast({
            //   title: '发团成功',
            //   icon: 'success',
            //   duration: 1500,
            //   mask: true,
            // });
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
                  that.cancelPay(res.data.res.out_trade_no, function() {
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
              'complete': function(res) {}
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
              content: '参团失败',
              showCancel: false,
              confirmText: '确认',
              confirmColor: '#9c3',
            });
          }
        },
        fail: function(res) {
          wx.hideLoading();
        },
        complete: function(res) {},
      })
    } else {
      wx.showModal({
        content: '亲~拼团数量不足哦，下次早点',
        showCancel: false,
        confirmText: '确认',
        confirmColor: '#9c3',
      });
      return false;
    }


  },

  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
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
  //拼团
  // 立即购买
  showCollagePopup: function() {
    this.setData({
      showCollageMask: true,
    })
  },
  // 隐藏弹窗
  hideCollagePopup: function() {
    this.setData({
      showCollageMask: false,
    })
  },
  // 计算时间差
  residueTime: function(d1) {
    console.log('计算时间');
    var dateBegin = new Date(d1.replace(/-/g, "/")); //replace方法将-转为/
    var dateEnd = new Date();
    var dateDiff = dateBegin.getTime() - dateEnd.getTime() //时间差的毫秒数
    if (dateDiff < 0) {
      console.log('小于0')
      this.setData({
        residueDay: 0,
        residueHour: 0,
        residueMin: 0,
        residueSec: 0,
      })
      return;
    }
    var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
    var leave1 = dateDiff % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000)) //计算出小时数
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000)) //计算相差分钟数
    //计算相差秒数
    var leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
    var seconds = Math.round(leave3 / 1000)
    this.setData({
      residueDay: dayDiff,
      residueHour: hours,
      residueMin: minutes,
      residueSec: seconds,
    })
  },
  // 加载产品信息
  getProduct: function() {
    var that = this
    wx.request({
      url: app.globalData.web + 'v1/collage/product/',
      data: {
        id: that.data.id,
        // flag: 2
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if (res.statusCode == 200 && res.data.status == 1) {
          that.setData({
            product: res.data.product,
          }, function() {
            var product = that.data.product;
            product.introduce = WxParse.wxParse('introduce', 'html', that.data.product.introduce, that, 5)
            that.setData({
              product: product,
            }, function() {
              wx.setNavigationBarTitle({
                title: that.data.product.productName,
                success: function(res) {},
                fail: function(res) {},
                complete: function(res) {},
              })
              var id = setInterval(function() {
                that.residueTime(that.data.product.collage.endTime);
              }, 1000);
              that.setData({
                intervalId: id
              });
              that.getCollager();
            })
          })
        }
      },

    })
  },
  // 加入购物车
  // 添加到购物车
  addToCart: function () {
    var that = this;
    wx.showLoading({
      title: '正在添加',
      mask: true,
    });
    wx.request({
      url: app.globalData.web + 'v1/cart/',
      data: {
        userId: app.globalData.userId,
        skuId: that.data.product.sku.id
      },
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        wx.hideLoading();
        if (res.statusCode == 200 && res.data.status == 1) {
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 1500,
            mask: true,
          });
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000,
            mask: true,
          });
        }
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: '添加失败',
          icon: 'none',
          duration: 1000,
          mask: true,
        })
      },
      complete: function (res) { },
    })
  },

  // 单买立即支付
  payNow:function(){
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
        skuId: that.data.product.sku.id,
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
  // 加载评价
  // getComment:function(){

  upShareUserid() {
    var that = this;
    wx.request({
      url: app.globalData.web + 'v1/user/',
      data: {
        userId: app.globalData.userId,
        shareId: that.data.shareId, flag: 1
      },
      header: {},
      method: 'PUT',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if (res.statusCode == 200 && res.data.status == 1) {
          console.log('更新分享状态成功');
        } else {
          console.log('更新分享状态成功');
        }
      },
      fail: function (res) {
        console.log('更新分享状态成功1');
      },
      complete: function (res) { },
    });
  },
  // 初始化
  init: function () {
    var that = this;
    if (!app.globalData.userId) {
      setTimeout(function () {
        that.init();
      }, 2000)
      return false;
    } else {
      // userId 准备好了
      this.upShareUserid();// 更新分享者
      // 加载产品信息
      this.getProduct();
    }

  },
  // },  
  // 初始化
  // init: function() {
  //   // 加载产品信息
  //   this.getProduct();

  // },
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

    var id = 0;
    var shareId = 0;
    console.log(options);
    if (options.id) {
      // 直接跳转进入(或转发进入)
      id = options.id;
      shareId = options.shareId || 0;
    } else if (options.scene) {
      // 通过分享二维码进入
      // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
      var scene = decodeURIComponent(options.scene);
      var scenes = scene.split('?');
      id = scene[0] || 0;
      shareId = scenes[1] || 0
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

    // var that = this;
    // var id = 0;
    // console.log(options);
    // if (options.id) {
    //   // 直接跳转进入(或转发进入)
    //   id = options.id
    // } else if (options.scene) {
    //   // 通过分享二维码进入
    //   // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    //   id = decodeURIComponent(options.scene)

    // } else {
    //   console.log('扫码进入id为:' + id)
    // }
    // console.log('id:' + id)
    // this.setData({
    //   id: id,
    //   flag: options.flag || 0,
    //   userId: app.getUserId(),
    //   userInfo: app.globalData.userInfo,
    // });
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
    // console.log('onshow了')
    // this.setData({
    //   commentList: [],
    //   commentPage: 0
    // });
    // this.gettrip();
    // this.getAttendUser(0);
    // this.getComment();
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
    clearInterval(this.data.intervalId);
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
    // wx.showLoading({
    //   title: '正在加载',
    //   mask: true,
    //   success: function(res) {},
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })
    // console.log('当前的activeIndex:' + this.data.activeIndex)
    // if (this.data.activeIndex == 0) {
    //   console.log('加载参加的用户');
    //   this.getAttendUser();
    // } else {
    //   console.log('加载评论')
    //   this.getComment();
    // }


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
      path: '/pages/collageDetail/collageDetail?id=' + that.data.id + '&shareId=' + app.globalData.userId,
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