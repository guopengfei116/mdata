<nav class="nav" ng-controller="navigationCtrl" ng-if="!outlineHide">
    <ul class="nav_list">
        <li class="nav_list_item" ng-class="{'nav_list_item-active' : page == 'application'}">
            <a href="#/application/manage">
                <i class="iconfont icon-application"></i>
                <p>Application</p>
            </a>
        </li>
        <li class="nav_list_item" ng-class="{'nav_list_item-active' : page == 'account'}">
            <a href="#/account/manage">
                <i class="iconfont icon-account"></i>
                <p>Account</p>
            </a>
        </li>
        <li class="nav_list_item" ng-class="{'nav_list_item-active' : page == 'systemLog'}">
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
    <dl class="shortcuts shortcuts-active">
        <dt class="shortcuts_title">
            <i class="shortcuts_title_icon iconfont icon-shortcuts"></i>
            <p>Shortcuts</p>
            <i class="shortcuts_title_arrow iconfont icon-arrow-small-up"></i>
        </dt>
        <dd class="shortcuts_apps">
            <dl class="shortcuts_apps_app">
                <dt class="shortcuts_apps_app_title">
                    <p>app1</p>
                    <i class="shortcuts_apps_app_title_arrow iconfont icon-arrow-small-up"></i>
                </dt>
                <dd class="shortcuts_apps_app_report">
                    <ul>
                        <li><a href="">report1</a></li>
                        <li><a href="">report2</a></li>
                        <li><a href="">report3</a></li>
                    </ul>
                </dd>
            </dl>
            <dl class="shortcuts_apps_app">
                <dt class="shortcuts_apps_app_title">
                    <p>app2</p>
                    <i class="shortcuts_apps_app_title_arrow iconfont icon-arrow-small-up"></i>
                </dt>
                <dd class="shortcuts_apps_app_report">
                    <ul>
                        <li><a href="">report1</a></li>
                        <li><a href="">report2</a></li>
                        <li><a href="">report3</a></li>
                    </ul>
                </dd>
            </dl>
        </dd>
    </dl>
</nav>