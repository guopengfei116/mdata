
/*
* 制作雪碧图
* */
var buildConfig = require('../lib/buildConfig')(gruntProject.src, 'img');

var spriteConfig = buildConfig.initBuildDir().build();

module.exports = spriteConfig;

console.log('sprite config initialized');