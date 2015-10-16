
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

                            if(data && typeof data !== 'object') {
                                throw Error('Http Data Illegal');
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
                                    fn && typeof fn === 'function' && fn(result.data);
                                }
                            });

                            return xhrPromise;
                        },

                        getSend : function (url, data) {
                            if(!data) {
                                return $http.get(url);
                            }
                            return $http.get(url, {params: data});
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


                        /*
                        * application interface method
                        * */
                        appIndex : function () {
                            if(arguments.length == 1) {
                                return this.send('appIndex', null, arguments[0]);
                            }
                            return this.send('appIndex', arguments[0], arguments[1]);
                        },

                        appUserList : function (fn) {
                            return this.send('appUserList', null, fn);
                        },

                        appCreate : function (data, fn) {
                            return this.send('userCreate', data, fn);
                        },

                        appUpdate : function (data, fn) {
                            return this.send('userUpdate', data, fn);
                        },


                        /*
                         * account interface method
                         * */
                        userIndex : function () {
                            if(arguments.length == 1) {
                                return this.send('userIndex', null, arguments[0]);
                            }
                            return this.send('userIndex', arguments[0], arguments[1]);
                        },

                        userAppList : function (fn) {
                            return this.send('userAppList', null, fn);
                        },

                        checkEmail : function (data, fn) {
                            return this.send('checkEmail', data, fn);
                        },

                        userCreate : function (data, fn) {
                            return this.send('userCreate', data, fn);
                        },

                        userUpdate : function (data, fn) {
                            return this.send('userUpdate', data, fn);
                        },

                        userDelete : function (data, fn) {
                            return this.send('userDelete', data, fn);
                        }
                    }
                }
            ]
        }
    }
]);
