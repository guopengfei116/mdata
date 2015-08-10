
/*
 * 只有在部署模式下才会压缩css文件
 * */
if(!gruntProject.debug) {
    exports.options = {

    };
    exports.deploy = {
        expand: true,
        cwd: gruntProject.prd,
        src: ['*/css/*.css'],
        dest: gruntProject.dest
    };
/*
 * 预留开发模式下自定义配置
 * */
}else {
    exports.common = {
        expand: true,
        cwd: gruntProject.prd,
        src: ['common/css/*.css'],
        dest: gruntProject.dest
    };
}

console.log('cssmin config initialized');
