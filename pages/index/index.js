
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
  },
  RightFollow: function(test) {
    var that = this
    that.setData({
      side: 'right'
    })
    that.Follow(test.target.id, 'right', that.data.token)
  },
  Follow: function (id, side, token) {
    var that = this
    console.log(token);
    wx.request({
      url: 'https://dd.doudouapp.com/api/v1/battles/' + id + '/follow_' + side + '_video.json',
      method: 'POST',
      data: {
        appid: app.globalData.appid,
        appsecret: app.globalData.appsecret,
        user_id: app.globalData.userid,
        session: app.globalData.usersession
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
		      that.GetBattles()
          that.GetBattlesById(id)
        }
      }
    }
    )
  },

  GoBattlePage: function(event){
    var battleid = event.target.id
    wx.navigateTo({
      url: '../challenge/challenge?id=' + battleid
    })
  },

  GetBattlesById: function (id) {
    var that = this
    console.log(that.data.token);
    app.request()
      .get('https://dd.doudouapp.com/api/v1/battles/'+id+'.json')
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
          battle: res.data,
          duileftid: res.data.left_video_id,
          duirightid: res.data.right_video_id,
        })
        wx.navigateTo({
          url: '../challenge/challenge?id=' + res.data.id
        })
      })
  },
  GetBattles: function () {
    var that = this
    console.log(that.data.token);
    app.request()
      .get('https://dd.doudouapp.com/api/v1/battles.json')
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
      that.GetBattles()
    })

  },
  addVideoInTopics: function () {
    const self = this
    var that = this;
    wx.navigateTo({
      url: '../openbattle/openbattle'
    })
  }
})
