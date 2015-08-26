
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
        this.initPosition();
        this.bind();
    },
    bind: function () {
        var self = this;
        $(this.trigger).on('click', this.target, function (e) {
            e.stopPropagation();
            self.initPosition();
            $(this).siblings(self.selector).slideToggle();
        }).bind('click', function () {
            $(self.selector).hide();
        })
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
