// pages/addAddress/addAddress.js
var address = require('../../utils/city.js');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isContact: true,
    value: [0, 0, 0],
    provinces: [],
    citys: [],
    areas: [],
    showPicker: false,
    name: '',
    address: '',
    phoneNum: '',
    isNormal: false,
    addressId: 0,
  },
  selectAddress: function() {
    this.setData({
      showPicker: true,
    })
  },
  hideAddressPicker: function() {
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
    var areas = this.data.areas
    var provinceNum = value[0]
    var cityNum = value[1]
    var countyNum = value[2]
    // 如果省份选择项和之前不一样，表示滑动了省份，此时市默认是省的第一组数据，
    if (this.data.value[0] != provinceNum) {
      var id = provinces[provinceNum].id
      this.setData({
        value: [provinceNum, 0, 0],
        citys: address.citys[id],
        areas: address.areas[address.citys[id][0].id],
      })
    } else if (this.data.value[1] != cityNum) {
      // 滑动选择了第二项数据，即市，此时区显示省市对应的第一组数据
      var id = citys[cityNum].id
      this.setData({
        value: [provinceNum, cityNum, 0],
        areas: address.areas[citys[cityNum].id],
      })
    } else {
      // 滑动选择了区
      this.setData({
        value: [provinceNum, cityNum, countyNum]
      })
    }
    // console.log(this.data)
  },
  // 输入姓名
  inputName: function(e) {
    this.setData({
      name: e.detail.value,
    });
  },
  // 输入详细地址
  inputAddress: function(e) {
    this.setData({
      address: e.detail.value,
    })
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

  // 选择设为常用地址
  switchChange: function(e) {
    this.setData({
      isNormal: e.detail.value,
    })
  },

  // 点击保存
  save: function() {
    var that = this;
    // console.log(that.data.value[0])
    const params = {
      name: this.data.name,
      province: this.data.provinces[that.data.value[0]].name,
      city: this.data.citys[that.data.value[1]].name,
      area: this.data.areas[that.data.value[2]].name,
      address: this.data.address,
      phoneNum: this.data.phoneNum,
      // isNormal:this.data.isNormal,
      userId: app.globalData.userId,
      addressId: this.data.addressId,
    };
    console.log(params)
    // return;
    // 检查数据是否可以了
    if (params.name && params.address && params.phoneNum && this.data.isContact) {
      wx.showLoading({
        title: '正在提交',
        mask: true,
      })

      wx.request({
        url: app.globalData.web + 'v1/address/',
        data: params,
        header: {},
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function(res) {
          if (res.statusCode == 200 && res.data.status == 1) {
            wx.hideLoading();
            wx.showToast({
              title: '添加成功',
              icon: 'success',
              duration: 1500,
              mask: true,
            });
            setTimeout(function() {
              wx.navigateBack({
                delta: 1,
              });
            }, 1500);

          } else {
            wx.showToast({
              title: '添加失败',
              icon: 'none',
              duration: 1500,
              mask: true,
            })
          }
        },
        fail: function(res) {
          wx.hideLoading();
          wx.showToast({
            title: '添加失败',
            icon: 'none',
            duration: 1500,
            mask: true,
          })
        },
        complete: function(res) {},
      })
    } else {
      wx.showToast({
        title: '输入有误',
        icon: 'none',
        duration: 1000,
        mask: true,
      });
    }
  },
  // 删除地址
  deleteAddress: function() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否删除地址？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000',
      confirmText: '确认',
      confirmColor: '#9c3',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.web + 'v1/address/',
            data: {
              addressId: that.data.addressId
            },
            header: {},
            method: 'DELETE',
            dataType: 'json',
            responseType: 'text',
            success: function(res) {
              if (res.statusCode == 200 && res.data.status == 1) {
                wx.showToast({
                  title: '删除成功',
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
                  title: '删除失败',
                  duration: 2000,
                  mask: true,
                })
              }
            },
            fail: function(res) {
              wx.showToast({
                title: '删除失败',
                duration: 2000,
                mask: true,
              })
            },
            complete: function(res) {},
          })
        }
      },

    })


  },
  // 加载地址信息
  getAddress: function() {
    var that = this;
    wx.request({
      url: app.globalData.web + 'v1/address/',
      data: {
        addressId: that.data.addressId
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if (res.data.status == 1 && res.statusCode == 200) {
          var citys = [];
          var areas = [];
          var provinces = address.provinces;
          var value = [];
          for (var i = 0; i < provinces.length; i++) {
            if (provinces[i].name == res.data.address.province) {
              value.push(i);
              citys = address.citys[provinces[i].id]
              break;
            }
          };
          for (var i = 0; i < citys.length; i++) {
            if (citys[i].name == res.data.address.city) {
              value.push(i);
              areas = address.areas[citys[i].id];
              break;
            }
          }
          for (var i = 0; i < areas.length; i++) {
            if (areas[i].name == res.data.address.area) {
              value.push(i);
              break;
            }
          }
          that.setData({
            citys: citys,
            areas: areas,
            value: value,
            name: res.data.address.name,
            phoneNum: res.data.address.phoneNum,
            address: res.data.address.address,
          });
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 初始化
  init: function() {
    if (this.data.addressId != 0) {
      this.getAddress();
    } else {
      // 新建
      var that = this;
      this.setData({
        citys: address.citys[address.provinces[0].id],
        areas: address.areas[address.citys[address.provinces[0].id][0].id],
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // var id = address.provinces[0].id
    console.log(options.id)
    var that = this;
    this.setData({
      provinces: address.provinces,
      // citys: address.citys[id],
      // areas: address.areas[address.citys[id][0].id],
      addressId: options.id || 0,
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