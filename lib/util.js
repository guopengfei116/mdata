var fs = require('fs');
var path = require('path');
var _ = require('underscore');

var util = {
    initGlobalConstant : function (pkgCfg, deploy) {

        if(!pkgCfg || !pkgCfg.projectCfg || (typeof pkgCfg.projectCfg != 'object')) {
            throw error('无效的pkgCfg参数');
        }

        var projectCfg = pkgCfg.projectCfg;

        //全局配置集合
        global.gruntProject = {};

        //源码目录
        gruntProject.src = path.resolve(projectCfg.src);

        //中间层调试代码
        gruntProject.prd = path.resolve(projectCfg.prdDest);

        //最终上线代码
        gruntProject.dest = path.resolve(projectCfg.depDest);

        //关键字，用以获取构建状态
        gruntProject.status = deploy ? 'deploy' : 'production';
        gruntProject.debug = deploy ? false : true;
    },
    isDir : function (dir) {

        //非空和路径判断
        if(!dir || (typeof dir != "string") || !fs.existsSync(dir)) {
            return false;
        }

        //目录判断
        if(fs.statSync(dir).isDirectory()) {
            return true;
        }

        return false;
    },
    /*
    * 获取一个目录的所有子文件，
    * 可以传入一个正则过滤不需要的文件，
    * 默认会过滤掉.开头的文件
    * */
    getChildrenFiles : function (dir, filter) {

        var files = [], matchingFiles = [], filter = filter || /^\.(\w)*/;

        //错误返回空数据
        if(!util.isDir(dir)) {
            return [];
        }

        //默认正则表达式
        if(!_.isRegExp(filter)) {
            filter = /^\.(\w)*/;
        }

        files = fs.readdirSync(dir);

        //对文件进行加工处理
        files.forEach(function (val, index) {

            //过滤
            if(!filter.test(val)) {

                //push绝对路径
                matchingFiles.push(path.resolve(dir, val));
            }
        });

        return matchingFiles;
    },
    getTaskModuleName : function (taskModulePath) {

        var files = [];

        files = util.getChildrenFiles(taskModulePath);

        //去掉路径
        files.forEach(function (v, i) {
            if(util.isDir(files[i])) {
                files[i] = path.basename(v);
            }
        });

        return files;
    }
};

module.exports = util;