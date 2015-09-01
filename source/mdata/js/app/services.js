'use strict';

/*
 * 注册自定义服务
 * */
oasgames.mdataPanelServices = angular.module('mdataPanelServices', ['ngResource']);

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
 * 用来配置哪些页面不需要基本的轮廓显示，
 * 提供getBlackList方法用来获取列表
 * @return {Array}
 * */
oasgames.mdataPanelServices.factory('Breadcrumb', [
    '$location',
    function ($location) {
        var breadcrumb = {
            '/application/manage' : ['Application', 'Application&nbsp;Manage'],
            '/application/manage/create' : ['Application', 'Application&nbsp;Manage', 'Create'],
            '/application/manage/edit' : ['Application', 'Application&nbsp;Manage', 'Edit'],
            '/channel/manage' : ['Channel', 'Channel&nbsp;Manage'],
            '/channel/manage/create' : ['Channel', 'Channel&nbsp;Manage', 'Create'],
            '/channel/manage/edit' : ['Channel', 'Channel&nbsp;Manage', 'Edit'],
            '/account/manage' : ['Account', 'Account&nbsp;Manage'],
            '/account/manage/create' : ['Account', 'Account&nbsp;Manage', 'Create'],
            '/account/manage/edit' : ['Account', 'Account&nbsp;Manage', 'Edit'],
            '/system/log' : ['System&nbsp;log'],
            '/report/([\w]+)/([\w]+)' : function (match, $1, $2) {
                var result = ['Report'];
                result.push($1.substr(0, 1).toUpperCase + $1.substr(1));
                result.push($2.substr(0, 1).toUpperCase + $2.substr(1));
            },
            '/report/manage' : ['Report', 'Report&nbsp;Manage'],
            '/report/manage/create' : ['Report', 'Report&nbsp;Manage', 'Create'],
            '/report/manage/edit' : ['Report', 'Report&nbsp;Manage', 'Edit'],
        };
        var breadcrumbList = [];

        //分隔页面路径
        var paths = $location.path().split('/');
        for(var i = 0; i < paths.length; i++) {
            if(paths[i]) {
                breadcrumbList.push(paths[i]);
            }
        }
        //取第一个path作为页面title
        var pageTitle = breadcrumbList[0];
        return pageTitle;
    }
]);

/*
 * 用来获取接口url
 * @return {Function}
 * */
oasgames.mdataPanelServices.factory('GetApi', [
    function () {
        var api = {
            'login' : '/mdata/js/login.json',
            'logout' : '/mdata/js/logout.json'
        };
        function getApi(name) {
            var matchApi = api[name];
            if(!matchApi) {
                console.log('api--' + name + '不存在');
                return '';
            }
            return matchApi;
        }
        return getApi;
    }
]);

oasgames.mdataPanelServices.factory('Applications', [
    '$resource',
    function ($resource) {
        return $resource('/mdata/js/:appId.json', {}, {
            query: {method: 'GET', params: {appId: 'applications'}, isArray: true}
        });
    }
]);