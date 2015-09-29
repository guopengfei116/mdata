
/*
* report_view页面的日期插件配置
* */
var reportViewDate = function (startTime, endTime, minTime) {
    var startTime = parseInt(startTime), endTime = parseInt(endTime), minTime = parseInt(minTime);

    var current = new Date();
    var startYear = current.getFullYear(), startMonth = current.getMonth() + 1, startDay = current.getDate();
    var startDate, endDate;

    // 开始时间
    startDate = $('#reportStartDate').glDatePicker({
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
    endDate = $('#reportEndDate').glDatePicker({
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

module.exports = reportViewDate;