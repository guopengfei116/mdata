/**
 * 扩展Function.prototype继承方法
 * @param {Function || Object} father
 */
if(!Function.prototype.extends) {
    Function.prototype.extends = function (father) {
        var type = Object.prototype.toString.call(father);

        if(type != '[object Function]' && type != '[object Object]') {
            return;
        }

        var smriti = new Function(), fatherInstance = father;

        if(type == '[object Function]') {
            fatherInstance = new father();
        }

        smriti.prototype = fatherInstance;
        this.prototype = $.extend(new smriti(), this.prototype);
    }
}

