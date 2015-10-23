/*
 * 配置location
 * */
oasgames.mdataServicesConfig.config([
    '$locationProvider',
    function ($locationProvider) {
        $locationProvider.html5Mode(false);
    }
]);