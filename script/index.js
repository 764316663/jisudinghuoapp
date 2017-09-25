
removeStorageSync('token');
getToken();
setTimeout(function(){
//  removeStorageSync('member');
  loginAjax();
},100);
