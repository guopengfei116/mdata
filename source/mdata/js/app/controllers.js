'use strict';

/*
 * 注册控制器
 * */
oasgames.mdataPanelControllers = angular.module('mdataPanelControllers', []);


/*
 * 页面框架控制器，
 * 根据hash值判断页面框架的展示
 * */
oasgames.mdataPanelControllers.controller('PageFrameCtrl', [
    '$scope',
    'PageOutlineBlacklist',
    function ($scope, PageOutlineBlacklist) {

        var blackList = PageOutlineBlacklist.getBlackList();

        //查询hash值是否匹配黑名单
        function matchBlackList(hash) {
            var matched = false;
            for(var i = blackList.length - 1; i >= 0; i--) {
                if(new RegExp('^' + blackList[i] + '$').test(hash)) {
                    matched = true;
                    break;
                }else {
                    matched = false;
                }
            }
            return matched;
        }

        $scope.outlineHide = matchBlackList(location.hash);

        $(window).bind('hashchange', function () {
            var hash = location.hash;
            $scope.outlineHide = matchBlackList(hash);
            console.log($scope.outlineHide);
        });
    }
]);


/*
 * 页面header控制器
 * */
oasgames.mdataPanelControllers.controller('HeaderCtrl', [
    '$scope',
    function ($scope, PageOutline) {

    }
]);


/*
 * 页面nav控制器
 * */
oasgames.mdataPanelControllers.controller('NavCtrl', [
    '$scope',
    function ($scope, PageOutline) {

    }
]);


/*
 * 页面nav控制器
 * */
oasgames.mdataPanelControllers.controller('MainCtrl', [
    '$scope',
    function ($scope, PageOutline) {

    }
]);


/*
 * login模块控制器
 * */
oasgames.mdataPanelControllers.controller('MdataLoginCtrl', [
    '$scope',
    '$http',
    function ($scope, $http) {

        $scope.account = '';
        $scope.password = '';
        $scope.tooltip = new Tooltip({'position':'rc'}).getNewTooltip();
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
        $scope.focus = function (type) {
            $scope[type + 'Error'] = false;
            if($scope.tooltip.errorType == type) {
                $scope.tooltip.hide();
            }
        };
        $scope.clearErrors = function () {
            var errorCtl = ['accountError', 'passwordError'];
            for(var i = 0; i < types.length; i++) {
                $scope[errorCtl[i]] = false;
            }
        };
        $scope.submit = function () {
            if($scope['ndForm'].$valid) {
                $http.get('/mdata/js/login.json').success(function (data) {
                    location.hash = '#/applications';
                });
            }
        }
    }
]);


/*
 * application模块控制器
 * */
oasgames.mdataPanelControllers.controller('ApplicationListCtrl', [
    '$scope',
    'Applications',
    function ($scope, Applications) {
        $scope.applications = Applications.query();
    }
]);