'use strict';

app.controller("mainController", function ($scope, dataService, configService, $q) {

    $scope.getFileUrl= function(filename) {
        var path = configService.getServerPath();
        return path + 'files/' + filename;
    }

    $scope.setTab = function (tabNo) {
        $scope.tabNo = tabNo;
    }

    $scope.getTab = function () {
        return $scope.tabNo;
    }

});


