(function () {
    var root = this;
    var Authentication = function () {
        this.cookieVal = {
            token : '',
            authority : '',
            account : ''
        };
        this.cookieKey = {
            token : 'MDATA-KEY',
            authority : 'authority',
            account : 'username'
        };
        this.cookie = require('Cookie');
        this.main = '/login';
    };

    $.extend(Authentication.prototype, {

        set : function (cookieVal) {
            $.extend(this.cookieVal, cookieVal);
            for(var key in this.cookieKey) {
                this.cookie.setCookie(this.cookieKey[key], this.cookieVal[key]);
            }
        },

        get : function (key) {
            var value = this.cookie.getCookie(this.cookieKey[key]);
            if(value === 'undefined') {
                value = null;
            }
            return value;
        },

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
