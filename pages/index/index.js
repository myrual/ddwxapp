const Upyun = require('../../upyun/upyun-wxapp-sdk')
const upyun = new Upyun({
  bucket: 'dd-doudouapp-com',
  operator: 'doudouapp',
  getSignatureUrl: 'https://dd.doudouapp.com/api/v1/upyunauths.json'
})
//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    token: null,
    battles: [],
    battle: null,
    duileftid: 0,
    duirightid: 0,
    duiid: 0,
    userInfo: {},
    src : null,
    side : null,
    targetid : null,
    userid: null,
    videoid: null,
  },

  ChallengeVideo: function(id, duiid) {
    var that = this;
    wx.request({
      url: 'https://dd.doudouapp.com/api/v1/battles.json',
      method: 'POST',
      data: {
        appid: 'app123',
        appsecret: '333',
        battle_title: 'testbattle',
        user_id: that.data.userid,
        user_token: that.data.token,
        battle_description: 'null',
        battle_left_video_id: id,
        battle_right_video_id: duiid,
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log("Create battle successful")
      }
    })
  },
  UpdateVideo: function() {
    var that = this;
    wx.request({
      url: 'https://dd.doudouapp.com/api/v1/videos/' + that.data.videoid + '/new_ext_video.json',
      method: 'POST',
      data: {
        appid: 'app123',
        appsecret: '333',
        video_title: 'test',
        user_id: that.data.userid,
        user_token: that.data.token,
        provider: 'upyun',
        videourl: 'http://dd-doudouapp-com.b0.upaiyun.com/uploads/testvideo/'+ that.data.videoid, 
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.id)
        console.log("Upload video to doudou")
        that.ChallengeVideo(that.data.videoid, that.data.duiid)
      }
    })
  },

  GeneVideoId: function() {
    var that = this;
    wx.request({
      url: 'https://dd.doudouapp.com/api/v1/videos.json',
      method: 'POST',
      data: {
        appid: 'app123',
        appsecret: '333',
        video_title: 'test123',
        user_id: that.data.userid,
        user_token: that.data.token
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log("video id :" + res.data.id)
        that.setData({
          videoid: res.data.id
        })

        console.log(that.data.src)
        console.log(that.data.videoid)
        upyun.upload({
          localPath: that.data.src,
          remotePath: '/uploads/testvideo/' + that.data.videoid,
          success: function (res) {
            console.log('uploadVideo success, res is:', res)
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 1000
            })
            that.UpdateVideo()
          },
          fail: function ({errMsg}) {
            console.log('uploadVideo fail, errMsg is', errMsg)
          }
        })
      }
    })

  },

  DuiFunction: function(test) {
    var that = this 
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        that.setData({
          src: res.tempFilePath,
          duiid: test.target.id,
        })
        const imageSrc = res.tempFilePath
        console.log(imageSrc)
        that.GeneVideoId()
      },
      fail: function ({errMsg}) {
        console.log('chooseImage fail, err is', errMsg)
      }
    })
  },
  
  LeftFollow: function(test) {
    var that = this
    that.setData({
      side: 'left'
    })
    that.Follow(test.target.id, 'left', that.data.token)
    that.GetBattlesById(test.target.id)    
  },
  RightFollow: function(test) {
    var that = this
    that.setData({
      side: 'right'
    })
    that.Follow(test.target.id, 'right', that.data.token)
    that.GetBattlesById(test.target.id)
  },
  Follow: function (id, side, token) {
    var that = this
    console.log(token);
    wx.request({
      url: 'https://dd.doudouapp.com/api/v1/battles/' + id + '/follow_' + side + '_video.json',
      method: 'POST',
      data: {
        appid: 'app123',
        appsecret: '333',
        user_email: "songwenbin@outlook.com",
        user_token: token
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.status == 400) {
          wx.showToast({
            icon: "success",
            title: "已投票",
            duration: 2000
          })
        } else if (res.data.status == 204) {
          wx.showToast({
            icon: "success",
            title: "已投票",
            duration: 2000
          })
        } else if (res.data.status == 200) {
          wx.showToast({
            icon: "success",
            title: "投票成功",
            duration: 2000
          })
        }
      }
    }
    )
  },

  GetBattlesById: function (id) {
    var that = this
    console.log(that.data.token);
    app.request()
      .get('https://dd.doudouapp.com/api/v1/battles/'+id+'.json')
      .query({
        appid: 'app123',
        appsecret: '333',
        user_email: 'songwenbin@outlook.com',
        user_token: that.data.token
      })
      .end()
      .then(function (res) {
        console.log(res.data)
        that.setData({
          battle: res.data,
          duileftid: res.data.left_video_id,
          duirightid: res.data.right_video_id,
        })
        wx.navigateTo({
          url: '../index/index?side=left&id=' + res.data.id + '&side=' + that.data.side + '&duileftid=' + that.data.duileftid + '&duirightid=' + that.data.duirightid
        })
      })
  },
  GetBattles: function () {
    var that = this
    console.log(that.data.token);
    app.request()
      .get('https://dd.doudouapp.com/api/v1/battles.json')
      .query({
        appid: 'app123',
        appsecret: '333',
        user_email: 'songwenbin@outlook.com',
        user_token: that.data.token
      })
      .end()
      .then(function (res) {
        console.log(res.data[0])
        that.setData({
          battles: res.data
        })
      })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    this.setData({
      side: that.options.side,
      targetid: that.options.id,
      duileftid: that.options.duileftid,
      duirightid: that.options.duirightid,
    })

    app.getUserInfo(function(userInfo){
      that.setData({
        userInfo:userInfo
      })
    })

    app.request()
      .post('https://dd.doudouapp.com/users/sign_in.json')
      .query({
        appid: 'app123',
        appsecret: '333',
        email: 'songwenbin@outlook.com',
        password: 'songwenbin'
      })
      .end()
      .then(function (res) {
        console.log(res.data)
        that.setData({
          token: res.data.authentication_token,
          userid: res.data.id
        })
        that.GetBattles()
      });
  }
})
