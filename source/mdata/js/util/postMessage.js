
/*
 * postMessage
 * */
(function () {
    var root = this;
    var PostMessage = function (option) {
        this.o = {
            "pageUrl" : '',
            "url" : '',
            "method" : '',
            "data" : null,
            "token" : {"MDATA-KEY" : require('Cookie').getCookie('MDATA-KEY')},
            "callback" : function(){}
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

            self.listening();

            var $iframe = $('<iframe id="postMessage"></iframe>');

            $iframe.bind('load', function () {
                PostMessage.prototype.iframeLoad = true;
                self.iframeLoadFn();
                console.log('iframe load');
            });

            $iframe.attr('src', this.o.pageUrl).css('display', 'none').appendTo('body');
        },

        /*
         * @method 主window事件监听
         * */
        listening : function () {
            var self = this;
            window.addEventListener('message', function (e) {
                var data = e.data;

                if(!data) {
                    throw Error('There is no data');
                }

                self.processData(data);
            });
        },

        /*
        * @method 预处理主window收到的数据
        * */
        processData : function (sourceData) {
            try {
                var data = JSON.parse(data);

                if(data.code == 500) {

                }else if(data.code == 401) {

                }else if(data.code == 403) {

                }

                var type = data.type;
                /*for(var i = 0; i < this[type].length; i++) {
                    this[type](data);
                }*/

                this.o.callback(data);
            }catch (e) {
                console.log('message data parse error');
            }
        },

        /*
         * @method 获取格式化后的数据
         * */
        getStringifyData : function () {
            return JSON.stringify(this.o);
        },

        /*
         * @method 发送消息
         * 如果iframe未load完成，则添加iframeLoadFn方法，等待load后再调用
         * */
        send : function () {
            if(!this.iframeLoad) {
                this.iframeLoadFn = this.send;
                return;
            }
            var iframe = document.getElementById('postMessage');
            iframe.contentWindow.postMessage(this.getStringifyData(), '*');
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
