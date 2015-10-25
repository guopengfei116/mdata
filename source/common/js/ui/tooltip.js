/**
 * @param {Object} options
 * @param {Selector} options.trigger 事件委托者
 * @param {Direction} options.position 定位方向
 * @param {Number} options.offset 定位偏移量
 */
var Tooltip = function (options) {
    var options = options || {};
    this.trigger = options['trigger'] || 'body';
    this.position = options['position'] || 'br';
    this.offset = options['offset'] || 12;
};

// 继承ui原型方法
Tooltip.extends(require('./ui'));

// 添加原型方法
$.extend(Tooltip.prototype, {
    initialized : false,
    toolTipLooks : null,
    selector: '.tooltip',
    target: '.tooltip-host',

    init: function () {
        if(Tooltip.prototype.initialized) {
            return;
        }

        Tooltip.prototype.toolTipLooks = $(this.getTooltipTpl()).addClass('common').appendTo('body');
        this._bind();
        Tooltip.prototype.initialized = true;
    },

    getTooltipTpl: function () {
        return '<span class="tooltip' + ' tooltip-' + this.position + '">' +
                    '<span class="tooltip_content"></span>' +
                    '<i class="tooltip_arrow"></i>' +
                    '<i class="tooltip_arrow tooltip_arrow-mask"></i>' +
                '</span>';
    },

    getNewTooltip: function () {
        this.toolTipLooks = $(this.getTooltipTpl()).appendTo('body');
        return this;
    },

    _bind: function () {
        var self = this;

        $(this.trigger).on('mouseenter', Tooltip.prototype.target, function () {
            var $this = $(this);
            var position = $this.data('tooltip-position') || self.position;
            var offset = $this.data('tooltip-offset') || self.offset;
            self.setContent($this.data('tooltip-info'));
            self.setPosition($this, Tooltip.prototype.toolTipLooks, position, offset);
            self.show(position);
        }).on('mouseleave', Tooltip.prototype.target, function () {
            self.hide();
        });

        // 清除active状态
        $(this.trigger).on('click', function (e) {
            self.hide();
        });
    },

    show: function (position) {
        var position = position || this.position;
        var baseClass = 'tooltip',
            positionClass = 'tooltip-' + position,
            showClass = 'tooltip-active';

        // common tooltip add common class
        if(this.toolTipLooks.hasClass('common')) {
            this.toolTipLooks.attr('class', baseClass + ' ' + positionClass + ' ' + showClass + ' ' + 'common');
        }else {
            this.toolTipLooks.attr('class', baseClass + ' ' + positionClass + ' ' + showClass);
        }
    },

    hide: function () {
        this.toolTipLooks.removeClass('tooltip-active');
    },

    setPosition: function (target, looks, position, offset) {
        var position = position || this.position;
        var offset = offset || this.offset;
        this.uSetPosition(target, looks, position, offset);
    },

    setContent: function (content) {
        this.toolTipLooks.children('.tooltip_content').html(content);
    }
});

module.exports = Tooltip;