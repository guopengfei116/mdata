
/**
 * copy文件到调试目录
 * js目录下的js子文件
 * css目录下的css子文件
 * img目录下的子文件
 * */
exports.common = {
    expand: true,
    flatten: false,
    cwd: gruntProject.src,
    src: ['*/tpl/*/*.html', '*/js/*.*', '*/css/*.css', '*/img/*.*', '*/ui_guide/**/*', '*/media/**/*'],
    dest: gruntProject.prd
};

/**
 *  部署模式，
 *  tpl目录下的html子文件
 *  img目录下的不支持压缩的子文件
 * */
if(!gruntProject.debug){
    exports.deploy = {
        expand: true,
        flatten: false,
        cwd: gruntProject.prd,
        src: ['*/tpl/**/*.html', '*/js/*.json', '*/img/*.*', '!*/img/*.{png,jpg,jpeg}', '*/media/**/*'],
        dest: gruntProject.dest
    };
}

console.log('copy config initialized');