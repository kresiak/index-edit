'use strict';

app.controller("pageUserRegisteredController", function ($scope, dataService, transitionService, $rootScope) {
    
    var firstname = $rootScope.firstname;
    var lastname = $rootScope.lastname;
    
    $scope.fullName = firstname + ' ' + lastname;

    $rootScope.hideGoContinue = true;
    $rootScope.hideGoBack = true;


    var record;
    if ($scope.User) {
        record = {Nom: $scope.User.Nom, Prenom: $scope.User.Prenom, email: $scope.User.email, email2: $scope.otherEmail, pi: $scope.Pi._id};
        dataService.crudUpdateRecord('Employees', $scope.User._id, record);
    } else {
        record = { Nom: $rootScope.lastname, Prenom: $rootScope.firstname, email: null, email2: $scope.otherEmail, pi: $scope.Pi._id };
        dataService.crudCreateRecord('Employees', record).then(function(response) {
                $scope.User = response.data;
            })
            ;        
    }
      
    transitionService.setOnNavigateCallback(function (isContinue) {
        if (isContinue) {
            return true;
        } else {
            return true;
        }
    })
    ;
});
