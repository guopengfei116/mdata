
/**
 * 默认清除目录
 * */
exports.cleanDir = [ gruntProject.prd ];

/**
 * 非调试模式下
 * */
if(!gruntProject.debug) {
    exports.cleanDir.push(gruntProject.dest);
}

console.log('clean config initialized');
