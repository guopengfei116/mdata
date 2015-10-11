
/*
 * @method report中的value_group表单组
 * @* 所有表单的值都按照key-value的形式进行存储，提交key，展示value
 * */
oasgames.mdataDirective.directive('valuegroup', [
    function () {
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
                    console.log("end valueGroup resultValue");

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

                        // name重复效验
                        var valName = val.split(separator)[0];
                        for(var i = 0; i < $scope.resultValue.length; i++) {
                            if(valName === $scope.resultValue[i].split(separator)[0]) {
                                Ui.alert('name can not repeat');
                                return;
                            }
                        }

                        // add值
                        $scope.resultValue.push(val);
                        $scope.flagData.push({
                            value_name : valName,
                            groupValue : val
                        });
                        element.data('value', $scope.resultValue);
                    });

                    // delete事件
                    element.on('click', '.flag-icon_delete', function () {
                        var val = $(this).data('value');

                        // 删除resultValue
                        for(var i = 0; i < $scope.resultValue.length; i++) {
                            if($scope.resultValue[i] == val) {
                                $scope.resultValue.splice(i, 1);
                            }
                        }
                        element.data('value', $scope.resultValue);

                        // 删除flagData
                        for(var i = 0; i < $scope.flagData.length; i++) {
                            if($scope.flagData[i]['groupValue'] == val) {
                                $scope.flagData.splice(i, 1);
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

                        function initForms () {
                            var vals = val.split(separator);
                            console.log(vals);
                            var $tempInput = null;
                            var valMark = 2;
                            while(valMark < vals.length) {

                                if(!vals.length || !valMark) {
                                    break;
                                }

                                // 第一个value
                                if(valMark == 2) {
                                    $scope.changeValueGroup(element.find('.value-group1'), vals[valMark]);
                                    valMark++;
                                    continue;
                                }

                                // 运算符，如果是string类型，则证明是上一个value值的子项，需要++获取运算符的值
                                if(valMark == 3) {
                                    if(typeof vals[valMark] == 'string') {
                                        valMark++;
                                    }
                                    $scope.changeOperation(vals[valMark]);
                                    valMark++;
                                    continue;
                                }

                                // 第二个value
                                if(valMark == 4 || valMark == 5) {
                                    $scope.changeValueGroup(element.find('.value-group2'), vals[valMark]);
                                    valMark++;
                                    continue;
                                }
                            }
                        }

                        $scope.initForms();
                        initForms();

                        var echo = new Echo(
                            val,
                            separator,
                            element,
                            function (newVal) {

                                // 更新复合表单值
                                if(val != newVal) {
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
                        console.log("end valueGroup valueList");

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
                        console.log("end valueGroup flagData");

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
