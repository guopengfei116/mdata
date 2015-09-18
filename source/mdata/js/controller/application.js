
var tooltip = require('Tooltip');

/*
 *  application manage控制器
 * */
oasgames.mdataControllers.controller('ApplicationManageCtrl', [
    '$scope',
    'Application',
    'Filter',
    'OrderHandler',
    function ($scope, Application, Filter, OrderHandler) {

        //定义default数据
        $scope.searchPlaceholder = 'Search AppName AppId...';
        $scope.sourceData = [];
        $scope.viewData = [];

        //展示列表数据初始化
        $scope.sourceData = Application.query().$promise.then(function (data) {
            $scope.sourceData = data.data;
            $scope.viewData = $scope.sourceData;
        });

        //搜索自定义处理函数
        $scope.searchHandler = function (searchVal) {
            $scope.viewData = Filter($scope.sourceData, {name : searchVal, id : searchVal});
        };

        //排序规则
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

        //修改排序规则
        $scope.changeSort = function (type, orderKey) {
            OrderHandler.change($scope.sort, type, orderKey);
        };

        //删除app
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
    }
]);


/*
 *  application create控制器
 * */
oasgames.mdataControllers.controller('ApplicationCreateCtrl', [
    '$scope',
    '$cacheFactory',
    '$route',
    'Application',
    'Account',
    'Filter',
    function ($scope, $cacheFactory, $route, Application, Account, Filter) {

        $scope.tooltip = new tooltip({'position':'rc'}).getNewTooltip();

        // 所有的account列表
        $scope.accountsData = [];

        // 当前app的信息
        $scope.appSourceData = [];

        // 当前编辑的appId
        $scope.appId = $route.current.params.appId;
        // 写死方便调试获取json-data
        $scope.appId = 'application_info';

        // getApp数据
        $scope.appSourceData = Application.get(
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

        // getAccount列表数据
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

        // 事件处理、表单效验
        (function () {
            $scope.blur = function(type,$errors){
                var errorInfo = {
                    name: {
                        pattern: 'Only accepts English letters and numbers'
                    }
                };
                console.log("sss");
                console.log($errors);
                for(var $error in $errors) {
                    console.log($errors);
                    if($errors[$error]) {
                        console.log($errors[$error]);
                        $scope[type + 'Error'] = true;
                        $scope.tooltip.errorType = type;
                        $scope.tooltip.setContent(errorInfo[type][$error]);
                        $scope.tooltip.setPosition('.fieldset-' + type, $scope.tooltip.toolTipLooks);
                        $scope.tooltip.toolTipLooks.css({'color': 'rgba(255, 0, 0, 0.7)'});
                        $scope.tooltip.show();
                        return;
                    }
                }

                $scope[type + 'Error'] = false;
            };

            //表单焦点时清除错误提示
            $scope.focus = function (type) {
                $scope[type + 'Error'] = false;
                if($scope.tooltip.errorType == type) {
                    $scope.tooltip.hide();
                }
            };

            // 提交 》》 需要修改get为save，开发期只能暂用get方法
            $scope.submit = function () {
                Application.get(
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


/*
 *  application edit控制器
 * */
oasgames.mdataControllers.controller('ApplicationEditCtrl', [
    '$scope',
    'ApplicationEdit',
    'Filter',
    function ($scope,ApplicationCreate,Filter) {
        $scope.viewData = [];
        $scope.tooltip = new tooltip({'position':'rc'}).getNewTooltip();

        //展示列表数据初始化
        $scope.viewData = ApplicationCreate.query().$promise.then(function (data) {
            $scope.viewData = data.data;
        });
    }
]);