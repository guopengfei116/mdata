
/*
 * 左侧navigation控制器
 * */
oasgames.mdataControllers.controller('navigationCtrl', [
    '$rootScope',
    '$scope',
    '$cacheFactory',
    '$http',
    '$location',
    'ApiCtrl',
    'Http',
    function ($rootScope, $scope, $cacheFactory, $http, $location, ApiCtrl, Http) {

        // 权限
        $scope.authority = $rootScope.user['authority'];
        $scope.logined = $rootScope.user['logined'];

        // 未登录
        if(!$scope.logined) {
            return;
        }

        // 导航高亮
        function navUp() {
            var path = $location.path();

            // 用于高亮左侧导航
            $scope.page = path && path.match(/\w+/) && path.match(/\w+/)[0];

            // 获取report页中的id值
            var getReportParam = path && path.match(/\/report\/view\/(\w+)/);

            // getReportParam == null
            if(getReportParam && getReportParam[1]) {
                $scope.currentReportId = getReportParam[1];
            }

            console.log("进入" + $location.path() + "页，" + "hash值：" + location.hash + "页");
        }

        navUp();

        // 路由切换时刷新导航
        $rootScope.$on('$routeChangeSuccess', function () {
            navUp();
        });

        // 收藏列表
        (function () {
            // 默认不展示
            var shortcutsDefaultStatus = false;

            // app默认展示
            $scope.appsShow = shortcutsDefaultStatus;

            // 用于存储每个report默认展示状态
            $scope.reportsShow = [];

            // get_shortcuts列表数据
            $scope.shortcuts = [];
            var shortcutCache = $cacheFactory.get('shortcut');
            if(shortcutCache && shortcutCache.get('list')) {
                $scope.shortcuts = shortcutCache.get('list');
                init();
            }else {
                if(shortcutCache) {
                    console.log(shortcutCache);
                }else {
                    shortcutCache = $cacheFactory('shortcut');
                }               
                $http({
                    method : "GET",
                    url : ApiCtrl.get('shortcuts'),
                }).success(function (result, status) {
                    if(result && result.code == 200) {
                        if(!result.data) {
                            $scope.shortcuts = [];  // 如果无收藏列表，则初始化一个空数组
                            return;
                        }
                        $scope.shortcuts = result.data;
                        shortcutCache.put('list', result.data);
                        init();
                    }
                });
            }

            // 初始化reports默认展示，绑定事件
            function init () {
                for(var i = $scope.shortcuts.length - 1; i >= 0; i--) {
                    $scope.reportsShow[i] = shortcutsDefaultStatus;
                }
                bind();
            }

            /*
             * @method 判断收藏列表是否已存在某app
             * @return {Array || false} 存在返回一个数组，包含app对象和app的位置，不存在返回null
             * */
            function appIsExistShortcut(appId) {
                for(var i = 0; i < $scope.shortcuts.length; i++) {
                    if($scope.shortcuts[i].appid == appId) {
                        return [$scope.shortcuts[i], i];
                    }
                }

                return null;
            }

            /*
             * @method 判断收藏列表是否已存在某report
             * @return {Object || false} 存在返回一个数组，包含report对象和report的位置，不存在返回null
             * */
            function reportIsExistShortcut(app, reportId) {
                for(var i = 0; i < app.reports.length; i++) {
                    if(app.reports[i].id == reportId) {
                        return [app.reports[i], i];
                    }
                }

                return false;
            }

            // 事件监听，通过事件动态更新收藏列表
            function bind () {

                /*
                 * 收藏,
                 * 如果已收藏过这个app下的report，
                 * 则push新收藏的report到app['reports']，
                 * 否则新建一个app体系
                 * */
                $rootScope.$on('addShortcut', function (event, report, app) {
                    var appExitInfo = appIsExistShortcut(app.appid);
                    var tempApp = appExitInfo && appExitInfo[0];

                    if(tempApp) {
                        if(!reportIsExistShortcut(tempApp, report.id)) {
                            console.log(tempApp.reports);
                            tempApp.reports.push(report);
                            console.log(tempApp.reports);
                        }
                    }else {
                        // 修改app的reports属性会造成连锁影响
                        tempApp = {};
                        tempApp.appid = app.appid;
                        tempApp.appname = app.appname;
                        tempApp.reports = [];
                        tempApp.reports.push(report);
                        $scope.shortcuts.push(tempApp);
                    }
                });

                /*
                 * 取消收藏,
                 * 如果app下只有一个report，
                 * 则删除这个app，
                 * 否则删除report，
                 * */
                $rootScope.$on('cancelShortcut', function (event, report, app) {
                    var appExitInfo = appIsExistShortcut(app.appid);
                    var tempApp = appExitInfo && appExitInfo[0];

                    if(tempApp.reports.length == 1) {
                        $scope.shortcuts.splice(appExitInfo[1], 1);
                        return;
                    }

                    var reportExitInfo = tempApp && reportIsExistShortcut(tempApp, report.id);
                    var tempReport = reportExitInfo && reportExitInfo[0];

                    if(tempReport) {
                        console.log(tempApp.reports);
                        tempApp.reports.splice(reportExitInfo[1], 1);
                        console.log(tempApp.reports);
                    }
                });
            }
        })()
    }
]);
