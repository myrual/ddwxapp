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
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        that.setData({
          src: res.tempFilePath
        })
      }
    })
  },
  
  LeftFollow: function(test) {
    console.log(test.target.id)
    var that = this
    
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
        email: 'songwenbin@outlook.com',
        user_token: token
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
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
        email: 'songwenbin@outlook.com',
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
