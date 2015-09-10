'use strict';

var oasgames = {};

/*
* 注册app主模块
* */
oasgames.mdataPanelApp = angular.module('mdataPanelApp', [
    'ngSanitize',
    'ngRoute',
    'mdataPanelControllers',
    'mdataPanelServices',
    'mdataPanelFilter'
]);

/*
 * 用户权限对照表
 * */
oasgames.mdataPanelApp.constant("AUTHORITY", {
    'administrators' : 1,
    'user' : {
        'reportAdmin' : 2,
        'reportViewer' : 3,
        'reportGuest' : 4
    }
});

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

/*
* 配置页面路由
* */
oasgames.mdataPanelApp.config([
    '$routeProvider',
    function ($routeProvider) {
        $routeProvider

        //login
        .when('/', {
            redirectTo: '/login'
        })
        .when('/login', {
            templateUrl: '/mdata/tpl/partials/login.html',
            controller: 'MdataLoginCtrl'
        })

        //application
        .when('/application', {
            redirectTo: '/application/manage'
        })
        .when('/application/manage', {
            templateUrl: '/mdata/tpl/partials/application_manage.html',
            controller: 'ApplicationManageCtrl'
        })
        .when('/application/manage/create', {
            templateUrl: '/mdata/tpl/partials/application_create.html',
            controller: 'ApplicationCreateCtrl'
        })
        .when('/application/manage/edit/:applicationId', {
            templateUrl: '/mdata/tpl/partials/application_edit.html',
            controller: 'ApplicationEditCtrl'
        })

        //account
        .when('/account', {
            redirectTo: '/account/manage'
        })
        .when('/account/manage', {
            templateUrl: '/mdata/tpl/partials/account_manage.html',
            controller: 'AccountManageCtrl'
        })
        .when('/account/manage/create', {
            templateUrl: '/mdata/tpl/partials/account_create.html',
            controller: 'AccountCreateCtrl'
        })
        .when('/account/manage/edit/:accountId', {
            templateUrl: '/mdata/tpl/partials/account_edit.html',
            controller: 'AccountEditCtrl'
        })

        //system log
        .when('/systemLog', {
            templateUrl: '/mdata/tpl/partials/system_log.html',
            controller: 'systemLogCtrl'
        })

        //report
        .when('/report', {
            redirectTo: '/report/manage'
        })
        .when('/report/manage', {
            templateUrl: '/mdata/tpl/partials/report_manage.html',
            controller: 'reportManageCtrl'
        })
        .when('/report/manage/create', {
            templateUrl: '/mdata/tpl/partials/report_create.html',
            controller: 'reportCreateCtrl'
        })
        .when('/report/manage/edit/:reportId', {
            templateUrl: '/mdata/tpl/partials/report_edit.html',
            controller: 'reportEditCtrl'
        })
        .when('/report/view/:reportId', {
            templateUrl: '/mdata/tpl/partials/report.html',
            controller: 'reportViewCtrl'
        })

        //notfound
        .when('/notfound', {
            templateUrl: '/mdata/tpl/404.html'
        })
        .otherwise({
            redirectTo: '/notfound'
        });
    }
]);

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
        $scope.outlineHide = false;
        $scope.islogin = false;
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
    '$rootScope',
    '$scope',
    '$http',
    '$location',
    'ApiCtrl',
    function ($scope, $http, ApiCtrl) {
        $scope.isshow = false;
        $scope.show = function () {
            $scope.isshow = !$scope.isshow;
        };
        $scope.logout = function () {
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
        };
    }
]);


/*
 * navigation控制器
 * */
oasgames.mdataPanelControllers.controller('navigationCtrl', [
    '$rootScope',
    '$scope',
    '$http',
    'ApiCtrl',
    function ($rootScope, $scope, $http, ApiCtrl) {
        //权限
        $scope.authority = $rootScope.user['authority'];

        $rootScope.$watch('path', function (newPath) {
            //当前页
            $scope.page = newPath && newPath.match(/\w+/)[0];

            //当前预览的report
            var reportViewPath = newPath && newPath.match(/\/report\/view\/(\w+)/);

            // reportViewPath == null
            if(reportViewPath && reportViewPath[1]) {
                $scope.currentReportId = reportViewPath[1];
            }

            console.log("进入" + $scope.page + "页");
            console.log($scope.currentReportId);
        });

        //收藏列表默认状态
        var shortcutsDefaultStatus = false;
        $scope.appsShow = shortcutsDefaultStatus;
        $scope.reportsShow = [];

        //shortcuts列表初始化
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
                $http.get(api).success(function (result) {

                    if(result.code == 200) {
                        //记录登陆状态
                        $rootScope.user['logined'] = true;
                        $rootScope.user['authority'] = result.data.authority;
                        $rootScope.$emit('$routeChangeStart');
                    }

                }).error(function (status) {
                    Ui.alert('网络错误！');
                });
            }
        }
    }
]);


