/**
 * @param {Object} options
 * @param {Array} options.initializeList 初始化列表
 */
var Ui = function (options) {
    this._o = {
        initializeList : ['Flag', 'Tooltip', 'Dropdown', 'Select', 'Checkbox']
    };
    $.extend(this._o, options);
};

Ui.prototype = {
    constructor: Ui,
    init: function () {
        var self = this;
        $(function () {
            setTimeout(function () {
                var leng = self._o.initializeList.length;

                while(leng--) {
                    (new (require(self._o.initializeList[leng]))).init();
                }
            }, 500);
        });
    },
    alert: (function () {
        var Alert = {
            initialized: false,
            looks: null,
            init: function () {
                var tpl =
                    '<div class="alert">' +
                        '<section class="alert_mask"></section>' +
                        '<aside class="alert_panel">' +
                            '<section class="alert_panel_content">' +
                                '<p class="alert_panel_content_info"></p>' +
                            '</section>' +
                            '<section class="alert_panel_btn">' +
                                'Confirm' +
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
                    $(document).trigger('AlertEvent')
                });
            },
            setInfo: function (info) {
                Alert.looks.find('.alert_panel_content_info').html(info);
            },
            show: function (callback) {
                Alert.looks.show();
                if(callback) {
                    $(document).bind('AlertEvent', callback);
                }else {
                    $(document).unbind('AlertEvent');
                }
            },
            hide: function () {
                Alert.looks.hide();
            }
        };
        return function (info, callback) {
            if(Alert.initialized) {
                Alert.setInfo(info);
                Alert.show(callback);
            }else {
                Alert.init();
                this.alert(info, callback);
            }
        }
    })(),
    confirm: (function () {
        var Confirm = {
            initialized: false,
            looks: null,
            init: function () {
                var tpl =
                    '<div class="confirm">' +
                        '<section class="confirm_mask"></section>' +
                        '<aside class="confirm_panel">' +
                            '<section class="confirm_panel_content">' +
                                '<p class="confirm_panel_content_info"></p>' +
                            '</section>' +
                            '<ul class="confirm_panel_btn">' +
                                '<li class="confirm_panel_btn_item confirm_panel_btn_item-ok">Confirm</li>' +
                                '<li class="confirm_panel_btn_item confirm_panel_btn_item-no">Cancel</li>' +
                            '</ul>' +
                        '</aside>' +
                    '</div>';
                Confirm.looks = $(tpl).hide().appendTo('body');
                Confirm.bind();
                Confirm.initialized = true;
            },
            bind: function () {
                $(document).on('touchend click', '.confirm_panel_btn_item-no', function() {
                    Confirm.hide();
                });
                $(document).on('touchend click', '.confirm_panel_btn_item-ok', function() {
                    Confirm.callback && Confirm.callback();
                    Confirm.hide();
                });
            },
            setInfo: function (info) {
                Confirm.looks.find('.confirm_panel_content_info').html(info);
            },
            show: function () {
                Confirm.looks.show();
            },
            hide: function () {
                Confirm.looks.hide();
            }
        };
        return function (info, callback) {
            if(Confirm.initialized) {
                Confirm.setInfo(info);
                Confirm.callback = callback;
                Confirm.show();
            }else {
                Confirm.init();
                this.confirm(info, callback);
            }
        }
    })(),
    loading: (function () {
        var Loading = {
            initialized: false,
            looks: null,
            init: function () {
                var tpl =
                    '<div class="Loading">' +
                        '<section class="Loading_mask"></section>' +
                        '<section class="Loading_icon">' +
                            '<img src="/mdata/img/loading.gif" />' +
                        '</section>' +
                    '</div>';
                Loading.looks = $(tpl).hide().appendTo('body');
                Loading.initialized = true;
            },
            show: function () {
                Loading.looks.show();
            },
            hide: function () {
                Loading.looks.hide();
            }
        };
        return function (handle) {
            if(Loading.initialized) {
                if(handle) {
                    Loading.hide();
                }else {
                    Loading.show();
                }
            }else {
                Loading.init();
                this.loading();
            }
        }
    })(),
    uSetPosition:  function (target, self, position, offset) {
        if(arguments.length != 4) {
            return;
        }
        var $target = $(target);
        var $self = $(self);

        var targetPosition = $target.offset(),
            targetHeight = $target.outerHeight(),
            targetWidth = $target.outerWidth(),
            selfHeight = $self.outerHeight(),
            selfWidth = $self.outerWidth();

        switch (position) {
            case 'tl':
                $self.css({
                    left: targetPosition.left,
                    top: targetPosition.top - offset - selfHeight
                });
                break;
            case 'tc':
                $self.css({
                    left: targetPosition.left + targetWidth / 2 - selfWidth / 2,
                    top: targetPosition.top - offset - selfHeight
                });
                break;
            case 'tr':
                $self.css({
                    left: targetPosition.left + targetWidth - selfWidth,
                    top: targetPosition.top - offset - selfHeight
                });
                break;
            case 'rt':
                $self.css({
                    left: targetPosition.left + targetWidth + offset,
                    top: targetPosition.top
                });
                break;
            case 'rc':
                $self.css({
                    left: targetPosition.left + targetWidth + offset,
                    top: targetPosition.top + targetHeight / 2 - selfHeight / 2
                });
                break;
            case 'rb':
                $self.css({
                    left: targetPosition.left + targetWidth + offset,
                    top: targetPosition.top + targetHeight - selfHeight
                });
                break;
            case 'br':
                $self.css({
                    left: targetPosition.left + targetWidth - selfWidth,
                    top: targetPosition.top + targetHeight + offset
                });
                break;
            case 'bc':
                $self.css({
                    left: targetPosition.left + targetWidth / 2 - selfWidth / 2,
                    top: targetPosition.top + targetHeight + offset
                });
                break;
            case 'bl':
                $self.css({
                    left: targetPosition.left,
                    top: targetPosition.top + targetHeight + offset
                });
                break;
            case 'lb':
                $self.css({
                    left: targetPosition.left - selfWidth - offset,
                    top: targetPosition.top + targetHeight - selfHeight
                });
                break;
            case 'lc':
                $self.css({
                    left: targetPosition.left - selfWidth - offset,
                    top: targetPosition.top + targetHeight / 2 - selfHeight / 2
                });
                break;
            case 'lt':
                $self.css({
                    left: targetPosition.left - selfWidth - offset,
                    top: targetPosition.top
                });
                break;
        }
    }
};

/*
* 添加静态方法
* */
Ui.alert = Ui.prototype.alert;
Ui.confirm = Ui.prototype.confirm;
Ui.loading = Ui.prototype.loading;

module.exports = Ui;
