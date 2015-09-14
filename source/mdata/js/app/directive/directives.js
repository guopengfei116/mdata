'use strict';

/*
 * 注册指令
 * */
oasgames.mdataPanelControllers = angular.module('mdataPanelDirective', []);


/*
* 搜索指令
* */
oasgames.mdataPanelControllers.directive('search', [
    function () {
        return {
            restrict: 'E',
            replace: true,
            template: '<form novalidate name="searchForm">' +
                        '<fieldset class="fieldset">' +
                            '<input class="fieldset_text" name="searchInput" ng-model="searchKeyword" type="text" placeholder="{{ searchPlaceholder }}" required >' +
                            '<button class="fieldset_button iconfont icon-search" ng-click="search()"></button>' +
                        '</fieldset>' +
                      '</form>',
            link: function (scope, element, attrs) {
                console.log(scope);
            },
            controller: [
                '$scope',
                '$timeout',
                'Filter',
                function ($scope, $timeout, Filter) {

                    /*
                    * 根据搜索关键字更新模板展示数据
                    * */
                    $scope.searchTimer = null;
                    $scope.search = function () {
                        $timeout.cancel($scope.searchTimer);
                        $scope.searchTimer = $timeout(function () {
                            var searchVal = $scope.searchKeyword;

                            // searchVal == null || searchVal == ' '
                            if(!searchVal || !searchVal.trim()) {
                                $scope.viewData = $scope.sourceData;
                            }else {
                                $scope.viewData = Filter($scope.sourceData, {email : ['account', 'email', searchVal], operation : searchVal});
                            }
                        }, 200);
                    };
                }
            ]
        }
    }
]);