'use strict';

/*
 * 注册自定义服务
 * */
oasgames.mdataPanelServices = angular.module('mdataPanelServices', ['ngResource']);

/*
 * 用来配置哪些页面不需要基本的轮廓显示，
 * 提供getBlackList方法用来获取列表
 * */
oasgames.mdataPanelServices.factory('PageOutlineBlacklist', [
    function () {
        return {
            blacklist : [ '', '#\\/login', '#\\/notfound' ],
            getBlackList : function () {
                return this.blacklist;
            }
        };
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