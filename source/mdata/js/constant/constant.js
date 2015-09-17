
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

