
/*
 * @account和application联动指令
 * 父控制器需要申明sourceData 和 viewData两个变量以供指令使用，
 * 指令只帮助处理了搜索为空的处理，
 * 具体搜索逻辑需父控制器自己定义searchHandler函数，接收搜索值进行处理，
 * 如果搜索输入框需要placeholder，则在父控制器作用域设置searchPlaceholder值
 * */
oasgames.mdataDirective.directive('cascadechoice', [
    'Exclude',
    function (Exclude) {
        return {
            restrict: 'E',
            replace: true,
            template:
                '<fieldset class="field-common field-account" ng-transclude>' +

                '</fieldset>',
            transclude: true,
            scope: {
                selectData : '=',
                flagData : '=',
                selectedData : '=',
                flagDataKey : '@'
            },
            link: function ($scope, element, attr, reScope) {
                var $select = element.find('.select');
                var $selectInput = element.find('.select_main_textarea');
                var $addSelect = element.find('.add-select');

                // 记录数据初始化的状态
                var resultValueInit = false, selectDataInit = false, selectedDataInit = false;

                /*
                * flagData初始化完毕后初始化resultValue
                * */
                var flagDataWatchCancel = $scope.$watch('flagData', function (newValue, oldValue, scope) {
                    // flagData = undefined
                    if(!newValue) {
                        $scope.flagData = [];
                    }

                    /*
                     * flagData  已存的对象 [{}, {}]
                     * 通过flagData初始化resultValue数据,
                     * 因为flagData数据是异步获取的，所以不能保证时实
                     * */
                    var flagData = $scope.flagData;
                    if(!resultValueInit) {
                        for(var i = 0; i < flagData.length; i++) {
                            $scope.resultValue.push(flagData[i][$scope.flagDataKey]);
                        }
                    }

                    resultValueInit = true;
                    $scope.$broadcast('bind');
                    flagDataWatchCancel();
                });

                /*
                * selectData初始化完毕后更新appsViewData
                * */
                var selectDataWatchCancel = $scope.$watch('selectData', function (newValue, oldValue, scope) {
                    console.log($scope.selectData);
                    selectDataInit = true;
                    $scope.$broadcast('bind');
                    selectDataWatchCancel();
                });

                /*
                 * selectedData初始化完毕后更新appsViewData
                 * */
                var selectedDataWatchCancel = $scope.$watch('selectedData', function (newValue, oldValue, scope) {
                    console.log($scope.selectedData);
                    selectedDataInit = true;
                    $scope.$broadcast('bind');
                    selectDataWatchCancel();
                });

                /*
                * 初始化dom
                * */
                $scope.$on('bind', function () {

                    if(!resultValueInit || !selectDataInit || !selectedDataInit) {
                        console.log('未初始化完成');
                        return;
                    }

                    // 绑定add事件
                    $addSelect.bind('click', function () {
                        if(!resultValueInit) {
                            Ui.alert('数据初始化失败');
                            return;
                        }

                        var val = $select.data('value');
                        if(!val) {
                            Ui.alert('请先选择');
                            return;
                        }

                        // 更新select值
                        $scope.resultValue.push(val[$scope.flagDataKey]);
                        element.data('value', $scope.resultValue);

                        // 更新select选择列表
                        $scope.selectedData.push(val[$scope.flagDataKey]);

                        // 更新选择展示列表
                        $scope.flagData.push(val);

                        // 清空值
                        $select.data('value', '');
                        $selectInput.val('');
                    });

                    element.on('click', '.flag-icon_delete', function () {
                        var val = $(this).data('value');

                        // 删除值，更新select值
                        for(var i = 0; i < $scope.resultValue.length; i++) {
                            if($scope.resultValue[i] == val) {
                                $scope.resultValue.splice(i, 1);
                            }
                        }
                        element.data('value', $scope.resultValue);

                        // 删除值，更新select选择列表
                        for(var i = 0; i < $scope.selectedData.length; i++) {
                            if($scope.selectedData[i] == val) {
                                $scope.selectedData.splice(i, 1);
                            }
                        }

                        // 删除值，更新选择展示列表
                        for(var i = 0; i < $scope.flagData.length; i++) {
                            if($scope.flagData[i][$scope.flagDataKey] == val) {
                                $scope.flagData.splice(i, 1);
                            }
                        }
                    });
                });
            },
            controller: [
                '$scope',
                function ($scope) {

                    // 所选值在flagData中的key名
                    var flagDataKey = $scope.flagDataKey;

                    // 要提交的值 [val, val]
                    $scope.resultValue = [];
                }
            ]
        }
    }
]);
