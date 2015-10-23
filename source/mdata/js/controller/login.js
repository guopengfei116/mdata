
/*
 * login模块控制器
 * */
oasgames.mdataControllers.controller('MdataLoginCtrl', [
    '$rootScope',
    '$scope',
    'MdataVerify',
    'Http',
    function ($rootScope, $scope, MdataVerify, Http) {
        var tooltip = require('Tooltip');

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
        $(".main-login input").keydown(function(e) {
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
