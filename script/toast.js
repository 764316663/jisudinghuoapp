/*
apiready = function(){
    api.parseTapmode();
}
*/
var toast = new auiToast()
function showToast(type,msg,fn){
    switch (type) {
        case "success":
            toast.success({
                title:msg,
                duration:1500
            });
            break;
        case "fail":
            toast.fail({
                title:msg,
                duration:1500
            });
            break;
        case "custom":
            toast.custom({
                title:msg,
                html:'<i class="aui-iconfont aui-icon-laud"></i>',
                duration:1500
            });
            break;
        case "loading":
            toast.loading({
              	title:"加载中",
                duration:1500
            },function(ret){
                console.log(ret);
                setTimeout(function(){
                    toast.hide();
                }, 3000)
            });
            break;
        default:
            // statements_def
            break;
    }
}
