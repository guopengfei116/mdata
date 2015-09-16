<nav class="nav" ng-controller="navigationCtrl" ng-if="outlineShow && logined">
    <ul class="nav_list">
        <li class="nav_list_item" ng-if="authority == 1" ng-class="{'nav_list_item-active' : page == 'application'}">
            <a href="#/application/manage">
                <i class="iconfont icon-application"></i>
                <p>Application</p>
            </a>
        </li>
        <li class="nav_list_item" ng-if="authority == 1" ng-class="{'nav_list_item-active' : page == 'account'}">
            <a href="#/account/manage">
                <i class="iconfont icon-account"></i>
                <p>Account</p>
            </a>
        </li>
        <li class="nav_list_item" ng-if="authority == 1" ng-class="{'nav_list_item-active' : page == 'systemLog'}">
            <a href="#/systemLog">
                <i class="iconfont icon-system"></i>
                <p>System log</p>
            </a>
        </li>
        <li class="nav_list_item" ng-class="{'nav_list_item-active' : page == 'report'}">
            <a href="#/report/manage">
                <i class="iconfont icon-report"></i>
                <p>Report</p>
            </a>
        </li>
    </ul>
    <dl class="shortcuts" ng-class="{'shortcuts-active' : appsShow}">
        <dt class="shortcuts_title" ng-click="appsShow = !appsShow">
            <i class="shortcuts_title_icon iconfont icon-shortcuts"></i>
            <p>Shortcuts</p>
            <i class="shortcuts_title_arrow iconfont icon-arrow-small-up"></i>
        </dt>
        <dd class="shortcuts_apps">
            <dl class="shortcuts_apps_app" ng-repeat="shortcut in shortcuts" ng-class="{'shortcuts_apps_app-active' : reportsShow[$index]}">
                <dt class="shortcuts_apps_app_title" ng-click="reportsShow[$index] = !reportsShow[$index]">
                    <p>{{ shortcut.app.name }}</p>
                    <i class="shortcuts_apps_app_title_arrow iconfont icon-arrow-small-up"></i>
                </dt>
                <dd class="shortcuts_apps_app_report">
                    <ul>
                        <li ng-repeat="report in shortcut.reports" ng-style="{color : currentReportId == report.id ? '#fff' : 'inherit'}"><a href="#/report/view/{{ report.id }}">{{ report.name }}</a></li>
                    </ul>
                </dd>
            </dl>
        </dd>
    </dl>
</nav>