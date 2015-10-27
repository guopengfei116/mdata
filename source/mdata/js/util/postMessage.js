
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
            "callback" : function(){},
            "error" : function(){}
        };
        $.extend(this.o, option);
        this.init();
    };

    $.extend(PostMessage.prototype, {
        initialized : false,
        iframeLoad : false,
        iframeLoadFn : function(){},

        /*
         * @method 初始化
         * @* 添加监听
         * @* 如果页面不存在iframe则创建一个iframe，并监听load事件，防止第一次在iframe未load时调用send方法
         * */
        init : function () {
            var self = this;

            self.listening();

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
         * @method 主window事件监听
         * */
        listening : function () {
            var self = this;
            var handler = function (e) {
                window.removeEventListener('message', handler, false);

                var data = e.data;

                if(!data) {
                    throw Error('There is no data');
                }

                self.processData(data);
            };
            window.addEventListener('message', handler, false);
        },

        /*
        * @method 预处理主window收到的数据
        * @* 500报网络错误
        * @* 403报服务器返回的msg
        * @* 401打回登录页面
        * */
        processData : function (sourceData) {
            try {
                var sourceData = JSON.parse(sourceData);
                var data = sourceData.data;
                var type = sourceData.type;
                var matchedApi = null, urlSummary = '';

                matchedApi = this.o.url.match(/api.mdata.com\/(.+)$/);
                if(matchedApi && matchedApi.length && matchedApi[1]) {
                    urlSummary = matchedApi[1];
                }

                Ui.loading(true);

                if(data.code == 500) {
                    Ui.alert('Network connection error, Error url: ' + urlSummary);
                    this.o.error(data);
                }
                else if(data.code == 403) {
                    Ui.alert(data.msg);
                    this.o.callback(data);
                }
                else if(data.code == 401) {
                    Ui.alert(data.msg, function () {
                        authentication.delete();
                        window.location.hash = '#/login';
                    });
                }
                else {
                    this.o.callback(data);
                    /*
                    for(var i = 0; i < this[type].length; i++) {
                        this[type](data);
                    }
                    */
                }
            }catch (e) {
                Ui.loading(true);
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
            Ui.loading();

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
