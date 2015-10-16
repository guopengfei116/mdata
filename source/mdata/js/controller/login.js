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
    'Http',
    function ($rootScope, $scope, $http, $location, ApiCtrl, AUTHORITY, MdataVerify, Http) {

        //账号
        $scope.account = {};
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
        $(".main-login input").keypress(function(e) {
            if(e.keyCode == 13){
                $scope.submit();
            }   
        });

        //登陆
        $scope.submit = function () {

            //判断用户名
            if(!MdataVerify.blur("account", $scope['ndForm']['ndAccount'].$error, $scope)){
                return;
            }

            //判断密码
            if(!MdataVerify.blur("password", $scope['ndForm']['ndPassword'].$error, $scope)){
                return;
            }

            if($scope['ndForm'].$valid) {
                Http.login($scope.account, function (data) {
                    //记录登陆状态
                    authentication.set({
                        token : data.token,
                        authority : data.authority,
                        account : data.username
                    });

                    //初始化用户属性
                    $rootScope.$emit('initUserProperty');
                    $rootScope.$emit('$routeChangeStart');
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
    'Http',
    function ($scope, $rootScope, $http, ApiCtrl, Http) {
        // $scope.toldPassword = new tooltip({'position':'rc'}).getNewTooltip();
        // $scope.tnewPassword = new tooltip({'position':'rc'}).getNewTooltip();
        // $scope.treNewPassword = new tooltip({'position':'rc'}).getNewTooltip();
        $scope.userPassword = {};
        $scope.tooltip = new tooltip({'position':'rc'}).getNewTooltip();

        //密码是否正确 1是不正确
        var pswFlag = 1;

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

                //验证旧密码格式               
                for(var $error in $errors) {
                    if($errors[$error]) {
                        $scope.showError(type, errorInfo[type][$error]);
                        return false;
                    }
                }

                ///验证旧密码是否正确
                Http.checkPaw({
                    "password" : $scope.userPassword.oldPassword
                }).success(function (result) {
                    if(result && result.code == 200){
                        pswFlag = 0;
                    }else {
                        pswFlag = 1;
                        $scope.showError(type, errorInfo[type]['error']);
                    }
                });

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
            //判断旧密码格式
            if($(".text-oldPassword").val() == ""){
                Ui.alert("Password must not be empty");
                return false;
            }

            if(pswFlag == 1){  //旧密码错误
                Ui.alert("Incorrect Password");
                return false;
            }

            if(!$scope.blur("newPassword",$scope['cPaw']['newPassword'].$error)){  //判断新密码格式
                return false;
            }

            if(!$scope.blur("reNewPassword",$scope['cPaw']['reNewPassword'].$error)){   //判断重新输入密码格式
                return false;
            }

            //验证通过、新旧密码不一致并且新密码相同
            if($scope['cPaw'].$valid) {
                Http.changePaw($scope.userPassword, function () {
                    Ui.alert('success', function () {
                        $scope.$emit('logout');
                    });
                });
            }
        }
    }
]);