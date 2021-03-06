'use strict';

window.oasgames = {};

/*
* 依赖库
* */
require('./lib/jquery-1.11.1.js');
require('./lib/jquery.sortable.js');
require('./lib/glDatePicker.js');
require('./lib/angular-1.4.3.js');
require('./lib/angular-resource.js');
require('./lib/angular-route.js');
require('./lib/angular-sanitize.js');

/*
* 公共
* */
require('common');
window.Ui = require('Ui');
window.authentication = new (require('Authentication'));

/*
 * 加载常量
 * */
oasgames.mdataConstant = angular.module('mdataConstant', []);
require('./constant/constant.js');

/*
 * 服务
 * */
oasgames.mdataServices = angular.module('mdataServices', ['ngResource']);
require('./service/cache_control.js');
require('./service/account_cache.js');
require('./service/application_cache.js');
require('./service/report_cache.js');
require('./service/shortcut_cache.js');
require('./service/filter.js');
require('./service/frame.js');
require('./service/get_api.js');
require('./service/http.js');
require('./service/user_auth.js');
require('./service/value_group.js');
require('./service/verify_form.js');

/*
 * 加载服务配置
 * */
oasgames.mdataServicesConfig = angular.module('mdataServicesConfig', []);
require('./service_config/route_config.js');
require('./service_config/location_config.js');
require('./service_config/http_config.js');

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
require('./directive/recombination_select.js');
require('./directive/cascade_choice.js');
require('./directive/value_group.js');
require('./directive/value_sortable.js');

/*
 * 控制器
 * */
oasgames.mdataControllers = angular.module('mdataControllers', []);
require('./controller/frame.js');
require('./controller/navigation.js');
require('./controller/login.js');
require('./controller/change_password.js');
require('./controller/applications.js');
require('./controller/application_edit.js');
require('./controller/accounts.js');
require('./controller/account_edit.js');
require('./controller/reports.js');
require('./controller/report_edit.js');
require('./controller/report.js');
require('./controller/system_log.js');

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
