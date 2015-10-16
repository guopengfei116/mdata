
/*
 * @provider {Object} API 接口url
 * @return {Function} 获取接口url
 * */
oasgames.mdataServices.provider('Http', [
    'API_METHOD',
    'CROSS_ORIGIN_METHOD',
    function (API_METHOD, CROSS_ORIGIN_METHOD) {
        return {
            get : API_METHOD.get,
            post : API_METHOD.post,

            /*
            * get api method
            * */
            getMethod : function (type) {
                if(CROSS_ORIGIN_METHOD.jsonp) {
                    return 'JSONP'
                }

                for(var i = this.get.length - 1; i >= 0; i--) {
                    if(type === this.get[i]) {
                        return 'GET';
                    }
                }

                for(var i = this.post.length - 1; i >= 0; i--) {
                    if(type === this.post[i]) {
                        return 'POST';
                    }
                }

                return null;
            },

            $get : [
                '$http',
                'ApiCtrl',
                function ($http, ApiCtrl) {
                    var self = this;
                    return {
                        /*
                         * 发送请求
                         * */
                        send : function (type, data, fn) {
                            var xhrPromise = null;
                            var url = ApiCtrl.get(type);
                            var method = self.getMethod(type);

                            if(!url || !method) {
                                throw Error('Interface Not found');
                            }

                            if(method === 'GET') {
                                xhrPromise = this.getSend(url, data);
                            }else if(method === 'POST'){
                                xhrPromise = this.postSend(url, data);
                            }else if(method === 'JSONP'){
                                xhrPromise = this.jsonpSend(url, data);
                            }

                            xhrPromise.success(function (result) {
                                if(result && result.code == 200) {
                                    fn && fn(result.data);
                                }else {
                                    console.log(result);
                                    console.log('请求错误');
                                }
                            });

                            return xhrPromise;
                        },

                        getSend : function (url, data) {
                            if(!data) {
                                return $http.get(url);
                            }
                            return $http.get(url, data);
                        },

                        postSend : function (url, data) {
                            if(!data) {
                                return $http.post(url);
                            }
                            return $http.post(url, data);
                        },

                        jsonpSend : function (url, data) {
                            if(!data) {
                                return $http.jsonp(url);
                            }
                            return $http.jsonp(url, data);
                        },

                        login : function (data, fn) {
                            return this.send('login', data, fn);
                        },

                        reports : function (fn) {
                            return this.send('reports', null, fn);
                        },

                        appIndex : function (fn) {
                            return this.send('appIndex', null, fn);
                        },

                        userIndex : function (fn) {
                            return this.send('userIndex', null, fn);
                        }
                    }
                }
            ]
        }
    }
]);