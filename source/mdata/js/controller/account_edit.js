var tooltip = require('Tooltip');

/*
 *  account edit控制器
 * */
oasgames.mdataControllers.controller('AccountEditCtrl', [
    '$rootScope',
    '$scope',
    '$route',
    '$location',
    'MdataVerify',
    'AccountCache',
    'Http',
    function ($rootScope, $scope, $route, $location, MdataVerify, AccountCache, Http) {

        // 所有的app列表
        $scope.appsData = [];

        // 所有已选的app列表
        $scope.selectedAppids = [];

        // 当前account的数据
        $scope.accountSourceData = {};

        // 初始为空，通过判断username是否存在来设定username表单是否可编辑
        $scope.accountEmail = "";

        $scope.reportAdminSearch = '';
        $scope.reportViewerSearch = '';

        // 当前编辑的accountId
        $scope.accountId = $route.current.params.accountId;

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
            Http.userIndex({
                uid : $scope.accountId
            }, function (data) {
                $scope.sourceData = data;
                $scope.viewData = data;
                $scope.accountSourceData = data[0];
                $scope.accountEmail = data[0].username;
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
            if(!$scope.accountSourceData['password']) {
                $scope.accountSourceData['password'] = '';
            }
            if(!$scope.accountSourceData['nickname']) {
                $scope.accountSourceData['nickname'] = ' ';
            }
            if(!$scope.sourceData) {
                $scope.sourceData = [];
            }
            if(!$scope.viewData) {
                $scope.viewData = [];
            }
        }

        // getApp列表数据
        Http.userAppList(function (data) {
            $scope.appsData = data;
        });

        // 事件处理、表单效验
        (function () {
            $scope.tooltip = new tooltip({'position':'rc'}).getNewTooltip();

            // 邮箱是否重复标识  1不重复
            var flag = 0;

            /*
            * 表单失去焦点时错误提示及验证
            * */
            $scope.blur = function(type, $errors){
                MdataVerify.blur(type, $errors, $scope);
                if(type == 'email' && $scope.accountSourceData.username){
                    flag = 0;
                    Http.checkEmail({
                        username : $scope.accountSourceData.username
                    }, function () {
                        flag = 1;
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
             * 如果缓存为开启状态则缓存数据，如果缓存失败则关闭缓存
             * 修改accountListCache为false，触发accountList刷新列表
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

                // 提交数据
                var result = {}, subMethod = 'userCreate';
                if($scope.accountId) {     //accountId === uid
                    subMethod = 'userUpdate';
                    result.uid = $scope.accountId;
                }
                result.nickname = $.trim($scope.accountSourceData['nickname']);
                result.username = $.trim($scope.accountSourceData['username']);
                result.password = $.trim($scope.accountSourceData['password']);
                result.reportAdmin = $(".field-account").data('value');
                result.reportViewer = $(".field-account").next().data('value');

                Http[subMethod](result, function (data) {
                    result.uid = $scope.accountId || data.uid;
                    result.reportAdmin = $(".field-account").data('cacheValue');
                    result.reportViewer = $(".field-account").next().data('cacheValue');
                    if($rootScope.accountListCache) {
                        if(!AccountCache.addItem(result)) {
                            $rootScope.accountListCache = false;
                        }
                    }
                    $rootScope.applicationListCache = false;
                    Ui.alert('success', function () {
                        $scope.$apply(function () {
                            $location.path('/account/manage');
                        });
                    });
                });
            };

            /*
             * 取消提交
             * 返回account管理页面
             * */
            $scope.cancel = function () {
                Ui.confirm('Confirm to cancel the operation？', function () {
                    $scope.$apply(function () {
                        $location.path('/account/manage');
                    });
                });
            }
        })();
    }
]);
