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
oasgames.mdataPanelControllers.controller('MainFrameCtrl', [
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
        $scope.blur = function ($error) {
            console.log($error);
            if($error.required) {
                
            }
        };
        $scope.submit = function (target) {
            if($scope['loginForm'].$valid) {
                $http.get('/mdata/js/login.json').success(function (data) {
                    location.hash = '#/applications';
                });
            }else {
                console.log('请输入正确账号密码！');
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