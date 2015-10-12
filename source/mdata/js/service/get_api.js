
/*
 * @provider {Object} API 接口url
 * @return {Function} 获取接口url
 * */
oasgames.mdataServices.provider('ApiCtrl', [
    'RUN_TIME_SYSTEM',
    'API_CONFIG',
    function (runTimeSystem, apiAll) {
        return {
            API : runTimeSystem.online ? apiAll.online : apiAll.local,
            localhost : runTimeSystem.domain ? 'http://api.mdata.com' : '',
            setApi : function (name, url) {
                this.API[name] = url;
            },
            $get : function () {
                var self = this;
                return {
                    get : function (name) {
                        
                        var url = self.API[name];
                        if(!url) {
                            console.log('api--' + name + '不存在');
                            return '';
                        }

                        return self.localhost + url;
                    },
                    set : function (name, url) {
                        self.setApi(name, url);
                    }
                }
            }
        };
    }
]);


/*
 * get app
 * */
oasgames.mdataServices.factory('Application', [
    '$resource',
    'ApiCtrl',
    function ($resource, ApiCtrl) {
        return $resource(ApiCtrl.get('application'), {}, {
            query: {method: 'GET', params: {appId: 'applications'}},
            get: {method: 'GET', params: {appId: 'applications'}}
        });
    }
]);


/*
 * get account
 * */
oasgames.mdataServices.factory('Account', [
    '$resource',
    'ApiCtrl',
    function ($resource, ApiCtrl) {
        return $resource(ApiCtrl.get('account'), {}, {
            query: {method: 'GET', params: {accountId: 'accounts'}},
            get: {method: 'GET', params: {accountId: 'accounts'}}
        });
    }
]);


/*
 * get report
 * */
oasgames.mdataServices.factory('Report', [
    '$resource',
    'ApiCtrl',
    function ($resource, ApiCtrl) {
        return $resource(ApiCtrl.get('report'), {}, {
            query: {method: 'GET', params: {reportId: 'reports'}}
        });
    }
]);


/*
 * shortcut
 * */
oasgames.mdataServices.factory('Shortcut', [
    '$resource',
    'ApiCtrl',
    function ($resource, ApiCtrl) {
        return $resource(ApiCtrl.get('shortcut'), {}, {
            save: {method: 'POST', params: {type: 'shortcut_add'}},
            get: {method: 'GET', params: {type: 'shortcut_add'}}
        });
    }
]);