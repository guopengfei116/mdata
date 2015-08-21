var Ui = function () {

};

Ui.prototype = {
    constructor: Ui,
    alert: (function () {
        var Alert = {
            initialized: false,
            looks: null,
            init: function () {
                var tpl =
                    '<div class="alert">' +
                        '<section class="alert_mask"></section>' +
                        '<aside class="alert_panel">' +
                            '<section class="alert_panel_info">' +
                            '</section>' +
                            '<section class="alert_panel_btn">' +
                                '确定' +
                            '</section>' +
                        '</aside>' +
                    '</div>';
                Alert.looks = $(tpl).hide().appendTo('body');
                Alert.bind();
                Alert.initialized = true;
            },
            bind: function () {
                $(document).on('touchend click', '.alert_panel_btn', function() {
                    Alert.hide();
                });
            },
            setInfo: function (info) {
                Alert.looks.find('.alert_panel_info').html(info);
            },
            show: function () {
                Alert.looks.show();
            },
            hide: function () {
                Alert.looks.hide();
            }
        };
        return function (info) {
            if(Alert.initialized) {
                Alert.setInfo(info);
                Alert.show();
            }else {
                Alert.init();
                this.alert(info);
            }
        }
    })(),
    position: (function () {

    })()
};
