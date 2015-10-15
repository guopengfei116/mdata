
/*
 * @provider {Object} API 接口url
 * @return {Function} 获取接口url
 * */
oasgames.mdataServices.provider('Http', [
    'API_METHOD',
    function (API_METHOD) {
        return {
            get : API_METHOD.get,
            post : API_METHOD.post,

            /*
            * get api method
            * */
            getMethod : function (type) {
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
                            }else {
                                xhrPromise = this.postSend(url, data);
                            }

                            xhrPromise.success(function (result) {
                                if(result && result.code == 200) {
                                    fn && fn(result.data);
                                }
                            });
                        },

                        getSend : function (url, data) {
                            return $http.get(url, data);
                        },

                        postSend : function (url, data) {
                            return $http.post(url, data);
                        },

                        jsonpSend : function () {

                        },

                        login : function (data, fn) {
                            this.send('login', data, fn);
                        }
                    }
                }
            ]
        }
    }
]);