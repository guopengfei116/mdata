
/*
 *  report manage控制器
 * */
oasgames.mdataControllers.controller('reportManageCtrl', [
    '$rootScope',
    '$scope',
    '$http',
    '$cacheFactory',
    'ApiCtrl',
    'Filter',
    'ReportCache',
    'ShortcutCache',
    'Http',
    function ($rootScope, $scope, $http, $cacheFactory, ApiCtrl, Filter, ReportCache, ShortcutCache, Http) {

        // 权限
        $scope.authority = $rootScope.user['authority'];
        $scope.createAppAuthority = false;

        // 定义default数据
        $scope.searchPlaceholder = 'Search AppName ReportName...';

        // report列表
        $scope.sourceData = [];
        $scope.viewData = [];

        // 所有report的收藏状态
        $scope.reportsShortcutStatus = {};

        // 用于存储每个app的report列表展示状态
        $scope.reportsShow = [];

        // 用户权限
        $scope.userPermission = $rootScope.user['authority'];

        /*
        * 收藏对象，
        * 列表五角星初始化，
        * 收藏、取消收藏与左侧导航联动
        * */
        var Shortcuts = {
            operationObject : {
                "app" : null,
                "report" : null
            },

            /*
            * method ：初始化收藏标记-五角星的状态
            * 调用该方法需要保证 $scope.sourceData 已经初始化完成。
            * */
            init : function () {
                var self = this;
                var reportShortcutIdList = [];

                // 初始化函数核心
                function processor () {
                    $scope.reportsShortcutStatus = self.initReportShortcutList(self.getReportId($scope.sourceData, 'object'), self.getReportId(reportShortcutIdList, 'array'));
                    self.bind();
                }

                // get_shortcuts列表数据
                var shortcutListCache = ShortcutCache.get();
                if(shortcutListCache && $rootScope.shortcutListCache) {
                    reportShortcutIdList = shortcutListCache;
                }else {
                    Http.shortcuts(function (data) {
                        // 如果无收藏列表，则初始化一个空数组
                        if(!data) {
                            data = [];
                        }
                        ShortcutCache.set(data);
                        reportShortcutIdList = data;
                        processor();
                    });
                }
            },

            /*
            * method ：提取report数据列表中的reportId属性
            * @param {Array} reportData 传入一个report列表数据([{reports: [id: 1]}...])，
            * @param {String}  returnType 设置方法返回的数据类型
            * @return {Object || Array} object返回一个由reportId为key值为null的对象，array返回一个由reportId组成的数组
            * */
            getReportId : function (reportData, returnType) {
                var allReport = [];

                // 在嵌套循环里进行逻辑判断，会比较耗资源，所以把判断提到了外层
                if(returnType == 'object') {
                    var allReport = {};
                    for(var i = 0; i < reportData.length; i++) {
                        for(var j = 0; j < reportData[i]['reports'].length; j++) {
                            allReport[reportData[i]['reports'][j]['id']] = null;
                        }
                    }
                }else {
                    for(var i = 0; i < reportData.length; i++) {
                        for(var j = 0; j < reportData[i]['reports'].length; j++) {
                            allReport.push([reportData[i]['reports'][j]['id']]);
                        }
                    }
                }
                return allReport;
            },

            /*
            * method ：已收藏的report值设为true
            * @return {Object} 修改过的reportShortcutStatus
            * */
            initReportShortcutList : function (defaultShortcutStatus, shortcutList) {
                for(var i = 0; i < shortcutList.length; i++) {
                    defaultShortcutStatus[shortcutList[i]] = true;
                }

                return defaultShortcutStatus;
            },

            /*
            * 五角星事件绑定，
            * 通过被动式绑定可以保证事件绑定在数据初始化之后进行,
            * 考虑到服务器收藏失败的几率和可能的网络延迟，为了最佳体验，
            * 默认认为操作是成功的，如果操作失败做倒退处理。
            * */
            bind : function () {
                var self = this;
                $scope.shortcutChange = function (report, app) {
                    var reportId = report.id;
                    var appId = app.appid;

                    self.changeOperationObject(report, app);

                    if($scope.reportsShortcutStatus[reportId]) {
                        self.cancelShortcut(reportId, appId);
                    }else {
                        self.addShortcut(reportId, appId);
                    }
                    console.log($scope.reportsShortcutStatus[reportId]);
                    $scope.reportsShortcutStatus[reportId] = !$scope.reportsShortcutStatus[reportId];
                    console.log($scope.reportsShortcutStatus[reportId]);
                };
            },

            // 记录收藏的report和所属app对象
            changeOperationObject : function (report, app) {
                this.operationObject.report = report;
                this.operationObject.app = app;
            },

            /*
            * 添加收藏
            * */
            addShortcut : function (reportId, appId) {
                var self = this;
                Http.shortcutAdd({
                    reportId : reportId,
                    appId : appId
                }).success(function () {
                    $scope.$emit('addShortcut', self.operationObject.report, self.operationObject.app);
                }).error(function () {
                    console.log('addShortcutError');
                    $scope.reportsShortcutStatus[reportId] = !$scope.reportsShortcutStatus[reportId];
                });
            },

            /*
             * 取消收藏
             * */
            cancelShortcut : function (reportId, appId) {
                var self = this;
                Http.shortcutDel({
                    reportId : reportId,
                    appId : appId
                }).success(function () {
                    $scope.$emit('cancelShortcut', self.operationObject.report, self.operationObject.app);
                }).error(function () {
                    console.log('cancelShortcutError');
                    $scope.reportsShortcutStatus[reportId] = !$scope.reportsShortcutStatus[reportId];
                });
            }
        };

        /*
        * 展示列表初始化
        * */
        (function () {

            $scope.loadReports = function () {
                var reportListCache = ReportCache.get();
                if(reportListCache && $rootScope.reportListCache) {
                    $scope.sourceData = reportListCache;
                    $scope.viewData = reportListCache;
                }else {
                    Http.reports(function (data) {
                        ReportCache.set(data);
                        $scope.sourceData = data;
                        $scope.viewData = data;
                        upReportsListShow();  // 初始化展示状态
                        setReportPermission();  // 记录report权限
                        Shortcuts.init();  // 初始化收藏标记
                    });
                }
            };

            /*
             * 更新report列表的展示状态，
             * 一个app时展开，多个app时合并列表
             * */
            function upReportsListShow (reportsList) {
                var reportsList = reportsList || $scope.sourceData;
                if(reportsList && reportsList.length > 1) {
                    for(var i = 0; i < reportsList.length; i++) {
                        $scope.reportsShow[i] = false;
                    }
                }else {
                    for(var i = 0; i < reportsList.length; i++) {
                        $scope.reportsShow[i] = true;
                    }
                }
            }

            /*
            * 更新report权限记录表
            * */
            function setReportPermission (reportsList) {
                var reportsList = reportsList || $scope.sourceData;
                $rootScope.reportPermission = {};
                for(var i = 0; i < reportsList.length; i++) {
                    for(var j = 0; j < reportsList[i]['reports'].length; j++) {
                        $rootScope.reportPermission[reportsList[i]['reports'][j]['id']] = reportsList[i]['permission'];
                    }
                    // 如果有任意一个app的管理员权限，则有权限创建report
                    if(reportsList[i]['permission'] == 1) {
                        $scope.createAppAuthority = true;
                    }
                }
            }

            $scope.loadReports();
        })();

        // report复制
        (function () {

            /*
             * @method duplicate点击事件
             * @param {Number} reportId  复制的reportId
             * @param {String} reportName  复制的report名称
             * @param {Number} appIndex  复制的report所属app列表对象的index值
             * @param {Number} $index  复制的report列表dom对象的index值
             * */
            $scope.reportCopyEvent = function (reportId, reportName, appIndex, $index) {

                // add编辑模板
                var tpl =
                    '<ul class="row row-report-duplicate">' +
                        '<li class="row_column row_column-2">' +
                            '<p class="report-duplicate-wrap">' +
                                '<input class="input-report-duplicate" value="Copy of '+reportName+'"/>' +
                                '<span class="iconfont icon-close icon-duplicate"></span>' +
                            '</p>' +
                        '</li>' +
                        '<li class="row_column row_column-2">' +
                            '<span class="iconfont icon-check confirm-report-duplicate"></span>' +
                            '<span class="iconfont icon-close cancel-report-duplicate"></span>' +
                        '</li>' +
                    '</ul>';
                var $duplicateReport = $('.container-app-' + appIndex + ' .row-report-' + $index);
                $duplicateReport.after(tpl);

                // 绑定duplicate编辑事件
                var $duplicateEdit = $(tpl);
                $('.report-manage').on('click', '.confirm-report-duplicate', function () {
                    var newReportName = $(this).parents(".row-report-duplicate").find(".input-report-duplicate").val();
                    var appId = $(this).parents(".container").attr("appid");
                    var reportNameValFliter = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/;                
                    if(newReportName == ""){  //判断是否为空
                        Ui.alert('report name must not be empty');
                        return;
                    }
                    if(!reportNameValFliter.test(newReportName)) {
                        Ui.alert('Name Only accepts English letters and numbers');
                        return;
                    }
                    $scope.$broadcast('requestDuplicate', reportId, newReportName, appId);
                    clearDuplicateEdit();                   
                    
                });

                $('.report-manage').on('click', '.cancel-report-duplicate', function () {
                    clearDuplicateEdit();
                });

                $('.report-manage').on('click', '.icon-duplicate', function () {
                    $(this).siblings('.input-report-duplicate').val("");
                });

                function clearDuplicateEdit () {
                    $('.row-report-duplicate').remove();
                    $(".report-manage").off("click", '.confirm-report-duplicate');
                    $(".report-manage").off("click", '.cancel-report-duplicate');
                }
            };

            // name重复效验
            $scope.$on('requestDuplicate', function (e, reportId, newReportName, appId) {
                Http.checkReportName({
                    'appId' : appId,
                    'report_name' : newReportName
                }, function () {
                    $scope.requestDuplicate(reportId, newReportName);
                });
            });

            // 提交duplicate
            $scope.requestDuplicate = function (reportId, newReportName) {
                if(!reportId || !newReportName) {
                    return;
                }
                Http.reportDuplicate({
                    'reportId' : reportId,
                    'report_name' : newReportName
                }, function () {
                    $scope.loadReports();
                });
            };
        })();

        /*
         * @暴漏的搜索处理函数
         * @param {String} searchVal
         * */
        $scope.searchHandler = function (searchVal) {

            // 依据appName匹配到的apps
            var matchedApps = Filter($scope.sourceData, {appname : searchVal});
            // 未匹配到的apps
            var unmatchedApps = [];
            // 用于临时存放依据reportsName匹配到的reports
            var tmpMatchedReports = null;
            // 用于临时创建新的匹配对象，以避免修改源对象属性
            var tmpMatchedApps = null;

            /*
             * 得到未匹配的apps
             * */
            if(matchedApps && matchedApps.length) {
                for(var j = 0; j < $scope.viewData.length; j++) {
                    for(var i = 0; i < matchedApps.length; i++) {
                        if($scope.viewData[j] === matchedApps[i]) {
                            break;
                        }
                        if(j == $scope.sourceData.length - 1) {
                            unmatchedApps.push($scope.sourceData[j]);
                        }
                    }
                }
            }else {
                unmatchedApps = $scope.sourceData;
            }

            /*
             * 遍历未匹配的apps，查找其匹配的reports,
             * 如果有匹配的reports，则重置该app的reports属性，并添加至匹配的apps
             * */
            if(unmatchedApps && unmatchedApps.length) {
                for(var i = 0; i < unmatchedApps.length; i++) {
                    var tmpMatchedReports = Filter(unmatchedApps[i]['reports'], {report_name : searchVal});

                    // 为匹配到的reports重新创建一个app对象存储
                    if(tmpMatchedReports && tmpMatchedReports.length) {
                        if(Object.prototype.toString.call(matchedApps) !== '[object Array]') {
                            matchedApps = [];
                        }

                        // 初始化空对象
                        tmpMatchedApps = {};
                        $.extend(tmpMatchedApps, unmatchedApps[i]);
                        tmpMatchedApps['reports'] = tmpMatchedReports;
                        matchedApps.push(tmpMatchedApps);
                    }
                }
            }

            upReportsListShow(matchedApps);
            $scope.viewData = matchedApps;
        };

        // 删除report
        (function () {
            $scope.delete = function (reportId, appId) {
                Ui.confirm('确定要删除这个report吗', function () {
                    Http.reportDel({
                        reportId : reportId
                    }, function () {
                        ReportCache.deleteItem(reportId, appId);
                        Ui.alert('删除成功');
                    });
                });
            };
        })();
    }
]);
