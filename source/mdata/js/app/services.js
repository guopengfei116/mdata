'use strict';

/*
 * 注册自定义服务
 * */
oasgames.mdataPanelServices = angular.module('mdataPanelServices', ['ngResource']);

/*
 * 该服务用来判断页面是否需要显示轮廓，
 * 不需要显示轮廓的页面在pageOutlineBlacklist配置即可。
 * */
oasgames.mdataPanelServices.factory('PageOutline', [
   function () {
       var pageOutlineBlacklist = [ '', '#\\/login' ];
       var hash = location.hash;
       console.log(hash);
       var isOutline = false;
       for(var i = pageOutlineBlacklist.length - 1; i >= 0; i--) {
           isOutline = !new RegExp('^' + pageOutlineBlacklist[i] + '$').test(hash);
           if(!isOutline) {
               break;
           }
       }
       return isOutline;
   }
]);
oasgames.mdataPanelServices.factory('PageOutlineBlacklist', [
    function () {
        return {
            blacklist : [ '', '#\\/login' ],
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