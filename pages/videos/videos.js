// videos.js
var app = getApp()
const Upyun = require('../../upyun/upyun-wxapp-sdk')
const upyun = new Upyun({
  bucket: 'dd-doudouapp-com',
  operator: 'doudouapp',
  getSignatureUrl: 'https://dd.doudouapp.com/api/v1/upyunauths.json'
})
const Battle = require('../battle.js')
const battle = new Battle()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videos: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(that.data.token);
    app.request()
      .get('https://dd.doudouapp.com/api/v1/videos.json')
      .query({
        appid: app.globalData.appid,
        appsecret: app.globalData.appsecret,
        user_id: app.globalData.userid,
        session: app.globalData.usersession
      })
      .end()
      .then(function (res) {
        console.log(res.data[0])
        console.log(res.data[1])
        that.setData({
          videos: res.data
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
  
  },
  chooseImage: function () {
    const self = this
    var that = this;

    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        console.log('choosevideo success, temp path is', res.tempFilePath)
        that.setData({
          src: res.tempFilePath
        })
        wx.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album'],
          success: function (res) {
            console.log('chooseImage success, temp path is', res.tempFilePaths[0])

            wx.request({
              url: 'https://dd.doudouapp.com/api/v1/videos.json',
              method: 'POST',
              data: {
                appid: app.globalData.appid,
                appsecret: app.globalData.appsecret,
                user_id: app.globalData.userid,
                session: app.globalData.usersession,
                video_title: "myvideo123"
              },
              header: {
                'Content-Type': 'application/json'
              },
              success: function (res) {
                console.log("get video id :" + res.data.id)
                that.UploadUpyun(wxsrc, res.data.id)
              }
            })
          },
          fail: function ({errMsg}) {
            console.log('chooseImage fail, err is', errMsg)
          }
        })
      }
    })


  }
})