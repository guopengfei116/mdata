var tooltip = require('Tooltip');

/*
 *  account edit控制器
 * */
oasgames.mdataControllers.controller('AccountEditCtrl', [
    '$scope',
    '$cacheFactory',
    '$route',
    '$http',
    'Application',
    'MdataVerify',
    'ApiCtrl',
    function ($scope, $cacheFactory, $route, $http, Application, MdataVerify, ApiCtrl) {

        // 所有的app列表
        $scope.appsData = [];

        // 所有已选的app列表
        $scope.selectedAppids = [];

        // 当前account的数据
        var httpApp = $scope.accountSourceData = {};
        var httpAppUp = $scope.accountSourceData;
        var httpName = $scope.accountSourceData.username;
        // 初始account的email值，username是否可编辑
        $scope.accountEmail = "";

        // 当前编辑的accountId
        var httpAccountId = $scope.accountId = $route.current.params.accountId;

        /*
         * 如果有id，则说明是编辑状态
         * accountId先写死方便调试获取json-data
         * */
        if($scope.accountId) {
            initAccountData();
        }else {
            initSelectData();
        }

        // getAccount数据
        function initAccountData () {
            var AppCache = $cacheFactory.get('app');
            // if(AppCache && AppCache.get('list')) {
            //     $scope.appsData = AppCache.get('list');
            // }else {
                if(AppCache) {
                    console.log(AppCache);
                }else {
                    AppCache = $cacheFactory('app');
                }
            $http({
                url: ApiCtrl.get('userIndex'),
                method: 'GET',
                params : {
                    uid : httpAccountId
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (result) {
                if(result && result.code == 200) {
                    $scope.sourceData = result.data;
                    $scope.viewData = result.data;
                    $scope.accountSourceData = result.data[0];
                    $scope.accountEmail = result.data[0].username;
                    AppCache.put('list', result.data);
                }else {
                    Ui.alert(result.msg);
                }
            }).error(function (status) {
                Ui.alert('网络错误');
            });
        }

        // 排除空值
        function initSelectData () {
            if(!$scope.accountSourceData['reportAdmin']) {
                $scope.accountSourceData['reportAdmin'] = [];
            }
            if(!$scope.accountSourceData['reportViewer']) {
                $scope.accountSourceData['reportViewer'] = [];
            }
        }

        // getApp列表数据
        (function () {
            var AppCache = $cacheFactory.get('app');
            // if(AppCache && AppCache.get('list')) {
            //     $scope.appsData = AppCache.get('list');
            // }else {
                if(AppCache) {
                    console.log(AppCache);
                }else {
                    AppCache = $cacheFactory('app');
                }
                
                // 异步获取
            $http({
                url: ApiCtrl.get('userAppList'),
                method: 'GET',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (result) {
                if(result && result.code == 200) {
                    $scope.appsData = result.data;
                    AppCache.put('list', result.data);
                }else {
                    Ui.alert(result.msg);
                }
            }).error(function (status) {
                Ui.alert('网络错误');
            });
        })();

        // 事件处理、表单效验
        (function () {
            $scope.tooltip = new tooltip({'position':'rc'}).getNewTooltip();

            // 邮箱是否重复标识  1不重复
            var flag = 0; 
            //表单失去焦点时错误提示
            $scope.blur = function(type, $errors){
                MdataVerify.blur(type, $errors, $scope);
                if(type == 'email'){
                    httpName = $scope.accountSourceData.username;
                    //验证是否重复
                    $http({
                        url: ApiCtrl.get('checkEmail'),
                        method: 'POST',
                        data: {username:httpName},
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        transformRequest: function(data){
                            return $.param(data);
                        }
                    }).success(function (result) {
                        if(result.code == 200) {                      
                            flag = 1;
                        }else{
                            Ui.alert(result.msg);
                            flag = 0;
                        }
                    });
                }
            };

            //表单焦点时清除错误提示
            $scope.focus = function (type) {
                $scope[type + 'Error'] = false;
                if($scope.tooltip.errorType == type) {
                    $scope.tooltip.hide();
                }
            };

            /*
             * 提交
             * 创建提交的数据中id为空，
             * 编辑提交的数据不为空
             * */
            $scope.submit = function () {
                //判断邮箱
                if(!MdataVerify.submit('email', $scope['accountForm']['email'].$error,$scope)){
                    return;
                }
                

                //判断用户名
                if(!MdataVerify.submit('accountName', $scope['accountForm']['accountName'].$error,$scope)){
                    return;
                }

                //判断密码
                if(!MdataVerify.submit('acountPassword', $scope['accountForm']['acountPassword'].$error,$scope)){
                    return;
                }
                $scope.accountSourceData["reportAdmin"] = $(".field-account").data('value');
                $scope.accountSourceData["reportViewer"] = $(".field-account").next().data('value');
                httpApp = $scope.accountSourceData;

                if($scope.accountId){ //编辑
                    httpAppUp.appid = $scope.appId;
                    $http({
                        url: ApiCtrl.get('userUpdate'),
                        method: 'POST',
                        data: httpApp
                        // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        // transformRequest: function(data){
                        //     return $.param(data);
                        // }
                    }).success(function (result) {
                        if(result && result.code == 200) {
                            Ui.alert('success', function () {
                                history.back();
                            });
                        }else {
                            Ui.alert(result.msg);
                        }
                    }).error(function (status) {
                        Ui.alert('网络错误！');
                    });
                }else{  //创建
                    if(flag == 0){
                        Ui.alert('用户名重复');
                        return;
                    }
                    $http({
                        url: ApiCtrl.get('userCreate'),
                        method: 'POST',
                        data: httpApp
                    }).success(function (result) {
                        if(result && result.code == 200) {
                            Ui.alert('success', function () {
                                history.back();
                            });
                        }else {
                            Ui.alert(result.msg);
                        }
                    }).error(function (status) {
                        Ui.alert('网络错误！');
                    });
                }
            };
        })();
    }
]);
