'use strict';

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