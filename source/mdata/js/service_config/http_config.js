/*
 * 配置页面路由
 * */
oasgames.mdataServicesConfig.config([
    '$httpProvider', 
    function($httpProvider) {
        $httpProvider.defaults.transformRequest = function(data){
            if($ && data) {
                return $.param(data);
            }
        };
        $httpProvider.interceptors.push(function(){
            var interceptor = {
                'request':function(config){
                    if(config && config.headers) {
                        config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
                    }
                    return config;
                },
                'response':function(resp){
                    return resp;
                },
                'requestError':function(rejection){
                    console.log(rejection);
                    return rejection;
                },
                'responseError':function(rejection){
                    console.log(rejection);
                    return rejection;
                }
            };
            return interceptor;
        });
        $httpProvider.defaults.useXDomain = false;
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        //$httpProvider.defaults.xhrFields = {'withCredentials': true};
        //$httpProvider.defaults.crossDomain = true;
        console.log($httpProvider.defaults);
    }
]);

