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
    userInfo: {},
    src : null,
    side : null,
    targetid : null,
  },

  DuiFunction: function() {
    var that = this 
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        that.setData({
          src: res.tempFilePath
        })
        const imageSrc = res.tempFilePath
        
        upyun.upload({
          localPath: imageSrc,
          remotePath: '/wxapp/demo',
          success: function (res) {
            console.log('uploadImage success, res is:', res)

            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 1000
            })

            that.setData({
              imageSrc
            })
          },
          fail: function ({errMsg}) {
            console.log('uploadImage fail, errMsg is', errMsg)
          }
        })
        
      },
      fail: function ({errMsg}) {
        console.log('chooseImage fail, err is', errMsg)
      }
    })

    
  },
  
  LeftFollow: function(test) {
    console.log(test.target.id)
    var that = this
   // that.DuiFunction()
    that.Follow(test.target.id, 'left', that.data.token)
    wx.navigateTo({
      url: '../index/index?side=left&id=' + test.target.id
    })
  },
  RightFollow: function(test) {
    var that = this
    that.Follow(test.target.id, 'right', that.data.token)
    wx.navigateTo({
      url: '../index/index?side=right&id=' + test.target.id
    })
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

  Battles: function () {
    var that = this
    console.log(that.data.token);
    wx.request({
      url: 'https://dd.doudouapp.com/api/v1/battles.json',
      method: 'GET',
      data: {
        appid: 'app123',
        appsecret: '333',
        user_email: 'songwenbin@outlook.com',
        user_token: that.data.token
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data[0])
        that.setData({
          battles: res.data
        })
      }
    }
    )
  },

  UserLogin: function() {
    var that = this
    wx.request({
        url : 'https://dd.doudouapp.com/users/sign_in.json',
        method : 'POST',
        data : {
          appid : 'app123',
          appsecret : '333',
          email: 'songwenbin@outlook.com',
          password: 'songwenbin'
        },
        header: {
          'Content-Type': 'application/json'  
        },
        success: function(res) {
          console.log(res.data)
          that.setData ({
            token: res.data.authentication_token
          })
          that.Battles()
        }
      }
    )
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    console.log(that.options.side)
    console.log(that.options.id)
    this.setData({
      side: that.options.side,
      targetid: that.options.id,
    })
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
    that.UserLogin()
  }
})
