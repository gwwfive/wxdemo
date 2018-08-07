//app.js
App({
  onLaunch: function() {
    this.getUserId();
  },
  getUserId() {
    var that = this
    if (that.globalData.userId) {
      return that.globalData.userId
    }
    wx.showLoading({
      title: '登录中',
      mask: true,
    });
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        //调用request请求api转换登录凭证  
        console.log("登录成功，并返回code:", res.code)
        wx.request({
          //获取openid接口
          url: that.globalData.web + 'v1/user/',
          data: {
            'code': res.code,
          },
          method: 'GET', // 要改为get
          success: res => {
            wx.hideLoading();
            that.globalData.userId = res.data.userId;
            // console.log("请求saveusers链接,成功并返回userId:", res.data.userId)
            wx.setStorageSync('userId', res.data.userId);
            console.log("getUserid获取缓存:", wx.getStorageSync('userId'));
            if (!that.globalData.userInfo) {
              // 获取用户信息
              wx.getSetting({
                success: res => {
                  if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                      withCredentials: true,
                      lang: 'zh_CN',
                      success: res => {
                        // 可以将 res 发送给后台解码出 unionId
                        that.globalData.userInfo = res.userInfo
                        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                        // 所以此处加入 callback 以防止这种情况
                        // if (that.userInfoReadyCallback) {
                        //   that.userInfoReadyCallback(res)
                        // }
                        // 更新用户信息
                        that.uploadUserInfo()
                      }
                    })
                  } else {
                    console.log('未授权')
                    wx.navigateTo({
                      url: '/pages/authorize/authorize',
                    })
                  }
                }
              })
            }
          }
        });
      },
    });
  },
  uploadUserInfo() {
    var $ = require("/utils/util.js");
    var that = this
    var userInfo = that.globalData.userInfo
    wx.request({
      url: that.globalData.web + 'v1/user/',
      data: {
        'nickName': userInfo.nickName,
        'province':userInfo.province,
        'city':userInfo.city,
        'avatarUrl': userInfo.avatarUrl,
        'gender': userInfo.gender,
        'userId': that.globalData.userId
      },
      method: 'PUT',
      success: function(res) {
        if (res.statusCode == 200) {
          if (res.data.status == 1) {
            console.log('更新用户信息成功');
          } else {
            console.log('更新用户信息失败')
          }
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })

  },
  globalData: {
    userInfo: null,
    userId:null,// 要改为null
    web:'http://127.0.0.01:8000/',//your web
    
  }
})