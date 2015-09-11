/*
 *  account manage控制器
 * */
oasgames.mdataPanelControllers.controller('AccountManageCtrl', [
    '$scope',
    '$timeout',
    'Account',
    'Filter',
    function ($scope, $timeout, Account, Filter) {
        var searchTimer = null;
        //数据模型
        $scope.dataAccounts = [];
        //数据模型模板动态映射
        $scope.accounts = [];

        //数据初始化
        $scope.dataAccounts = Account.query().$promise.then(function (data) {
            $scope.dataAccounts = data.data;
            //模板所用动态数据
            $scope.accounts = $scope.dataAccounts;
        });

        //排序数据模型
        $scope.sort = {
            appList : {
                filter : '',
                orderKey : 'email',
                isDownOrder : false
            },
            adminReports : {
                orderKey : 'name',
                isDownOrder : false
            },
            viewerReports : {
                orderKey : 'name',
                isDownOrder : false
            }
        };

        // 修改排序规则
        $scope.changeListSort = function (type, orderKey) {
            if($scope.sort[type].orderKey == orderKey) {
                $scope.sort[type].isDownOrder = !$scope.sort[type].isDownOrder;
            }else {
                $scope.sort[type].orderKey = orderKey;
            }
        };

        //搜索
        $scope.search = function () {
            $timeout.cancel(searchTimer);
            searchTimer = $timeout(function () {
                var searchVal = searchForm.searchInput.value;

                // searchVal == null || searchVal == ' '
                if(!searchVal || !searchVal.trim()) {
                    $scope.accounts = $scope.dataAccounts;
                }else {
                    $scope.accounts = Filter($scope.dataAccounts, {name : searchVal, email : searchVal});
                }
            }, 200);
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