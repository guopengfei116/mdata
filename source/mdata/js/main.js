'use strict';

window.oasgames = {};

/*
* 依赖库
* */
require('./lib/jquery-1.11.1.js');
require('./lib/angular-1.4.3.js');
require('./lib/angular-resource.js');
require('./lib/angular-route.js');
require('./lib/angular-sanitize.js');

/*
 * 控制器
 * */
oasgames.mdataPanelControllers = angular.module('mdataPanelControllers', []);
require('./controller/frame.js');
require('./controller/login.js');
require('./controller/application.js');
require('./controller/account.js');
require('./controller/system.js');
require('./controller/report.js');

/*
 * 指令
 * */
oasgames.mdataPanelControllers = angular.module('mdataPanelDirective', []);
require('./directive/search.js');

/*
 * 过滤器
 * */
oasgames.mdataPanelFilter = angular.module('mdataPanelFilter', []);
require('./filter/filters.js');

/*
 * 服务
 * */
oasgames.mdataPanelServices = angular.module('mdataPanelServices', ['ngResource']);
require('./service/filter.js');
require('./service/frame.js');
require('./service/get_api.js');
require('./service/user_auth.js');

/*
 * app主模块
 * */
oasgames.mdataPanelApp = angular.module('mdataPanelApp', [
    'ngSanitize',
    'ngRoute',
    'mdataPanelControllers',
    'mdataPanelServices',
    'mdataPanelFilter',
    'mdataPanelDirective'
]);

/*
* 加载常量
* */
require('./constant/constant.js');

/*
 * 加载服务配置
 * */
require('./service_config/route_config.js');

/*
 * 初始化页面路由
 * */
require('./initialize/run.js');