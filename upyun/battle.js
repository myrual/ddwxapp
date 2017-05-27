const Upyun = require('./upyun-wxapp-sdk')
const upyun = new Upyun({
  bucket: 'dd-doudouapp-com',
  operator: 'doudouapp',
  getSignatureUrl: 'https://dd.doudouapp.com/api/v1/upyunauths.json'
})

function Battle() {
}

Battle.prototype.ChallengeVideo = function(id, duiid) {
  var that = this;
  wx.request({
    url: 'https://dd.doudouapp.com/api/v1/battles.json',
    method: 'POST',
    data: {
      appid: 'app123',
      appsecret: '333',
      battle_title: 'testbattle123',
      user_id: that.user_id,
      user_token: that.user_token,
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

Battle.prototype.UpdateVideo = function(videoid) {
  var that = this;
  wx.request({
    url: 'https://dd.doudouapp.com/api/v1/videos/' + videoid + '/new_ext_video.json',
    method: 'POST',
    data: {
      appid: 'app123',
      appsecret: '333',
      video_title: 'test',
      user_id: that.user_id,
      user_token: that.user_token,
      provider: 'upyun',
      videourl: 'http://dd-doudouapp-com.b0.upaiyun.com/uploads/testvideo/' + videoid,
    },
    header: {
      'Content-Type': 'application/json'
    },
    success: function (res) {
      console.log(res.data.id)
      console.log("Upload video to doudou")
      that.ChallengeVideo(videoid, that.duiid)
    }
  })
},
  
Battle.prototype.CreateBattle = function(wxsrc) {
  var that = this;
  wx.request({
    url: 'https://dd.doudouapp.com/api/v1/videos.json',
    method: 'POST',
    data: {
      appid: 'app123',
      appsecret: '333',
      video_title: 'test123',
      user_id: that.user_id,
      user_token: that.user_token
    },
    header: {
      'Content-Type': 'application/json'
    },
    success: function (res) {
      console.log("get video id :" + res.data.id)
      that.UploadUpyun(wxsrc, res.data.id)
    }
  })
}

Battle.prototype.UploadUpyun = function(wxsrc, videoid) {
  var that = this;
  upyun.upload({
    localPath: wxsrc,
    remotePath: '/uploads/testvideo/' + videoid,
    success: function (res) {
      console.log('uploadVideo success, res is:', res)
      wx.showToast({
        title: '上传成功',
        icon: 'success',
        duration: 1000
      })
      that.UpdateVideo(videoid)
    },
    fail: function ({errMsg}) {
      console.log('uploadVideo fail, errMsg is', errMsg)
    }
  })
}

module.exports = Battle