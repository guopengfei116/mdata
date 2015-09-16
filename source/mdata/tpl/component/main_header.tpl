<section class="main_header" ng-controller="breadcrumbCtrl" ng-if="outlineShow && logined">
    <h2 class="main_header_title" ng-bind="breadcrumb[0] | capitalize"></h2>
    <nav class="breadcrumb">
        <em class="iconfont icon-coords"></em>
        <ul class="breadcrumb_list">
            <li class="breadcrumb_list_item">Locations:</li>
            <li class="breadcrumb_list_item" ng-repeat="item in breadcrumb track by $index"
                ng-class="{'breadcrumb_list_item-url' : $index %2 == 0}"
                ng-bind-html="item | capitalize" ng-click="setHref($index)"></li>
        </ul>
    </nav>
</section>