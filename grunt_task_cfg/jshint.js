
/*
* js语法检查
* 因现在没有js语法规范，所以默认关闭
* */
exports.options = {
    boreser: true,
    node: true,
    camelcase: true,
    curly: true,
    eqnull: true,
    eqeqeq: true,
    undef: true,
    debug: gruntProject.debug || false,
    globals: {
        jQuery: true,
        underscore: true,
        console: true,
        module: true
    }
};

exports.hint = [gruntProject.src + '/UG/*.js'];

console.log('jshint config initialized');