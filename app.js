//app.js
App({
  onLaunch: function () {
    wx.login({
      success: function (res) {
        if (res.code) {
          console.log("js code is :" + res.code)
          //发起网络请求
          wx.request({
            url: 'https://dd.doudouapp.com/api/v1/wxappauths.json',
            method: 'GET',
            data: {
              code: res.code
            },
            header: {
              'Content-Type': 'application/json'
            },
            success: function (res) {
              console.log(res.data)
            }
          }
          
          )
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function (res) {
          if (res.code) {
            console.log("js code is :" + res.code)
            //发起网络请求
            wx.request({
              url: 'https://dd.doudouapp.com/api/v1/wxappauths.json',
              method: 'GET',
              data: {
                code: res.code,
                appid: 'wxapp',
                appsecret: 'wxapp1234!@'
              },
              header: {
                'Content-Type': 'application/json'
              },
              success: function (res) {
                console.log(res.data)
                that.globalData.userid = res.data.user_id;
                that.globalData.usersession = res.data.session;
                wx.getUserInfo({
                  success: function (res) {
                    that.globalData.userInfo = res.userInfo
                    wx.request({
                      url:'https://dd.doudouapp.com/api/v1/wxappuserupdate.json',
                      method: 'POST',
                      data: {
                        appid: 'wxapp',
                        appsecret: 'wxapp1234!@',
                        nickname: that.globalData.userInfo.nickname,
                        avatarurl: that.globalData.userInfo.avatarUrl,
                        user_id: that.globalData.userid
                      },
                      header: {
                        'Content-Type': 'application/json'
                      },
                      success: function (res) {
                        console.log(res.data)
                      }
                    }

                    )
                    typeof cb == "function" && cb(that.globalData.userInfo)
                  }
                })
              }
            }

            )
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      })
    }
  },
  globalData:{
    userInfo:null,
    userid: null,
    usersession: null
  },
  request: function (method, url, data, header) {
    if (typeof method === 'object') {
      url = method.url;
      data = method.data;
      header = method.header;
      method = method.method;
    }
    var req = {
      method: method,
      url: url,
      header: {},
      data: {}
    }, def = {
      header: function (name, value) {
        if (value) req.header[name] = value;
        else req.header = name;
        return def;
      },
      query: function (name, value) {
        if (value) req.data[name] = value;
        else req.data = name;
        return def;
      },
      send: function (name, value) {
        if (value) req.data[name] = value;
        else req.data = name;
        return def;
      },
      use: function (middleware) {
        req = middleware.call(def, req);
        return def;
      },
      end: function (callback, done) {
        var p = new Promise(function (accept, reject) {
          if (!callback) {
            wx.showNavigationBarLoading();
            callback = function (err, res) {
              wx.hideNavigationBarLoading();
              if (err) return reject(err);
              else accept(res);
            };
          }
        });
        if (!req.header['content-type']) {
          req.header['content-type'] = req.method == 'get' ?
            'application/x-www-form-urlencoded' : 'application/json';
        }
        req.complete = done;
        req.fail = callback;
        req.success = callback.bind(req, null);
        wx.request(req);
        return p;
      }
    };
    'get post put delete'.split(' ').forEach(function (method) {
      def[method] = (function () {
        return function (url) {
          req.url = req.url || url;
          req.method = req.method || method;
          return def;
        };
      })();
    });
    return def;
  }
})