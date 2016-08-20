'use strict';

app.controller("pageAskEmailController", function ($scope, dataService, transitionService, $rootScope) {
    
    var firstname = $rootScope.firstname;
    var lastname = $rootScope.lastname;
    
    $scope.FullName = firstname + ' ' + lastname;
    
    $scope.userAnswer = 'yes';
    
    
    transitionService.setOnNavigateCallback(function (isContinue) {
        if (isContinue) {
            if ($scope.userAnswer && ($scope.userAnswer === 'no' || (!String.IsNullOrTrimEmpty($scope.otherEmail) && $scope.otherEmail.IsEmail()))) {
                $rootScope.otherEmail = $scope.userAnswer === 'no' ? null : $scope.otherEmail.Trim();
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    })
    ;
});
