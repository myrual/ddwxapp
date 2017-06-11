// videointopics.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    opentopics: [],
    topicid : null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    var that = this
    console.log(option.topicid)
    var topicid = option.topicid
    app.request()
      .get('https://dd.doudouapp.com/api/v1/openbattles/' + topicid + '.json')
      .query({
        appid: app.globalData.appid,
        appsecret: app.globalData.appsecret,
        user_id: app.globalData.userid,
        session: app.globalData.usersession
      })
      .end()
      .then(function (res) {
        console.log(res.data.id)
        console.log(res.data.videos)
        wx.setNavigationBarTitle({
          title: res.data.title,
        })
        that.setData({
          opentopics: res.data.videos,
          topicid : topicid
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
    var topicid = that.data.topicid;
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