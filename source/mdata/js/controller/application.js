
var tooltip = require('Tooltip');

/*
 *  application manage控制器
 * */
oasgames.mdataControllers.controller('ApplicationManageCtrl', [
    '$scope',
    '$cacheFactory',
    'Application',
    'Filter',
    'OrderHandler',
    function ($scope, $cacheFactory, Application, Filter, OrderHandler) {

        // 定义default数据
        $scope.searchPlaceholder = 'Search AppName AppId...';
        $scope.sourceData = [];
        $scope.viewData = [];

        // getApp列表数据
        var appCache = $cacheFactory.get('app');
        if(appCache && appCache.get('list')) {
            $scope.sourceData = appCache.get('list');
            $scope.viewData = $scope.sourceData;
        }else {
            appCache = $cacheFactory('app');
            // 异步获取
            Application.query().$promise.then(
                function (result) {
                    if(result && result.code == 200) {
                        $scope.sourceData = result.data;
                        $scope.viewData = result.data;
                        appCache.put('list', result.data);
                    }else {
                        Ui.alert(result.msg);
                    }
                },
                function () {
                    Ui.alert('网络错误');
                }
            );
        }

        // 搜索自定义处理函数
        $scope.searchHandler = function (searchVal) {
            $scope.viewData = Filter($scope.sourceData, {name : searchVal, appid : searchVal});
        };

        // 排序规则
        $scope.sort = {
            appList : {
                orderKey : 'name',
                isDownOrder : false
            },
            adminUsers : {
                orderKey : 'name',
                isDownOrder : false
            },
            viewerUsers : {
                orderKey : 'name',
                isDownOrder : false
            }
        };

        // 修改排序规则
        $scope.changeSort = function (type, orderKey) {
            OrderHandler.change($scope.sort, type, orderKey);
        };

        // 事件处理
        (function () {
            // 删除app
            $scope.delete = function (appId) {
                Ui.confirm('确定要删除这个app吗', function () {
                    Application.save(
                        {appId : appId},
                        {appId : appId},
                        function (result) {
                            if(result && result.code == 200) {
                                Ui.alert('删除成功');
                            }else {
                                Ui.alert('删除失败');
                            }
                        },
                        function () {
                            Ui.alert('网络错误');
                        }
                    );
                });
            };
        })();
    }
]);


/*
 *  application create控制器
 * */
oasgames.mdataControllers.controller('ApplicationEditCtrl', [
    '$scope',
    '$cacheFactory',
    '$route',
    'Application',
    'Account',
    'Filter',
    'MdataVerify',
    function ($scope, $cacheFactory, $route, Application, Account, Filter, MdataVerify) {
 
        $scope.tooltip = new tooltip({'position':'rc'}).getNewTooltip();

        // 所有的account列表
        $scope.accountsData = [];
        $scope.selectedAccountuids = [];

        // 当前app的信息
        $scope.appSourceData = [];

        // 当前编辑的appId
        $scope.appId = $route.current.params.applicationId;

        /*
         * 如果有id，则说明是编辑状态
         * accountId先写死方便调试获取json-data
         * */
        if($scope.appId) {
            $scope.appId = 'application_info';
            initAppData();
        }

        // getApp数据
        function initAppData () {
            Application.get(
                {appId: $scope.appId},
                function (result) {
                    if(result && result.code == 200) {
                        $scope.appSourceData = result.data;
                    }else {
                        Ui.alert(result.msg);
                    }
                },
                function () {
                    Ui.alert('网络错误');
                }
            );
        }

        // getAccount列表数据
        (function () {
            var accountCache = $cacheFactory.get('account');
            if(accountCache && accountCache.get('list')) {
                $scope.accountsData = accountCache.get('list');
            }else {
                accountCache = $cacheFactory('account');
                // 异步获取
                Account.query().$promise.then(
                    function (result) {
                        if(result && result.code == 200) {
                            $scope.accountsData = result.data;
                            accountCache.put('list', result.data);
                        }else {
                            Ui.alert(result.msg);
                        }
                    },
                    function () {
                        Ui.alert('网络错误');
                    }
                );
            }
        })();

        // 事件处理、表单效验
        (function () {
            //表单失去焦点时错误提示
            $scope.blur = function(type, $errors){

                MdataVerify.blur(type, $errors, $scope);
            };

            //表单焦点时清除错误提示
            $scope.focus = function (type) {
                $scope[type + 'Error'] = false;
                if($scope.tooltip.errorType == type) {
                    $scope.tooltip.hide();
                }
            };
            //表单焦点时清除错误提示
            $scope.focus = function (type) {
                $scope[type + 'Error'] = false;
                if($scope.tooltip.errorType == type) {
                    $scope.tooltip.hide();
                }
            };

            // 调试期只能暂用get方法，测试期需要修改method方法为对应fn
            var submitMethod = 'get';

            /*
             * 提交
             * 创建提交的数据中id为空，
             * 编辑提交的数据不为空
             * */
            $scope.submit = function () {
                Application[submitMethod](
                    {appId: $scope.appId},
                    $scope.appSourceData,
                    function (result) {
                        if(result && result.code == 200) {
                            Ui.alert('success', function () {
                                history.back();
                            });
                        }else {
                            Ui.alert(result.msg);
                        }
                    },
                    function () {
                        Ui.alert('网络错误');
                    }
                )
            };
        })();
    }
]);
