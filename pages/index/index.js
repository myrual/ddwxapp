
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
          url: '../challenge/challenge?side=left&id=' + res.data.id + '&side=' + that.data.side + '&duileftid=' + that.data.duileftid + '&duirightid=' + that.data.duirightid + '&userid=' + that.data.userid +'&token='+that.data.token
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

    app.getUserInfo(function(userInfo, userid, usersession){
      that.setData({
        userInfo:userInfo,
        userid: userid,
        usersession: usersession
      })
      console.log("====================")
      console.log(that.data.userInfo)
      console.log(that.data.userid)
      console.log(that.data.usersession)
      console.log("====================")

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
    })
  }
})
