
/*
 * 缓存过期管理
 * @return {Object} functions
 * */
oasgames.mdataServices.factory('CacheControl', [
    '$cacheFactory',
    'CACHE_SETTINGS',
    function ($cacheFactory, CACHE_SETTINGS) {
        return {

            /*
             * 获取配置在常量里的过期时间属性名称
             * @return {Boole} 添加结果
             * */
            getConfigName : function (type) {
                var config = {
                    application : 'applicationListCacheTime',
                    account : 'accountListCacheTime',
                    report : 'reportListCacheTime',
                    shortcut : 'shortcutListCacheTime'
                };
                return CACHE_SETTINGS[config[type]];
            },

            /*
             * 刷新缓存记录时间
             * @return {Boole} 添加结果
             * */
            refresh : function (type) {
                var cache = $cacheFactory.get('expirationTime');
                if(!cache) {
                    cache = $cacheFactory('expirationTime');
                }
                cache.put(type, new Date().getTime());
            },

            /*
             * 判断缓存是否过期
             * 如没有缓存过则认为缓存已过期
             * @return {Boole} 添加结果
             * */
            isExpiration : function (type) {
                var cache = $cacheFactory.get('expirationTime');
                var recordingTime = '', expirationTime = '', currentTime = new Date().getTime();
                if(!cache) {
                    return true;
                }
                recordingTime = cache.get(type);
                if(!recordingTime) {
                    return true;
                }
                expirationTime = this.getConfigName(type) * 60 * 1000 + recordingTime;
                if(expirationTime < currentTime) {
                    return true;
                }
                return false;
            }
        }
    }
]);
