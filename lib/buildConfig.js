var path = require ("path");
var util = require ('./util');

/*
*  key代表支持的文件类型，value代表合并后文件的后缀名
* */
var typeMap = {
    img : {
        filter : '/*.{png,jpg,gif}',
        postfix : '.png'
    },
    js : {
        filter : '/*.js',
        postfix : '.js'
    },
    css : {
        filter : '/*.css',
        postfix : '.css'
    }
};

/*
*  构建grunt合并文件类型的任务配置
*
*  约定：工程目录结构采用如下方式组织
*  总工程 》 [子项目，子项目...] 》[img，js，tpl，sass，css等目录区分文件类型] 》[file，dir(待合并的文件)]
*
*  @param dir      项目根路径
*  @param type     文件类型名
* */
var BuildConfig = function (root, type) {
    this._root = root;
    this._type = type;
};

BuildConfig.prototype = {

    //返回一个符合预定的目录列表
    initBuildDir : function () {
        var i, j, projects, project, classify, items, buildList = [];

        //获取所有项目路径
        var projects = util.getChildrenFiles(this._root);

        //遍历项目
        for(i = projects.length - 1; i >= 0; i--) {
            project = projects[i];
            if(util.isDir(project)) {

                //找到项目下特定类型的文件夹
                classify = path.join(project, this._type);

                //获取某类型文件夹的子文件
                items = util.getChildrenFiles(classify);

                //遍历子文件，如果子文件是一个目录，则是一个符合约定的目录，并作记录
                for(j = items.length - 1; j >= 0; j--) {
                    util.isDir(items[j]) && buildList.push(items[j]);
                }
            }
        }

        this.buildList = buildList;
        return this;
    },

    //返回一个构建好的配置
    build : function () {

        var buildList, hookFn, argLength, _self = this;

        for(argLength = arguments.length; argLength >= 0; argLength--) {
            if(Object.prototype.toString.call(arguments[argLength]) == '[object Array]') {
                buildList = arguments[argLength];
            }else if(Object.prototype.toString.call(arguments[argLength]) == '[object Function]') {
                hookFn = arguments[argLength];
            }
        }

        buildList = buildList || this.buildList;

        var baseName, destPath, config = {}, separator = path.sep;

        if(!buildList || !buildList.length) {
            buildList = [];
            config['none'] = {
                expand: true,
                src: gruntProject.src + 'none',
                dest: path.join(gruntProject.prd, 'trash/trash.jpg'),
                destCss: path.join(gruntProject.prd, 'trash/_trash.scss')
            };
            console.log('没有找到符合预期的"' + _self._type + '"类型的文件');
            return config;
        }

        /*
        *  new一个正则，用以匹配构建目录的path
        * */
        var pattern = new RegExp(gruntProject.src.split(separator).join('\\' + separator));

        /*
        * buildList的每个目录都会动态构建一个task配置，
        * task名称取自目录名称，
        * 因为涉及多个项目同时构建，为防止重名覆盖，在task名称加上唯一脚标
        * */
        for (var i = buildList.length - 1; i >= 0; i--) {
            baseName = path.basename(buildList[i]);
            destPath = buildList[i].replace(pattern, gruntProject.prd);

            //创建配置信息
            config[baseName + i] = {
                src: path.join(buildList[i], typeMap[_self._type]['filter']),
                dest: destPath + typeMap[_self._type]['postfix']
            };

            /*
            * 雪碧图特殊配置
            * 图片 >> 调试目录
            * scss >> 源代码目录
            * */
            if(_self._type == 'img') {
                config[baseName + i].dest = destPath.replace(/[a-zA-Z][\w-]*$/, function (matching) {
                    return 'sprite_' + matching + typeMap[_self._type]['postfix'];
                });
                config[baseName + i].destCss = buildList[i].replace(/\/img\/([a-zA-Z][\w-]*)$/, function (matching, g1) {
                    return '/sass/_sprite_' + g1 + '.scss';
                });
                config[baseName + i].imgPath = '../img/' + baseName + typeMap[_self._type]['postfix'];
            }
        }

        return config;
    }
};

module.exports = function (root, type) {
    return new BuildConfig(root, type);
};