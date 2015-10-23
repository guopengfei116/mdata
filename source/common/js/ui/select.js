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
    main: '.select_main',
    target : '.select_target',
    textarea : '.select_main_textarea',
    textarea_value : '.select_main_textarea-value',
    text : '.select_main_text',
    optionsTarget : '.select_content_list_value',
    optionsSelector : '.select_content_list',
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

            if(e && !e.offsetX && !e.offsetY && !e.pageX && !e.pageY) {
                return;
            }

            var $this = $(this);
            var $parentSelect = $this.parents(self.selector);

            // disabled
            if($parentSelect.hasClass('select-disable')) {
                return;
            }

            // options == 0
            if(!$parentSelect.find(self.optionsSelector).length) {
                return;
            }

            self.initPosition();
            self.initStyle($parentSelect);

            // 清除其他select的active状态
            $(self.selector).not($parentSelect).removeClass('select-active');
            $parentSelect.toggleClass('select-active');
        });

        // selected word
        $(o.trigger).on('click', self.optionsTarget, function (e) {
            e.stopPropagation();
            var $this = $(this);
            var $select = $this.parents(self.selector);
            var val = $this.data('value');

            $select.data('value', val).toggleClass('select-active');
            $select.find(self.textarea).val($this.text());
            $select.find('input' + self.text).val($this.text());
            $select.find(self.text).text($this.text());
        });

        // text change
        $(o.trigger).on('blur', self.textarea_value, function (e) {
            e.stopPropagation();
            var $this = $(this);
            var $select = $this.parents(self.selector);
            var val = $this.val();
            $select.data('value', val);
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

    initStyle : function ($select) {
        var o = this._o, self = this;
        var width = $select.find(self.main).innerWidth();
        $select.find(o.content).css('width', width);
    },

    initPosition : function () {
        var o = this._o, self = this;
        $(o.content).each(function () {
            var $looks = $(this);
            if($looks.attr('init')) {
                return;
            }
            var $host = $looks.parent(self.host);
            var hostOuterHeight = $host.outerHeight();
            if(!hostOuterHeight) {
                return true;
            }
            $looks.css({
                top: hostOuterHeight + o.offset,
                left: 0
            }).attr('init', true);
        });
    }
});

module.exports = Select;