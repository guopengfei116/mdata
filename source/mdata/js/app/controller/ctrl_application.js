/*
 *  application manage控制器
 * */
oasgames.mdataPanelControllers.controller('ApplicationManageCtrl', [
    '$scope',
    'Application',
    function ($scope, Application) {
        var searching = false;
        $scope.dataApps = Application.query();

        //搜索
        $scope.submit = function () {
            if($scope.searchForm.searchInput.$valid && $scope.searchTerms && !searching) {
                searching = true;
                Application.get(
                    { appId: $scope.searchTerms },
                    function (data) {
                        console.log(data);
                        searching = false;
                    },
                    function () {

                    }
                )
            }
        }
    }
]);

/*
 *  application create控制器
 * */
oasgames.mdataPanelControllers.controller('ApplicationCreateCtrl', [
    '$scope',
    function ($scope) {

    }
]);

/*
 *  application edit控制器
 * */
oasgames.mdataPanelControllers.controller('ApplicationEditCtrl', [
    '$scope',
    function ($scope) {

    }
]);