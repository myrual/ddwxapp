// uploadsuccess.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    video_title: null,
    video_id: null,
    video_url: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    var that = this
    console.log(option.videoid)
    app.request()
      .get('https://dd.doudouapp.com/api/v1/videos/' + option.videoid + '.json')
      .query({
        appid: app.globalData.appid,
        appsecret: app.globalData.appsecret,
        user_id: app.globalData.userid,
        session: app.globalData.usersession
      })
      .end()
      .then(function (res) {
        console.log(res.data)
        that.setData({
          video_title: res.data.title,
          video_url: res.data.video_url
        })
      })
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