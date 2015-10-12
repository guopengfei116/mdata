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
                    var Cookie = require('Cookie');
                    if(config && config.headers) {
                        config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
                        config.headers['MDATA-KEY'] = Cookie.getCookie('MDATA-KEY');
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
                    if(rejection) {
                        if(rejection.status === 0) {
                            Ui.alert('Network connection error');
                        }else {
                            console.log(rejection);
                        }
                    }
                    return rejection;
                }
            };
            return interceptor;
        });
        $httpProvider.defaults.useXDomain = false;
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
        //$httpProvider.defaults.xhrFields = {'withCredentials': true};
        //$httpProvider.defaults.crossDomain = true;
        console.log($httpProvider.defaults);
    }
]);

