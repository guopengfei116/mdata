
/*
 * @directive 用来编辑复合值，复合属性,产出 >> [ a+b+c, c+b+d... ]
 * @* 本指令和cascadechoice指令最大区别是改指令只维护一组数据进行添加，节省内存开销，支持回显
 *
 * @*添加数据绑定在'.add-select'选择器上，
 * @*删除数据绑定在'.flag-icon_delete'选择器上
 * @*数据回显绑定在'.flag-text'选择器上
 *
 * @* 标签内所有需要处理的表单需要添加"recombination-input"class做标记
 * @* 指令在回写状态时会在class为"recombination-menu"的DOM中添加两个编辑按钮
 *
 * */
oasgames.mdataDirective.directive('recombination', [
    function () {
        return {
            restrict: 'E',
            replace: true,
            template:
                '<fieldset class="field-common" ng-transclude>' +

                '</fieldset>',
            transclude: true,
            scope: {
                recombinationData: '='
            },
            link: function ($scope, element, attr) {
                var separator = attr.separator;
                var $forms = element.find('.recombination-input');
                var Echo = require('Echo');

                // 更新复合表单值
                $scope.upRecombinationData = function (data) {
                    element.data('value', data);
                };

                /*
                * 事件绑定
                * */
                $scope.$on('recombinationDataInitFinish', function (event, recombinationData) {

                    if(!$scope.recombinationData) {
                        throw new Error('数据初始化失败');
                    }

                    // 初始化复合表单默认值
                    $scope.upRecombinationData($scope.recombinationData);

                    /*
                     * 添加processor,
                     * 不允许重复的processor
                     * */
                    element.on('click', '.add-select', function () {

                        var val = Echo.prototype.getValue($forms, separator);
                        if(!val) {
                            return;
                        }

                        // 重复效验
                        for(var i = 0; i < $scope.recombinationData.length; i++) {
                            if($scope.recombinationData[i] == val) {
                                Ui.alert('请勿添加重复字段');
                                return;
                            }
                        }

                        // add值
                        $scope.recombinationData.push(val);
                        $scope.upRecombinationData($scope.recombinationData);
                    });

                    /*
                     * 删除processor
                     * */
                    element.on('click', '.flag-icon_delete', function () {
                        var val = $(this).data('value');

                        for(var i = 0; i < $scope.recombinationData.length; i++) {
                            if($scope.recombinationData[i] == val) {
                                $scope.recombinationData.splice(i, 1);
                                $scope.upRecombinationData($scope.recombinationData);
                                return;
                            }
                        }
                    });

                    /*
                     * 回显编辑
                     * */
                    element.on('click', '.flag-text', function () {
                        var val = $(this).data('value');
                        var $flag = $(this).parent('.flag');

                        // 隐藏添加按钮，变化样式
                        $flag.css('bakcgrountColor', '#65c178');
                        element.find('.add-select').hide();

                        var echo = new Echo(
                            val,
                            separator,
                            element,

                            /*
                            * 成功回调函数，
                            * 如果新值为空或不变则不做任何处理
                            * */
                            function (newVal) {

                                if(!newVal) {
                                    newVal = val;
                                }
                                if(val != newVal) {
                                    for(var i = 0; i < $scope.recombinationData.length; i++) {
                                        if($scope.recombinationData[i] == val) {
                                            $scope.recombinationData[i] = newVal;
                                            $scope.upRecombinationData($scope.recombinationData);
                                            break;
                                        }
                                    }
                                    $flag.find('.flag-text').data('value', newVal).text(newVal);
                                    $flag.find('.flag-icon_delete').data('value', newVal);
                                }

                                // 恢复样式
                                $flag.css('bakcgrountColor', '#12afcb');
                                element.find('.add-select').show();
                            },
                            function () {
                                $flag.css('bakcgrountColor', '#12afcb');
                                element.find('.add-select').show();
                            }
                        );
                    });
                });
            },
            controller: [
                '$scope',
                function ($scope) {

                    /*
                     * 初始化完毕后绑定事件
                     * */
                    var recombinationDataWatchCancel = $scope.$watch('recombinationData', function (newValue, oldValue, scope) {

                        // recombinationData = undefined
                        if(!newValue) {
                            return;
                        }

                        console.log("begin recombinationData");
                        console.log($scope.recombinationData);
                        console.log("end recombinationData");

                        $scope.$emit('recombinationDataInitFinish', $scope.recombinationData);
                        recombinationDataWatchCancel();
                    });
                }
            ]
        }
    }
]);