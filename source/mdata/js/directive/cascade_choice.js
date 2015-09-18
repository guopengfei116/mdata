
/*
 * @account和application联动指令
 * 父控制器需要申明sourceData 和 viewData两个变量以供指令使用，
 * 指令只帮助处理了搜索为空的处理，
 * 具体搜索逻辑需父控制器自己定义searchHandler函数，接收搜索值进行处理，
 * 如果搜索输入框需要placeholder，则在父控制器作用域设置searchPlaceholder值
 * */
oasgames.mdataDirective.directive('cascadechoice', [
    function () {
        return {
            restrict: 'E',
            replace: true,
            template:
                '<fieldset class="field-common field-account" ng-transclude>' +
                    '<legend class="field-title-account">As Report Admin</legend>' +
                    '<div>' +
                        '<div class="select select-host select-btn">' +
                            '<div class="select_main">' +
                                '<input class="select_main_textarea select_target" type="text" value="mail">' +
                                '<button class="select_main_btn select_target">' +
                                    '<i class="select_main_btn_icon"></i>' +
                                '</button>' +
                            '</div>' +
                            '<ul class="select_content">' +
                                '<li class="select_content_arrow"></li>' +
                                '<li class="select_content_arrow select_content_arrow-mask"></li>' +
                                '<li class="select_content_list" ng-repeat="app in appsData">' +
                                    '<a class="select_content_list_value" data-value="{{ app.appid }}">{{ app.name }}</a>' +
                                '</li>' +
                            '</ul>' +
                        '</div>' +
                        '<button class="button tooltip-host" data-tooltip-position="tc" data-tooltip-info="tc">add</button>' +
                        '<a class="button button-check"><i class="iconfont icon-check"></i></a>' +
                        '<a class="button button-close"><i class="iconfont icon-close"></i></a>' +
                    '</div>' +
                    '<div class="textarea">' +
                        '<span class="flag flag-icon" ng-repeat="app in accountSourceData.as_report_admin">' +
                            '{{ app.appname }}' +
                            '<i class="flag-icon_delete iconfont icon-close"></i>'+
                        '</span>' +
                    '</div>' +
                '</fieldset>',
            transclude: true,
            link: function ($scope, element, attr) {

            },
            controller: [
                '$scope',
                function ($scope) {

                }
            ]
        }
    }
]);