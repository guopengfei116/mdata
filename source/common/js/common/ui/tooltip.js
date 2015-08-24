
var Tooltip = function (trigger, position) {
    this.trigger = trigger ? trigger : 'body';
    this.position = position ? position : 'br';
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
                Tooltip.prototype.toolTipLooks = $(tooltipTpl).appendTo('body');
                Tooltip.prototype.initialized = true;
            }
            this.bind();
        },
        bind: function () {
            self = this;
            $(this.trigger).on('mouseenter', self.target, function () {
                var $this = $(this);
                self.targetLooks = $this;
                self.setContent($this.data('tooltip-info'));
                self.show($this.data('tooltip-position'));
            }).on('mouseleave', self.target, function () {
                self.hide();
            });
        },
        show: function (position) {
            this.setPosition(this.targetLooks, Tooltip.prototype.toolTipLooks, position || this.position, 12);

            var oldPositionClass = 'tooltip-' + this.position,
                newPositionClass = 'tooltip-' + position,
                toolTipClass = 'tooltip';
            if(position && oldPositionClass != newPositionClass) {
                toolTipClass += ' tooltip-active ' + newPositionClass;
            }else {
                toolTipClass += ' tooltip-active ' + oldPositionClass;
            }

            Tooltip.prototype.toolTipLooks.attr('class', toolTipClass);
        },
        hide: function () {
            Tooltip.prototype.toolTipLooks.removeClass('tooltip-active');
        },
        setContent: function (content) {
            Tooltip.prototype.toolTipLooks.children('.tooltip_content').html(content);
        }
    });
});
