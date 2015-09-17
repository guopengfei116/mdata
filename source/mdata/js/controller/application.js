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
var tooltip = require('Tooltip');
/*
 *  application create控制器
 * */
oasgames.mdataControllers.controller('ApplicationCreateCtrl', [
    '$scope',
    'ApplicationCreate',
    'Filter',
    function ($scope,ApplicationCreate,Filter) {
        $scope.viewData = [];
        $scope.tooltip = new tooltip({'position':'rc'}).getNewTooltip();

        //展示列表数据初始化
        $scope.viewData = ApplicationCreate.query().$promise.then(function (data) {
            $scope.viewData = data.data;
        });
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
        }
        //表单焦点时清除错误提示
        $scope.focus = function (type) {
            $scope[type + 'Error'] = false;
            if($scope.tooltip.errorType == type) {
                $scope.tooltip.hide();
            }
        };
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