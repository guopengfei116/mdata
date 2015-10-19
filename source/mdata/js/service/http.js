
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
                switch (CROSS_ORIGIN_METHOD) {
                    case 'message':
                        return 'MESSAGE';
                    case 'jsonp':
                        return 'JSONP';
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
                '$q',
                '$http',
                'ApiCtrl',
                function ($q, $http, ApiCtrl) {
                    var self = this;
                    return {

                        /*
                         * 原始方法
                         * */
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

                        messageSend : function (method, url, data) {
                            var iframe = window.document.createElement('iframe');
                            $(iframe).attr('src', '').appendTo('body');
                            var data = {
                                method : method,
                                url : url,
                                data : data,
                                message : 'ajax'
                            };

                            var defer = $q.defer();
                            var promise = defer.promise;
                            var returnData = null;
                            var callbacks = [];
                            promise.then(function () {
                                for(var i = 0; i < callbacks.length; i++) {
                                    callbacks[i](returnData.data);
                                }
                            }, function () {
                                if(returnData.code == 403) {
                                    Ui.alert('Failure');
                                }
                            });
                            promise.success = function (fn) {
                                callbacks.push(fn);
                            };

                            $(window).bind('message', function (e) {
                                data = e.data? e.data : {};
                                returnData = JSON.parse(data);
                                if(returnData && returnData.code == 200) {
                                    defer.resolve();
                                }else {
                                    defer.reject();
                                }
                            });

                            if(iframe.contentWindow.postMessage) {
                                iframe.contentWindow.postMessage(JSON.stringify(data), '*');
                            }

                            return promise;
                        },


                        /*
                         * 公共方法
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
                            }else if(method === 'POST') {
                                xhrPromise = this.postSend(url, data);
                            }else if(method === 'JSONP') {
                                xhrPromise = this.jsonpSend(url, data);
                            }else if(method === 'MESSAGE') {
                                xhrPromise = this.messageSend(method, url, data);
                            }

                            xhrPromise.success(function (result) {
                                if(result && result.code == 200) {
                                    fn && typeof fn === 'function' && fn(result.data);
                                }
                            });

                            return xhrPromise;
                        },


                        /*
                         * login interface method
                         * */
                        login : function (data, fn) {
                            return this.send('login', data, fn);
                        },

                        logout : function () {
                            return this.send('logout');
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
                            return this.send('appCreate', data, fn);
                        },

                        appUpdate : function (data, fn) {
                            return this.send('appUpdate', data, fn);
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

                        checkPaw : function (data, fn) {
                            return this.send('checkPaw', data, fn);
                        },

                        changePaw : function (data, fn) {
                            return this.send('changePaw', data, fn);
                        },

                        userCreate : function (data, fn) {
                            return this.send('userCreate', data, fn);
                        },

                        userUpdate : function (data, fn) {
                            return this.send('userUpdate', data, fn);
                        },

                        userDelete : function (data, fn) {
                            return this.send('userDelete', data, fn);
                        },


                        /*
                         * shortcut interface method
                         * */
                        shortcuts : function (fn) {
                            return this.send('shortcuts', null, fn);
                        },

                        shortcutAdd : function (data, fn) {
                            return this.send('shortcutAdd', data, fn);
                        },

                        shortcutDel : function (data, fn) {
                            return this.send('shortcutDel', data, fn);
                        },


                        /*
                         * report interface method
                         * */
                        reports : function (fn) {
                            return this.send('reports', null, fn);
                        },

                        reportView : function (data, fn) {
                            return this.send('reportView', data, fn);
                        },

                        reportUpdate : function (data, fn) {
                            return this.send('reportUpdate', data, fn);
                        },

                        reportCreate : function (fn) {
                            return this.send('reportCreate', null, fn);
                        },

                        reportSave : function (data, fn) {
                            return this.send('reportSave', data, fn);
                        },

                        reportDuplicate : function (data, fn) {
                            return this.send('reportDuplicate', data, fn);
                        },

                        reportDel : function (data, fn) {
                            return this.send('reportDel', data, fn);
                        },

                        guestUser : function (fn) {
                            return this.send('guestUser', null, fn);
                        },

                        checkReportName : function (data, fn) {
                            return this.send('checkReportName', data, fn);
                        },


                        /*
                         * log interface method
                         * */
                        systemLog : function (fn) {
                            return this.send('systemLog', null, fn);
                        }
                    }
                }
            ]
        }
    }
]);
