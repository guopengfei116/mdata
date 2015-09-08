'use strict';

var oasgames = {};

/*
* 注册app主模块
* */
oasgames.mdataPanelApp = angular.module('mdataPanelApp', [
    'ngSanitize',
    'ngRoute',
    'mdataPanelControllers',
    'mdataPanelServices',
    'mdataPanelFilter',
]);

/*
* 权限验证
* */
oasgames.mdataPanelApp.run([
    '$rootScope',
    '$location',
    'AuthService',
    function ($rootScope, $location, AuthService) {
        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            // 如果用户未登录
            if(!AuthService.userLoggedIn()) {
                if(next.templateUrl === '/mdata/tpl/partials/login.html') {
                    // 已经转向登录路由因此无需重定向
                }else {
                    $location.path('/login');
                }
            }else {
                $rootScope.userLevel = AuthService.userLevel();
            }
        });
    }
]);

/*
* 配置页面路由
* */
oasgames.mdataPanelApp.config([
    '$routeProvider',
    function ($routeProvider) {
        $routeProvider
        //login
        .when('/', {
            redirectTo: '/login'
        })
        .when('/login', {
            templateUrl: '/mdata/tpl/partials/login.html',
            controller: 'MdataLoginCtrl'
        })

        //application
        .when('/application', {
            redirectTo: '/application/manage'
        })
        .when('/application/manage', {
            templateUrl: '/mdata/tpl/partials/application_manage.html',
            controller: 'ApplicationListCtrl'
        })
        .when('/application/manage/create', {
            templateUrl: '/mdata/tpl/partials/application_create.html',
            controller: 'ApplicationListCtrl'
        })
        .when('/application/manage/edit/:applicationId', {
            templateUrl: '/mdata/tpl/partials/application_edit.html',
            controller: 'ApplicationListCtrl'
        })

        //account
        .when('/account', {
            redirectTo: '/account/manage'
        })
        .when('/account/manage', {
            templateUrl: '/mdata/tpl/partials/account_manage.html',
            controller: 'ApplicationListCtrl'
        })
        .when('/account/manage/create', {
            templateUrl: '/mdata/tpl/partials/account_create.html',
            controller: 'ApplicationListCtrl'
        })
        .when('/account/manage/edit/:accountId', {
            templateUrl: '/mdata/tpl/partials/account_edit.html',
            controller: 'ApplicationListCtrl'
        })

        //system log
        .when('/systemLog', {
            templateUrl: '/mdata/tpl/partials/system_log.html',
            controller: 'ApplicationListCtrl'
        })

        //report
        .when('/report', {
            redirectTo: '/report/manage'
        })
        .when('/report/manage', {
            templateUrl: '/mdata/tpl/partials/report_manage.html',
            controller: 'ApplicationListCtrl'
        })
        .when('/report/manage/create', {
            templateUrl: '/mdata/tpl/partials/report_create.html',
            controller: 'ApplicationListCtrl'
        })
        .when('/report/manage/edit/:reportId', {
            templateUrl: '/mdata/tpl/partials/report_edit.html',
            controller: 'ApplicationListCtrl'
        })
        .when('/report/view/:reportId', {
            templateUrl: '/mdata/tpl/partials/report.html',
            controller: 'ApplicationListCtrl'
        })

        //notfound
        .when('/notfound', {
            templateUrl: '/mdata/tpl/404.html'
        })
        .otherwise({
            redirectTo: '/notfound'
        });
    }
]);

