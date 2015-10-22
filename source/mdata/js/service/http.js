
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
                'CACHE_SETTINGS',
                'ApplicationCache',
                'AccountCache',
                'ReportCache',
                'ShortcutCache',
                function ($q, $http, ApiCtrl, CACHE_SETTINGS, ApplicationCache, AccountCache, ReportCache, ShortcutCache) {
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

                        logout : function (fn) {
                            return this.send('logout', null, fn);
                        },


                        /*
                        * application interface method
                        * 如果获取application列表数据，则会依据配置进行缓存
                        * */
                        appIndex : function () {
                            var callBack = null, paramCallBack = null;
                            if(arguments.length == 1) {
                                if(CACHE_SETTINGS.applicationListCache) {
                                    paramCallBack = arguments[0];
                                    callBack = function (data) {
                                        if(!data) {
                                            data = [];
                                        }
                                        ApplicationCache.set(data);
                                        paramCallBack(data);
                                    }
                                }else {
                                    callBack = arguments[0];
                                }
                                return this.send('appIndex', null, callBack);
                            }else {
                                return this.send('appIndex', arguments[0], arguments[1]);
                            }
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
                         * 如果获取account列表数据，则会依据配置进行缓存
                         * */
                        userIndex : function () {
                            var callBack = null, paramCallBack = null;
                            if(arguments.length == 1) {
                                if(CACHE_SETTINGS.accountListCache) {
                                    paramCallBack = arguments[0];
                                    callBack = function (data) {
                                        if(!data) {
                                            data = [];
                                        }
                                        AccountCache.set(data);
                                        paramCallBack(data);
                                    }
                                }else {
                                    callBack = arguments[0];
                                }
                                return this.send('userIndex', null, callBack);
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
                         * 并依据配置进行缓存
                         * */
                        shortcuts : function (fn) {
                            var callBack = fn;
                            if(CACHE_SETTINGS.shortcutListCache) {
                                callBack = function (data) {
                                    if(!data) {
                                        data = [];
                                    }
                                    ShortcutCache.set(data);
                                    fn(data);
                                }
                            }
                            return this.send('shortcuts', null, callBack);
                        },

                        shortcutAdd : function (data, fn) {
                            return this.send('shortcutAdd', data, fn);
                        },

                        shortcutDel : function (data, fn) {
                            return this.send('shortcutDel', data, fn);
                        },


                        /*
                         * report interface method
                         * 并依据配置进行缓存
                         * */
                        reports : function (fn) {
                            var callBack = fn;
                            if(CACHE_SETTINGS.reportListCache) {
                                callBack = function (data) {
                                    if(!data) {
                                        data = [];
                                    }
                                    ReportCache.set(data);
                                    fn(data);
                                }
                            }
                            return this.send('reports', null, callBack);
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

                        guestUser : function (data, fn) {
                            return this.send('guestUser', data, fn);
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
