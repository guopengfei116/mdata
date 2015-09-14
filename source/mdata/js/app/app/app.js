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
    'mdataPanelFilter',
    'mdataPanelDirective'
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

