/*
 * 配置页面路由
 * */
oasgames.mdataServicesConfig.config([
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
            .when('/change_password', {
                templateUrl: '/mdata/tpl/partials/change_password.html',
                controller: 'MdataChangePasswordCtrl'
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
                templateUrl: '/mdata/tpl/partials/application_edit.html',
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
                templateUrl: '/mdata/tpl/partials/account_edit.html',
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

