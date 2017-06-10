// openbattle.js
var app = getApp()
const Upyun = require('../../upyun/upyun-wxapp-sdk')
const upyun = new Upyun({
  bucket: 'dd-doudouapp-com',
  operator: 'doudouapp',
  getSignatureUrl: 'https://dd.doudouapp.com/api/v1/upyunauths.json'
})
Page({

  /**
   * 页面的初始数据
   */
  data: {
    opentopics : []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(that.data.token);
    app.request()
      .get('https://dd.doudouapp.com/api/v1/openbattles.json')
      .query({
        appid: app.globalData.appid,
        appsecret: app.globalData.appsecret,
        user_id: app.globalData.userid,
        session: app.globalData.usersession
      })
      .end()
      .then(function (res) {
        console.log(res.data[0])
        that.setData({
          opentopics: res.data
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

  startRecording: function (){

  },
  chooseImage: function (test) {
    const self = this
    var that = this;
    var topicid = test.target.id;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        console.log('choosevideo success, temp path is', res.tempFilePath)
        that.setData({
          src: res.tempFilePath
        })
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
            var video_id = res.data.id
            console.log("get video id :" + res.data.id)
            wx.request({
              url: 'https://dd.doudouapp.com/api/v1/addvideototopic.json',
              method: 'POST',
              data: {
                appid: app.globalData.appid,
                appsecret: app.globalData.appsecret,
                user_id: app.globalData.userid,
                session: app.globalData.usersession,
                topic_id: topicid,
                video_id: res.data.id
              },
              header: {
                'Content-Type': 'application/json'
              },
              success: function (res) {
                console.log("get video id :" + res.data.id)
              }
            })
            that.uploadUpyun(that.data.src, res.data.id)
          }
        })
      }
    })
  },
  uploadUpyun: function (wxsrc, videoid) {
    var that = this;
    upyun.upload({
      localPath: wxsrc,
      remotePath: '/uploads/uploads/' + videoid,
      success: function (res) {
        console.log('uploadVideo success, res is:', res)
        wx.request({
          url: 'https://dd.doudouapp.com/api/v1/videos/' + videoid + '/new_ext_video.json',
          method: 'POST',
          data: {
            appid: app.globalData.appid,
            appsecret: app.globalData.appsecret,
            user_id: app.globalData.userid,
            session: app.globalData.usersession,
            provider: 'upyun',
            videourl: 'http://dd-doudouapp-com.b0.upaiyun.com/uploads/uploads/' + videoid,
          },
          header: {
            'Content-Type': 'application/json'
          },
          success: function (res) {
            console.log(res)
            console.log("Upload video to doudou")
            wx.navigateTo({
              url: '../uploadsuccess/uploadsuccess?videoid=' + videoid
            })
          }
        })
      },
      fail: function ({errMsg}) {
        console.log('uploadVideo fail, errMsg is', errMsg)
      }
    })
  },

})