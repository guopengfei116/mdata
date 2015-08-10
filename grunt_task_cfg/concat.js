var path = require ("path");
var util = require ('../lib/util');

//防止任务名称重叠造成覆盖
var taskNameId = 1;

//遍历js下的子目录，来用动态创建配置
!function buildCigBefore (sourceDir) {
    var i, j, jsModues, item;

    //获取所有项目目录名
    var items = util.getChildrenFiles(sourceDir);

    //遍历所有项目
    for(i = items.length - 1; i >= 0; i--) {
        item = items[i];

        //排除文件
        if(util.isDir(item)) {
            //获取项目js目录
            item = path.join(item, '/js');
            //得到项目中每个js子模块
            jsModues = util.getChildrenFiles(item);

            //依据JS模块构建合并配置
            for(j = jsModues.length - 1; j >= 0; j--) {
                util.isDir(jsModues[j]) && buildCig(jsModues[j]);
            }
        }
    }
}(gruntProject.src);

/**
 * 依据子目录构建配置项, 把合并后的js存放到调试代码目录下
 * */
function buildCig (concatDir) {
    var baseName = path.basename(concatDir);
    var pattern, separator = path.sep;

    //源路径字符串伪正则，把路径分隔符替换成合法的正则
    pattern = gruntProject.src.split(separator).join('\\' + separator);

    //build config
    exports[baseName + taskNameId++] = {
        src: path.join(concatDir, '/*.js'),
        //把src路径部分替换为dest
        dest: (concatDir + '.js').replace(new RegExp(pattern), gruntProject.prd)
    };
}

//多个js间的连接符
exports.options = {
    separator: ''
};

console.log('concat config initialized');