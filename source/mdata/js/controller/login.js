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

        $scope.account = '';
        $scope.password = '';
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
            //判断用户名
            if(!MdataVerify.blur("account",$scope['ndForm']['ndAccount'].$error, $scope)){
                return;
            }
            //判断密码
            if(!MdataVerify.blur("password",$scope['ndForm']['ndPassword'].$error, $scope)){
                return;
            }    
            if($scope['ndForm'].$valid && api ) {
                $http.get(api).success(function (result) {

                    if(result.code == 200) {
                        //记录登陆状态
                        $rootScope.user['logined'] = true;
                        $rootScope.user['authority'] = result.data.authority;
                        $rootScope.$emit('$routeChangeStart');
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
        $scope.toldPassword = new tooltip({'position':'rc'}).getNewTooltip();
        $scope.tnewPassword = new tooltip({'position':'rc'}).getNewTooltip();
        $scope.treNewPassword = new tooltip({'position':'rc'}).getNewTooltip();

        //错误提示
        $scope.showError = function(type, pError) {
            $scope[type + 'Error'] = true;
            $scope['t' + type].errorType = type;
            $scope['t' + type].setContent(pError);
            $scope['t' + type].setPosition('.text-' + type, $scope['t' + type].toolTipLooks);
            $scope['t' + type].toolTipLooks.css({'color': 'rgba(255, 0, 0, 0.7)'});
            $scope['t' + type].show();
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
                },
            };
            //格式不正确
            for(var $error in $errors) {
                if($errors[$error]) {
                    $scope.showError(type, errorInfo[type][$error]);
                    return false;
                }
            }
            //新旧密码相同
            if($scope.newPassword == $scope.oldPassword && type == "newPassword" ){
                $scope.showError('newPassword', errorInfo.newPassword.noSame);
                return false;
            }
            //重新输入密码不一致
            if($scope.newPassword != $scope.reNewPassword && (type == "reNewPassword" || type == "newPassword" && $scope.reNewPassword)){
                $scope.showError('reNewPassword', errorInfo.reNewPassword.mustSame);
                return false;
            }   
            //重新输入新密码正确
            if($scope.newPassword == $scope.reNewPassword && type == "newPassword" ){
                if($scope.treNewPassword.errorType == 'reNewPassword') {
                    $scope.treNewPassword.hide();
                    $scope.reNewPasswordError = false;
                    return false;
                }
            }  
            return true;
        };

        //表单获得焦点时清除错误
        $scope.focus = function (type) {
            $scope[type + 'Error'] = false;
            if($scope['t'+type].errorType == type) {
                $scope['t'+type].hide();
            }
        };

        //修改密码提交
        $scope.submit = function () {
            var api = ApiCtrl.get('login');
            //判断旧密码格式
            if(!$scope.blur("oldPassword",$scope['cPaw']['oldPassword'].$error)){
                return;
            }
            //判断新密码格式
            if(!$scope.blur("newPassword",$scope['cPaw']['newPassword'].$error)){  
                return;
            }
            //判断重新输入密码格式
            if(!$scope.blur("reNewPassword",$scope['cPaw']['reNewPassword'].$error)){   
                return;
            }
            //验证通过、新旧密码不一致并且新密码相同
            if($scope['cPaw'].$valid && api && $scope.newPassword != $scope.oldPassword && $scope.newPassword == $scope.reNewPassword) {
                $http.get(api).success(function (result) {

                    if(result.code == 200) {
                        Ui.alert('Your password has been changed successfully');
                    }

                }).error(function (status) {
                    Ui.alert('网络错误！');
                });
            }
        }
    }
]);