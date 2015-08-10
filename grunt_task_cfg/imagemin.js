
/*
 * 只有在部署模式下才会压缩img文件
 * */
if(!gruntProject.debug) {
    exports.options = {
        optimizationLevel : 7
    };
    exports.deploy = {
        files: [{
            expand: true,
            cwd: gruntProject.prd,
            src: '*/img/*.{png,jpg,gif}',
            dest: gruntProject.dest
        }]
    };
}




console.log('imagemin config initialized');