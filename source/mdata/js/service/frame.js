
/*
 * 用来配置哪些页面不需要基本的轮廓显示，
 * 提供getBlackList方法用来获取列表
 * @return {Array}
 * */
oasgames.mdataServices.factory('PageOutline', [
    function () {
        return {
            outlineHideList : [ '', '\\/login', '\\/notfound' ],

            //查询hash值是否匹配黑名单
            outlineHide : function (path) {
                var blackList = this.outlineHideList;
                var matched = false;
                for(var i = blackList.length - 1; i >= 0; i--) {
                    if(new RegExp('^' + blackList[i] + '$').test(path)) {
                        matched = true;
                        break;
                    }else {
                        matched = false;
                    }
                }
                return matched;
            }
        };
    }
]);

/*
 * @provider {String} breadcrumbSeparator 分隔符
 * @provider {Array} endSign 结束路径
 * @provider {Object} parseMethod 自定义生成breadcrumb，key为正则，value为处理方法
 * @return {Function} 解析path对应的breadcrumb
 * */
oasgames.mdataServices.provider('Breadcrumb', [
    function () {
        return {
            breadcrumbSeparator : '&nbsp;&gt;&nbsp;',
            endSign : ['edit', 'view'],
            parseMethod : {
                '^\\/system\\/log$' : function () {
                    return ['systemLog'];
                }
            },
            setApi : function (reg, fn) {
                this.parseMethod[reg] = fn;
            },
            $get : [
                '$location',
                function ($location) {
                    var self = this;
                    return {
                        getBreadcrumb : function (path) {
                            var path = path || $location.path();

                            //优先使用自定义的解析方法
                            for(var reg in self.parseMethod) {
                                if(new RegExp(reg).test(path)) {
                                    return self.parseMethod[reg]();
                                }
                            }

                            //breadcrumb解析
                            var breadcrumbs = [];
                            var pathChildren = path.split('/');

                            outerloop:
                            for(var i = 0; i < pathChildren.length; i++) {

                                // pathChildren[i] == ''
                                if (!pathChildren[i]) {
                                    continue;
                                }

                                //奇数添加分隔符
                                if(breadcrumbs.length % 2 == 1) {
                                    breadcrumbs.push(self.breadcrumbSeparator);
                                }

                                //如果是path为manage，则添加前缀
                                if(breadcrumbs.length == 2 && pathChildren[i] == 'manage') {
                                    breadcrumbs.push(breadcrumbs[0] + 'Manage');
                                }else {
                                    breadcrumbs.push(pathChildren[i]);
                                }

                                //路径结束标记
                                for(var j = 0; j < self.endSign.length; j++) {
                                    if(pathChildren[i] == self.endSign[j]) {
                                        break outerloop;
                                    }
                                }
                            }
                            return breadcrumbs;
                        },
                        getPath : function () {

                        }
                    }
                }
            ]
        };
    }
]);

