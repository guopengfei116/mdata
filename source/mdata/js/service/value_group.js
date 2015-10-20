
/*
 * 对value_group原始属性值进行转换
 * */
oasgames.mdataServices.factory('ValueGroup', [
    'VALUE_TYPE',
    'VALUE_ARITHMETIC',
    function (VALUE_TYPE, VALUE_ARITHMETIC) {
        return {
            semantic : function (value, separator, valueList) {
                var values = value.split(separator);
                var valueArithmetic = '', valueArithmeticIndex = 3, value = '';

                // 如果拥有format值，那么运算符值所在的位置将向后挪一位
                var format = this.getValueFormat(values[2], valueList) || '';
                if(format) {
                    valueArithmeticIndex++;
                }

                // 如果valueArithmetic值为Null，那么不展示这个值
                var valueArithmetic  = this.getValueArithmetic(values[valueArithmeticIndex]) || '';
                if(valueArithmetic === 'Null') {
                    valueArithmetic = '';
                }

                //值转换
                values[1] = this.getValueType(values[1]) || '';
                values[valueArithmeticIndex] = valueArithmetic;

                for(var i = 2; i < values.length; i++) {
                    value += values[i] + ' ';
                }

                return values[0] + '(' + values[1] + ')' + '=' + value;
            },

            /*
            * @method 依据值获取value_type
            * @param {String} value
            * @return {String || Null} value对应的type
            * */
            getValueType : function (value) {
                if(!value) {
                    return null;
                }

                for(var i = 0; i < VALUE_TYPE.length; i++) {
                    if(VALUE_TYPE[i]['value'] === value) {
                        return VALUE_TYPE[i]['type'];
                    }
                }

                return null;
            },

            /*
             * @method 依据值获取value_arithmetic
             * @param {String} value
             * @return {String || Null} value对应的算术符号
             * */
            getValueArithmetic : function (value) {
                if(!value) {
                    return null;
                }

                for(var i = 0; i < VALUE_ARITHMETIC.length; i++) {
                    if(VALUE_ARITHMETIC[i]['value'] === value) {
                        return VALUE_TYPE[i]['arithmetic'];
                    }
                }

                return null;
            },

            /*
             * @method 依据value值获取format值
             * @param {String} value
             * @param {Array} valueList
             * @return {String || Null} value对应的format
             * */
            getValueFormat : function (value, valueList) {
                if(!value || !valueList) {
                    return null;
                }

                var valueProperty = valueList[value], format = null;

                if(!valueProperty) {
                    return null;
                }

                // 获取format属性值
                format = valueProperty.format;

                // format 为 "" 时保持不变
                if(!format) {
                    return null;
                }else {
                    return format;
                }

                return null;
            }
        };
    }
]);
