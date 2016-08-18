'use strict';

app.controller("mainController",
    function ($scope, dataService, configService) {
    $scope.welcomeText = 'hello stranger';
    
    dataService.crudGetRecords('Employees').then(
        function(response) {
            $scope.employees = response.data;
        }
    );
});
