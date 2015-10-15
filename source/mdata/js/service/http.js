
/*
 * @provider {Object} API 接口url
 * @return {Function} 获取接口url
 * */
oasgames.mdataServices.provider('Http', [
    function () {
        return {
            get : [

            ],

            post : [
                'login'
            ],

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

                throw Error('Http Method Not found');
            },

            $get : [
                '$http',
                'ApiCtrl',
                function ($http, ApiCtrl) {
                    var self = this;
                    return {
                        login : function (data, fn) {
                            var method = self.getMethod('login');
                            $http({
                                url: ApiCtrl.get('login'),
                                method: method,
                                data: data
                            }).success(function (result) {
                                if(result && result.code == 200) {
                                    fn && fn(result.data);
                                }
                            });
                        }
                    }
                }
            ]
        }
    }
]);