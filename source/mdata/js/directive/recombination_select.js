
/*
 * @directive 用来编辑复合值，复合属性,产出 >> [ a+b+c, c+b+d... ]
 * @* 本指令和cascadechoice指令区别是该指令只维护一组数据[]，并且数据的每个值由多个表单组合而成，支持回显操作
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
                var maxlength = attr.maxlength || null;
                var pattern = attr.pattern;
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
                     * @method 检测value第一个值的正确性
                     * @param {String} newVal 要检测的新值
                     * @param {String} oldVal 新值的前身，在重复检测时，新值不会与旧值进行比较
                     * */
                    $scope.nameVerify = function (newVal, oldVal) {
                        var oldVal = oldVal || '', nameReg = null, result = false;
                        var valName = newVal.split(separator)[0];

                        for(var i = 0; i < $scope.recombinationData.length; i++) {
                            if(oldVal === $scope.recombinationData[i]) {
                                continue;
                            }
                            if(valName === $scope.recombinationData[i].split(separator)[0]) {
                                Ui.alert('Name can not repeat');
                                return false;
                            }
                        }

                        if(pattern) {
                            try {
                                nameReg = new RegExp(pattern);
                                result = nameReg.test(valName);
                                if(!result) {
                                    Ui.alert('The name of the format error');
                                    return false;
                                }
                            }catch (e) {
                                console.log('value_group pattern error');
                                return false;
                            }
                        }

                        return true;
                    };

                    /*
                     * 添加值组,
                     * 值组中第一个值不允许重复
                     * */
                    element.on('click', '.add-select', function () {
                        var val = Echo.prototype.getValue($forms, separator);

                        if(!val) {
                            return;
                        }

                        // 最大数量效验
                        if(maxlength && $scope.recombinationData.length >= maxlength) {
                            Ui.alert('最多添加' + maxlength + '项值');
                            return;
                        }

                        // name重复效验
                        if(!$scope.nameVerify(val)) {
                            return;
                        }

                        // add值
                        $scope.recombinationData.push(val);
                        $scope.upRecombinationData($scope.recombinationData);
                        $scope.$apply();
                    });

                    /*
                     * 删除processor
                     * */
                    element.on('click', '.flag-icon_delete', function () {
                        var val = $(this).data('value');

                        $scope.$apply(function () {
                            for(var i = 0; i < $scope.recombinationData.length; i++) {
                                if($scope.recombinationData[i] == val) {
                                    $scope.recombinationData.splice(i, 1);
                                    $scope.upRecombinationData($scope.recombinationData);
                                    return;
                                }
                            }
                        });
                    });

                    /*
                     * 回显编辑
                     * */
                    element.on('click', '.flag-text', function () {
                        var val = $(this).data('value');
                        var $flag = $(this).parent('.flag');

                        var echo = new Echo({
                            value : val,
                            separator : separator,
                            domScope : element,

                            // 隐藏添加按钮，变化样式
                            before : function () {
                                $flag.css('backgroundColor', '#65c178').siblings().css('backgroundColor', '#12afcb');
                                element.find('.add-select').hide();
                            },

                            complete : function () {
                                $flag.css('backgroundColor', '#12afcb');
                                element.find('.add-select').show();
                            },

                            //如果新值为空或不变则不做任何处理
                            success : function (newVal) {
                                if(!newVal) {
                                    newVal = val;
                                }
                                if(val != newVal) {
                                    if(!$scope.nameVerify(val)) {
                                        return;
                                    }
                                    for(var i = 0; i < $scope.recombinationData.length; i++) {
                                        if($scope.recombinationData[i] == val) {
                                            console.log($scope.recombinationData);
                                            console.log($scope.recombinationData[i]);
                                            $scope.recombinationData[i] = newVal;
                                            $scope.upRecombinationData($scope.recombinationData);
                                            break;
                                        }
                                    }
                                    $scope.$apply();
                                }
                            }
                        });
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
