// pages/applyCash/applyCash.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCash: !0,
    isWxCode: !0,
    isName: !0,
    isPhoneNum: !0,
    residue: 0,
    cash: 0,
    wxCode: null,
    name: null,
    phoneNum: null,
  },
  isNull: function(e) {
    return e == undefined || e == "undefined" || e == null || e == ""
  },
  alert: function(e) {
    wx.showModal({
      title: '提示',
      content: e,
      showCancel: false,
      confirmColor: '#9c3',
      confirmText: '确认',
    });
  },
  // 输入金额
  inputCash: function(e) {
    this.setData({
      cash: e.detail.value
    }), this.isNull(e.detail.value) ? this.setData({
      isCash: !1
    }) : this.setData({
      isCash: !0
    });
    this.data.cash > this.data.residue ? this.setData({
      isCash: !1
    }) : this.data.cash >= 10.0 ? this.setData({
      isCash: !0
    }) : this.setData({
      isCash: !1
    });
  },
  //输入微信号
  inputWxCode: function(e) {
    this.setData({
      wxCode: e.detail.value,
    }), this.isNull(e.detail.value) ? this.setData({
      isWxCode: !1,
    }) : this.setData({
      isWxCode: !0,
    });
  },
  // 输入姓名
  inputName: function(e) {
    this.setData({
      name: e.detail.value
    }), this.isNull(e.detail.value) ? this.setData({
      isName: !1
    }) : this.setData({
      isName: !0
    })
  },
  // 输入手机号
  inputPhoneNum: function(e) {
    this.setData({
      phoneNum: e.detail.value
    }), this.isNull(e.detail.value) ? this.setData({
      isPhoneNum: !1
    }) : /^1[34578]\d{9}$/.test(e.detail.value) ? this.setData({
      isPhoneNum: !0
    }) : this.setData({
      isPhoneNum: !1
    })
  },
  // 提交数据
  submit: function() {
    var that = this;
    const params = {
      userId: app.globalData.userId,
      agentId: that.data.agentId,
      cash: that.data.cash,
      wxCode: that.data.wxCode,
      name: that.data.name,
      phoneNum: that.data.phoneNum,
    };
    if (that.data.isCash && that.data.isWxCode && that.data.isName && that.data.isPhoneNum) {
      wx.request({
        url: app.globalData.web + 'v1/agent/',
        data: params,
        header: {},
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function(res) {
          if (res.statusCode == 200 && res.data.status == 1) {
            // 提示成功
            wx.showModal({
              title: '成功',
              content: '提交申请成功',
              showCancel: false,
              confirmText: '确认',
              confirmColor: '#9c3',
              success: function(res) {
                wx.navigateBack({
                  delta: 1,
                });
              },
              fail: function(res) {},
              complete: function(res) {},
            })
          } else if (res.statusCode == 200 && res.data.status == 2) {
            wx.showModal({
              title: '失败',
              content: '你上次提交的申请未处理',
              showCancel: false,
              confirmText: '确认',
              confirmColor: '#9c3',
              success: function(res) {
                wx.navigateBack({
                  delta: 1,
                });
              },
              fail: function(res) {},
              complete: function(res) {},
            })
          } else {
            wx.showModal({
              title: '失败',
              content: '提交申请失败',
              showCancel: false,
              confirmText: '确认',
              confirmColor: '#9c3',
              success: function(res) {
                wx.navigateBack({
                  delta: 1,
                });
              },
              fail: function(res) {},
              complete: function(res) {},
            })
          }
        },
        fail: function(res) {
          wx.showModal({
            title: '失败',
            content: '提交申请失败',
            showCancel: false,
            confirmText: '确认',
            confirmColor: '#9c3',
            success: function (res) {
              wx.navigateBack({
                delta: 1,
              });
            },
            fail: function (res) { },
            complete: function (res) { },
          })
        },
        complete: function(res) {},
      })

    } else {
      wx.showModal({
        title: '错误',
        content: '请检查输入是否正确',
        showCancel: false,
        confirmText: '确认',
        confirmColor: '#9c3',
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      residue: options.residue,
      agentId: options.agentId,
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