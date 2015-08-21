'use strict';

var oasgames = {};

/*
* 注册app主模块
* */
oasgames.mdataPanelApp = angular.module('mdataPanelApp', [
    'ngRoute',
    'mdataPanelControllers',
    'mdataPanelServices'
]);

/*
* 配置页面路由规则
* */
oasgames.mdataPanelApp.config([
    '$routeProvider',
    function ($routeProvider) {
        $routeProvider.when('/', {
            redirectTo: '/login'
        })
        .when('/login', {
            templateUrl: '/mdata/tpl/login.html',
            controller: 'MdataLoginCtrl'
        })
        .when('/applications', {
            templateUrl: '/mdata/tpl/applications.html',
            controller: 'ApplicationListCtrl'
        })
        .when('/applications/:applicationId', {
            templateUrl: '/mdata/tpl/applications.html',
            controller: 'ApplicationListCtrl'
        })
        .when('/notfound', {
            templateUrl: '/mdata/tpl/404.html'
        })
        .otherwise({
            redirectTo: '/notfound'
        });
    }
]);

