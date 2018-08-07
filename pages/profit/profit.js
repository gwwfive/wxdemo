var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const app = getApp();
Page({
  data: {
    tabs: ["今日收益", "近一个月", "全部"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    sliderWidth: 0,
    // dayProfit:{list:[],total:0,page:0},
    // monthProfit:{list:[],total:0,page:0},
    // allProfit:{list:[],total:0,page:0},
    profit: [{
      list: [],
      agentProfitCount: {},
      page: 0,
      dataReady: false
    }, {
      list: [],
      agentProfitCount: {},
      page: 0,
      dataReady: false
    }, {
      list: [],
      agentProfitCount: {},
      page: 0,
      dataReady: false
    }],
  },

  // 加载收益
  getAgentProfitRecord: function(index) {
    var that = this;
    var profit = that.data.profit;
    var page = profit[index].page;
    var flag = 0;
    if (index == 0) {
      flag = 3;
    } else if (index == 1) {
      flag = 4
    } else if (index == 2) {
      flag = 5
    }
    wx.request({
      url: app.globalData.web + 'v1/agent/',
      data: {
        agentId: that.data.agentId,
        flag: flag,
        page: page
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if (res.data.status == 1 && res.statusCode == 200) {
          var list = profit[index].list;
          if (page == 0) {
            list = [];
          }
          if (res.data.agentProfitRecord.length > 0) {
            list = list.concat(res.data.agentProfitRecord);
            page++;
          }
          profit[index].list = list;
          profit[index].page = page;
          profit[index].dataReady = true;
          that.setData({
            profit: profit,
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {
        wx.hideLoading();
      },
    })
  },
  // 加载收益总额
  getAgentProfitCount: function(index) {
    var that = this;
    var profit = that.data.profit;
    // var page = profit[index].page;
    var flag = index;
    wx.request({
      url: app.globalData.web + 'v1/agent/',
      data: {
        agentId: that.data.agentId,
        flag: flag
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if (res.data.status == 1 && res.statusCode == 200) {
          var agentProfitCount = {
            total: 0.00,
            firstFans: 0,
            secondFans: 0,
          }
          if (index == 1) {
            res.data.agentCount.forEach((item) => {
              agentProfitCount.total += parseFloat(item.total);
              agentProfitCount.firstFans += item.firstFans;
              agentProfitCount.secondFans += item.secondFans;
            });
            agentProfitCount.total = agentProfitCount.total.toFixed(2);
          } else {
            agentProfitCount = res.data.agentCount
          }
          profit[index].agentProfitCount = agentProfitCount
          that.setData({
            profit: profit,
          });
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 初始化
  init: function() {
    // 加载今日收益
    this.getAgentProfitRecord(0);
    this.getAgentProfitCount(0);
  },
  onLoad: function(options) {
    var that = this;
    that.setData({
      agentId: options.agentId,
    })
    wx.getSystemInfo({
      success: function(res) {
        var sliderWidth = res.windowWidth / that.data.tabs.length - 10
        that.setData({
          sliderWidth: sliderWidth,
          sliderLeft: 5,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    that.init();
  },
  tabClick: function(e) {
    var that = this;
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    }, function() {
      if (that.data.profit[e.currentTarget.id].list.length == 0) {
        that.getAgentProfitRecord(e.currentTarget.id);
        that.getAgentProfitCount(e.currentTarget.id);
      }
    });
  },
  onReachBottom: function() {
    wx.showLoading({
      title: '加载中',
      mask: true,
    });
    this.getAgentProfitRecord(this.data.activeIndex);
  },
});