
/*
* 只有在部署模式下才会压缩js文件
* */
if(!gruntProject.debug) {
    exports.options = {
        mangle: {
            except: ['jQuery', 'CXG']
        }
    };
    exports.deploy = {
        expand: true,
        cwd: gruntProject.prd,
        src: ['*/js/*.js'],
        dest: gruntProject.dest
    };
/*
* 预留开发模式下自定义配置
* */
}else {
    exports.common = {
        expand: true,
        cwd: gruntProject.prd,
        src: ['common/js/*.js'],
        dest: gruntProject.dest
    };
}

console.log('uglify config initialized');
