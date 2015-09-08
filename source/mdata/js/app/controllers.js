'use strict';

/*
 * 注册控制器
 * */
oasgames.mdataPanelControllers = angular.module('mdataPanelControllers', []);


/*
 * 页面框架控制器，
 * 根据hash值判断页面框架的展示
 * */
oasgames.mdataPanelControllers.controller('PageFrameCtrl', [
    '$rootScope',
    '$scope',
    '$location',
    'PageOutline',
    'Breadcrumb',
    function ($rootScope, $scope, $location, PageOutline, Breadcrumb) {
        $scope.outlineHide = true;
        $scope.islogin = true;
        $scope.pageTitle = 'Application';
        $scope.breadcrumb = ['Application', 'Create'];

        //初始化Ui
        var ui = new Ui();
        ui.init();

        $scope.$on('$routeChangeSuccess', function () {
            $rootScope.path = $location.path();
            $scope.outlineHide = PageOutline.outlineHide($rootScope.path);
            $scope.islogin = /^\/login$/.test($rootScope.path);
        });
    }
]);


/*
 * header控制器
 * */
oasgames.mdataPanelControllers.controller('HeaderCtrl', [
    '$scope',
    '$http',
    'ApiCtrl',
    function ($scope, $http, ApiCtrl) {
        $scope.isshow = false;
        $scope.show = function () {
            $scope.isshow = !$scope.isshow;
        };
        $scope.logout = function () {
            var api = ApiCtrl.get('logout');
            if(api) {
                $http.get(api).success(function () {
                    location.hash = '#/login';
                });
            }
        };
    }
]);


/*
 * navigation控制器
 * */
oasgames.mdataPanelControllers.controller('navigationCtrl', [
    '$rootScope',
    '$scope',
    function ($rootScope, $scope) {
        $rootScope.$watch('path', function (newPath) {
            $scope.page = newPath.match(/\w+/)[0];
            console.log("进入" + $scope.page + "页");
        });
    }
]);


/*
 * breadcrumb控制器
 * */
oasgames.mdataPanelControllers.controller('breadcrumbCtrl', [
    '$rootScope',
    '$scope',
    '$location',
    'Breadcrumb',
    function ($rootScope, $scope, $location, Breadcrumb) {
        //监听path变更
        $rootScope.$watch('path', function (newPath) {
            $scope.breadcrumb = Breadcrumb.getBreadcrumb(newPath);
            //console.log($scope.breadcrumb);
        });

        //关联每个breadcrumb Url
        $scope.setHref = function (index) {
            //最后路径指向当前页
            if(index == $scope.breadcrumb.length - 1) {
                return;
            }

            var childrenPaths = $rootScope.path.match(/\w+/g);
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


/*
 * login模块控制器
 * */
oasgames.mdataPanelControllers.controller('MdataLoginCtrl', [
    '$rootScope',
    '$scope',
    '$http',
    '$location',
    'ApiCtrl',
    'AUTHORITY',
    function ($rootScope, $scope, $http, $location, ApiCtrl, AUTHORITY) {

        $scope.account = '';
        $scope.password = '';
        $scope.tooltip = new Tooltip({'position':'rc'}).getNewTooltip();

        //表单失去焦点时错误验证
        $scope.blur = function (type, $errors) {
            var errorInfo = {
                account: {
                    required: '请输入账号',
                    pattern: '账号格式错误'
                },
                password: {
                    required: '请输入密码',
                    pattern: '密码格式错误'
                }
            };

            for(var $error in $errors) {
                if($errors[$error]) {
                    $scope[type + 'Error'] = true;
                    $scope.tooltip.errorType = type;
                    $scope.tooltip.setContent(errorInfo[type][$error]);
                    $scope.tooltip.setPosition('.fieldset-' + type, $scope.tooltip.toolTipLooks);
                    $scope.tooltip.toolTipLooks.css({'color': 'rgba(255, 0, 0, 0.7)'});
                    $scope.tooltip.show();
                    return;
                }
            }

            $scope[type + 'Error'] = false;
        };

        //表单焦点时清除错误提示
        $scope.focus = function (type) {
            $scope[type + 'Error'] = false;
            if($scope.tooltip.errorType == type) {
                $scope.tooltip.hide();
            }
        };

        //清除错误
        $scope.clearErrors = function () {
            var errorCtl = ['accountError', 'passwordError'];
            for(var i = 0; i < types.length; i++) {
                $scope[errorCtl[i]] = false;
            }
        };

        //登陆
        $scope.submit = function () {
            var api = ApiCtrl.get('login');

            if($scope['ndForm'].$valid && api) {
                $http.get(api).success(function (data) {

                    //记录登陆状态
                    $rootScope.user['logined'] = true;
                    $rootScope.user['authority'] = data.authority;

                    if(data.authority == AUTHORITY.administrators) {
                        $location.path('/application/manage');
                    }else {
                        $location.path('/report/manage');
                    }

                }).error(function (status) {
                    Ui.alert('网络错误！');
                });
            }
        }
    }
]);


/*
 * application模块控制器
 * */
oasgames.mdataPanelControllers.controller('ApplicationListCtrl', [
    '$scope',
    'Application',
    function ($scope, Application) {
        var searching = false;
        $scope.apps = Application.query();

        //搜索
        $scope.submit = function () {
            if($scope.searchForm.searchInput.$valid && $scope.searchTerms && !searching) {
                searching = true;
                Application.get(
                    { appId: $scope.searchTerms },
                    function (data) {
                        console.log(data);
                        searching = false;
                    },
                    function () {

                    }
                )
            }
        }
    }
]);