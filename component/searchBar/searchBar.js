const app  = getApp()
Component({
  properties: {
    modalHidden: {
      type: Boolean,
      value: true
    }, //这里定义了modalHidden属性，属性值可以在组件使用时指定.写法为modal-hidden  
    modalMsg: {
      type: String,
      value: ' ',
    },
    list:{
      type: Array,
      value: '',
    },
  },
  data: {
    inputShowed: false,
    inputVal: "",
    textbar:'取消',
    flag:0,
    showClear:false,
    trips:[]
  },
  methods: {
    // 这里放置自定义方法  
    modal_click_Hidden: function () {
      this.setData({
        modalHidden: true,
      })
    },
    // 确定  
    Sure: function () {
      console.log(this.data.text)
    },
    showInput: function () {
      this.setData({
        inputShowed: true
      });
    },
    hideInput: function () {
      var that =this;
      if(this.data.flag==1){  // 搜索按钮
      //  跳转页面
      wx.navigateTo({
        url: '/pages/searchDetail/searchDetail?keyWords=' + this.data.inputVal,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
      //  
      return
        // wx.request({
        //   url: app.globalData.web + 'search',
        //   data: {
        //     "keys": this.data.inputVal,
        //     "userId": app.getUserId(),
        //   },
        //   method: 'GET',
        //   success: function (res) {
        //     if(res.statusCode==200&&res.data.return_code=='SUCCESS'){
        //       that.setData({
        //         trips: res.data.trips,
        //         coolsCars: res.data.coolsCars,
        //         users: res.data.users,
        //       })
        //     } else if (res.statusCode == 200 && res.data.return_code == 'FAIL'){wx.showToast({
        //       title: res.data.msg,
        //       icon:'none',
        //       duration:2000,
        //     })

        //     }else{
        //       wx.showToast({
        //         title: '服务器错误',
        //         icon: 'none',
        //         duration: 2000,
        //         mask: true,
                
        //       })
        //     }
        //   },
        //   fail: function (res) { },
        //   searchComplete: function (res) { },
        // })
        // return
      }
      this.setData({
        inputVal: "",
        inputShowed: false
      });
    },
    clearInput: function () {
      this.setData({
        inputVal: "",
        textbar: '取消',
        flag: 0,
        list:[]
      });
    },
    _inputTyping: function (e) {
      this.setData({
        inputVal: e.detail.value
      });
      this.triggerEvent("inputTyping")
      console.log('组件',e)
      
    },
    _inputting:function(e){
      console.log('hh')
      if (e.detail.value.length <= 0){
        this.setData({
          inputVal: e.detail.value,
          textbar: '取消',
          flag: 0,
          list: []
        });
        return
      }
      this.setData({
        inputVal: e.detail.value,
        textbar:'搜索',
        flag:1,
        list: []
      });
      
    },
    /*
     * 内部私有方法建议以下划线开头
     * triggerEvent 用于触发事件
     */
    _cancelEvent() {
      //触发取消回调
      this.triggerEvent("cancelEvent")
    },
    _confirmEvent() {
      //触发成功回调
      this.triggerEvent("confirmEvent");
    },
    // 
    // preventScroll:function(){
    //   console.log('hha')
    // }
  }
})