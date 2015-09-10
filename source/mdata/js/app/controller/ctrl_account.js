/*
 *  account manage控制器
 * */
oasgames.mdataPanelControllers.controller('AccountManageCtrl', [
    '$scope',
    'Account',
    function ($scope, Account) {
        var searching = false;

        //初始化数据
        $scope.dataAccounts = Account.query();

        $scope.search = "";
        $scope.appListSort = "email";
        $scope.reportAdminSort = "name";
        $scope.reportViewerSort = "name";

        //修改排序规则
        $scope.changeAppSort = function (sortTitle) {
            $scope.appListSort = sortTitle;
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