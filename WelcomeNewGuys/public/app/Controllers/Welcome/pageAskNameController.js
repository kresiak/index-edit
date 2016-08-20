'use strict';

app.controller("pageAskNameController",
    function ($scope, dataService, transitionService, $rootScope) {
    
    transitionService.setOnNavigateCallback(function (isContinue) {
        if (isContinue) {
            if (String.IsNullOrTrimEmpty($scope.lastname) || String.IsNullOrTrimEmpty($scope.firstname)) {
                return false;
            } else {
                $rootScope.firstname = $scope.firstname.Trim();
                $rootScope.lastname = $scope.lastname.Trim();
                return true;
            }
        } else {
            return true;
        }
    })
    ;
});
