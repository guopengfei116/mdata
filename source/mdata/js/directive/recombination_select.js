
/*
 * @用来编辑复合值，复合属性,产出 >> [ a+b+c, c+b+d... ]
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
            link: function ($scope, element, attr) {
                var separator = attr.separator;
                var $forms = element.find('.recombination-input');

                element.data('value', $scope.appSourceData['processor']);

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
                    for(var i = 0; i < $scope.appSourceData['processor'].length; i++) {
                        if($scope.appSourceData['processor'][i] == val) {
                            Ui.alert('请勿添加重复字段');
                            return;
                        }
                    }

                    // add值
                    element.data('value', $scope.appSourceData['processor']);
                    $scope.appSourceData['processor'].push(val);
                });

                /*
                * 删除processor
                * */
                element.on('click', '.flag-icon_delete', function () {
                    var val = $(this).data('value');
                    for(var i = 0; i < $scope.appSourceData['processor'].length; i++) {
                        if($scope.appSourceData['processor'][i] == val) {
                            $scope.appSourceData['processor'].splice(i, 1);
                            element.data('value', $scope.appSourceData['processor']);
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
                    $flag.css('bakcgrountColor', '#65c178');

                    // 隐藏添加按钮
                    element.find('.add-select').hide();

                    var echo = new Echo(
                        val,
                        separator,
                        element,
                        function (newVal) {
                            if(val != newVal) {
                                for(var i = 0; i < $scope.appSourceData['processor'].length; i++) {
                                    if($scope.appSourceData['processor'][i] == val) {
                                        $scope.appSourceData['processor'][i] = newVal;
                                        element.data('value', $scope.appSourceData['processor']);
                                        break;
                                    }
                                }
                                $flag.css('bakcgrountColor', '#12afcb').find('.flag-text').data('value', newVal).text(newVal);
                                $flag.find('.flag-icon_delete').data('value', newVal);
                                element.find('.add-select').show();
                            }
                        },
                        function () {
                            $flag.css('bakcgrountColor', '#12afcb');
                            element.find('.add-select').show();
                        }
                    );
                });

                /*
                * @echo 自定义复合表单组回写编辑
                * @param {String} value 构造器需要传入一个value值和分隔符用来回写数据，传入两个回调用来接收最新数据结果和后续处理操作
                * @param {String} separator value的分隔符
                * @param {Element} domScopo 一个dom对象，作为当前回显编辑操作的最大dom作用域，以避免对外界同类的操作影响
                * @param {Function} arguments最后两个参数，分别为确定和取消，回调函数会传入当前最新的值
                * @* echo会按照'.recombination-input'的数量进行分割value并按照顺序回写值
                * @* 回写时会添加确定与取消两个按钮到'.recombination-menu'里
                * */
                var Echo = function (value, separator, domScope) {

                    // 复合值的字符串
                    this.value = value;

                    // 分隔符
                    this.separator = separator;

                    // dom祖类
                    this.domScope = domScope;

                    // 回调
                    this.success = arguments[arguments.length - 2];
                    this.failure = arguments[arguments.length - 1];

                    // 初始化
                    this.init();
                };

                Echo.prototype = {
                    constructor : Echo,
                    inputSelector : '.recombination-input',
                    btnWrapSelector : '.recombination-menu',
                    btnTemplate :
                        '<menu class="echo-button inline-block">' +
                            '<a class="echo-button-check button button-check"><i class="iconfont icon-check"></i></a>' +
                            '<a class="echo-button-close button button-close"><i class="iconfont icon-close"></i></a>' +
                        '</menu>',

                    // 初始化
                    init : function () {
                        var self = this;
                        var $domScope = $(this.domScope);
                        var $echoForms = $domScope.find(this.inputSelector);
                        var values = this.value.split(this.separator);

                        // 检测value分割正确性
                        var echoFromCount = $echoForms.length;
                        if(values.length != echoFromCount) {
                            throw new Error('value字段分割与要求的长度不相符');
                        }

                        // 数据回写
                        this.setValue($echoForms, values);

                        // 事件绑定
                        self.bind();
                    },

                    // 销毁操作痕迹
                    destroy : function () {
                        var self = this;
                        var $domScope = $(this.domScope);
                        var $echoForms = $domScope.find(this.inputSelector);

                        $domScope.find('.echo-button').remove();
                        $domScope.off('click', '.echo-button-check');
                        $domScope.off('click', '.echo-button-close');
                        this.setValue($echoForms);
                    },

                    // echo确定和取消按钮
                    bind : function () {
                        var self = this;
                        var $domScope = $(this.domScope);
                        var $echoForms = $domScope.find(this.inputSelector);

                        // 防止重复添加
                        if($domScope.find('.echo-button').length) {
                            return;
                        }

                        // 添加echo操作按钮
                        $domScope.find(this.btnWrapSelector).append(this.btnTemplate);

                        // 绑定事件
                        $domScope.on('click', '.echo-button-check', function () {
                            var newVal = self.getValue($echoForms, self.separator);
                            self.success(newVal);
                            self.destroy();

                        }).on('click', '.echo-button-close', function () {
                            var newVal = self.getValue($echoForms, self.separator);
                            self.failure(newVal);
                            self.destroy();
                        })
                    },

                    /*
                    * @method 获取表单新值
                    * @param {$Element} $forms JQ表单对象，用于获取值
                    * @param {String} 分隔符，用于连接多个表单值
                    * @return {String} 所有表单值的拼接结果
                    * */
                    getValue : function ($forms, separator) {
                        var self = this;
                        var val = "", temVal = "", temWarn = "";
                        var separator = separator || "";

                        $forms.each(function () {
                            if($(this).hasClass('select')) {
                                temVal = $(this).data('value');
                            }else {
                                temVal = $(this).val();
                            }

                            // 必填项没有填写，进行提示，并返回""
                            temWarn = $(this).attr('required-warn');
                            if(!temVal && temWarn) {
                                Ui.alert(temWarn);
                                val = "";
                                return false;
                            }else {

                                // 第一次直接赋值
                                if(!val) {
                                    val = temVal;
                                }else {
                                    val += separator + temVal;
                                }
                            }
                        });

                        return val;
                    },

                    /*
                     * @method 表单数据回写
                     * @param {$Element} $forms JQ表单对象，用于回写值
                     * @param {Array || ""} 回写值，无回写值则回写""
                     * */
                    setValue : function ($forms, values) {
                        var self = this;
                        var values = values || [];

                        $forms.each(function (i) {
                            if($(this).hasClass('select')) {
                                self.selectEcho(this, values[i] || "");
                            }else {
                                self.textEcho(this, values[i] || "");
                            }
                        });
                    },

                    // 自定义select组件回写
                    selectEcho : function (select, val) {
                        var $select = $(select);
                        var $text = $select.find('.select_main_text');
                        var $textarea = $select.find('.select_main_textarea');

                        if($text.length) {
                            $text.text(val);
                        }
                        if($textarea.length) {
                            $textarea.val(val);
                        }
                        $select.data('value', val);
                    },

                    // text表单回写
                    textEcho : function (text, val) {
                        var $text = $(text);
                        $text.val(val);
                    }
                };
            },
            controller: [
                '$scope',
                function ($scope) {

                }
            ]
        }
    }
]);