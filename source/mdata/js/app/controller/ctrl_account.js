/*
 *  account manage控制器
 * */
oasgames.mdataPanelControllers.controller('AccountManageCtrl', [
    '$scope',
    '$timeout',
    'Account',
    function ($scope, $timeout, Account) {
        var searching = false;

        //初始化数据
        $scope.dataAccounts = Account.query();

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
        $scope.changeAppSort = function (type, orderKey) {
            if($scope.sort[type].orderKey == orderKey) {
                $scope.sort[type].isDownOrder = !$scope.sort[type].isDownOrder;
            }else {
                $scope.sort[type].orderKey = orderKey;
            }
        };

        // search
        $scope.submit = function () {
            console.log('search');
        };

        //搜索
        $scope.submit = function () {
            if($scope.searchForm.searchInput.$valid && $scope.searchTerms && !searching) {
                searching = true;
                Account.get(
                    { accountId: $scope.searchTerms },
                    function (data) {
                        console.log(data);
                        searching = false;
                    },
                    function () {
                        Ui.alert('网络错误');
                    }
                )
            }
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