
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
        iframeLoad : false,
        iframeLoadFn : function(){},

        /*
         * @method 初始化iframe
         * 第一次添加iframe时监听load事件
         * */
        init : function () {
            var self = this;

            if(PostMessage.prototype.initialized) {
                return;
            }
            PostMessage.prototype.initialized = true;

            var $iframe = $('<iframe id="postMessage"></iframe>');

            $iframe.bind('load', function () {
                PostMessage.prototype.iframeLoad = true;
                self.iframeLoadFn();
                console.log('iframe load');
            });

            $iframe.attr('src', this.o.pageUrl).css('display', 'none').appendTo('body');
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
                console.log(e);
                //self.o.callback(data);
            });
        },

        /*
         * @method 发送消息
         * */
        send : function () {
            if(!this.iframeLoad) {
                this.iframeLoadFn = this.send;
                return;
            }
            var iframe = document.getElementById('postMessage');
            console.log(iframe);
            //this.listening();
            iframe.contentWindow.postMessage($.param(this.o), '*');
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
