
/*
 * postMessage
 * */
(function () {
    var root = this;
    var PostMessage = function () {

    };

    $.extend(PostMessage.prototype, {

        /*
         * @method set cookie
         * @param {Object} cookieVal
         * */

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
