/*
 *  system log控制器
 * */
oasgames.mdataPanelControllers.controller('systemLogCtrl', [
    '$scope',
    '$http',
    'ApiCtrl',
    function ($scope, $http, ApiCtrl) {

        //初始化数据
        $scope.logs = [];
        $http({
            method: 'GET',
            url : ApiCtrl.get('systemLog')
        }).success(function (result) {
            if(result.code == 200) {
                $scope.logs = result.data;
            }else {
                Ui.alert(result.msg);
            }
        }).error(function () {
            Ui.alert('数据获取失败，请稍后再试！');
        });
    }
]);