/*
 *  application manage控制器
 * */
oasgames.mdataPanelControllers.controller('ApplicationManageCtrl', [
    '$scope',
    'Application',
    function ($scope, Application) {
        var searching = false;
        $scope.dataApps = Application.query();

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

/*
*  application create控制器
* */
oasgames.mdataPanelControllers.controller('ApplicationCreateCtrl', [
    '$scope',
    function ($scope) {

    }
]);

/*
 *  application edit控制器
 * */
oasgames.mdataPanelControllers.controller('ApplicationEditCtrl', [
    '$scope',
    function ($scope) {

    }
]);

/*
 *  account manage控制器
 * */
oasgames.mdataPanelControllers.controller('AccountManageCtrl', [
    '$scope',
    'Account',
    function ($scope, Account) {
        var searching = false;
        $scope.dataAccounts = Account.query();

        //搜索
        $scope.submit = function () {
            if($scope.searchForm.searchInput.$valid && $scope.searchTerms && !searching) {
                searching = true;
                Account.get(
                    { accountId: $scope.searchTerms },
                    function (data) {
                        console.log(data);
                        searching = false;
                    },
                    function () {
                        Ui.alert('网络错误');
                    }
                )
            }
        }
    }
]);

/*
 *  account create控制器
 * */
oasgames.mdataPanelControllers.controller('AccountCreateCtrl', [
    '$scope',
    function ($scope) {

    }
]);

/*
 *  account edit控制器
 * */
oasgames.mdataPanelControllers.controller('AccountEditCtrl', [
    '$scope',
    function ($scope) {

    }
]);

/*
 *  system log控制器
 * */
oasgames.mdataPanelControllers.controller('systemLogCtrl', [
    '$scope',
    function ($scope) {

    }
]);

/*
 *  report manage控制器
 * */
oasgames.mdataPanelControllers.controller('reportManageCtrl', [
    '$scope',
    'Report',
    function ($scope, Report) {
        var searching = false;
        $scope.dataReports = Report.query();

        //搜索
        $scope.submit = function () {
            if($scope.searchForm.searchInput.$valid && $scope.searchTerms && !searching) {
                searching = true;
                Account.get(
                    { accountId: $scope.searchTerms },
                    function (data) {
                        console.log(data);
                        searching = false;
                    },
                    function () {
                        Ui.alert('网络错误');
                    }
                )
            }
        }
    }
]);

/*
 *  report create控制器
 * */
oasgames.mdataPanelControllers.controller('reportCreateCtrl', [
    '$scope',
    function ($scope) {

    }
]);

/*
 *  report edit控制器
 * */
oasgames.mdataPanelControllers.controller('reportEditCtrl', [
    '$scope',
    function ($scope) {

    }
]);

/*
 *  report view控制器
 * */
oasgames.mdataPanelControllers.controller('reportViewCtrl', [
    '$scope',
    function ($scope) {

    }
]);'use strict';

/*
 * 注册自定义过滤器
 * */
oasgames.mdataPanelFilter = angular.module('mdataPanelFilter', []);


/*
*   输出html文档
* */
oasgames.mdataPanelFilter.filter('to_trusted', [
    '$sce',
    function ($sce) {
        return function (text) {
            if(text) {
                return $sce.trustAsHtml(text);
            }
        };
    }
]);


/*
* 首字母大写
* */
oasgames.mdataPanelFilter.filter('capitalize', [
    function () {
        return function (text) {
            if(text) {
                return text[0].toUpperCase() + text.slice(1);
            }
        }
    }
]);'use strict';

/*
 * 注册自定义服务
 * */
oasgames.mdataPanelServices = angular.module('mdataPanelServices', ['ngResource']);

/*
 * @provider {Object} API 接口url
 * @return {Function} 获取接口url
 * */
oasgames.mdataPanelServices.provider('ApiCtrl', [
    function () {
        return {
            API : {
                'userAuth' : '/isLogin',
                'login' : '/mdata/js/login.json',
                'logout' : '/mdata/js/logout.text',
                'shortcuts' : '/mdata/js/shortcuts.json',
                'application' : '/mdata/js/:appId.json',
                'account' : '/mdata/js/:accountId.json',
                'report' : '/mdata/js/:reportId.json',
                'systemLog' : '/mdata/js/systemLog.json'
            },
            setApi : function (name, url) {
                this.API[name] = url;
            },
            $get : function () {
                var self = this;
                return {
                    get : function (name) {
                        var url = self.API[name];
                        if(!url) {
                            console.log('api--' + name + '不存在');
                            return '';
                        }
                        return url;
                    },
                    set : function (name, url) {
                        self.setApi(name, url);
                    }
                }
            }
        };
    }
]);


/*
* 用户登录验证
* @return {Object} UserAuth
*
* */
oasgames.mdataPanelServices.provider('UserAuth', [
    function () {
        return {
            //权限可访问的路由表
            regAuthTable : {
                '1' : [
                    /^\/\w+/
                ],
                '2' : [
                    /^\/report/
                ],
                '3' : [
                    /^\/report/
                ],
                '4' : [
                    /^\/report\/view\/\w+$/
                ]
            },

            $get : [
                '$rootScope',
                function ($rootScope) {
                    var self = this;

                    var UserAuth = {

                        //路由权限验证
                        route : function (url) {

                            //用户权限
                            var userAuth = $rootScope.user['authority'];

                            //可访问的路由正则list
                            var regAuthList =  self.regAuthTable[userAuth];

                            if(!regAuthList) {
                                throw new Error('未知的用户权限：' + userAuth);
                            }

                            //验证路由是否合法
                            for(var i = regAuthList.length - 1; i >= 0; i--) {
                                if(regAuthList[i].test(url)) {
                                    return true;
                                }
                            }

                            return false;
                        }
                    };
                    return UserAuth;
                }
            ]
        }
    }
]);


/*
 * 用来配置哪些页面不需要基本的轮廓显示，
 * 提供getBlackList方法用来获取列表
 * @return {Array}
 * */
oasgames.mdataPanelServices.factory('PageOutline', [
    function () {
        return {
            outlineHideList : [ '', '\\/login', '\\/notfound' ],

            //查询hash值是否匹配黑名单
            outlineHide : function (path) {
                var blackList = this.outlineHideList;
                var matched = false;
                for(var i = blackList.length - 1; i >= 0; i--) {
                    if(new RegExp('^' + blackList[i] + '$').test(path)) {
                        matched = true;
                        break;
                    }else {
                        matched = false;
                    }
                }
                return matched;
            }
        };
    }
]);

/*
 * @provider {String} breadcrumbSeparator 分隔符
 * @provider {Array} endSign 结束路径
 * @provider {Object} parseMethod 自定义生成breadcrumb，key为正值，value为处理方法
 * @return {Function} 解析path为breadcrumb
 * */
oasgames.mdataPanelServices.provider('Breadcrumb', [
    function () {
        return {
            breadcrumbSeparator : '&nbsp;&gt;&nbsp;',
            endSign : ['edit'],
            parseMethod : {
                '^\\/system\\/log$' : function () {
                    return ['systemLog'];
                }
            },
            setApi : function (reg, fn) {
                this.parseMethod[reg] = fn;
            },
            $get : [
                '$location',
                function ($location) {
                    var self = this;
                    return {
                        getBreadcrumb : function (path) {
                            var path = path || $location.path();

                            //优先使用自定义的解析方法
                            for(var reg in self.parseMethod) {
                                if(new RegExp(reg).test(path)) {
                                    return self.parseMethod[reg]();
                                }
                            }

                            //breadcrumb解析
                            var breadcrumbs = [];
                            var pathChildren = path.split('/');

                            outerloop:
                            for(var i = 0; i < pathChildren.length; i++) {

                                // pathChildren[i] == ''
                                if (!pathChildren[i]) {
                                    continue;
                                }

                                if(breadcrumbs.length % 2 == 1) {
                                    breadcrumbs.push(self.breadcrumbSeparator);
                                }

                                //如果是path为manage，则添加前缀
                                if(breadcrumbs.length == 2 && pathChildren[i] == 'manage') {
                                    breadcrumbs.push(breadcrumbs[0] + 'Manage');
                                }else {
                                    breadcrumbs.push(pathChildren[i]);
                                }

                                //结束标记
                                for(var j = 0; j < self.endSign.length; j++) {
                                    if(pathChildren[i] == self.endSign[j]) {
                                        break outerloop;
                                    }
                                }
                            }
                            return breadcrumbs;
                        },
                        getPath : function () {

                        }
                    }
                }
            ]
        };
    }
]);


/*
* get app
* */
oasgames.mdataPanelServices.factory('Application', [
    '$resource',
    'ApiCtrl',
    function ($resource, ApiCtrl) {
        return $resource(ApiCtrl.get('application'), {}, {
            query: {method: 'GET', params: {appId: 'applications'}}
        });
    }
]);


/*
 * get account
 * */
oasgames.mdataPanelServices.factory('Account', [
    '$resource',
    'ApiCtrl',
    function ($resource, ApiCtrl) {
        return $resource(ApiCtrl.get('account'), {}, {
            query: {method: 'GET', params: {accountId: 'accounts'}}
        });
    }
]);


/*
 * get report
 * */
oasgames.mdataPanelServices.factory('Report', [
    '$resource',
    'ApiCtrl',
    function ($resource, ApiCtrl) {
        return $resource(ApiCtrl.get('report'), {}, {
            query: {method: 'GET', params: {reportId: 'reports'}}
        });
    }
]);