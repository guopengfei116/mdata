/**
 * @param {Object} options
 * @param {Selector} options.trigger 事件委托者
 * @param {Direction} options.position 定位方向
 * @param {Number} options.offset 定位偏移量
 */
var Checkbox = function (options) {
    var options = options || {};
    this.trigger = options.trigger || 'body';
};

$.extend(Checkbox.prototype, {
    selector: '.checkbox',
    target: '.checkbox-target',

    init: function () {
        if(Checkbox.prototype.initialized) {
            return;
        }
        this.bind();
        Checkbox.prototype.initialized = true;
    },

    bind: function () {
        var self = this;
        $(this.trigger).on('click', this.selector, function (e) {
            e.stopPropagation();
            var $this = $(this);
            if($this.attr('disabled')) {
                return;
            }

            if ($this.attr('checked')) {
                $this.removeClass('icon-checkbox-checked').addClass('icon-checkbox-unchecked').removeAttr('checked');
            } else {
                $this.removeClass('icon-checkbox-unchecked').addClass('icon-checkbox-checked').attr('checked', 'checked');
            }
        });
    }
});

module.exports = Checkbox;
