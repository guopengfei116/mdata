
/*
 * @method report中的value_group表单组
 * @* 所有表单的值都按照key-value的形式进行存储，提交key，展示value
 * */
oasgames.mdataDirective.directive('valuegroup', [
    'ValueGroup',
    function (ValueGroup) {
        return {
            restrict: 'E',
            replace: true,
            template:
            '<fieldset class="field-common field-account" ng-transclude>' +

            '</fieldset>',
            transclude: true,
            scope: {
                valueList : '=',
                flagData : '='
            },
            link: function ($scope, element, attr) {
                var separator = attr.separator;
                var maxlength = attr.maxlength || null;
                var pattern = attr.pattern;
                var Echo = require('Echo');

                /*
                * 通过运算符控制第二组value表单的填写
                * */
                $scope.changeOperation = function (val) {
                    var $valueGroup2 = element.find('.value-group2');
                    if(val == 0) {
                        $valueGroup2.find('.recombination-input').removeClass('recombination-input');
                        $valueGroup2.hide();
                    }else {
                        $($valueGroup2.find('.select')[0]).addClass('recombination-input').show().siblings().removeClass('recombination-input').hide();
                        $valueGroup2.show();
                    }
                };

                /*
                * value表单根据第一个值来确定是否需要添加第二个值,
                * */
                $scope.changeValueGroup = function ($valueGroup, val) {
                    var valueProperty = $scope.valueList[val];
                    var format = null, childrenSelectList = [], tmp = '';

                    // 隐藏value子表单项
                    $valueGroup.find('.recombination-input').not('.value-group-type').removeClass('recombination-input').hide();

                    if(!valueProperty) {
                        return;
                    }

                    // 获取format属性值
                    format = valueProperty.format;

                    // format 为 "" 时保持不变
                    if(!format) {

                    // format 的值如果包涵,号，则初始化一个select联动列表
                    }else if(format.indexOf(',') > 0){
                        childrenSelectList = format.split(',');
                        for(var i = 0; i < childrenSelectList.length; i++) {
                            tmp += '<a class="select_content_list_value" data-value="' + childrenSelectList[i] + '">' + childrenSelectList[i] + '</a>';
                        }
                        $valueGroup.find('.value-group-format').addClass('recombination-input').show().find('.select_content_list').append(tmp);

                    // format 为其它值时，显示一个必填输入框
                    }else {
                        $valueGroup.find('.fieldset-text-com').addClass('recombination-input').attr('placeholder', format).show();
                    }
                };

                /*
                 * @method 检测value第一个值的正确性
                 * @param {String} newVal 要检测的新值
                 * @param {String} oldVal 新值的前身，在重复检测时，新值不会与旧值进行比较
                 * */
                $scope.nameVerify = function (newVal, oldVal) {
                    var oldVal = oldVal || '', nameReg = null, result = false;
                    var valName = newVal.split(separator)[0];

                    for(var i = 0; i < $scope.resultValue.length; i++) {
                        if(oldVal === $scope.resultValue[i]) {
                            continue;
                        }
                        if(valName === $scope.resultValue[i].split(separator)[0]) {
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

                // 销毁填写痕迹
                $scope.destroy = function () {
                    var $echoForms = element.find(Echo.prototype.inputSelector);
                    Echo.prototype.setValue($echoForms);
                };

                /*
                * 表单样式初始化
                * */
                $scope.initForms = function () {
                    $scope.changeValueGroup($('.value-group1'), "");
                    $scope.changeValueGroup($('.value-group2'), "");
                    $scope.changeOperation(0);
                };

                /*
                 * 初始化dom
                 * */
                $scope.$on('bind', function () {

                    if(!$scope.resultValueInit || !$scope.valueList) {
                        console.log('未初始化完成');
                        return;
                    }

                    // 初始化两个value表单组
                    $scope.initForms();

                    console.log("begin valueGroup resultValue");
                    console.log($scope.resultValue);

                    // 添加未编辑时的初始值
                    element.data('value', $scope.resultValue);

                    // value-select事件
                    element.on('click', '.value-group .select_content_list_value-group', function () {
                        var val = $(this).data('value');
                        $scope.changeValueGroup($(this).parents('.value-group'), val);
                    });

                    // 运算符select事件
                    element.on('click', '.select_content_list_value-operator', function () {
                        var val = $(this).data('value');
                        $scope.changeOperation(val);
                    });

                    // add事件
                    element.on('click', '.add-select', function () {
                        var $forms = element.find('.recombination-input');
                        var val = Echo.prototype.getValue($forms, separator);

                        if(!val) {
                            Ui.alert('please fill out the data');
                            return;
                        }

                        // 最大数量效验
                        if(maxlength && $scope.resultValue.length >= maxlength) {
                            Ui.alert('You can only add 20 Values');
                            return;
                        }

                        // name重复效验
                        if(!$scope.nameVerify(val)) {
                            return;
                        }

                        // add值
                        $scope.resultValue.push(val);
                        $scope.flagData.push({
                            value_name : val.split(separator)[0],
                            groupValue : val
                        });
                        element.data('value', $scope.resultValue);
                        $scope.destroy();
                        $scope.$apply();
                    });

                    // delete事件
                    element.on('click', '.flag-icon_delete', function () {
                        var val = $(this).data('value');

                        // 删除resultValue
                        for(var i = 0; i < $scope.resultValue.length; i++) {
                            if($scope.resultValue[i] == val) {
                                $scope.resultValue.splice(i, 1);
                                break;
                            }
                        }
                        element.data('value', $scope.resultValue);

                        // 删除flagData
                        for(var i = 0; i < $scope.flagData.length; i++) {
                            if($scope.flagData[i]['groupValue'] == val) {
                                $scope.flagData.splice(i, 1);
                                break;
                            }
                        }

                        $scope.$apply();
                    });

                    /*
                     * 回显编辑
                     * */
                    element.on('click', '.flag-text', function () {
                        var val = $(this).data('value');
                        var $flag = $(this).parent('.flag');

                        // 表单初始化
                        (function initForms () {
                            $scope.initForms();
                            var valueArithmetic = '', valueArithmeticIndex = 3, valueGroup2Index = 4, vals = '';
                            vals = val.split(separator);

                            if(!vals || !vals.length) {
                                return;
                            }

                            // 如果拥有format值，那么运算符值和第二组表单第一个值所在的位置将向后挪一位
                            var format = ValueGroup.getValueFormat(vals[2], $scope.valueList) || '';

                            if(format) {
                                valueArithmeticIndex++;
                                valueGroup2Index++;
                            }

                            // 依据第一组表单第一个值确定第一组表单第二个值形态
                            $scope.changeValueGroup(element.find('.value-group1'), vals[2]);

                            // 依据运算符确定第二组表单形态
                            $scope.changeOperation(vals[valueArithmeticIndex]);

                            // 依据第二组表单第一个值确定第二组表单第二个值形态
                            $scope.changeValueGroup(element.find('.value-group2'), vals[valueGroup2Index]);

                        })();

                        var echo = new Echo({
                            value : val,
                            separator : separator,
                            domScope : element,

                            // 隐藏添加按钮，变化样式
                            before : function(){
                                $flag.css('backgroundColor', '#65c178').siblings().css('backgroundColor', '#12afcb');
                                element.find('.add-select').hide();
                            },

                            complete : function(){
                                $flag.css('backgroundColor', '#12afcb');
                                element.find('.add-select').show();
                            },

                            echoSuccess : function () {
                                var $valueTypeInput = $('.select-value-type').find('.select_main_text');
                                var $valueArithmeticInput = $('.select-value-arithmetic').find('.select_main_text');
                                var valueTypeVal = $valueTypeInput.val();
                                var valueArithmeticVal = $valueArithmeticInput.val();
                                var valueType = ValueGroup.getValueType(valueTypeVal);
                                var valueArithmetic = ValueGroup.getValueArithmetic(valueArithmeticVal);
                                $valueTypeInput.val(valueType);
                                $valueArithmeticInput.val(valueArithmetic);
                            },

                            /*
                            * 如果新值为空或不变则不做任何处理,
                            * 如果值做了改变，则直接操作dom修改显示值比更新flagData效率要快
                            * */
                            success : function(newVal){
                                if(!newVal) {
                                    newVal = val;
                                }
                                if(val != newVal) {
                                    if(!$scope.nameVerify(newVal, val)) {
                                        return;
                                    }
                                    for(var i = 0; i < $scope.resultValue.length; i++) {
                                        if($scope.resultValue[i] == val) {
                                            $scope.resultValue[i] = newVal;
                                            element.data('value', $scope.resultValue);
                                            break;
                                        }
                                    }
                                    $flag.find('.flag-text').data('value', newVal).text(newVal.split(separator)[0]);
                                    $flag.find('.flag-icon_delete').data('value', newVal);
                                }
                            }
                        });
                    });

                    // 拖拽
                    $scope.$on('valuesRenderFinished', function (e) {
                        var sortableContainer = $('.value-sortable');
                        sortableContainer.sortable().bind('sortupdate', function () {
                            var flagText = sortableContainer.find('.flag-text');

                            // 重构resultValue值
                            console.log($scope.resultValue);
                            flagText.each(function (i, e) {
                                var val = $(this).data('value');
                                $scope.resultValue[i] = val;
                            });
                            console.log($scope.resultValue);

                            // 重构flagData和Domvalue值
                            for(var i = 0; i < $scope.resultValue.length; i++) {
                                $scope.flagData[i] = {
                                    value_name : $scope.resultValue[i].split(separator)[0],
                                    groupValue : $scope.resultValue[i]
                                };
                            }
                            element.data('value', $scope.resultValue);
                        });
                    });
                });
            },
            controller: [
                '$scope',
                function ($scope) {

                    // 要提交的值 [val, val]
                    $scope.resultValue = [];

                    // 记录数据初始化的状态
                    $scope.resultValueInit = false;
                    $scope.valueListInit = false;

                    /*
                     * selectData：表单的可选数据 [{}, {}]
                     * 初始化完毕后更新appsViewData
                     * */
                    var valueListWatchCancel = $scope.$watch('valueList', function (newValue, oldValue, scope) {

                        // valueList = undefined
                        if(!newValue) {
                            return;
                        }

                        console.log("begin valueGroup valueList");
                        console.log($scope.valueList);

                        $scope.valueListInit = true;
                        $scope.$broadcast('bind');
                        valueListWatchCancel();
                    });

                    /*
                     * flagData：表单的已选数据, [{}, {}]
                     * 通过flagData初始化resultValue数据,
                     * 因为flagData数据是异步获取的，所以不能保证时实
                     * */
                    var flagDataWatchCancel = $scope.$watch('flagData', function (newValue, oldValue, scope) {

                        // flagData = undefined
                        if(!newValue) {
                            return;
                        }

                        console.log("begin valueGroup flagData");
                        console.log($scope.flagData);

                        // 初始化结果值
                        var flagData = $scope.flagData;
                        for(var i = 0; i < flagData.length; i++) {
                            $scope.resultValue.push(flagData[i]['groupValue']);
                        }

                        $scope.resultValueInit = true;
                        $scope.$broadcast('bind');
                        flagDataWatchCancel();
                    });
                }
            ]
        }
    }
]);
