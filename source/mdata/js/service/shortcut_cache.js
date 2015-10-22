
/*
 * shortcut 列表缓存处理
 * @return {Object} functions
 * */
oasgames.mdataServices.factory('ShortcutCache', [
    '$cacheFactory',
    function ($cacheFactory) {

        /*
         * @method 判断收藏列表是否已存在某app
         * @return {Array || false} 存在返回一个数组，包含app对象和app的位置，不存在返回null
         * */
        function appIsExistShortcut(shortcuts, appId) {
            for(var i = 0; i < shortcuts.length; i++) {
                if(shortcuts[i].appid == appId) {
                    return [shortcuts[i], i];
                }
            }
            return null;
        }

        /*
         * @method 判断收藏的某app中是否已存在某report
         * @return {Object || false} 存在返回一个数组，包含report对象和report的位置，不存在返回null
         * */
        function reportIsExistShortcut(app, reportId) {
            for(var i = 0; i < app.reports.length; i++) {
                if(app.reports[i].id == reportId) {
                    return [app.reports[i], i];
                }
            }
            return false;
        }

        return {

            /*
             * cache shortcut list
             * */
            set : function (data) {
                var cache = $cacheFactory.get('shortcut');
                if(!cache) {
                    cache = $cacheFactory('shortcut');
                }
                cache.put('list', data);
            },

            /*
             * get shortcut list
             * */
            get : function () {
                var cache = $cacheFactory.get('shortcut'),
                    listCache = null;
                if(cache && cache.get('list')) {
                    listCache = cache.get('list');
                }
                return listCache;
            },

            /*
             * delete account list
             * */
            delete : function () {
                var cache = $cacheFactory.get('shortcut');
                if(cache) {
                    cache.remove('list');
                }
                return true;
            },

            /*
             * @method add shortcut list item
             *
             * @* 如果已收藏过这个app下的report，
             * @* 则push新收藏的report到app['reports']，
             * @* 否则新建一个app体系
             *
             * @return {Boole} 添加结果
             * */
            addItem : function (report, app) {
                var listCache = this.get();
                if(!listCache || !report || !report.id || !app || !app.appid) {
                    return false;
                }

                try {
                    var appExitInfo = appIsExistShortcut(listCache, app.appid);
                    var tempApp = appExitInfo && appExitInfo[0];
                    if(tempApp) {
                        if(!reportIsExistShortcut(tempApp, report.id)) {
                            tempApp.reports.push(report);
                            return true;
                        }
                    }else {
                        // 修改app的reports属性会造成连锁影响
                        tempApp = {};
                        tempApp.appid = app.appid;
                        tempApp.appname = app.appname;
                        tempApp.reports = [];
                        tempApp.reports.push(report);
                        listCache.push(tempApp);
                        return true;
                    }
                }catch (e) {
                    console.log(e);
                    return false;
                }
            },

            /*
             * @method delete shortcut list item
             *
             * @* 如果app下只有一个report，
             * @* 则删除这个app，
             * @* 否则删除report，
             *
             * @return {Boole} 删除结果
             * */
            deleteItem : function (report, app) {
                var listCache = this.get();
                if(!listCache || !report || !report.id || !app || !app.appid) {
                    return false;
                }

                try {
                    var appExitInfo = appIsExistShortcut(listCache, app.appid);
                    var tempApp = appExitInfo && appExitInfo[0];
                    if(tempApp.reports.length == 1) {
                        listCache.splice(appExitInfo[1], 1);
                        return true;
                    }

                    var reportExitInfo = tempApp && reportIsExistShortcut(tempApp, report.id);
                    var tempReport = reportExitInfo && reportExitInfo[0];
                    if(tempReport) {
                        tempApp.reports.splice(reportExitInfo[1], 1);
                        return true;
                    }
                }catch (e) {
                    console.log(e);
                    return false;
                }
            }
        }
    }
]);
