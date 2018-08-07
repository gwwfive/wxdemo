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
    }
  },
  data: {
    inputShowed: false,
    inputVal: "",
    textbar:'取消',
    flag:0,
    showClear:false,
    list:[]
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
        wx.request({
          url: 'https://www.rydxjy.com/search/',
          data: {
            "keyWords": this.data.inputVal,
            "userId":wx.getStorageSync('userId'),
          },
          method: 'POST',
          success: function (res) {
            if (res.data.return_code == 'SUCCESS') {
              if (res.data.courses.length < 1) {
                wx.showModal({
                  title: '提示',
                  content: '没有相关课程',
                  showCancel: false,
                  confirmText: '好的',
                  confirmColor: '#1AB20A',
                })
              }
              that.setData({
                list: res.data.courses
              })
            } else {
              wx.showToast({
                title: '网络错误',
                icon: 'none',
                image: '',
                duration: 3000,
                mask: true,
              })
            }
          },
          fail: function (res) { },
          searchComplete: function (res) { },
        })
        return
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
    }
  }
})