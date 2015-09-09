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
    'mdataPanelFilter'
]);

/*
 * 用户权限对照表
 * */
oasgames.mdataPanelApp.constant("AUTHORITY", {
    'administrators' : 1,
    'user' : {
        'reportAdmin' : 2,
        'reportViewer' : 3,
        'reportGuest' : 4
    }
});

/*
* 页面初始化
* */
oasgames.mdataPanelApp.run([
    '$rootScope',
    '$location',
    '$log',
    'UserAuth',
    'AUTHORITY',
    function ($rootScope, $location, $log, UserAuth, AUTHORITY) {
        //用户初始属性
        $rootScope.user = {
            "logined" : false,
            "authority" : null
        };

        //切换页面时权限认证
        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            var nextUrl = next && next.originalPath;
            var currentUrl = current && current.originalPath;
            console.log('当前页：' + currentUrl + ', 下一页：' + nextUrl);

            // 如果用户未登录
            if(!$rootScope.user['logined']) {
                console.log('用户未登录');
                if(next.templateUrl === '/mdata/tpl/partials/login.html') {
                    // 已经转向登录路由因此无需重定向
                }else {
                    $location.path('/login');
                }
            // 已登陆访问登陆页
            }else if(nextUrl === '/login' || nextUrl === '/' || nextUrl === undefined){
                if($rootScope.user.authority == AUTHORITY.administrators) {
                    $location.path('/application/manage');
                }else {
                    $location.path('/report/manage');
                }
            // 已登录访问其他页
            }else {
                var license = UserAuth.route(nextUrl);
                // 如果权限不足
                if(!license) {
                    console.log('不通过');
                    $location.path(currentUrl);
                }
                $log.debug("访问权限验证：" + license);
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
            controller: 'ApplicationManageCtrl'
        })
        .when('/application/manage/create', {
            templateUrl: '/mdata/tpl/partials/application_create.html',
            controller: 'ApplicationCreateCtrl'
        })
        .when('/application/manage/edit/:applicationId', {
            templateUrl: '/mdata/tpl/partials/application_edit.html',
            controller: 'ApplicationEditCtrl'
        })

        //account
        .when('/account', {
            redirectTo: '/account/manage'
        })
        .when('/account/manage', {
            templateUrl: '/mdata/tpl/partials/account_manage.html',
            controller: 'AccountManageCtrl'
        })
        .when('/account/manage/create', {
            templateUrl: '/mdata/tpl/partials/account_create.html',
            controller: 'AccountCreateCtrl'
        })
        .when('/account/manage/edit/:accountId', {
            templateUrl: '/mdata/tpl/partials/account_edit.html',
            controller: 'AccountEditCtrl'
        })

        //system log
        .when('/systemLog', {
            templateUrl: '/mdata/tpl/partials/system_log.html',
            controller: 'systemLogCtrl'
        })

        //report
        .when('/report', {
            redirectTo: '/report/manage'
        })
        .when('/report/manage', {
            templateUrl: '/mdata/tpl/partials/report_manage.html',
            controller: 'reportManageCtrl'
        })
        .when('/report/manage/create', {
            templateUrl: '/mdata/tpl/partials/report_create.html',
            controller: 'reportCreateCtrl'
        })
        .when('/report/manage/edit/:reportId', {
            templateUrl: '/mdata/tpl/partials/report_edit.html',
            controller: 'reportEditCtrl'
        })
        .when('/report/view/:reportId', {
            templateUrl: '/mdata/tpl/partials/report.html',
            controller: 'reportViewCtrl'
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

