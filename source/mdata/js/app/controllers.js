'use strict';

oasgames.mdataPanelControllers = angular.module('mdataPanelControllers', []);

oasgames.mdataPanelControllers.controller('mdataLogin', [
    '$scope',
    '$http',
    function ($scope, $http) {
        $scope.account = '';
        $scope.password = '';
        $scope.submit = function (target) {
            if(/^[\w]{6,18}$/.test($scope.account) && /^[\w]{6,18}$/.test($scope.password)) {
                $http.get('/mdata/js/login.json').success(function (data) {
                    location.hash = '#/application';
                });
            }else {
                console.log('请输入正确账号密码！');
            }
        }
    }
]);

oasgames.mdataPanelControllers.controller('applicationListCtrl', [
    '$scope',
    '$http',
    function ($scope, $http) {

    }
]);