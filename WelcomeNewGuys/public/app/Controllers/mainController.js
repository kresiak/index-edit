'use strict';

app.controller("mainController",
    function ($scope, dataService, transitionService) {
    $scope.welcomeText = 'hello stranger';
    
    //dataService.crudGetRecords('Employees').then(
    //    function(response) {
    //        $scope.employees = response.data;
    //    }
    //);

    $scope.gotoBack = function() {
        transitionService.goBack();
    }

    $scope.gotoNext = function() {
        transitionService.goContinue();
    }
});
