'use strict';

app.controller("pageConfirmNameController", function ($scope, dataService, transitionService, $rootScope) {

    var firstname = $rootScope.firstname;
    var lastname = $rootScope.lastname;

    $scope.FullName = firstname + ' ' + lastname;

    $scope.userAnswer = 'no';

    transitionService.setOnNavigateCallback(function (isContinue) {
        if (isContinue) {
            return false;
        } else {
            return true;
        }
    })
    ;
});
