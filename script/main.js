//var bodyHeight;
/*
window.startApp=function(){
	console.log('start');
}
*/
/*
window.onload=function(){
	var bodyHeight=document.body.clientHeight;
	$('html,body').height(bodyHeight);
}
*/
var rootDocment = 'https://yarkool.jisudinghuo.com/'
var client_id = 'yarkool';
var Authorization = 'eWFya29vbDpZYXJrb29sMTY4Lg==';
// console.log(navigator.userAgent);
//StorageSync
/*
$.ajax({
    headers: {
        "Content-Type": "application/json" ,
    },
    type: 'get',
    url: rootDocment + "api/Agent/GetOpenID",
    async: true,
    data: {
        code:navigator.userAgent
    },
    success: function(res) {
        console.log(JSON.stringify(res.data));
    },
    error: function(err) {
        console.log(JSON.stringify(err));
    }
});
*/






function setStorageSync(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
};

function getStorageSync(key) {
    var value = window.localStorage.getItem(key);
    return JSON.parse(value);
}

function removeStorageSync(key) {
    window.localStorage.removeItem(key);
}

//getToken
function getToken(url, method, data, cb, contentType) {
    var contentType = contentType;
    var token = getStorageSync('token');
    var nowDate = Math.round(new Date() / 1000);
    if (token) {
        var nowExpires_in = nowDate - token.getTime;
        if (nowExpires_in > token.expires_in) { //超时
            //	callAjax(url, method, data, cb, contentType,true);
            var data = {
                grant_type: 'refresh_token',
                refresh_token: token.refresh_token
            };
            console.log(JSON.stringify(data));
            $.ajax({
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": "Basic eWFya29vbDpZYXJrb29sMTY4Lg=="
                },
                type: "post",
                url: rootDocment + "token",
                async: true,
                data,
                success: function(res) {
                    if (res.status == 200) {
                        var token = {
                            getTime: Math.round(new Date() / 1000),
                            getToken: res.access_token,
                            refresh_token: res.refresh_token,
                            token_type: res.token_type,
                            expires_in: res.expires_in
                        }
                        setStorageSync('token', token);
                        //调用接口
                        callAjax(url, method, data, cb, contentType, true);

                    }
                },
                error: function(err) {
                    console.log(JSON.stringify(err));
                }
            })
        } else {
            callAjax(url, method, data, cb, contentType, true);
        }
    } else {
        $.ajax({ //获取code
            type: "get",
            url: rootDocment + "authorize",
            async: true,
            data: {
                grant_type: "authorization_code",
                response_type: "code",
                client_id: "yarkool",
                redirect_uri: rootDocment + "api/authorization_code"
            },
            success: function(res) {
                $.ajax({ //获取token
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": "Basic eWFya29vbDpZYXJrb29sMTY4Lg=="
                    },
                    type: "post",
                    url: rootDocment + "token",
                    async: true,
                    data: {
                        code: res,
                        client_id: 'yarkool',
                        grant_type: "authorization_code",
                        redirect_uri: rootDocment + "api/authorization_code"
                    },
                    success: function(res) {
                        //						console.log('success');
                        var token = {
                            getTime: Math.round(new Date() / 1000),
                            getToken: res.access_token,
                            refresh_token: res.refresh_token,
                            token_type: res.token_type,
                            expires_in: res.expires_in
                        }
                        setStorageSync('token', token);
                        //调用接口
                        callAjax(url, method, data, cb, contentType, true);
                    },
                    error: function(err) {
                        console.log(JSON.stringify(err));
                    }
                });
            },
            error: function(err) {
                console.log(JSON.stringify(err));
            }
        });
    }
}

//getUserInfo
function getUserInfo(){
    var that=this;
    var openID=getStorageSync('openID') || '';
    if(!openID){
        callAjax(
          'api/Agent/GetOpenID',
          'get',
          {code:api.deviceId},
          function(res){
              // console.log(JSON.stringify(res));
          }
        );
    }
}

//Ajax
function callAjax(url, method, data, cb, contentType, bool) {
    var contentType = contentType;
    if (bool) {
        if (url) {
            //	getToken(url, method, data, cb, contentType)
            var token = getStorageSync('token');
            $.ajax({
                headers: {
                    "Content-Type": contentType || "application/x-www-form-urlencoded",
                    "Authorization": "bearer " + token.getToken
                },
                type: method,
                url: rootDocment + url,
                async: true,
                data: data,
                success: function(res) {
                    return typeof cb == "function" && cb(res)
                },
                error: function(err) {
                    console.log(JSON.stringify(err));
                }
            });
        }
    } else {
        getToken(url, method, data, cb, contentType);
    }
}

function loginAjax(url, method, data, cb, contentType) {
    var member = getStorageSync('member');
    if (member) {
        callAjax(url, method, data, cb, contentType);
    } else {
        api.openWin({
            name: 'login',
            url: './index.html'
        });
    }
}

function upLoadImg(formElement,cb) {
    var form=formElement;
    var token=getStorageSync('token');
    form.ajaxSubmit({
        url: rootDocment+'api/Agent/SingleUpload',
        type: 'post',
        header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'bearer ' + token.getToken
        },
        success: function(res) {
            return typeof cb == "function" && cb(res);
        },
        error: function(err) {
            console.log(JSON.stringify(err));
        }
    })
    // from.ajaxSubmit(option);
}


//Window
function linkTo(name, url, reload, pageParam) {
    api.openWin({
        name: name,
        url: url,
        reload: reload,
        pageParam: pageParam ? pageParam : {},
    });
}

function closeWin(name) {
    if (name) {
        console.log('closeWin--' + name);
        api.closeWin({
            name: name
        });
    } else {
        api.closeWin();
    }

};

function closeToWin(name) {
    api.closeToWin({
        name: name
    });
};


//Dom
function hPadding(fn) {
    $api.fixStatusBar($api.dom('header'));
    api.setStatusBarStyle({
        style: 'light',
        color: '#ffffff'
    });
    if (fn) {
        fn();
    }
}

//event
function sendEvent(name) {
    api.sendEvent({
        name: name
    });
};

function listenEvent(name, fn) {
    api.addEventListener({
        name: name
    }, function(ret, err) {
        if (ret) {
            fn();
        } else {
            console.log("失败了");
        }
    });
}

//vue
Vue.filter('toFix', function(value) {
    return parseFloat(value).toFixed(2);
});
Vue.filter('toFix1', function(value) {
    return parseFloat(value).toFixed(2) * 1;
});

//Plug-in unit
function showToast(msg, fn) {
    v.toast = true;
    api.toast({
        msg: msg,
        duration: 2000,
        location: 'bottom'
    });
    setTimeout(function() {
        v.toast = false;
        if (fn) {
            fn();
        }
    }, 2000);
}

function showConfirm(msg, fn) {
    api.confirm({
        title: '系统提示',
        msg: msg,
        buttons: ['确定', '取消']
    }, function(ret, err) {
        var index = ret.buttonIndex;
        if (index == 1) {
            if (fn) {
                return typeof fn == "function" && fn()
            }
        }
    });
}
