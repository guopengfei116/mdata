/**
 * @param {Object} options
 * @param {Selector} options.trigger 事件委托者
 */
var Flag = function (options) {
    var options = options || {};
    this.trigger = options.trigger || 'body';
    this.unbind = {
        'delete' : false
    };
};

Flag.extends(require('./ui'));
$.extend(Flag.prototype, {
    initialized : false,
    selector: '.flag',
    targets: {
        '.flag-icon_delete' : 'delete'
    },
    init: function () {
        if(Flag.prototype.initialized) {
            return;
        }
        this.bind();
        Flag.prototype.initialized = true;
    },
    getFlag: function (info, type) {
        if(!info) {
            return;
        }
        var type = type || 'delete';
        var typeIcon = {
            delete : '<i class="flag-icon_delete iconfont icon-close"></i>'
        };
        var flag = '<span class="flag flag-icon tooltip-host">' +
                        info +
                        typeIcon[type] +
                    '</span>';
        return $(flag);
    },
    /*
     * 给flag子类绑定事件，
     * 如果想保留子类样式而不需要子类事件的话，
     * 可以通过设置unbind属性来禁用子类的事件，
     * 如果只想禁用某个flag的特定事件，可以通过dataApi的方式进行配置
     * */
    bind: function () {
        var self = this;
        for(target in this.targets) {
            $(this.trigger).on('click', target, function () {
                var eventFn = self.targets[target];
                if($(this).data('delete') == 'off' || self.unbind[eventFn]) {
                    return false;
                }
                self[eventFn].apply(self, arguments);
            });
        }
    },
    /*
     * 禁用flag的某些事件，并且不可挽回，
     * 如果想禁止flag的所有事件，可以在暴漏的初始化方法中阻止
     * */
    unbind: function (type) {
        if(type && this.unbind[type]) {
            this.unbind[type] = false;
        }
    },
    delete: function (e) {
        try {
            var $target = $(e.target);
            var deleteInfo = $target.data('delete-info');
            $target.parent(this.selector).remove();
            if(deleteInfo) {
                this.alert(deleteInfo);
            }
        }catch (e) {
            console.log(e + 'delete方法只能通过触发事件的方式调用');
        }
    }
});

module.exports = Flag;