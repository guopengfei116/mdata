/*
*   广度优先遍历目录，返回一个二维数组
* */

'use strict';

var fs = require('fs');
var path = require('path');

//按广度优化顺序存放每个目录的文件list
var result = [];

//二维指针
var pointer = 0;

//广度遍历查找
function traversal (homePath, filters) {

    var directoryList = [];

    //文件属性
    var st = fs.statSync(homePath);

    //处理目录
    if(st.isDirectory()) {

        //获取目录文件
        var files = fs.readdirSync(homePath);

        //依据广度优先遍历，查找匹配的目录
        if(files && files.length) {

            for(var i = 0; i < files.length; i++) {
                directoryList.push(path.join(homePath, files[i]));
            }
        }
    }else {
        //文件不做处理
    }

    return directoryList;
}

function breadthTraversal (homePath, i) {
    //非空
    if(!homePath) {
        return;
    }

    //路径是否存在
    if(!fs.existsSync(homePath)){
        return;
    }

    //得到遍历结果
    var dirList = traversal(homePath);

    //存到二维数组里
    if(dirList.length) {
        result.push(dirList);
    }

    //遍历二维数组
    if(result[pointer] && result[pointer].length) {

        //通过上一次遍历的脚标，判断当前的二维数组是否已遍历完毕
        var i = i ? i : 0;

        if(i < result[pointer].length) {

            //依次存储子目录内容
            breadthTraversal(result[pointer][i], i + 1);

        }else {

            //如果当前维度遍历完，并且还有下一维度，则开始遍历下一维度
            result[++pointer] && result[pointer][0] && breadthTraversal(result[pointer][0]);
        }
    }
}

module.exports = function (homeDir) {
    breadthTraversal(homeDir, null);
    return result;
};



