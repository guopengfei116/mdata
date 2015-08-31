/**
 * @param {Object} options
 * @param {Selector} options.trigger 事件委托者
 * @param {Selector} options.content
 * @param {Event} options.triggerEvent
 */
var Select = function (options) {
    this._o = {
        trigger : 'body',
        content : '.dropdown',
        triggerEvent : 'click'
    };

    $.extend(this._o, options);
};

$.extend(Select.prototype, {
    selector : '.select',
    target : '.select_main',
    optionsTarget : '.select .dropdown_list_content',
    initialized : false,

    init : function () {
        if(Select.prototype.initialized) {
            return;
        }
        this.bind();
        Select.prototype.initialized = true;
    },
    
    bind : function () {
        var o = this._o, self = this;

        //开关
        $(o.trigger).on(o.triggerEvent, self.target, function (e) {
            e.stopPropagation();
            var $this = $(this);
            if($this.parent(self.selector).hasClass('select-disable')) {
                return;
            }

            //清除其他select的active状态
            $(self.target).removeClass('active').parent(self.selector).find(o.content).hide();

            $this.toggleClass('select_main-active');
            if($this.hasClass('select_main-active')) {
                $this.parent(self.selector).find(o.content).show();
            }else {
                $this.parent(self.selector).find(o.content).hide();
            }
        });

        //selected
        $(o.trigger).on('click', self.optionsTarget, function (e) {
            e.stopPropagation();
            var $this = $(this);

            $this.parents('.dropdown').hide().parents(self.selector).data('value', $this.data('value'))
                .find(self.target).toggleClass('select_main-active').find('.select_main_p').text($this.text());
        });

        $(o.trigger).on('click', function () {
            $(self.target).removeClass('select_main-active');
        });
    }
});

