/**
 * @param {Object} options
 * @param {Array} options.initializeList 初始化列表
 */
var Ui = function (options) {
    this._o = {
        initializeList : ['Flag', 'Tooltip', 'Dropdown', 'Select']
    }
};

Ui.prototype = {
    constructor: Ui,
    init: function () {
        var self = this;
        $(function () {
            setTimeout(function () {
                var leng = self._o.initializeList.length;

                while(leng--) {
                    (new window[self._o.initializeList[leng]]).init();
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
    confirm: (function () {
        var Confirm = {
            initialized: false,
            looks: null,
            init: function () {
                var tpl =
                    '<div class="confirm">' +
                        '<section class="confirm_mask"></section>' +
                        '<aside class="confirm_panel">' +
                            '<section class="confirm_panel_info">' +
                            '</section>' +
                            '<ul class="confirm_panel_btn">' +
                                '<li class="confirm_panel_btn_item confirm_panel_btn_item-no">取消</li>' +
                                '<li class="confirm_panel_btn_item confirm_panel_btn_item-ok">确定</li>' +
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
                Confirm.looks.find('.confirm_panel_info').html(info);
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

Ui.alert = Ui.prototype.alert;
Ui.confirm = Ui.prototype.confirm;
