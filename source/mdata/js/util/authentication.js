
/*
* 用户认证管理
* */
(function () {
    var root = this;
    var Authentication = function () {
        this.cookieVal = {                     //cookie默认值
            token : '',
            authority : '',
            account : ''
        };
        this.cookieKey = {                     //cookieKey配置
            token : 'MDATA-KEY',
            authority : 'authority',
            account : 'username'
        };
        this.cookie = require('Cookie');       //cookie操作对象
        this.main = '/login';                  //入口
    };

    $.extend(Authentication.prototype, {

        /*
        * @method set cookie
        * @param {Object} cookieVal
        * */
        set : function (cookieVal) {
            $.extend(this.cookieVal, cookieVal);
            for(var key in this.cookieKey) {
                this.cookie.setCookie(this.cookieKey[key], this.cookieVal[key]);
            }
        },

        /*
         * @method get cookie
         * @param {String} cookieKey
         * */
        get : function (key) {
            var value = this.cookie.getCookie(this.cookieKey[key]);
            if(value === 'undefined') {
                value = null;
            }
            return value;
        },

        /*
         * @method delete all cookie
         * */
        delete : function () {
            for(var key in this.cookieKey) {
                this.cookie.removeCookie(this.cookieKey[key]);
            }
            //window.location.hash = '/login';
        }
    });

    if(typeof exports !== 'undefined') {
        if(typeof module !== 'undefined' && module.exports) {
            exports = module.exports = Authentication;
        }
        exports.Authentication = Authentication;
    } else if (typeof define === 'function' && define.amd) {
        define('Authentication', function () {
            return Authentication;
        });
    } else {
        root.Authentication = Authentication;
    }

}).call(this);
