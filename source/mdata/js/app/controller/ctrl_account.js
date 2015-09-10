/*
 *  account manage控制器
 * */
oasgames.mdataPanelControllers.controller('AccountManageCtrl', [
    '$scope',
    'Account',
    function ($scope, Account) {
        var searching = false;
        $scope.dataAccounts = Account.query();

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