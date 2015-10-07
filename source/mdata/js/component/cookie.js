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
        setCookie : function (key, value, expire)	{
            var DAY = 24 * 60 * 60 * 1000,
                now = new Date(),
                exp = expire ? expire : 30;

            now.setTime(now.getTime() + exp * DAY);
            document.cookie = key + "=" + encodeURIComponent(value) + "; path=/" + "; expires=" + now.toGMTString();
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
                    Cookie.setCookie(key, "", 1);
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
