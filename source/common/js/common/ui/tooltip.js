
var Tooltip = function (trigger) {
    this.trigger = trigger ? trigger : 'body';
};

Tooltip.prototype = {
    constructor: Tooltip,
    initialized : false,
    toolTipLooks : null,
    selector: '.tooltip',
    target: '.tooltip-host',
    init: function () {
        if(!Tooltip.prototype.initialized) {
            var tooltipTpl =
                '<span class="tooltip">' +
                    '<span class="tooltip_content"></span>' +
                    '<i class="tooltip_arrow"></i>' +
                    '<i class="tooltip_arrow tooltip_arrow-mask"></i>' +
                '</span>';
            Tooltip.prototype.toolTipLooks = $(tooltipTpl).hide().appendTo('body');
            Tooltip.prototype.initialized = true;
        }
        this.bind();
    },
    bind: function () {
        self = this;
        $(this.trigger).on('mouseenter', self.target, function () {
            self.setContent(this.data('tooltip'));
            self.show();
        }).on('mouseleave', self.target, function () {
            self.hide();
        });
    },
    show: function () {
        Tooltip.prototype.toolTipLooks.addClass('tooltip-active');
    },
    hide: function () {
        Tooltip.prototype.toolTipLooks.removeClass('tooltip-active');
    },
    setContent: function (content) {
        Tooltip.prototype.toolTipLooks.children('.tooltip_content').html(content);
    }
};