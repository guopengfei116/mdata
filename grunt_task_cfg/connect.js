var path = require('path');

/**
 * 开启一个静态文件服务器
 * */
exports.options = {
    port : 9800,
    protocal : 'http',
    hostname : 'localhost',
    livereload : 79513
};

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