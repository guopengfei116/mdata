var path = require('path');

/**
 * 开启一个静态文件服务器
 * */
exports.options = {
    port : 9800,
    open : false,
    protocol : 'http',
    hostname : '0.0.0.0',
    livereload : 79513
};

console.log('http://127.0.0.1:9800');

/**
 * 调试模式指向开发目录，部署模式指向上线目录
 * */
exports.server = {
    options : {
        open : true,
        keepalive : true,
        base : [
            path.basename(gruntProject.debug ? gruntProject.prd : gruntProject.dest)
        ]
    }
};

console.log('connect config initialized');