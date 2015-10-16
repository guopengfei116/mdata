
/*
 * application 列表缓存处理
 * @return {Object} functions
 * */
oasgames.mdataServices.factory('ApplicationCache', [
    '$cacheFactory',
    function ($cacheFactory) {
        return {

            /*
            * cache application list
            * */
            set : function (data) {
                var cache = $cacheFactory.get('application');
                if(!cache) {
                    cache = $cacheFactory('application');
                }
                cache.put('list', data);
            },

            /*
             * get application list
             * */
            get : function () {
                var cache = $cacheFactory.get('application'),
                    listCache = null;
                if(cache && cache.get('list')) {
                    listCache = cache.get('list');
                    return listCache;
                }
            },

            /*
             * add application list item
             * @return {Boole} 添加结果
             * */
            addItem : function (data) {
                var listCache = this.get();
                if(!listCache || !data) {
                    return false;
                }
                for(var i = listCache.length - 1; i >= 0; i--) {
                    if(data['appid'] == listCache[i]['appid']) {
                        listCache.splice(i, 1, data);
                        return true;
                    }
                }
                listCache.push(data);
                return true;
            },

            /*
             * delete application list item
             * @return {Boole} 删除结果
             * */
            deleteItem : function (appid) {
                var listCache = this.get();
                if(!listCache || !appid) {
                    return false;
                }
                for(var i = listCache.length - 1; i >= 0; i--) {
                    if(appid == listCache[i]['appid']) {
                        listCache.splice(i, 1);
                        return true;
                    }
                }
                return false;
            }
        }
    }
]);
