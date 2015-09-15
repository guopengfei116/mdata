
/**
 * 别名配置
 * */
exports.options = {
    alias : {
        'main': gruntProject.src + '/mdata/js/main.js',
        'common': gruntProject.src + '/mdata/js/main.js'
    }
};

/**
 * 合并js到调试目录
 * */
exports.all = {
    files: [
        {
            expand: true,
            cwd: gruntProject.src,
            src: ['*/js/*.js'],
            dest: gruntProject.prd
        }
    ]
};

console.log('browserify config initialized');