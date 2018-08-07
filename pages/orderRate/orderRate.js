// pages/orderRate/orderRate.js
const util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rate:5,
    files:[],
    isCheck:true,
    imgUrl:[],
    content:'',
    orderId:0,
    // orderSku:[],
    comments:[],
  },
  // 上传某一商品的评论的图片
  uploadImage:function(reslist,updateList,index,callBack){
    var that = this;
    if (index >= updateList.length){
      callBack(reslist);
    }else{
      // 继续上传
      util.uploadFile(updateList[index],function(res){
        reslist.push(res);
        index++;
        console.log('index'+index);
        that.uploadImage(reslist,updateList,index, callBack);
      });
    } 
  },
  uploadAllImage: function (comments,index,callback){
   var that = this;
    if (index >= comments.length){
      callback(comments);
    }else{
      that.uploadImage([], comments[index].files,0,function(resList){
        comments[index].imgUrl = resList;
        index++;
        that.uploadAllImage(comments,index,callback);
      });
    }
  },
  // uploadImage: function (list, index, callBack) {
  //   var that = this;
  //   if (index >= that.data.files.length) {
  //     callBack(list);
  //   } else {
  //     // 继续上传
  //     util.uploadFile(that.data.files[index], function (res) {
  //       list.push(res);
  //       index++;
  //       console.log('index' + index);
  //       that.uploadImage(list, index, callBack);
  //     });
  //   }
  // },

  // 上传服务器
  submitComment: function () {
    var that = this;
    wx.showLoading({
      title: '正在提交',
      mask: true,
    });
    // 1.上传图片
    this.uploadAllImage(that.data.comments, 0, function (res) {

      const params = {
        userId: app.globalData.userId,
        orderId: that.data.orderId,
        comments:res
        // rate: that.data.rate,
        // imgUrl: res,
        // content: that.data.content,
        // isCheck: that.data.isCheck,
      }
      wx.request({
        url: app.globalData.web + 'v1/order/comment/',
        data: params,
        header: {},
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          if (res.statusCode == 200 && res.data.status == 1) {
            // 评论成功
            wx.hideLoading();
            wx.showToast({
              title: '评论成功',
              icon: 'success',
              duration: 1500,
              mask: true,
            });
            setTimeout(function () {
              wx.showToast({
                title: '积分+' + res.data.score,
                icon: 'success',
                duration: 1000,
                mask: true,
              });
              setTimeout(function () {

                wx.navigateBack({
                  delta: 2,// 回退两步，刷新数据
                });
              }, 1000)
            }, 2000);

          } else {
            console.log(res);
            wx.hideLoading();
            wx.showToast({
              title: '评论失败',
              icon: 'none',
              duration: 2000,
              mask: true,
            })
          }
        },
        fail: function (res) {
          console.log(res);
        },
        complete: function (res) { },
      })
    });
  },
  // submitComment:function(){
  //   var that = this;
  //   wx.showLoading({
  //     title: '正在提交',
  //     mask: true,
  //   });
  //   // 1.上传图片
  //   this.uploadImage([],0,function(res){
  //        const params ={
  //          userId:app.globalData.userId,
  //          orderId:that.data.orderId,
  //          rate:that.data.rate,
  //          imgUrl:res,
  //          content:that.data.content,
  //          isCheck:that.data.isCheck,
  //        }
  //        wx.request({
  //          url: app.globalData.web+'v1/order/comment/',
  //          data: params,
  //          header: {},
  //          method: 'POST',
  //          dataType: 'json',
  //          responseType: 'text',
  //          success: function(res) {
  //            if(res.statusCode==200&&res.data.status==1){
  //              // 评论成功
  //              wx.hideLoading();
  //              wx.showToast({
  //                title: '评论成功',
  //                icon: 'success',
  //                duration: 1500,
  //                mask: true,
  //              });
  //              setTimeout(function(){
  //                wx.showToast({
  //                  title: '积分+'+res.data.score,
  //                  icon: 'success',
  //                  duration: 1000,
  //                  mask: true,
  //                });
  //                setTimeout(function(){

  //                  wx.navigateBack({
  //                    delta: 2,// 回退两步，刷新数据
  //                  });
  //                },1000)
  //              },2000);

  //            }else{
  //              console.log(res);
  //              wx.hideLoading();
  //              wx.showToast({
  //                title: '评论失败',
  //                icon: 'none',
  //                duration: 2000,
  //                mask: true,
  //              })
  //            }
  //          },
  //          fail: function(res) {
  //            console.log(res);
  //          },
  //          complete: function(res) {},
  //        })
  //   });
  // },
  // 输入评论内容
  inputContent:function(e){
    var index = e.currentTarget.dataset.index;
    var comments = this.data.comments;
    comments[index].content = e.detail.value;
    this.setData({
      comments: comments,
    })
  },
  // 选择评分
  selecRate:function(e){
    var index= e.currentTarget.dataset.index;
    var comments = this.data.comments;
    comments[index].rate = parseInt(e.currentTarget.dataset.rateindex) + 1
    this.setData({
      comments: comments,
    });
  },
  chooseImage: function (e) {
    var that = this;
    var index =e.currentTarget.dataset.index;
    wx.chooseImage({
      count:3-that.data.files.length,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var comments = that.data.comments;
        comments[index].files = comments[index].files.concat(res.tempFilePaths);
        that.setData({
          // files: that.data.files.concat(res.tempFilePaths)
          comments: comments,
        });
      }
    });
  },
  previewImage: function (e) {
    var index= e.currentTarget.dataset.index;
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.comments[index].files // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var flag = options.flag;
    var index = options.index;
    var pages = getCurrentPages();
    var prePage = pages[pages.length-2];
    var order = prePage.data.orders[flag].list[index];
    var comments = [];
    order.orderSku.forEach((item)=>{
      var temp = { rate: 5, files: [], isCheck: true, imgUrl: [], content: '',skuId:item.sku_id,skuName:item.skuName,imgUrl:item.imgUrl};
      comments.push(temp);
    });
    this.setData({
      orderId: order.id,
      comments: comments,
      // // imgUrl: item.orderSku[0].imgUrl,
      // order: order,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})