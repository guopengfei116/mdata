/*
 * login模块控制器
 * */
oasgames.mdataPanelControllers.controller('MdataLoginCtrl', [
    '$rootScope',
    '$scope',
    '$http',
    '$location',
    'ApiCtrl',
    'AUTHORITY',
    function ($rootScope, $scope, $http, $location, ApiCtrl, AUTHORITY) {

        $scope.account = '';
        $scope.password = '';
        $scope.tooltip = new Tooltip({'position':'rc'}).getNewTooltip();

        //表单失去焦点时错误验证
        $scope.blur = function (type, $errors) {
            var errorInfo = {
                account: {
                    required: '请输入账号',
                    pattern: '账号格式错误'
                },
                password: {
                    required: '请输入密码',
                    pattern: '密码格式错误'
                }
            };

            for(var $error in $errors) {
                if($errors[$error]) {
                    $scope[type + 'Error'] = true;
                    $scope.tooltip.errorType = type;
                    $scope.tooltip.setContent(errorInfo[type][$error]);
                    $scope.tooltip.setPosition('.fieldset-' + type, $scope.tooltip.toolTipLooks);
                    $scope.tooltip.toolTipLooks.css({'color': 'rgba(255, 0, 0, 0.7)'});
                    $scope.tooltip.show();
                    return;
                }
            }

            $scope[type + 'Error'] = false;
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

            if($scope['ndForm'].$valid && api) {
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
oasgames.mdataPanelControllers.controller('MdataChangePasswordCtrl', [
    '$scope',
    '$rootScope',
    '$http',
    'ApiCtrl',
    //'HeaderCtrl',
    function ($scope, $rootScope, $http, ApiCtrl) {
        $scope.tpassword = new Tooltip({'position':'rc'}).getNewTooltip();
        $scope.tnewPassword = new Tooltip({'position':'rc'}).getNewTooltip();
        $scope.treNewPassword = new Tooltip({'position':'rc'}).getNewTooltip();
        //表单失去焦点时错误验证
        $scope.blur = function (type, $errors) {
            var errorInfo = {
                password: {
                    required: '请输入旧密码',
                    pattern: '格式错误，长度为6-20的字母、数字或特殊字符'
                },
                newPassword: {
                    required: '请输入新密码',
                    pattern: '格式错误，长度为6-20的字母或数字'
                },
                reNewPassword:{
                    required: '请重新输入新密码',
                    pattern: '格式错误，长度为6-20的字母或数字'
                },
            };
            for(var $error in $errors) {
                if($errors[$error]) {
                    $scope[type + 'Error'] = true;
                    $scope['t'+type].errorType = type;
                    $scope['t'+type].setContent(errorInfo[type][$error]);
                    $scope['t'+type].setPosition('.text-' + type, $scope['t'+type].toolTipLooks);
                    $scope['t'+type].toolTipLooks.css({'color': 'rgba(255, 0, 0, 0.7)'});
                    $scope['t'+type].show();
                    return;
                }
            }
            console.log($scope.newPassword +"=="+ $scope.password +"&&"+ type)
            if($scope.newPassword == $scope.password && type == "newPassword"){
                $scope['newPasswordError'] = true;
                $scope['tnewPassword'].errorType = type;
                $scope['tnewPassword'].setContent("New Password must not be same as Old Password");
                $scope['tnewPassword'].setPosition('.text-newPassword', $scope['tnewPassword'].toolTipLooks);
                $scope['tnewPassword'].toolTipLooks.css({'color': 'rgba(255, 0, 0, 0.7)'});
                $scope['tnewPassword'].show();
            }
            if($scope.newPassword != $scope.reNewPassword && type == "reNewPassword"){
                $scope['reNewPasswordError'] = true;
                $scope['treNewPassword'].errorType = type;
                $scope['treNewPassword'].setContent("Passwords do not match");
                $scope['treNewPassword'].setPosition('.text-reNewPassword', $scope['treNewPassword'].toolTipLooks);
                $scope['treNewPassword'].toolTipLooks.css({'color': 'rgba(255, 0, 0, 0.7)'});
                $scope['treNewPassword'].show();
            }

            $scope[type + 'Error'] = false;
        };
        //表单失去焦点时错误验证
        $scope.focus = function (type) {
            $scope[type + 'Error'] = false;
            if($scope['t'+type].errorType == type) {
                $scope['t'+type].hide();
            }
        };
        //修改密码
        $scope.submit = function () {
            var api = ApiCtrl.get('login');
            //验证通过、新旧密码不一致并且新密码相同
            if($scope['cPaw'].$valid && api && $scope.newPassword != $scope.password && $scope.newPassword == $scope.reNewPassword) {
                $http.get(api).success(function (result) {

                    if(result.code == 200) {
                        //记录登陆状态
                        $rootScope.user['logined'] = false;
                        $scope.$emit('logout');
                    }

                }).error(function (status) {
                    Ui.alert('网络错误！');
                });
            }
        }

    }
]);