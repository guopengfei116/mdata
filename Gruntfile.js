var fs = require('fs');
var path = require('path');
var util = require('./lib/util');
var TASK_MODULES_PATH = 'node_modules';

module.exports = function (grunt) {
    var pkgCfg, projectCfg, taskCfgs, taskModuleNames, initCfg = {}, isDeploy = false;

    var arguments = process.argv.splice(2);

    //项目根路径（根据grunt规范，主进程在项目根路径）
    var CWD = process.cwd();
    var er = new Error('需要一个正确的grunt对象');

    //grunt对象验证
    if(!grunt && !grunt.version) {
        throw er;
    }

    //项目规范检查
    if(!fs.existsSync(path.join(CWD + '/Gruntfile.js')) || !fs.existsSync(path.join(CWD + '/package.json'))) {
        grunt.fail.warn('非规范的grunt项目', 2);
    }

    global.grunt = grunt;

    //获取grunt-package配置
    pkgCfg = grunt.file.readJSON('package.json');

    //是否部署代码
    isDeploy = grunt.option('deploy') || arguments[0] == 'deploy' || false;

    //添加全局变量
    util.initGlobalConstant(pkgCfg, isDeploy);

    //获取工程结构配置
    projectCfg = pkgCfg.projectCfg || {};

    //获取所有grunt—task的配置文件
    taskCfgfiles = util.getChildrenFiles(projectCfg.taskCfgPath);

    //在node_modules文件夹中获取grunt-task相关的模块名
    taskModuleNames = util.getTaskModuleName(TASK_MODULES_PATH);

    initCfg.pkg = pkgCfg;

    /*
    * 通过遍历配置文件，得到文件名称，
    * 依据文件名称与模块名称的约定关系，构建匹配正则，
    * 遍历所有的grunt—task模块，依据正则来验证哪些模块已经配置，
    * 只有配置过的模块才会被grunt所load
    * */
    taskCfgfiles.forEach(function (val) {

        var taskCfgName = path.basename(val, '.js');

        var taskReg = new RegExp('^grunt-(' + taskCfgName + '[a-z]*' + '|' + 'contrib-' + taskCfgName + ')$');

        //归纳配置
        initCfg[taskCfgName] = require(val);

        //找到匹配的模块进行load
        for(var i = taskModuleNames.length - 1; i >= 0; i--) {
            //加载已配置的task模块
            if(taskReg.test(taskModuleNames[i])) {
                grunt.loadNpmTasks(taskModuleNames[i]);
                grunt.log.ok((taskModuleNames[i] + ' task loaded').yellow);
                break;
            }
        }
    });

    //初始化grunt配置
    grunt.initConfig(initCfg);

    /**
     *  注册默认任务(任务调用简写方式)，根据参数调用相关的构建模式任务，默认调用其构建模式的调试模式。
     *  运行 grunt 调用 'production-debug' 任务，
     *  运行 grunt --deply 调用 'deploy-debug' 任务,
     *  运行 grunt production 调用 'production' 任务，
     *  运行 grunt deploy 调用 'deploy' 任务，
     * */
    grunt.registerTask('default', function () {
        if(isDeploy) {
            grunt.log.subhead('####部署环境代码调试####'.red);
            grunt.task.run('deploy-debug');
        }else {
            grunt.log.subhead('====开发环境代码调试===='.green);
            grunt.task.run('production-debug');
        }
    });

    /*
    *  开发模式任务，通过运行 grunt production 命令调用。构建流程：
    *  1、清楚调试代码目录
    *  2、合并js --> 调试目录
    *  3、构建html --> 调试目录
    *  4、合成雪碧图 --> 调试目录(scss文件被生产到源开发目录，所以开发时可以预先使用)
    *  5、解析sass --> 调试目录
    *  6、剩余未操作文件复制 --> 调试目录
    * */
    grunt.registerTask('production', ['clean', 'concat', 'string-replace', 'sprite', 'sass', 'copy']);

    /**
     * 开发模式调试任务，通过运行 grunt 或 grunt production-debug 命令调用。构建流程：
     * 1、使用开发模式任务
     * 2、开启静态文件服务器 --> 调试目录
     * 3、开启文件监听 --> 调试目录
     * */
    grunt.registerTask('production-debug', ['production', 'connect']);

    /*
    *  部署模式任务，通过grunt deploy 或 grunt deploy --deploy 命令调用。构建流程：
    *  1、使用开发模式任务，增加了copy任务，把部分文件复制 --> 部署目录
    *  2、混淆压缩js --> 部署目录
    *  3、混淆压缩css --> 部署目录
    *  4、压缩图片 --> 部署目录
    *  5、通过gzip算法对部署目录下的非图片文件进行二次压缩 --> 部署目录(默认关闭状态)
    * */
    grunt.registerTask('deploy', ['production', 'uglify', 'cssmin', 'imagemin', 'compress']);

    /**
     * 开发模式调试任务，通过运行 grunt --deploy 或 grunt deploy-debug --deploy 命令调用。构建流程：
     * 1、使用部署模式任务
     * 2、开启静态文件服务器 --> 部署目录
     * 3、开启文件监听 --> 部署目录
     * */
    grunt.registerTask('deploy-debug', ['deploy', 'connect']);
};