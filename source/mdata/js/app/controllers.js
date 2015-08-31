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
    '$scope',
    '$location',
    'PageOutlineBlacklist',
    function ($scope, $location, PageOutlineBlacklist) {
        $scope.outlineHide = true;
        $scope.islogin = true;
        $scope.pageTitle = 'Application';
        $scope.pageHistorys = ['Application', 'Create'];

        //查询hash值是否匹配黑名单
        function matchBlackList(hash) {
            var blackList = PageOutlineBlacklist.getBlackList();
            var matched = false;
            for(var i = blackList.length - 1; i >= 0; i--) {
                if(new RegExp('^' + blackList[i] + '$').test(hash)) {
                    matched = true;
                    break;
                }else {
                    matched = false;
                }
            }
            return matched;
        }

        ($scope.pageInit = function () {
            $scope.outlineHide = matchBlackList(location.hash);
            $scope.islogin = /^\/login$/.test($location.path());

            //分隔页面路径
            var paths = $location.path().split('/');
            for(var i = 0; i < paths.length; i++) {
                if(paths[i]) {
                    $scope.pageHistorys.push(paths[i]);
                }
            }

            //取第一个path作为页面title
            $scope.pageTitle = $scope.pageHistorys[0];

            //初始化Ui
            var ui = new Ui();
            ui.init();
            console.log('当前页面为' + $location.path());
        })();

        $(window).bind('hashchange', function () {
            $scope.pageInit();
        });
    }
]);


/*
 * 页面header控制器
 * */
oasgames.mdataPanelControllers.controller('HeaderCtrl', [
    '$scope',
    '$http',
    'GetApi',
    function ($scope, $http, GetApi) {
        $scope.isshow = false;
        $scope.show = function () {
            $scope.isshow = !$scope.isshow;
        };
        $scope.logout = function () {
            var api = GetApi('logout');
            if(api) {
                $http.get(api).success(function () {
                    location.hash = '#/login';
                });
            }
        };
    }
]);


/*
 * 页面appNav控制器
 * */
oasgames.mdataPanelControllers.controller('appNavCtrl', [
    '$scope',
    function ($scope) {
        console.log(this);
        this.name = 'pengfei';
        console.log(this);
    }
]);


/*
 * 页面historyNav控制器
 * */
oasgames.mdataPanelControllers.controller('historyNavCtrl', [
    '$scope',
    function ($scope) {
        console.log(this);
    }
]);


/*
 * login模块控制器
 * */
oasgames.mdataPanelControllers.controller('MdataLoginCtrl', [
    '$scope',
    '$http',
    'GetApi',
    function ($scope, $http, GetApi) {

        $scope.account = '';
        $scope.password = '';
        $scope.tooltip = new Tooltip({'position':'rc'}).getNewTooltip();
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
        $scope.focus = function (type) {
            $scope[type + 'Error'] = false;
            if($scope.tooltip.errorType == type) {
                $scope.tooltip.hide();
            }
        };
        $scope.clearErrors = function () {
            var errorCtl = ['accountError', 'passwordError'];
            for(var i = 0; i < types.length; i++) {
                $scope[errorCtl[i]] = false;
            }
        };
        $scope.submit = function () {
            var api = GetApi('login');
            if($scope['ndForm'].$valid && api) {
                $http.get('/mdata/js/login.json').success(function (data) {
                    location.hash = '#/applications';
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
    'Applications',
    function ($scope, Applications) {
        $scope.applications = Applications.query();
    }
]);