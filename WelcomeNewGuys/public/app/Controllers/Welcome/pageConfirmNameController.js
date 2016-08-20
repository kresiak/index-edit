'use strict';

app.controller("pageConfirmNameController", function ($scope, dataService, transitionService, $rootScope) {

    var firstname = $rootScope.firstname;
    var lastname = $rootScope.lastname;

    $scope.FullName = firstname + ' ' + lastname;

    //$scope.userAnswer = 'no';
    
    dataService.callWebService('FindMatchingUsers', {'firstname': firstname, 'lastname': lastname}).then(
        function(response) {
            $scope.possibleUsers = response.data;
        }
    );

    $scope.getDisplayUserName = function(user) {
        if (!String.IsNullOrTrimEmpty(user.email)) return user.Prenom + ' ' + user.Nom + ' (' + user.email + ')';
        if (!String.IsNullOrTrimEmpty(user.email2)) return user.Prenom + ' ' + user.Nom + ' (' + user.email2 + ')';
        return user.Prenom + ' ' + user.Nom;
    };

    transitionService.setOnNavigateCallback(function (isContinue) {
        if (isContinue) {
            if ($scope.userAnswer && ($scope.userAnswer === 'no' || $scope.specifiedUserId)) {
                $rootScope.User = $scope.userAnswer === 'no' ? null : $scope.possibleUsers.filter(function (u) { return u._id === $scope.specifiedUserId})[0] ;
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
