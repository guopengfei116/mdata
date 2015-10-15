
/*
 * 页面初始化之前，验证用户登录状态和权限，进行页面跳转
 * */
oasgames.mdataApp.run([
    '$rootScope',
    '$location',
    '$log',
    'UserAuth',
    'AUTHORITY',
    function ($rootScope, $location, $log, UserAuth, AUTHORITY) {

        $rootScope.user = {};
        $rootScope.applicationListCache = true; // applicationList页面切换时默认缓存开关
        $rootScope.accountListCache = true; // accountList页面切换时默认缓存开关

        // 初始化用户属性
        $rootScope.$on('initUserProperty', function () {
            var userAuthority = authentication.get('authority');
            var userName = authentication.get('account');
            var userToken = authentication.get('token');
            if(userAuthority && userName && userToken) {
                $rootScope.user['logined'] = true;
                $rootScope.user['authority'] = userAuthority;
                $rootScope.user['username'] = userName;
                $rootScope.user['token'] = userToken;
            }else {
                $rootScope.user['logined'] = false;
            }
        });

        // 页面初始化时初始化用户属性
        $rootScope.$emit('initUserProperty');

        // 切换页面时权限认证
        $rootScope.$on('$routeChangeStart', function (event, next, current) {

            $('.tooltip').remove(':not(.common)');

            var nextUrl = next && next.originalPath;
            var currentUrl = current && current.originalPath;
            console.log('当前页：' + currentUrl + ', 下一页：' + nextUrl);

            // 如果用户未登录
            if(!$rootScope.user['logined']) {
                console.log('用户未登录, nextUrl:' + nextUrl);

                if(nextUrl && (nextUrl == '/login' || nextUrl === '/')) {
                    // 已经转向登录路由因此无需重定向
                    $location.path('/login');
                }else {
                    $location.path('/login');
                }

            // 访问登陆页面，如果已登录，则重定向
            }else if(nextUrl === '/login' || nextUrl === '/' || nextUrl === undefined){

                // 超级管理员跳转到app管理
                if($rootScope.user.authority == AUTHORITY.administrators) {
                    $location.path('/application/manage');

                // 其他跳转到report管理
                }else {
                    $location.path('/report/manage');
                }

            // 访问其它页，如果已登录，需进行权限效验
            }else {

                // 访问页面权限效验
                var license = UserAuth.route(nextUrl);

                // 权限不足
                if(!license) {
                    console.log('不通过');
                    $location.path(currentUrl);
                }
                $log.debug("访问权限验证：" + license);
            }

        });
    }
]);

