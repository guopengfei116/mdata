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
* 公共
* */
require('common');

/*
 * 加载常量
 * */
oasgames.mdataConstant = angular.module('mdataConstant', []);
require('./constant/constant.js');

/*
 * 服务
 * */
oasgames.mdataServices = angular.module('mdataServices', ['ngResource']);
require('./service/filter.js');
require('./service/frame.js');
require('./service/get_api.js');
require('./service/user_auth.js');

/*
 * 加载服务配置
 * */
oasgames.mdataServicesConfig = angular.module('mdataServicesConfig', []);
require('./service_config/route_config.js');

/*
 * 过滤器
 * */
oasgames.mdataFilter = angular.module('mdataFilter', []);
require('./filter/filters.js');

/*
 * 指令
 * */
oasgames.mdataDirective = angular.module('mdataDirective', []);
require('./directive/search.js');

/*
 * 控制器
 * */
oasgames.mdataControllers = angular.module('mdataControllers', []);
require('./controller/frame.js');
require('./controller/login.js');
require('./controller/application.js');
require('./controller/account.js');
require('./controller/system.js');
require('./controller/report.js');

/*
 * app主模块
 * */
oasgames.mdataApp = angular.module('mdataApp', [
    'ngSanitize',
    'ngRoute',
    'mdataConstant',
    'mdataServices',
    'mdataServicesConfig',
    'mdataFilter',
    'mdataDirective',
    'mdataControllers'
]);

/*
 * 初始化页面路由
 * */
require('./initialize/run.js');
