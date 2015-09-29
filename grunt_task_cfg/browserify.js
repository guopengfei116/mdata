
/**
 * 别名配置
 * */
exports.options = {
    alias : {
        'common': gruntProject.src + '/common/js/common.js',
        'Ui': gruntProject.src + '/common/js/ui/ui.js',
        'Flag': gruntProject.src + '/common/js/ui/flag.js',
        'Tooltip': gruntProject.src + '/common/js/ui/tooltip.js',
        'Dropdown': gruntProject.src + '/common/js/ui/dropdown.js',
        'Select': gruntProject.src + '/common/js/ui/select.js',
        'Checkbox': gruntProject.src + '/common/js/ui/checkbox.js'
    }
};

/**
 * 合并js到调试目录
 * */
exports.all = {
    files: [
        {
            expand: true,
            cwd: gruntProject.src,
            src: ['*/js/*.js'],
            dest: gruntProject.prd
        }
    ]
};

console.log('browserify config initialized');