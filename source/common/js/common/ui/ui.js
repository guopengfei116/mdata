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
