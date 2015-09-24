
/*
 * 页面框架控制器，
 * 根据hash值判断页面框架的展示
 * */
oasgames.mdataControllers.controller('PageFrameCtrl', [
    '$rootScope',
    '$scope',
    '$location',
    'PageOutline',
    function ($rootScope, $scope, $location, PageOutline) {

        // 权限
        $scope.authority = $rootScope.user['authority'];
        $scope.logined = $rootScope.user['logined'];

        // 页面框架显示控制
        $scope.outlineShow = true;

        // 初始化所有Ui
        var ui = new Ui();
        ui.init();

        // 路由切换时刷新页面框架
        $scope.$on('$routeChangeSuccess', function () {
            $scope.authority = $rootScope.user['authority'];
            $scope.logined = $rootScope.user['logined'];
            $scope.outlineHide = PageOutline.outlineHide($location.path());
        });
    }
]);


/*
 * header控制器
 * */
oasgames.mdataControllers.controller('HeaderCtrl', [
    '$rootScope',
    '$scope',
    '$http',
    '$location',
    'ApiCtrl',
    function ($rootScope, $scope, $http, $location, ApiCtrl) {

        // 权限
        $scope.authority = $rootScope.user['authority'];
        $scope.logined = $rootScope.user['logined'];

        // 未登录
        if(!$scope.logined) {
            return;
        }

        // 菜单控制
        $scope.isshow = false;
        $scope.show = function () {
            $scope.isshow = !$scope.isshow;
        };

        // 登出
        $scope.logout = function () {
            $scope.$emit('logout');
        };

        // 绑定登出事件
        $rootScope.$on('logout', function () {
            var api = ApiCtrl.get('logout');
            if(api) {
                $http({
                    method : "GET",
                    url : api
                }).success(function (data) {
                    if(data.code == 200) {
                        $rootScope.user['logined'] = false;
                        $rootScope.user['authority'] = null;
                        $location.path('/login');
                    }else {
                        Ui.alert(data.msg);
                    }
                }).error(function () {
                    Ui.alert('网络错误');
                });
            }
        });
    }
]);


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
    function ($rootScope, $scope, $cacheFactory, $http, $location, ApiCtrl) {

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
            $scope.page = path && path.match(/\w+/)[0];

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
                shortcutCache = $cacheFactory('shortcut');
                $http({
                    method : "GET",
                    url : ApiCtrl.get('shortcuts'),
                    data : { "reportId" : 1, }
                }).success(function (result, status) {
                    if(result.code == 200) {
                        $scope.shortcuts = result.data;
                        shortcutCache.put('list', result.data);
                        init();
                    }else {
                        Ui.alert(result.msg);
                    }
                }).error(function () {
                    Ui.alert('网络错误');
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
                        tempApp.reports.push(app);
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


/*
 * breadcrumb控制器
 * */
oasgames.mdataControllers.controller('breadcrumbCtrl', [
    '$rootScope',
    '$scope',
    '$location',
    'Breadcrumb',
    function ($rootScope, $scope, $location, Breadcrumb) {

        // 权限
        $scope.authority = $rootScope.user['authority'];
        $scope.logined = $rootScope.user['logined'];

        // 未登录
        if(!$scope.logined) {
            return;
        }

        // 面包屑导航默认值
        $scope.breadcrumb = Breadcrumb.getBreadcrumb($location.path());

        // 路由切换时刷新面包屑导航
        $rootScope.$on('$routeChangeSuccess', function () {
            $scope.breadcrumb = Breadcrumb.getBreadcrumb($location.path());
        });

        // 关联每个breadcrumb Url
        $scope.setHref = function (index) {
            //最后路径指向当前页
            if(index == $scope.breadcrumb.length - 1) {
                return;
            }

            var childrenPaths = $location.path().match(/\w+/g);
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

