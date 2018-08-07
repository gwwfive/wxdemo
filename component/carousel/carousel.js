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
    carousel: {
      type: Object,
      value: ' ',
    }
  },
  data: {
    // imgUrls: [
    //   'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
    //   'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
    //   'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    // ],
    indicatorDots: true,//是否显示面板指示点
    autoplay: true,//是否自动切换
    circular: true,//是否采用衔接滑动
    interval: 5000,//自动切换时间间隔
    duration: 1000,//滑动动画时长
    swiperIndex:0,
  },
  methods: {
    // 这里放置自定义方法  
    readDetail:function(e){
      return;// 暂时不需要点击
      console.log('点开了');
      wx.navigateTo({
        url: '/pages/readDetail/readDetail?url='+e.currentTarget.dataset.url,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })

    },
    swiperChange(e) {
      this.setData({
        swiperIndex: e.detail.current
      })
    }

  }
})