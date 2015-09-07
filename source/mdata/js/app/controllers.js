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
        $scope.outlineHide = true;
        $scope.islogin = true;
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
    '$scope',
    '$http',
    'GetApi',
    function ($scope, $http, GetApi) {
        $scope.isshow = false;
        $scope.show = function () {
            $scope.isshow = !$scope.isshow;
        };
        $scope.logout = function () {
            var api = GetApi('logout');
            if(api) {
                $http.get(api).success(function () {
                    location.hash = '#/login';
                });
            }
        };
    }
]);


/*
 * navigation控制器
 * */
oasgames.mdataPanelControllers.controller('navigationCtrl', [
    '$rootScope',
    '$scope',
    function ($rootScope, $scope) {
        $rootScope.$watch('path', function (newPath) {
            $scope.page = newPath.match(/\w+/)[0];
            console.log($scope.page);
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
        $rootScope.$watch('path', function (newPath) {
            $scope.breadcrumb = Breadcrumb.getBreadcrumb(newPath);
            console.log($scope.breadcrumb);
        });
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


/*
 * login模块控制器
 * */
oasgames.mdataPanelControllers.controller('MdataLoginCtrl', [
    '$scope',
    '$http',
    '$location',
    'GetApi',
    function ($scope, $http, $location, GetApi) {

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
            var api = GetApi('login');
            if($scope['ndForm'].$valid && api) {
                $http.get('/mdata/js/login.json').success(function (data) {
                    $location.path('application');
                    //location.hash = '#/application';
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
    'GetApi',
    function ($scope, Applications) {
        $scope.applications = Applications.query();
    }
]);