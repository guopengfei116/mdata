
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
            $scope.username = $rootScope.user['username'];
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

        // 用户信息，注意登陆页面时会获取不到
        $scope.authority = $rootScope.user['authority'];
        $scope.logined = $rootScope.user['logined'];
        $scope.username = $rootScope.user['username'];

        // 未登录
        if(!$scope.logined) {
            return;
        }

        // 菜单控制
        $scope.isshow = false;
        $scope.show = function () {
            $scope.isshow = !$scope.isshow;
        };

        /*
        * @method 退出登录
        * 发送一个服务器通知，
        * 清空cookie，
        * 清空rootScope记录的用户信息，
        * 跳转到登陆页
        * */
        $scope.logout = function () {
            $http({
                method : "GET",
                url : ApiCtrl.get('logout')
            });
            authentication.delete();
            $rootScope.$emit('initUserProperty');
            $location.path('/login');
        };

        // 对外暴漏的登出事件
        $rootScope.$on('logout', function () {
            $scope.logout();
        });
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

