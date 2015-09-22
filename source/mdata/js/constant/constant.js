
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
 * 时区
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
 * report日期范围
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
 * report_dimension
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
 * report_filter支持的运算符
 * */
oasgames.mdataConstant.constant("COMPUTE_SIGN", [
    "=",
    ">",
    "<",
    ">=",
    "<=",
    "in",
    "!="
]);

