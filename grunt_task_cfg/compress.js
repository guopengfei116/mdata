
/*
*  通常服务器会动态压缩web所需文件，所以默认禁掉压缩。
* */
var isOpenCompress = false;

exports.options = {
    mode : 'gzip'
};

if (isOpenCompress) {
    /*
    *  把全部项目压缩为gzip格式文件，存储到compress_gzip文件夹下
    * */
    exports.compress = {
        expand : true,
        cwd : gruntProject.dest,
        src : ['**/*.*','!*/img/*.*'],
        dest : 'compress_gzip/'
    };
}else {
    /*
    *  预留自定义压缩
    * */
    exports.compress = {};
}

console.log('compress config initialized');