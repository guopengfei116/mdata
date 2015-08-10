
/**
 * 开发模式生产结构化代码，
 * 部署模式生产混淆压缩代码
 * */
exports.options = {
    style: gruntProject.debug ? 'expanded' : 'compressed',
    sourcemap: false,
    trace: false
};

/**
 * 开发模式编译scss到调试目录
 * 部署模式编译scss到生产目录
 * */
exports.all = {
    files: [
        {
            expand: true,
            cwd: gruntProject.src,
            src: ['*/sass/*.scss'],
            dest: gruntProject.debug ? gruntProject.prd : gruntProject.dest,
            ext: '.css'
        }
    ]
};
console.log('sass config initialized');