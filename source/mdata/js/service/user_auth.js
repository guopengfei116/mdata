
/*
 * 用户登录验证
 * @return {Object} UserAuth
 *
 * */
oasgames.mdataPanelServices.provider('UserAuth', [
    function () {
        return {
            //权限可访问的路由表
            regAuthTable : {
                '1' : [
                    /^\/\w+/
                ],
                '2' : [
                    /^\/report/
                ],
                '3' : [
                    /^\/report/
                ],
                '4' : [
                    /^\/report\/view\/\w+$/
                ]
            },

            $get : [
                '$rootScope',
                function ($rootScope) {
                    var self = this;

                    var UserAuth = {

                        //路由权限验证
                        route : function (url) {

                            //用户权限
                            var userAuth = $rootScope.user['authority'];

                            //可访问的路由正则list
                            var regAuthList =  self.regAuthTable[userAuth];

                            if(!regAuthList) {
                                throw new Error('未知的用户权限：' + userAuth);
                            }

                            //验证路由是否合法
                            for(var i = regAuthList.length - 1; i >= 0; i--) {
                                if(regAuthList[i].test(url)) {
                                    return true;
                                }
                            }

                            return false;
                        }
                    };
                    return UserAuth;
                }
            ]
        }
    }
]);