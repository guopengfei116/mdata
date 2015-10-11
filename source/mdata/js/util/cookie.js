(function () {
    var root = this;
    var Cookie = {
        /**
         * @method setCookie
         * @description 设置cookie
         * @param {String} key
         * @param {String} value
         * @param {Number} expire
         */
        oldSetCookie : function (key, value, expire)	{
            var DAY = 24 * 60 * 60 * 1000,
                now = new Date(),
                exp = expire ? expire : 0;

            now.setTime(now.getTime() + exp * DAY);
            document.cookie = key + "=" + encodeURIComponent(value) + "; path=/" + "; expires=" + now.toGMTString();
        },

        setCookie : function (key, value, options) {
            options = $.extend({},{
                domain : '',
                path : '/'
            }, options);

            //删除cookie操作处理
            if (value === null) {
                options.expires = -1;
            }

            //设置过期时间
            if (typeof options.expires === 'number') {
                var seconds = options.expires, t = options.expires = new Date();
                t.setTime(t.getTime() + seconds*1000*60*60);
            }

            //强制转换为字符串格式
            value = '' + value;

            //设置cookie信息
            return (document.cookie = [
                encodeURIComponent(key), '=',
                options.raw
                ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '',
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''));
        },

         /**
         * @method getCookie
         * @description 读取cookie
         * @param {String} key
         * @return value of the key
         */
        getCookie : function (key) {
            var keys = document.cookie.split("; "),
                len = keys.length, tmp;

            while (len--) {
                tmp = keys[len].split('=');
                if (tmp[0] === key) {
                    return decodeURIComponent(tmp[1]);
                }
            }
        },
        /**
         * @method removeCookie
         * @description 删除cookie
         * @param {String} key
         */
        removeCookie : function (key) {
            var keys = document.cookie.split("; "),
                len = keys.length, tmp;

            while (len--) {
                tmp = keys[len].split('=');
                if (tmp[0] === key) {
                    Cookie.oldSetCookie(key, "", 1);
                    //DelCookie(tmp[0]);
                }
            }
        }
    };

    if(typeof exports !== 'undefined') {
        if(typeof module !== 'undefined' && module.exports) {
            exports = module.exports = Cookie;
        }
        exports.Cookie = Cookie;
    } else if (typeof define === 'function' && define.amd) {
        define('Cookie', function () {
            return Cookie;
        });
    } else {
        root.Cookie = Cookie;
    }

}).call(this);
