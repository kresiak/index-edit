'use strict';

app.controller("mainController",
    function ($scope, dataService, $state) {
    $scope.welcomeText = 'hello stranger';
    
    dataService.crudGetRecords('Employees').then(
        function(response) {
            $scope.employees = response.data;
        }
    );

    $scope.gotoNext = function() {
        $state.go('askName');
    }
});
