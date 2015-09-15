'use strict';

window.oasgames = {};

/*
* 依赖库
* */
require('./lib/jquery-1.11.1.js');
require('./lib/angular-1.4.3.js');
require('./lib/angular-resource.js');
require('./lib/angular-route.js');
require('./lib/angular-sanitize.js');

/*
 * 控制器
 * */
oasgames.mdataPanelControllers = angular.module('mdataPanelControllers', []);
require('./controller/frame.js');
require('./controller/login.js');
require('./controller/application.js');
require('./controller/account.js');
require('./controller/system.js');
require('./controller/report.js');

/*
 * 指令
 * */
oasgames.mdataPanelControllers = angular.module('mdataPanelDirective', []);
require('./directive/search.js');

/*
 * 过滤器
 * */
oasgames.mdataPanelFilter = angular.module('mdataPanelFilter', []);
require('./filter/filters.js');

/*
 * 服务
 * */
oasgames.mdataPanelServices = angular.module('mdataPanelServices', ['ngResource']);
require('./service/filter.js');
require('./service/frame.js');
require('./service/get_api.js');
require('./service/user_auth.js');

/*
 * app主模块
 * */
oasgames.mdataPanelApp = angular.module('mdataPanelApp', [
    'ngSanitize',
    'ngRoute',
    'mdataPanelControllers',
    'mdataPanelServices',
    'mdataPanelFilter',
    'mdataPanelDirective'
]);

/*
* 常量
* */
require('./constant/constant.js');

/*
 * 服务配置
 * */
require('./service_config/route_config.js');

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

