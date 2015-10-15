
/*
* report_view页面的日期插件配置
* */
var reportViewDate = function (options) {
    var current = new Date();
    var currentYear = current.getFullYear(), currentMonth = current.getMonth() + 1, currentDay = current.getDate();
    var startDateInstance, endDateInstance;
    this.o = {
        startTime : current.getTime(),
        endTime : current.getTime(),
        minTime : current.getTime(),
        startDataInputSelector : '#reportStartDate',
        endDataInputSelector : '#reportEndDate'
    };
    $.extend(this.o, options);

    // 初始化表单值
    var startTime = parseInt(this.o.startTime), endTime = parseInt(this.o.endTime), minTime = parseInt(this.o.minTime);
    var startTimeDate  = new Date(startTime);
    var startTimeYear = startTimeDate.getFullYear(), startTimeMonth = startTimeDate.getMonth() + 1, startTimeDay = startTimeDate.getDate();
    var endTimeDate  = new Date(endTime);
    var endTimeYear = endTimeDate.getFullYear(), endTimeMonth = endTimeDate.getMonth() + 1, endTimeDay = endTimeDate.getDate();
    var startDataInput = $(this.o.startDataInputSelector);
    var endDataInput = $(this.o.endDataInputSelector);
    startDataInput.val(startTimeYear + '-' + startTimeMonth + '-' + startTimeDay);
    endDataInput.val(endTimeYear + '-' + endTimeMonth + '-' + endTimeDay);

    // 开始时间
    this.startDateComp = startDateInstance = $('#reportStartDate').glDatePicker({
        showAlways: false,
        cssName: 'flatwhite',
        allowMonthSelect: false,
        allowYearSelect: false,
        selectedDate: new Date(startTime),
        selectableDateRange: [
            { from: new Date(2000, 1, 1),
                to: new Date(currentYear, currentMonth, currentDay) }
        ],

        onClick: function(target, cell, date, data) {

            target.val(date.getFullYear() + '-' +
                (date.getMonth() + 1) + '-' +
                date.getDate());

            if(data != null) {
                alert(data.message + '\n' + date);
            }

            // 修改结束时间可选范围
            $.extend(endDateInstance.options, {
                selectedDate: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
                selectableDateRange: [
                    { from: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
                        to: new Date(currentYear, currentMonth, currentDay) }
                ]
            });
            endDateInstance.render();
        }
    }).glDatePicker(true);

    // 结束时间
    this.endDateComp = endDateInstance = $('#reportEndDate').glDatePicker({
        showAlways: false,
        cssName: 'flatwhite',
        allowMonthSelect: false,
        allowYearSelect: false,
        selectedDate: new Date(endTime),

        onClick: function(target, cell, date, data) {

            target.val(date.getFullYear() + '-' +
                (date.getMonth() + 1) + '-' +
                date.getDate());

            if(data != null) {
                alert(data.message + '\n' + date);
            }
        }
    }).glDatePicker(true);
};

reportViewDate.prototype = {
    constructor : reportViewDate,

    /*
    * @method 获取某月天数，必要时需要传入年份
    * @param {Number} month 月份
    * @param {Number} year 年份
    * @return {Number} 天数
    * */
    getMonthIsDay : function (month, year) {
        var long = '1,3,5,7,8,10,12';
        var normal = '4,6,9,11';

        // 31天
        if(long.indexOf(month) != -1) {
            return 31;
        }

        // 30天
        if(normal.indexOf(month) != -1) {
            return 30;
        }

        // 2月
        if(year && year % 4 == 0) {
            return 29;
        }else {
            return 28;
        }
    },

    // 更新日期插件select日期 -- 开始时间
    changeStartData : function (time) {
        $.extend(this.startDateComp.options, {
            selectedDate: new Date(time)
        });
    },

    // 更新日期插件select日期 -- 结束时间
    changeEndData : function (time) {
        $.extend(this.endDateComp.options, {
            selectedDate: new Date(time)
        });
    },

    /*
    * @method 根据类型转换开始时间和结束时间
    * @param {String} type 类型
    * */
    changeData : function (type) {
        var current = new Date();
        var year = current.getFullYear(), month = current.getMonth() + 1, day = current.getDate(), week = current.getDay();
        var startDataInput = $(this.o.startDataInputSelector);
        var endDataInput = $(this.o.endDataInputSelector);
        var tempMonth, endTempMonth, startTempDay, endTempDay;
        switch (type) {
            case 0 :
                startDataInput.val(year + '-' + month + '-' + day);
                endDataInput.val(year + '-' + month + '-' + day);
                break;
            case 1 :
                endTempDay = startTempDay = day - 1; // 昨天
                startDataInput.val(year + '-' + month + '-' + startTempDay);
                endDataInput.val(year + '-' + month + '-' + endTempDay);
                break;
            case 7 :
                endTempDay = day - 1; // 昨天
                if(day > 7) {
                    startTempDay = day - 7; // 过去7天
                    startDataInput.val(year + '-' + month + '-' + startTempDay);
                    endDataInput.val(year + '-' + month + '-' + endTempDay);
                }else {
                    tempMonth = month - 1;
                    startTempDay = this.getMonthIsDay(tempMonth) + day - 7; // 当月天数小于7天的部分，从上月总天数中扣除
                    startDataInput.val(year + '-' + tempMonth + '-' + startTempDay);
                    endDataInput.val(year + '-' + month + '-' + endTempDay);
                }
                break;
            case '7L' :
                if(day > (6 + week)) {
                    startTempDay = day - (6 + week); // 周一
                    endTempDay = day - week;  // 周日
                    startDataInput.val(year + '-' + month + '-' + startTempDay);
                    endDataInput.val(year + '-' + month + '-' + endTempDay);
                }else {
                    tempMonth = month - 1;
                    startTempDay = this.getMonthIsDay(tempMonth) + day - (6 + week);
                    if(day > week) {
                        endTempDay = day - week;
                        endTempMonth = month;
                    }else {
                        endTempDay = this.getMonthIsDay(tempMonth) + day - week;
                        endTempMonth = month - 1;
                    }
                    startDataInput.val(year + '-' + tempMonth + '-' + startTempDay);
                    endDataInput.val(year + '-' + endTempMonth + '-' + endTempDay);
                }
                break;
            case 30 :
                endTempDay = day - 1; // 昨天
                if(day > 30) {
                    startTempDay = day - 30; // 过去30天
                    startDataInput.val(year + '-' + month + '-' + startTempDay);
                    endDataInput.val(year + '-' + month + '-' + endTempDay);
                }else {
                    tempMonth = month - 1;
                    startTempDay = this.getMonthIsDay(tempMonth) + day - 30;
                    startDataInput.val(year + '-' + tempMonth + '-' + startTempDay);
                    endDataInput.val(year + '-' + month + '-' + endTempDay);
                }
                break;
            case '30L' :
                tempMonth = month - 1; // 上月
                startTempDay = 1;  // 月初天数
                endTempDay = this.getMonthIsDay(tempMonth); // 月底天数
                startDataInput.val(year + '-' + tempMonth + '-' + startTempDay);
                endDataInput.val(year + '-' + tempMonth + '-' + endTempDay);
                break;
        }
    }
};

module.exports = reportViewDate;