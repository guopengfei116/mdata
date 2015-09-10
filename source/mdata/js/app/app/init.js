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

