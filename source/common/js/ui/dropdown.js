/**
 * @param {Object} options
 * @param {Selector} options.trigger 事件委托者
 * @param {Direction} options.position 定位方向
 * @param {Number} options.offset 定位偏移量
 */
var Dropdown = function (options) {
    var options = options || {};
    this.trigger = options.trigger || 'body';
    this.position = options.position || 'bl';
    this.offset = options.offset || 10;
};

$.extend(Dropdown.prototype, {
    selector: '.dropdown',
    host: '.dropdown-host',
    target: '.dropdown-target',

    init: function () {
        if(Dropdown.prototype.initialized) {
            return;
        }
        this.initPosition();
        this.bind();
        Dropdown.prototype.initialized = true;
    },

    bind: function () {
        var self = this;
        $(this.trigger).on('click', this.target, function (e) {
            e.stopPropagation();
            self.initPosition();
            $(this).siblings(self.selector).slideToggle();
        }).bind('click', function (e) {
            $(self.selector).hide();
        });
    },

    initPosition: function () {
        var self = this;
        $(Dropdown.prototype.selector).each(function () {
            var $looks = $(this);
            if($looks.attr('init')) {
                return;
            }
            var $host = $looks.parent(self.host);
            var position = $looks.data('dropdown-position') || self.position;
            self.setPosition($host, $looks, position);
            $looks.attr('init', true);
        });
    },

    setPosition: function (host, looks, position) {
        switch(position) {
            case 'bl':
                looks.css({
                    top: host.outerHeight() + this.offset,
                    left: 0
                });
                break;
            case 'br':
                looks.css({
                    top: host.outerHeight() + this.offset,
                    right: 0
                });
                break;
        }
    }
});

module.exports = Dropdown;
