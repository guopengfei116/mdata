<section class="main_header" ng-hide="outlineHide">
    <h2 class="main_header_title">{{ pageTitle }}</h2>
    <nav class="breadcrumb">
        <em class="iconfont icon-coords"></em>
        <div class="breadcrumb_list">
            <span class="breadcrumb_list_item">Locations:</span>
            <ul ng-repeat="number in breadcrumb.length">
                <li class="breadcrumb_list_item breadcrumb_list_item-url" ng-repeat="history in breadcrumb">{{history}}</li>
                <li class="breadcrumb_list_item">&gt;</li>
                <li class="breadcrumb_list_item breadcrumb_list_item-url">Create</li>
            </ul>
        </div>
    </nav>
</section>