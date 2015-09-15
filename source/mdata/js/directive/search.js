
/*
* @搜索指令
* 父控制器需要申明sourceData 和 viewData两个变量以供指令使用，
* 指令只帮助处理了搜索为空的处理，
* 具体搜索逻辑需父控制器自己定义searchHandler函数，接收搜索值进行处理，
* 如果搜索输入框需要placeholder，则在父控制器作用域设置searchPlaceholder值
* */
oasgames.mdataDirective.directive('search', [
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
            controller: [
                '$scope',
                '$timeout',
                'Filter',
                function ($scope, $timeout) {

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

                                //具体搜索由控制器根据不同需求单独处理
                                $scope.searchHandler(searchVal);
                            }
                        }, 200);
                    };
                }
            ]
        }
    }
]);