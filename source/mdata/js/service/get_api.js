
/*
 * @provider {Object} API 接口url
 * @return {Function} 获取接口url
 * */
oasgames.mdataServices.provider('ApiCtrl', [
    function () {
        return {
            API : {
                'userAuth' : '/isLogin',
                'login' : '/mdata/js/login.json',
                'logout' : '/mdata/js/logout.json',
                'checkPaw' : '/mdata/js/check_password.json',
                'shortcuts' : '/mdata/js/shortcuts.json',
                'application' : '/mdata/js/:appId.json',
                'account' : '/mdata/js/:accountId.json',
                'report' : '/mdata/js/:reportId.json',
                'systemLog' : '/mdata/js/system_log.json'
            },
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
                        return url;
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
