
/*
 * postMessage
 * */
(function () {
    var root = this;
    var PostMessage = function (option) {
        this.o = {
            pageUrl : ''
        };
        $.extend(this.o, option);
        this.init();
    };

    $.extend(PostMessage.prototype, {
        initialized : false,

        /*
         * @method 初始化iframe
         * */
        init : function () {
            if(PostMessage.prototype.initialized) {
                return;
            }
            this.prototype.initialized = true;
            var $iframe = $('<iframe id="postMessage"></iframe>');
            $iframe.attr('src', this.o.pageUrl).css('display', 'hidden').appendTo('body');
        },

        /*
         * @method 消息处理
         * */
        listening : function () {
            var self = this;
            $(window).bind('message', function (e) {
                var data = e.data? e.data : {};

                if(data.code == 500) {

                }else if(data.code == 401) {

                }else if(data.code == 403) {

                }

                self.o.callback(data);
            });
        },

        /*
         * @method 发送消息
         * */
        send : function (fn) {
            var iframe = document.getElementById('postMessage');
            if(iframe.contentWindow.postMessage) {
                this.listening();
                iframe.contentWindow.postMessage(JSON.stringify(this.o), '*');
            }
        }
    });

    if(typeof exports !== 'undefined') {
        if(typeof module !== 'undefined' && module.exports) {
            exports = module.exports = PostMessage;
        }
        exports.PostMessage = PostMessage;
    } else if (typeof define === 'function' && define.amd) {
        define('PostMessage', function () {
            return PostMessage;
        });
    } else {
        root.PostMessage = PostMessage;
    }

}).call(this);
