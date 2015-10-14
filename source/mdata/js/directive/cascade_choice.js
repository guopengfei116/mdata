
/*
 * @account和application中的联动指令
 * @* 本指令和cascadechoice指令最大区别是需要维护多组数据，不支持回显
 *
 * */
oasgames.mdataDirective.directive('cascadechoice', [
    function () {
        return {
            restrict: 'E',
            replace: true,
            template:
                '<fieldset class="field-common field-account" ng-transclude>' +

                '</fieldset>',
            transclude: true,
            scope: {
                flagDataKey : '@',
                flagData : '=',
                selectData : '=',
                selectedData : '='
            },
            link: function ($scope, element, attr, reScope) {
                var $select = element.find('.select');
                var $selectInput = element.find('.select_main_textarea');

                // 记录数据初始化的状态
                var resultValueInit = false, selectDataInit = false, selectedDataInit = false;

                /*
                * flagData：当前单表单的已选数据, [{}, {}]
                * 通过flagData初始化resultValue数据,
                * 因为flagData数据是异步获取的，所以不能保证时实
                * */
                var flagDataWatchCancel = $scope.$watch('flagData', function (newValue, oldValue, scope) {

                    // flagData = undefined
                    if(!newValue) {
                        return;
                    }

                    console.log("begin flagData");
                    console.log($scope.flagData);
                    console.log("end flagData");

                    var flagData = $scope.flagData;
                    for(var i = 0; i < flagData.length; i++) {
                        $scope.resultValue.push(flagData[i][$scope.flagDataKey]);
                    }

                    resultValueInit = true;
                    $scope.$broadcast('bind');
                    flagDataWatchCancel();
                });

                /*
                * selectData：多表单共享的可选列表数据，为总数据源 [{}, {}]
                * 初始化完毕后更新appsViewData
                * */
                var selectDataWatchCancel = $scope.$watch('selectData', function (newValue, oldValue, scope) {

                    // selectData = undefined
                    if(!newValue) {
                        return;
                    }

                    console.log("begin selectData");
                    console.log($scope.selectData);
                    console.log("end selectData");

                    selectDataInit = true;
                    $scope.$broadcast('bind');
                    selectDataWatchCancel();
                });

                /*
                 * selectedData：多表单共享的已选数据，用来过滤可选列表 [val, val]
                 * selectedData初始化完毕后更新appsViewData
                 * */
                var selectedDataWatchCancel = $scope.$watch('selectedData', function (newValue, oldValue, scope) {

                    // selectedData = undefined
                    if(!newValue) {
                        return;
                    }

                    console.log("begin selectedData");
                    console.log($scope.selectedData);
                    console.log("end selectedData");

                    selectedDataInit = true;
                    $scope.$broadcast('bind');
                    selectedDataWatchCancel();
                });

                /*
                * 初始化dom
                * */
                $scope.$on('bind', function () {
                    if(!resultValueInit || !selectDataInit || !selectedDataInit) {
                        console.log('未初始化完成');
                        return;
                    }

                    console.log("begin resultValue");
                    console.log($scope.resultValue);
                    console.log("end resultValue");

                    // 添加未编辑时的初始值
                    element.data('value', $scope.resultValue);

                    // 把初始值添加进入已选值总和
                    $scope.selectedData.push.apply($scope.selectedData, $scope.resultValue);

                    // 绑定add事件
                    element.on('click', '.add-select', function () {
                        var val = $select.data('value');

                        if(!val) {
                            Ui.alert('please fill out the data');
                            return;
                        }

                        // 值重复效验
                        for(var i = 0; i < $scope.resultValue.length; i++) {
                            if(val[$scope.flagDataKey] === $scope.resultValue[i]) {
                                Ui.alert('can not repeat');
                                return;
                            }
                        }

                        // 更新当前所属表单的值
                        $scope.resultValue.push(val[$scope.flagDataKey]);
                        element.data('value', $scope.resultValue);

                        // 添加到公有已选数据
                        $scope.selectedData.push(val[$scope.flagDataKey]);

                        // 更新flag展示列表
                        $scope.flagData.push(val);

                        // 清空值
                        $select.data('value', '');
                        $selectInput.val('');

                        $scope.$apply();
                    });

                    // 绑定delete事件
                    element.on('click', '.flag-icon_delete', function () {
                        var val = $(this).data('value');

                        // 删除值，更新结果数据，result是单个表单的值
                        for(var i = 0; i < $scope.resultValue.length; i++) {
                            if($scope.resultValue[i] == val) {
                                $scope.resultValue.splice(i, 1);
                                break;
                            }
                        }
                        element.data('value', $scope.resultValue);

                        // 删除值，更新select选择列表，selected是多个表单值的集合
                        for(var i = 0; i < $scope.selectedData.length; i++) {
                            if($scope.selectedData[i] == val) {
                                $scope.selectedData.splice(i, 1);
                                break;
                            }
                        }

                        // 删除值，更新选择展示列表，result是单个表单的值所属的对象类型
                        for(var i = 0; i < $scope.flagData.length; i++) {
                            if($scope.flagData[i][$scope.flagDataKey] == val) {
                                $scope.flagData.splice(i, 1);
                                break;
                            }
                        }

                        $scope.$apply();
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
