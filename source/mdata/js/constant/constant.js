/*
* 配置测试或线上环境
* */
oasgames.mdataConstant.constant("RUN_TIME_SYSTEM", {
    online : true,
    domain : true
});

/*
 * 用户权限对照表
 * */
oasgames.mdataConstant.constant("API_CONFIG", {
    "online" : {
        'userAuth' : '/isLogin',
        'login' : '/site/login',
        'logout' : '/site/logout',
        'changePaw' : '/site/modify-psw',
        'checkPaw' : '/site/check-psw',
        'appIndex' : '/app/index',
        'appUpdate' : '/app/update',
        'appCreate' : '/app/create',
        'appUserList' : '/user/get-users',
        'userIndex' : '/user/index',
        'userUpdate' : '/user/update',
        'userCreate' : '/user/create',
        'userDelete' : '/user/delete',
        'userAppList' : '/user/app-list',
        'checkEmail' : '/user/check-email',
        'systemLog' : '/log/index',
        'reports': '/report/view',
        'reportView' : '/report/view-report',
        'reportUpdate': '/report/update',
        'reportDel': '/report/del',
        'checkReportName' : '/report/check-report-name',
        'shortcuts' : '/report/shortcut',
        'shortcutAdd' : '/report/favorite-add',
        'shortcutDel' : '/report/favorite-del',
        'guestUser' : '/report/guest-user'
    },
    "local" : {
        'userAuth' : '/isLogin',
        'login' : '/mdata/js/login.json',
        'logout' : '/mdata/js/logout.json',
        'changePaw' : '/mdata/js/change_password.json',
        'checkPaw' : '/mdata/js/check_password.json',
        'application' : '/mdata/js/:appId.json',
        'account' : '/mdata/js/:accountId.json',
        'systemLog' : '/mdata/js/system_log.json',
        'report' : '/mdata/js/:reportId.json',
        'reportName' : '/mdata/js/check_reportName.json',
        'shortcuts' : '/mdata/js/shortcuts.json',
        'shortcut' : '/mdata/js/:type.json',
        'guestUser' : '/mdata/js/guest_user.json'
    }
});

/*
 * 用户权限对照表
 * */
oasgames.mdataConstant.constant("AUTHORITY", {
    'administrators' : 1,
    'yeoman' : 2,
    'yeoman_report' : {
        'reportAdmin' : 1,
        'reportViewer' : 2,
        'reportGuest' : 3
    }
});

/*
 * app创建time_zone选项
 * */
oasgames.mdataConstant.constant("TIME_ZONE", [
    { key : 'China', value : 'Asia/Shanghai' },
    { key : 'Turkey', value : 'Europe/Istanbul' },
    { key : 'Brazil', value : 'America/Sao_Paulo' },
    { key : 'Argentina', value : 'America/Argentina/Buenos_Aires' },
    { key : 'Mexico', value : 'America/Mexico_City' },
    { key : 'USA', value : 'America/New_York' }
]);

/*
 * app创建processor选项
 * */
oasgames.mdataConstant.constant("PROCESSOR", [
    "normalevent",
    "retention",
    "dau",
    "wau",
    "mau",
    "dailystatus",
    "payment",
    "loss"
]);

/*
 * report查看的日期范围
 * */
oasgames.mdataConstant.constant("REPORT_DATE_RANGE", [
    { meaning : '今天', value : 0 },
    { meaning : '昨天', value : 1 },
    { meaning : '过去7天', value : 7 },
    { meaning : '上周', value : '7L' },
    { meaning : '过去30天', value : 30 },
    { meaning : '上月', value : '30L' }
]);

/*
 * report_dimension可选列表
 * */
oasgames.mdataConstant.constant("REPORT_DIMENSION", [
    { dimension : 'ip', value : 'ip' },
    { dimension : 'uuid', value : 'uuid' },
    { dimension : 'udid', value : 'udid' },
    { dimension : 'channel', value : 'channel' },
    { dimension : 'subchannel', value : 'subchannel' },
    { dimension : 'referrer', value : 'referrer' },
    { dimension : 'country', value : 'country' },
    { dimension : 'region', value : 'region' },
    { dimension : 'city', value : 'city' },
    { dimension : 'locale', value : 'locale' },
    { dimension : 'version', value : 'version' },
    { dimension : 'os', value : 'os' },
    { dimension : 'browser', value : 'browser' },
    { dimension : 'screen', value : 'screen' },
    { dimension : 'reg_date', value : 'reg_date' },
    { dimension : 'reg_channel', value : 'reg_channel' },
    { dimension : 'reg_subchannel', value : 'reg_subchannel' },
    { dimension : 'server_reg_directed', value : 'server_reg_directed' }
]);

/*
 * report_filter可选列表
 * */
oasgames.mdataConstant.constant("FILTER", [
    "ip",
    "uuid",
    "udid",
    "channel",
    "subchannel",
    "referrer",
    "country",
    "region",
    "city",
    "locale",
    "version",
    "os",
    "browser",
    "screen",
    "reg_date",
    "reg_channel",
    "reg_subchannel",
    "server_reg_directed"
]);

/*
 * report_filter支持的运算符
 * */
oasgames.mdataConstant.constant("FILTER_COMPUTE_SIGN", [
    "=",
    ">",
    "<",
    ">=",
    "<=",
    "in",
    "!="
]);

/*
 * report_value_group支持的类型
 * */
oasgames.mdataConstant.constant("VALUE_TYPE", [
    { type : 'original', value : '0' },
    { type : 'percent', value : '1' },
    { type : 'int', value : '2' },
    { type : 'currency', value : '3' }
]);

/*
 * report_value_group支持的算法
 * */
oasgames.mdataConstant.constant("VALUE_ARITHMETIC", [
    { arithmetic : 'Null', value : '0' },
    { arithmetic : 'addition(+)', value : '1' },
    { arithmetic : 'subtraction(-)', value : '2' },
    { arithmetic : 'multiplication(*)', value : '3' },
    { arithmetic : 'division(/)', value : '4' }
]);

