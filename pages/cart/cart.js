var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cartListReady: false,
    cartList: [], // [{ 'productName': '龙眼干', 'skuName': '500g罐装龙眼干', 'price': '100', 'originPrice': '150','slideStyle':''}, {}],
    startX: 0,
    page: 0,
    selectAll: false,
    total: 0,
  },
// 删除
  deleteCart:function(e){
    var that = this;
    wx.request({
      url: app.globalData.web+'v1/cart/',
      data: {skuId:e.currentTarget.dataset.id},
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if(res.data.status==1&&res.statusCode==200){
          var cartList = that.data.cartList;
          cartList.splice(e.currentTarget.dataset.index,1)
          that.setData({
            cartList:cartList,
          })
        }else{
          wx.showToast({
            title: '删除失败',
            icon: 'none',
            duration: 1000,
            mask: true,
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })

  },
  touchS: function(e) {
    // var index = e.currentTarget.dataset.index
    // console.log(e);
    if (e.touches.length == 1) {
      this.setData({
        startX: e.touches[0].clientX,
      })
    }
  },
  touchM: function(e) {
    console.log(e)
    if (e.touches.length == 1) {
      var moveX = e.touches[0].clientX;
      var dist = this.data.startX - moveX;
      var slideStyle = ''
      if (dist <= 0) {
        slideStyle = "left: 0rpx";
      } else if (dist >= 65) {
        slideStyle = "left:-" + 150 + 'rpx';
      } else {
        slideStyle = "left:-" + dist * 2 + 'rpx';
      }
      var cartList = this.data.cartList;
      var index = e.currentTarget.dataset.index;
      cartList[index].slideStyle = slideStyle;
      this.setData({
        cartList: cartList,
      })

    }
  },
  touchE: function(e) {
    console.log(e);
    if (e.changedTouches.length == 1) {
      var endX = e.changedTouches[0].clientX;
      var dist = this.data.startX - endX;
      var slideStyle = dist > 75 ? 'left:-150rpx' : 'left:0rpx';
      var index = e.currentTarget.dataset.index;
      var cartList = this.data.cartList;
      cartList[index].slideStyle = slideStyle;
      this.setData({
        cartList: cartList,
      })
    }


  },
  // 计算总价
  calculateTotal: function() {
    var cartList = this.data.cartList;
    var total = 0;
    for (var i = 0; i < cartList.length; i++) {
      if (cartList[i].select) {
        total = total + ((cartList[i].sku__sellPrice) * (cartList[i].skuNum))
      }
    }
    this.setData({
      total: total.toFixed(2),
    })
  },
  // 输入sku数量
  inputSkuNum: function(e) {
    // console.log(e);
    var that = this;
    var cartList = this.data.cartList;
    cartList[e.currentTarget.dataset.index].skuNum = e.detail.value <= 0 ? 1 : e.detail.value;
    this.setData({
      cartList: cartList,
    }, function() {
      that.calculateTotal()
    });

  },
  //  添加sku数量
  addSkuNum: function(e) {
    var that = this;
    var cartList = this.data.cartList;
    cartList[e.currentTarget.dataset.index].skuNum++;
    this.setData({
      cartList: cartList,
    }, function() {
      that.calculateTotal();
    })
  },
  // 减少数量
  minusSkuNum: function(e) {
    var that = this;
    var cartList = this.data.cartList;
    cartList[e.currentTarget.dataset.index].skuNum--;
    if (cartList[e.currentTarget.dataset.index].skuNum <= 1) {
      cartList[e.currentTarget.dataset.index].skuNum = 1
    }
    this.setData({
      cartList: cartList,
    }, function() {
      that.calculateTotal();
    });
  },
  // 选一个
  select: function(e) {
    var that = this;
    var cartList = this.data.cartList;
    cartList[e.currentTarget.dataset.index].select = !cartList[e.currentTarget.dataset.index].select;
    this.setData({
      cartList: cartList,
    }, function() {
      that.calculateTotal();
    })
  },
  // 全选
  selectAll: function() {
    var that = this;
    var selectAll = !this.data.selectAll;
    var cartList = this.data.cartList;
    for (var i = 0; i < cartList.length; i++) {
      cartList[i].select = selectAll;
    }
    this.setData({
      cartList: cartList,
      selectAll: selectAll,
    }, function() {
      that.calculateTotal();
    })

  },
  // 结算
  account: function() {
    var that = this;
    // 分三步 
    // 1.判断是否选择了商品
    var cartList = this.data.cartList;
    var selectSku = [];
    var total = 0;
    for (var i = 0; i < cartList.length; i++) {
      if (cartList[i].select) {
        total = total + (cartList[i].sku__sellPrice) * (cartList[i].skuNum);
        selectSku.push({
          cartId: cartList[i].id,
          skuId: cartList[i].sku_id,
          price: cartList[i].sku__sellPrice,
          skuNum:cartList[i].skuNum,
          skuName: cartList[i].sku__skuName,
          productName: cartList[i].sku__product__productName,
          imgUrl: cartList[i].sku__product__imgUrl,
        });
      }
    }
    if (selectSku.length==0){
      wx.showToast({
        title: '请选择商品',
        icon: 'none',
        duration: 1000,
        mask: true,
      })
      return;
    }
    // 2.提交数据并生成订单
    const params = {
      userId:app.globalData.userId,
      selectSku: selectSku,
    }
    wx.request({
      url: app.globalData.web+'v1/order/',
      data: params,
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if(res.statusCode==200&&res.data.status==1){
          console.log('提交数据成功');
          if(res.data.order){
            wx.navigateTo({
              url: '/pages/prepay/prepay?orderId='+res.data.order,
            })
          }
        }else{
        }
      },
      fail: function(res) {
        wx.showToast({
          title: '结算失败',
          duration: 2000,
        });
      },
      complete: function(res) {},
    })
    // 3.进行结算
    // return;
  },
  // 加载购物车
  getCart: function() {
    var that = this;
    if (!app.globalData.userId) {
      setTimeout(function() {
        that.getCart();
        return;
      }, 1000)
      return;
    }
    var page = this.data.page;
    wx.request({
      url: app.globalData.web + 'v1/cart/',
      data: {
        userId: app.globalData.userId,
        page: page
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if (res.statusCode == 200 && res.data.status == 1) {
          var cartList = that.data.cartList;
          if (page == 0) {
            cartList = [];
          }
          if (res.data.cart.length > 0) {
            cartList = cartList.concat(res.data.cart);
            page++;
          }
          that.setData({
            cartList: cartList,
            page: page,
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {
        that.setData({
          cartListReady: true,
        });
        wx.stopPullDownRefresh();
      },
    })
  },
  init: function() {
    this.getCart();
  },


  onLoad: function(options) {
    // var that = this;
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // onLoad: function (options) {

  // },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.init();
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
    var that = this;
          this.setData({
            page:0,
          },function(){
            that.init();
          });
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