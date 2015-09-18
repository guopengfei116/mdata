
/*
 * 邮箱、密码、用户名验证
 * @return 
 *
 * */
oasgames.mdataServices.factory('MdataVerify', [
    function () {
        return {
            blur : function(type, $errors, $scope){
                var errorInfo = {
                    account: {
                        required: 'E-mail must not be empty',
                        pattern: 'This user does not exist'
                    },
                    password: {
                        required: 'Password must not be empty',
                        pattern: 'Incorrect Password '
                    },
                    name: {
                        required: 'Name must not be empty',
                        pattern: 'Name Only accepts English letters and numbers'
                    }

                };
                for(var $error in $errors) {
                    if($errors[$error]) {
                        $scope[type + 'Error'] = true;
                        $scope.tooltip.errorType = type;
                        $scope.tooltip.setContent(errorInfo[type][$error]);
                        $scope.tooltip.setPosition('.fieldset-' + type, $scope.tooltip.toolTipLooks);
                        $scope.tooltip.toolTipLooks.css({'color': 'rgba(255, 0, 0, 0.7)'});
                        $scope.tooltip.show();
                        return false;
                    }
                }
                return true;
            }
        }
    }
]);