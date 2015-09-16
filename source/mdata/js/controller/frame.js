
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
            var shortcutsDefaultStatus = false;
            $scope.appsShow = shortcutsDefaultStatus;
            $scope.reportsShow = [];

            // shortcuts列表初始化
            $scope.shortcuts = [];
            $http({
                method : "GET",
                url : ApiCtrl.get('shortcuts'),
                data : { "reportId" : 1, }
            }).success(function (data, status) {
                if(data && data.code == 200) {
                    $scope.shortcuts = data.data;
                }
                //初始化reports默认状态
                for(var i = $scope.shortcuts.length - 1; i >= 0; i--) {
                    $scope.reportsShow[i] = shortcutsDefaultStatus;
                }
            }).error(function () {
                Ui.alert('网络错误');
            });
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

