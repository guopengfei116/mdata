
/*
* value_group渲染完毕触发valuesRenderFinished事件
* */
oasgames.mdataDirective.directive('onFinishRenderValues', [
    '$timeout',
    function ($timeout) {
        return {
            restrict: 'A',
            link: function ($scope, element, attr) {
                if($scope.$last === true) {
                    $timeout(function () {
                        $scope.$emit('valuesRenderFinished');
                    });
                }
            }
        }
    }
]);


/*
 * dimension渲染完毕触发dimensionRenderFinished事件
 * */
oasgames.mdataDirective.directive('onFinishRenderDimension', [
    '$timeout',
    function ($timeout) {
        return {
            restrict: 'A',
            link: function ($scope, element, attr) {
                if($scope.$last === true) {
                    $timeout(function () {
                        $scope.$emit('dimensionRenderFinished');
                    });
                }
            }
        }
    }
]);