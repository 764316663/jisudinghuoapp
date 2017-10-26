var v = new Vue({
    el: '#app',
    data: {
        username: '',
        password: '',
        msg: 'message'
    },
    methods: {
        login() {
            if (!this.username) {
                showToast('fail', '请输入登录账号');
            } else if (!this.password) {
                showToast('fail', '请输入登录密码');
            } else {
                callAjax(
                    'api/Agent/Login',
                    'post', {
                        loginID: this.username,
                        loginPwd: this.password,
                    },
                    function(res) {
                        if (res.status) {
                            console.log();
                            var member = res.data;
                            showToast('success', res.message);
                            setStorageSync('member', member);
                            setTimeout(function() {
                                api.openWin({
                                    name: 'index',
                                    url: '../index.html',
                                    pageParam: {
                                        name: 'test'
                                    }
                                });

                            }, 1500);
                        } else {
                            showToast('fail', res.message);
                        }

                    }
                );
            }

        }
    }
});
