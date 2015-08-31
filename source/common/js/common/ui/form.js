/**
 * @param {Object} options
 * @param {Selector} options.trigger 事件委托者
 */
var Form = function (options) {
    this.o = {

    };

    $.extend(this.o, options);
};

Form.prototype = {
    constructor: Form,
    select: '.form',
    regList: {
        cellphone : /^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$/,
        telePhone : /^(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})$/,
        account: /^\w{6,20}$/,
        password : /^[\S]{6,20}$/,
        verifyCode : /^[\S]{4,8}$/,
        chineseName : /^[\u4E00-\u9FFF]{2,10}$/,
        email : /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,
        textArea : /^[\S]{6,200}$/
    },
    init: function () {
        var self = this;
        $(this.select).submit(function () {
            self.verify();
            if($(this).data('submit')) {
                return true;
            }
            return false;
        });
    }
};