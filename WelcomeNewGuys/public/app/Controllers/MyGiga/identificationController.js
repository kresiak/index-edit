
'use strict';

app.controller("identificationController",
    function ($scope, $stateParams, dataService, $rootScope, $state) {
    
    
    $scope.gotoLogin = function () {
        
        dataService.crudGetRecordById('Employees', $scope.userId).then(
            function (response) {
                if (response.data) {
                    $rootScope.user = response.data;
                    $state.go('userinfo');            
                }
                
            }
        );
    }
    
});
