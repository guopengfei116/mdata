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
    function ($scope) {
        $scope.tpassword = new Tooltip({'position':'rc'}).getNewTooltip();
        $scope.tnewPassword = new Tooltip({'position':'rc'}).getNewTooltip();
        $scope.treNewPassword = new Tooltip({'position':'rc'}).getNewTooltip();
        //表单失去焦点时错误验证
        $scope.blur = function (type, $errors) {
            var errorInfo = {
                password: {
                    required: '请输入旧密码',
                    pattern: '旧密码格式错误'
                },
                newPassword: {
                    required: '请输入新密码',
                    pattern: '新密码格式错误'
                },
                reNewPassword:{
                    required: '请重新输入新密码',
                    pattern: '新密码格式错误'
                }
            };

            for(var $error in $errors) {
                if($errors[$error]) {
                    $scope[type + 'Error'] = true;
                    $scope['t'+type].errorType = type;
                    $scope['t'+type].setContent(errorInfo[type][$error]);
                    $scope['t'+type].setPosition('.fieldset-' + type, $scope['t'+type].toolTipLooks);
                    $scope['t'+type].toolTipLooks.css({'color': 'rgba(255, 0, 0, 0.7)'});
                    $scope['t'+type].show();
                    return;
                }
            }

            $scope[type + 'Error'] = false;
        };

    }
]);