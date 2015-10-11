var tooltip = require('Tooltip');

/*
 * login模块控制器
 * */
oasgames.mdataControllers.controller('MdataLoginCtrl', [
    '$rootScope',
    '$scope',
    '$http',
    '$location',
    'ApiCtrl',
    'AUTHORITY',
    'MdataVerify',
    function ($rootScope, $scope, $http, $location, ApiCtrl, AUTHORITY, MdataVerify) {

        //$scope.password = '';
        var httpData = $scope.account = {};
        $scope.tooltip = new tooltip({'position':'rc'}).getNewTooltip();

        //表单失去焦点时错误提示
        $scope.blur = function(type, $errors){
            MdataVerify.blur(type, $errors, $scope);
        };

        //表单焦点时清除错误提示
        $scope.focus = function (type) {
            $scope[type + 'Error'] = false;
            if($scope.tooltip.errorType == type) {
                $scope.tooltip.hide();
            }
        };

        //清除错误
        $scope.clearErrors = function () {
            var errorCtl = ['accountError', 'passwordError'];
            for(var i = 0; i < types.length; i++) {
                $scope[errorCtl[i]] = false;
            }
        };

        //登陆
        $scope.submit = function () {
            var api = ApiCtrl.get('login');
            console.log(api);
            var Cookie = require('Cookie');

            //判断用户名
            if(!MdataVerify.blur("account", $scope['ndForm']['ndAccount'].$error, $scope)){
                return;
            }

            //判断密码
            if(!MdataVerify.blur("password", $scope['ndForm']['ndPassword'].$error, $scope)){
                return;
            }

            if($scope['ndForm'].$valid && api ) {
                  
                $http({
                    url: api,
                    method: 'POST',
                    data: httpData,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    xhrFields: {'withCredentials': true},
                    crossDomain: true,
                    transformRequest: function(data){
                        return $.param(data);
                    }
                }).success(function (result) {
                    var Cookie = require('Cookie');
                    if(result.code == 200) {
                        //记录登陆状态
                        $rootScope.user['logined'] = true;
                        $rootScope.user['authority'] = result.data.authority;
                        $rootScope.user['username'] = result.data.username;
                        Cookie.oldSetCookie('MDATA-KEY', result.data.token);
                        Cookie.setCookie('MDATA_KEY', result.data.token, {domain: '.mdata.dev'});
                        Cookie.setCookie('loginedAccount', $scope.account.account);
                        Cookie.setCookie('loginedAccountAuthority', result.data.authority);
                        Cookie.setCookie('loginedAccountName', result.data.username);
                        $rootScope.$emit('$routeChangeStart');
                    }else{
                        Ui.alert(result.msg);
                    }

                }).error(function (status) {
                    Ui.alert('网络错误！');
                });
            }
        }
    }
]);


/*
 *  change pasword控制器
 * */
oasgames.mdataControllers.controller('MdataChangePasswordCtrl', [
    '$scope',
    '$rootScope',
    '$http',
    'ApiCtrl',
    function ($scope, $rootScope, $http, ApiCtrl) {
        // $scope.toldPassword = new tooltip({'position':'rc'}).getNewTooltip();
        // $scope.tnewPassword = new tooltip({'position':'rc'}).getNewTooltip();
        // $scope.treNewPassword = new tooltip({'position':'rc'}).getNewTooltip();
        var httpData = $scope.userPassword = {};
        
        $scope.tooltip = new tooltip({'position':'rc'}).getNewTooltip();

        //错误提示
        $scope.showError = function(type, pError) {
            $scope[type + 'Error'] = true;
            $scope.tooltip.errorType = type;
            $scope.tooltip.setContent(pError);
            $scope.tooltip.setPosition('.text-' + type, $scope.tooltip.toolTipLooks);
            $scope.tooltip.toolTipLooks.css({'color': 'rgba(255, 0, 0, 0.7)'});
            $scope.tooltip.show();
        };

        //表单失去焦点时错误验证
        $scope.blur = function (type, $errors) {
            var errorInfo = {
                oldPassword : {
                    required: 'Password must not be empty',
                    error: 'Incorrect Password'
                },
                newPassword: {
                    required: 'Password must not be empty',
                    pattern: 'Incorrect Format,Password must be 6-20 characters with English letters and numbers',
                    noSame: 'New Password must not be same as Old Password'
                },
                reNewPassword:{
                    required: 'Password must not be empty',
                    pattern: 'Incorrect Format,Password must be 6-20 characters with English letters and numbers',
                    mustSame: 'Passwords do not match'
                }
            };

            //格式不正确
            if(type == "oldPassword"){  
                var flag = 0;

                //验证旧密码格式               
                for(var $error in $errors) {
                    if($errors[$error]) {
                        $scope.showError(type, errorInfo[type][$error]);
                        return false;
                    }
                }
                var httpOldPaW = {"password":$scope.userPassword.oldPassword};
                ///验证旧密码是否正确 
                $http({
                    url: ApiCtrl.get('checkPaw'),
                    method: 'POST',
                    data: httpOldPaW,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function(data){
                        return $.param(data);
                    }
                }).success(function (result) {
                    if(result.code != 200) {                      
                        $scope.showError(type, errorInfo[type]['error']);
                        flag = 1;
                    }
                }); 
                if(flag == 1){
                    return false;
                } 
            }else{  
                for(var $error in $errors) {
                    if($errors[$error]) {
                        $scope.showError(type, errorInfo[type][$error]);
                         return false;
                    }
                }

                //新旧密码相同
                if($scope.userPassword.password == $scope.userPassword.oldPassword && type == "newPassword" ){
                    $scope.showError('newPassword', errorInfo.newPassword.noSame);
                    return false;
                }

                //重新输入密码不一致
                if($scope.userPassword.password != $scope.userPassword.confirmPassword && (type == "reNewPassword" || type == "newPassword" && $scope.reNewPassword)){
                    $scope.showError('reNewPassword', errorInfo.reNewPassword.mustSame);
                    return false;
                }

                //重新输入新密码正确
                if($scope.userPassword.password == $scope.userPassword.confirmPassword && type == "newPassword" ){
                    if($scope.tooltip.errorType == 'reNewPassword') {
                        $scope.tooltip.hide();
                        $scope.reNewPasswordError = false;
                        return true;
                    }
                }               
            }
            return true;
        };

        //表单获得焦点时清除错误
        $scope.focus = function (type) {
            $scope[type + 'Error'] = false;
            if($scope.tooltip.errorType == type) {
                $scope.tooltip.hide();
            }
        };

        //修改密码提交
        $scope.submit = function () {
            var api = ApiCtrl.get('changePaw');

            //判断旧密码格式
            if(!$scope.blur("oldPassword",$scope['cPaw']['oldPassword'].$error)){
                return false;
            }
            if(!$scope.blur("newPassword",$scope['cPaw']['newPassword'].$error)){  //判断新密码格式
                return false;
            }
            if(!$scope.blur("reNewPassword",$scope['cPaw']['reNewPassword'].$error)){   //判断重新输入密码格式
                return false;
            }

            //验证通过、新旧密码不一致并且新密码相同
            if($scope['cPaw'].$valid && api ) {
                $http({
                    url: api,
                    method: 'POST',
                    data: httpData,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function(data){
                        return $.param(data);
                    }
                }).success(function (result) {
                    if(result.code == 200) {
                        Ui.alert(result.msg);
                    }else{
                        Ui.alert(result.msg);
                    }
                }).error(function (status) {
                    Ui.alert('网络错误！');
                });
            }
        }
    }
]);