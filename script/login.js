
var v=new Vue({
  el:'#app',
  data:{
    username:'',
    password:'',
    msg:'message'
  },
  methods:{
    login(){
      callAjax(
				'api/Agent/Login',
				'post',
				{
		          	loginID: this.username,
		          	loginPwd: this.password,
		        },
		        function(res){
		        	if(res.status){
                console.log();
		        		var member=res.data;
		        		showToast('success',res.message);
		        		setStorageSync('member',member);
		        		setTimeout(function(){
		        			api.openWin({
		        			    name: 'index',
		        			    url: '../index.html',
		        			    pageParam: {
		        			        name: 'test'
		        			    }
		        			});

		        		},1500);
		        	}
              else{
                showToast('fail',res.message);
              }

		        }
			);
    }
  }
});
