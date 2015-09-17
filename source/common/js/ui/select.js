/**
 * @param {Object} options
 * @param {Selector} options.trigger 事件委托者
 * @param {Selector} options.content
 * @param {Event} options.triggerEvent
 */
var Select = function (options) {
    this._o = {
        trigger : 'body',
        content : '.select_content',
        triggerEvent : 'click',
        offset : 10
    };

    $.extend(this._o, options);
};

$.extend(Select.prototype, {
    selector : '.select',
    host: '.select-host',
    target : '.select_target',
    textarea : '.select_main_textarea',
    text : '.select_main_text',
    optionsTarget : '.select_content_list_value',
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

        // select开关
        $(o.trigger).on(o.triggerEvent, self.target, function (e) {
            e.stopPropagation();
            var $this = $(this);

            // disabled
            if($this.parents(self.selector).hasClass('select-disable')) {
                return;
            }

            self.initPosition();

            // 清除其他select的active状态
            //$(self.selector).removeClass('select-active').find(o.content).hide();
            $this.parents(self.selector).toggleClass('select-active');
            /*if($this.parents(self.selector).hasClass('select-active')) {
                $this.parents(self.selector).find(o.content).show();
            }else {
                $this.parents(self.selector).find(o.content).hide();
            }*/
        });

        // selected word
        $(o.trigger).on('click', self.optionsTarget, function (e) {
            e.stopPropagation();
            var $this = $(this);

            var val = $this.data('value');
            $this.parents(self.selector).data('value', $this.data('value')).toggleClass('select-active');
            $this.parents(self.selector).find(self.textarea).val($this.text());
            $this.parents(self.selector).find(self.text).text($this.text());
        });

        // select阻止事件外流
        $(o.trigger).on(o.triggerEvent, self.selector, function (e) {
            e.stopPropagation();
        });

        // 清除active状态
        $(o.trigger).on('click', function (e) {
            $(self.selector).removeClass('select-active');
        });
    },

    initPosition: function () {
        var o = this._o, self = this;
        $(o.content).each(function () {
            var $looks = $(this);
            if($looks.attr('init')) {
                return;
            }
            var $host = $looks.parent(self.host);
            $looks.css({
                top: $host.outerHeight() + o.offset,
                left: 0
            }).attr('init', true);
        });
    }
});

module.exports = Select;