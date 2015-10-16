
/*
 * shortcut 列表缓存处理
 * @return {Object} functions
 * */
oasgames.mdataServices.factory('ShortcutCache', [
    '$cacheFactory',
    function ($cacheFactory) {
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
                    return listCache;
                }
            },

            /*
             * add shortcut list item
             * @return {Boole} 添加结果
             * */
            addItem : function (data) {
                var listCache = this.get();
                if(!listCache || !data || !data['uid']) {
                    return false;
                }
                for(var i = listCache.length - 1; i >= 0; i--) {
                    if(data['uid'] == listCache[i]['uid']) {
                        listCache.splice(i, 1, data);
                        return true;
                    }
                }
                listCache.push(data);
                return true;
            },

            /*
             * delete shortcut list item
             * @return {Boole} 删除结果
             * */
            deleteItem : function (uid) {
                var listCache = this.get();
                if(!listCache || !uid) {
                    return false;
                }
                for(var i = listCache.length - 1; i >= 0; i--) {
                    if(uid == listCache[i]['uid']) {
                        listCache.splice(i, 1);
                        return true;
                    }
                }
                return false;
            }
        }
    }
]);
