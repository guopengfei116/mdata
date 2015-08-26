
var Dropdown = function (trigger, position, offset) {
    this.trigger = trigger || 'body';
    this.position = position || 'bl';
    this.offset = offset || 10;
};

$.extend(Dropdown.prototype, {
    selector: '.dropdown',
    host: '.dropdown-host',
    target: '.dropdown-target',
    init: function () {
        var self = this;
        $('.dropdown').each(function () {
            var $looks = $(this);
            if($looks.attr('init')) {
                return;
            }
            var $host = $looks.parent(self.host);
            var position = $looks.data('dropdown-position') || self.position;
            self.initPosition($host, $looks, position);
            $looks.attr('init', true);
        });
        this.bind();
    },
    bind: function () {
        var self = this;
        $(this.trigger).on('click', this.target, function (e) {
            e.stopPropagation();
            $(this).siblings(self.selector).slideToggle();
        }).bind('click', function () {
            $(self.selector).hide();
        })
    },
    initPosition: function (host, self, position) {
        switch(position) {
            case 'bl':
                self.css({
                    top: host.outerHeight() + this.offset,
                    left: 0
                });
                break;
            case 'br':
                self.css({
                    top: host.outerHeight() + this.offset,
                    right: 0
                });
                break;
        }
    }
});
