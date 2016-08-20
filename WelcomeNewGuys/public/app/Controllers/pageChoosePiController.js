'use strict';

app.controller("pageChoosePiController", function ($scope, dataService, transitionService, $rootScope) {
    
    var firstname = $rootScope.firstname;
    var lastname = $rootScope.lastname;
    
    $scope.FullName = firstname + ' ' + lastname;
    
    //$scope.userAnswer = 'no';
    
    dataService.crudGetRecords('PIs').then(
        function (response) {
            $scope.pis = response.data;
        }
    );
    
    
    transitionService.setOnNavigateCallback(function (isContinue) {
        if (isContinue) {
            if ($scope.ChosenPiId) {
                $rootScope.Pi = $scope.pis.filter(function (u) { return u._id === $scope.ChosenPiId })[0];
               
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
