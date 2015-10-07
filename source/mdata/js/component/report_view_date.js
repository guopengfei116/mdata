
/*
* report_view页面的日期插件配置
* */
var reportViewDate = function (options) {
    var current = new Date();
    this.o = {
        startTime : current.getTime(),
        endTime : current.getTime(),
        minTime : current.getTime(),
        startDataInputSelector : '#reportStartDate',
        endDataInputSelector : '#reportEndDate'
    };
    $.extend(this.o, options);

    var startTime = parseInt(this.o.startTime), endTime = parseInt(this.o.endTime), minTime = parseInt(this.o.minTime);
    var startYear = current.getFullYear(), startMonth = current.getMonth() + 1, startDay = current.getDate();
    var startDate, endDate;

    var startDataInput = $(this.o.startDataInputSelector);
    var endDataInput = $(this.o.endDataInputSelector);
    startDataInput.val(startYear + '-' + startMonth + '-' + startDay);
    endDataInput.val(startYear + '-' + startMonth + '-' + (startDay + 1));

    // 开始时间
    this.startDateComp = startDate = $('#reportStartDate').glDatePicker({
        showAlways: false,
        cssName: 'flatwhite',
        allowMonthSelect: false,
        allowYearSelect: false,
        selectedDate: new Date(startTime),
        selectableDateRange: [
            { from: new Date(minTime),
                to: new Date(startYear, startMonth, startDay) }
        ],

        onClick: function(target, cell, date, data) {

            target.val(date.getFullYear() + '-' +
                date.getMonth() + '-' +
                date.getDate());

            if(data != null) {
                alert(data.message + '\n' + date);
            }

            // 修改结束时间可选范围
            $.extend(endDate.options, {
                /*selectedDate: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),*/
                selectableDateRange: [
                    { from: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
                        to: new Date(startYear, startMonth, startDay) }
                ]
            });
            endDate.render();
        }
    }).glDatePicker(true);

    // 结束时间
    this.endDateComp = endDate = $('#reportEndDate').glDatePicker({
        showAlways: false,
        cssName: 'flatwhite',
        allowMonthSelect: false,
        allowYearSelect: false,
        selectedDate: new Date(endTime),

        onClick: function(target, cell, date, data) {

            target.val(date.getFullYear() + '-' +
                date.getMonth() + '-' +
                date.getDate());

            if(data != null) {
                alert(data.message + '\n' + date);
            }
        }
    }).glDatePicker(true);
};

reportViewDate.prototype = {
    constructor : reportViewDate,
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
    changeStartData : function (time) {
        $.extend(this.startDateComp.options, {
            selectedDate: new Date(time)
        });
    },
    changeEndData : function (time) {
        $.extend(this.endDateComp.options, {
            selectedDate: new Date(time)
        });
    },
    changeData : function (type) {
        var current = new Date();
        var year = current.getFullYear(), month = current.getMonth() + 1, day = current.getDate();
        var startDataInput = $(this.o.startDataInputSelector);
        var endDataInput = $(this.o.endDataInputSelector);
        var tempMonth, startTempDay, endTempDay;
        switch (type) {
            case 0 :
                endTempDay = day + 1;
                startDataInput.val(year + '-' + month + '-' + day);
                endDataInput.val(year + '-' + month + '-' + endTempDay);
                break;
            case 1 :
                startTempDay = day - 1;
                startDataInput.val(year + '-' + month + '-' + startTempDay);
                endDataInput.val(year + '-' + month + '-' + day);
                break;
            case 7 :
                if(day > 7) {
                    startTempDay = day - 7;
                    startDataInput.val(year + '-' + month + '-' + startTempDay);
                    endDataInput.val(year + '-' + month + '-' + day);
                }else {
                    tempMonth = month - 1;
                    startTempDay = this.getMonthIsDay(tempMonth) + day - 7;
                    startDataInput.val(year + '-' + tempMonth + '-' + startTempDay);
                    endDataInput.val(year + '-' + month + '-' + day);
                }
                break;
            case '7L' :
                if(day > 7) {
                    startTempDay = day - 7;
                    startDataInput.val(year + '-' + month + '-' + startTempDay);
                    endDataInput.val(year + '-' + month + '-' + day);
                }else {
                    tempMonth = month - 1;
                    startTempDay = this.getMonthIsDay(tempMonth) + day - 7;
                    startDataInput.val(year + '-' + tempMonth + '-' + startTempDay);
                    endDataInput.val(year + '-' + month + '-' + day);
                }
                break;
            case 30 :
                if(day > 30) {
                    startTempDay = day - 30;
                    startDataInput.val(year + '-' + month + '-' + startTempDay);
                    endDataInput.val(year + '-' + month + '-' + day);
                }else {
                    tempMonth = month - 1;
                    startTempDay = this.getMonthIsDay(tempMonth) + day - 30;
                    startDataInput.val(year + '-' + tempMonth + '-' + startTempDay);
                    endDataInput.val(year + '-' + month + '-' + day);
                }
                break;
            case '30L' :
                tempMonth = month - 1;
                startDataInput.val(year + '-' + tempMonth + '-' + 1);
                endDataInput.val(year + '-' + month + '-' + 1);
                break;
        }
    }
};

module.exports = reportViewDate;