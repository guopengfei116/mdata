/*
 * 配置页面路由
 * */
oasgames.mdataServicesConfig.config([
    '$httpProvider', 
    function($httpProvider) {
        $httpProvider.defaults.useXDomain = false;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);


