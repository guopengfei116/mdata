
var Tooltip = function (options) {
    var options = options || {};
    this.trigger = options['trigger'] || 'body';
    this.position = options['position'] || 'br';
    this.offset = options['offset'] || 12;
};

$(function () {
    Tooltip.extends(Ui);
    $.extend(Tooltip.prototype, {
        initialized : false,
        toolTipLooks : null,
        targetLooks: null,
        selector: '.tooltip',
        target: '.tooltip-host',
        init: function () {
            if(Tooltip.prototype.initialized) {
                return;
            }

            Tooltip.prototype.toolTipLooks = $(this.getTooltipTpl()).appendTo('body');
            Tooltip.prototype.initialized = true;
            this._bind();
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
            self = this;

            $(this.trigger).on('mouseenter', Tooltip.prototype.target, function () {
                var $this = $(this);
                Tooltip.prototype.targetLooks = $this;

                var position = $this.data('tooltip-position') || self.position;
                self.setContent($this.data('tooltip-info'));
                self.setPosition(Tooltip.prototype.targetLooks, Tooltip.prototype.toolTipLooks, position);
                self.show(position);
            }).on('mouseleave', Tooltip.prototype.target, function () {
                self.hide();
            });
        },
        show: function (position) {
            var position = position || this.position;
            var baseClass = 'tooltip',
                positionClass = 'tooltip-' + position,
                showClass = 'tooltip-active';

            this.toolTipLooks.attr('class', baseClass + ' ' + positionClass + ' ' + showClass);
        },
        hide: function () {
            this.toolTipLooks.removeClass('tooltip-active');
        },
        setPosition: function (target, looks, position) {
            var position = position || this.position;
            this.uSetPosition(target, looks, position, this.offset);
        },
        setContent: function (content) {
            this.toolTipLooks.children('.tooltip_content').html(content);
        }
    });
});
