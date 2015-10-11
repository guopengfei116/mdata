<header class="header" ng-controller="HeaderCtrl" ng-if="outlineShow && logined" ng-show="outlineShow && logined">
    <h1 class="header_logo sprite sprite-mdata_logo"></h1>
    <menu class="header_settings dropdown-host">
        <a class="header_settings_user dropdown-target" href="javascript:void(0);"
           ng-click="show()">{{ username }}</a>
        <i class="header_settings_arrow iconfont"
           ng-class="{'icon-arrow-small-down': !isshow, 'icon-arrow-small-up': isshow}"></i>
        <ul class="dropdown dropdown-br" data-dropdown-position="br">
            <li class="dropdown_arrow"></li>
            <li class="dropdown_arrow dropdown_arrow-mask"></li>
            <li class="dropdown_list dropdown_list-group">
                <span class="dropdown_list-group_iconfont iconfont icon-wrench"></span>
                <a href="#/change_password">Change&nbsp;password</a>
            </li>
            <li class="dropdown_list dropdown_list-group">
                <span class="dropdown_list-group_iconfont iconfont icon-goout"></span>
                <a href="javascript:void(0);" ng-click="logout()">Log&nbsp;out</a>
            </li>
        </ul>
    </menu>
</header>