'use strict';

var oasgames = {};

oasgames.mdataPanelApp = angular.module('mdataPanelApp', [
    'ngRoute',
    'mdataPanelControllers'
]);

oasgames.mdataPanelApp.config([
    '$routeProvider',
    function ($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: '/mdata/tpl/login.html',
            controller: 'mdataLogin'
        })
        .when('/application', {
            templateUrl: '/mdata/tpl/applications',
            controller: 'applicationListCtrl'
        })
        .otherwise({
            redirectTo: '/login'
        });
    }
]);