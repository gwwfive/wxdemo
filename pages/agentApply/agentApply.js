// pages/agentApply/agentApply.js
var address = require('../../utils/city.js');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isContact: true,
    value: [],
    showPicker: false,
    name: null,
    phoneNum: null,
    gender: ['女', '男'],
    genderIndex: null,
    provinces: [],
    citys: [],
    dataReady: false,
    hasApply: true,
    agentStatus:0,
  },
  bindGenderChange: function(e) {
    this.setData({
      genderIndex: e.detail.value
    })
  },
  inputName: function(e) {
    this.setData({
      name: e.detail.value,
    });
  },

  // 选择城市
  selectCity: function() {
    this.setData({
      showPicker: true,
    })
  },

  hideCityPicker: function() {
    this.setData({
      showPicker: false,
    })
  },
  // 处理省市县联动逻辑
  cityChange: function(e) {
    // console.log(e)
    var value = e.detail.value
    var provinces = this.data.provinces
    var citys = this.data.citys
    // var areas = this.data.areas
    var provinceNum = value[0]
    var cityNum = value[1]
    // var countyNum = value[2]
    // 如果省份选择项和之前不一样，表示滑动了省份，此时市默认是省的第一组数据，
    if (this.data.value[0] != provinceNum) {
      var id = provinces[provinceNum].id
      this.setData({
        value: [provinceNum, 0],
        citys: address.citys[id],
        // areas: address.areas[address.citys[id][0].id],
      })
    } else {
      // 滑动选择了第二项数据，即市，此时区显示省市对应的第一组数据
      // var id = citys[cityNum].id
      this.setData({
        value: [provinceNum, cityNum],
        // areas: address.areas[citys[cityNum].id],
      })
    }
    // console.log(this.data)
  },
  inputPhone: function(e) {
    this.setData({
      phoneNum: e.detail.value,
    });
    /^1[34578]\d{9}$/.test(e.detail.value) ? this.setData({
      isContact: !0
    }) : this.setData({
      isContact: !1
    });
  },
  // 提交
  submit: function() {
    if(!app.globalData.userInfo){
      
    }
    var that = this;
    var params = {}
    try {
      params = {
        name: this.data.name,
        phoneNum: this.data.phoneNum,
        gender: this.data.genderIndex,
        province: this.data.provinces[this.data.value[0]].name,
        city: this.data.citys[this.data.value[1]].name,
        userId: app.globalData.userId,
      }
    } catch (e) {
      // console.log(e)
      wx.showToast({
        title: '输入有误',
        icon: 'none',
        duration: 1500,
      });
      return;
    };
    console.log(params);
    if (params.name && params.phoneNum && params.gender && this.data.isContact) {
      console.log(params);
      wx.request({
        url: app.globalData.web + 'v1/agent/',
        data: params,
        header: {},
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function(res) {
          if (res.data.status == 1 && res.statusCode == 200) {
            wx.showToast({
              title: '提交申请成功',
              icon: 'success',
              duration: 1500,
              mask: true,
            });
            setTimeout(function() {
              wx.navigateBack({
                delta: 1,
              })
            }, 1500);
          } else {
            wx.showToast({
              title: '提交申请失败',
              icon: 'none',
              duration: 1500,
              mask: true,
            });
          }
        },
        fail: function(res) {
          wx.showToast({
            title: '提交申请失败',
            icon: 'none',
            duration: 1500,
            mask: true,
          });
        },
        complete: function(res) {},
      })
    }
  },
  // 加载代理状态
  getAgentApply:function(){
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
            agentStatus: res.data.applyStatus,
            hasApply:res.data.isApply,
            dataReady:true
          });
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  goToCashCenter:function(){
    wx.redirectTo({
      url: '/pages/cashCenter/cashCenter',
      
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      provinces: address.provinces,
    });
    this.getAgentApply();
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