
/*
 * @provider {Object} API 接口url
 * @return {Function} 获取接口url
 * */
oasgames.mdataPanelServices.provider('ApiCtrl', [
    function () {
        return {
            API : {
                'userAuth' : '/isLogin',
                'login' : '/mdata/js/login.json',
                'logout' : '/mdata/js/logout.json',
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
oasgames.mdataPanelServices.factory('Application', [
    '$resource',
    'ApiCtrl',
    function ($resource, ApiCtrl) {
        return $resource(ApiCtrl.get('application'), {}, {
            query: {method: 'GET', params: {appId: 'applications'}}
        });
    }
]);


/*
 * get account
 * */
oasgames.mdataPanelServices.factory('Account', [
    '$resource',
    'ApiCtrl',
    function ($resource, ApiCtrl) {
        return $resource(ApiCtrl.get('account'), {}, {
            query: {method: 'GET', params: {accountId: 'accounts'}}
        });
    }
]);


/*
 * get report
 * */
oasgames.mdataPanelServices.factory('Report', [
    '$resource',
    'ApiCtrl',
    function ($resource, ApiCtrl) {
        return $resource(ApiCtrl.get('report'), {}, {
            query: {method: 'GET', params: {reportId: 'reports'}}
        });
    }
]);