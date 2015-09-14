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
    '$rootScope',
    '$scope',
    '$location',
    'PageOutline',
    'Breadcrumb',
    function ($rootScope, $scope, $location, PageOutline, Breadcrumb) {
        $scope.outlineHide = false;
        $scope.islogin = false;
        $scope.pageTitle = 'Application';
        $scope.breadcrumb = ['Application', 'Create'];

        //初始化Ui
        var ui = new Ui();
        ui.init();

        $scope.$on('$routeChangeSuccess', function () {
            $rootScope.path = $location.path();
            $scope.outlineHide = PageOutline.outlineHide($rootScope.path);
            $scope.islogin = /^\/login$/.test($rootScope.path);
        });
    }
]);


/*
 * header控制器
 * */
oasgames.mdataPanelControllers.controller('HeaderCtrl', [
    '$rootScope',
    '$scope',
    '$http',
    '$location',
    'ApiCtrl',
    function ($rootScope, $scope, $http, $location, ApiCtrl) {
        $scope.isshow = false;
        $scope.show = function () {
            $scope.isshow = !$scope.isshow;
        };
        $scope.logout = function () {
            $scope.$emit('logout');
        };

        $rootScope.$on('logout', function () {
            var api = ApiCtrl.get('logout');
            if(api) {
                $http({
                    method : "GET",
                    url : api
                }).success(function (data) {
                    if(data.code == 200) {
                        $rootScope.user['logined'] = false;
                        $rootScope.user['authority'] = null;
                        $location.path('/login');
                    }else {
                        Ui.alert(data.msg);
                    }
                });
            }
        });
    }
]);


/*
 * 左侧navigation控制器
 * */
oasgames.mdataPanelControllers.controller('navigationCtrl', [
    '$rootScope',
    '$scope',
    '$http',
    'ApiCtrl',
    function ($rootScope, $scope, $http, ApiCtrl) {
        //权限
        $scope.authority = $rootScope.user['authority'];

        $rootScope.$watch('path', function (newPath) {
            //当前页
            $scope.page = newPath && newPath.match(/\w+/)[0];

            //当前预览的report
            var reportViewPath = newPath && newPath.match(/\/report\/view\/(\w+)/);

            // reportViewPath == null
            if(reportViewPath && reportViewPath[1]) {
                $scope.currentReportId = reportViewPath[1];
            }

            console.log("进入" + $scope.page + "页，" + "当前" + location.hash + "页");
        });

        //收藏列表默认状态
        var shortcutsDefaultStatus = false;
        $scope.appsShow = shortcutsDefaultStatus;
        $scope.reportsShow = [];

        //shortcuts列表初始化
        $scope.shortcuts = [];
        $http({
            method : "GET",
            url : ApiCtrl.get('shortcuts'),
            data : { "reportId" : 1, }
        }).success(function (data, status) {
            if(data && data.code == 200) {
                $scope.shortcuts = data.data;
            }
            //初始化reports默认状态
            for(var i = $scope.shortcuts.length - 1; i >= 0; i--) {
                $scope.reportsShow[i] = shortcutsDefaultStatus;
            }
        }).error(function () {
            Ui.alert('网络错误');
        });
    }
]);


/*
 * breadcrumb控制器
 * */
oasgames.mdataPanelControllers.controller('breadcrumbCtrl', [
    '$rootScope',
    '$scope',
    '$location',
    'Breadcrumb',
    function ($rootScope, $scope, $location, Breadcrumb) {

        //监听path变更
        $rootScope.$watch('path', function (newPath) {
            $scope.breadcrumb = Breadcrumb.getBreadcrumb(newPath);
            //console.log($scope.breadcrumb);
        });

        //关联每个breadcrumb Url
        $scope.setHref = function (index) {
            //最后路径指向当前页
            if(index == $scope.breadcrumb.length - 1) {
                return;
            }

            var childrenPaths = $rootScope.path.match(/\w+/g);
            var path = [], i = 0, j = 0;
            while(i <= index) {
                path.push(childrenPaths[j]);
                i += 2;
                j++;
            }
            $location.path(path.join('/'));
        };
    }
]);



