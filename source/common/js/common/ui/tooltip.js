
var Tooltip = function (trigger, position, offset) {
    this.trigger = trigger || 'body';
    this.position = position || 'br';
    this.offset = offset || 12;
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
            if(!Tooltip.prototype.initialized) {
                var tooltipTpl =
                    '<span class="tooltip' + ' tooltip-' + this.position + '">' +
                    '<span class="tooltip_content"></span>' +
                    '<i class="tooltip_arrow"></i>' +
                    '<i class="tooltip_arrow tooltip_arrow-mask"></i>' +
                    '</span>';
                this.toolTipLooks = $(tooltipTpl).appendTo('body');
                Tooltip.prototype.initialized = true;
            }
            this.bind();
        },
        bind: function () {
            self = this;
            $(this.trigger).on('mouseenter', self.target, function () {
                var $this = $(this);
                var position = $this.data('tooltip-position') || self.position;
                self.targetLooks = $this;
                self.setContent($this.data('tooltip-info'));
                self.setPosition(position);
                self.show(position);
            }).on('mouseleave', self.target, function () {
                self.hide();
            });
        },
        show: function (position) {
            var baseClass = 'tooltip',
                positionClass = 'tooltip-' + position,
                showClass = 'tooltip-active';

            this.toolTipLooks.attr('class', baseClass + ' ' + positionClass + ' ' + showClass);
        },
        hide: function () {
            this.toolTipLooks.removeClass('tooltip-active');
        },
        setPosition: function (position) {
            this.uSetPosition(this.targetLooks, this.toolTipLooks, position, this.offset);
        },
        setContent: function (content) {
            this.toolTipLooks.children('.tooltip_content').html(content);
        }
    });
});
