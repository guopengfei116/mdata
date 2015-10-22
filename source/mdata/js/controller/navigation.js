
/*
 * 左侧navigation控制器
 * */
oasgames.mdataControllers.controller('navigationCtrl', [
    '$rootScope',
    '$scope',
    '$location',
    'SHORTCUT_DEFAULT_STATUS',
    'ShortcutCache',
    'Http',
    function ($rootScope, $scope, $location, SHORTCUT_DEFAULT_STATUS, ShortcutCache, Http) {

        // 权限
        $scope.authority = $rootScope.user['authority'];
        $scope.logined = $rootScope.user['logined'];

        // 未登录
        if(!$scope.logined) {
            return;
        }

        /*
        * 左侧导航
        * */
        (function () {

            /*
            * 通过正则获取当前页面标记，
            * 通过标记高亮左侧导航对应的icon
            * */
            function navUp() {
                var path = $location.path();
                $scope.page = path && path.match(/\w+/) && path.match(/\w+/)[0];

                // 获取report页中的id值
                var getReportParam = path && path.match(/\/report\/view\/(\w+)/);

                // getReportParam == null
                if(getReportParam && getReportParam[1]) {
                    $scope.currentReportId = getReportParam[1];
                }

                console.log("进入" + $location.path() + "页，" + "hash值：" + location.hash + "页");
            }

            // 路由切换时刷新导航
            $rootScope.$on('$routeChangeSuccess', function () {
                navUp();
            });

            navUp();
        })();

        /*
        * 左侧收藏列表
        * */
        (function () {

            /*
            *  初始化每个app默认展示状态,
            *  每个report默认展示状态，
            *  绑定收藏事件
            * */
            function init () {
                $scope.appsShow = SHORTCUT_DEFAULT_STATUS.app;
                $scope.reportsShow = [];
                for(var i = $scope.shortcuts.length - 1; i >= 0; i--) {
                    $scope.reportsShow[i] = SHORTCUT_DEFAULT_STATUS.report;
                }
                bind();
            }

            /*
             * 监听添加收藏、取消收藏事件，
             * 通过事件动态更新收藏列表
             * */
            function bind () {
                $rootScope.$on('addShortcut', function (event, report, app) {
                    ShortcutCache.addItem(report, app);
                });
                $rootScope.$on('cancelShortcut', function (event, report, app) {
                    ShortcutCache.deleteItem(report, app);
                });
            }

            // 初始化收藏列表数据
            var shortcutListCache = ShortcutCache.get();
            if(shortcutListCache && $rootScope.shortcutListCache) {
                $scope.shortcuts = shortcutListCache;
                init();
            }else {
                Http.shortcuts(function (data) {
                    $scope.shortcuts = data;
                    init();
                });
            }
        })();
    }
]);
