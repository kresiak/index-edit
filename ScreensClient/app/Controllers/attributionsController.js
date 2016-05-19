'use strict';

app.controller("attributionsController", function ($scope, dataService, $q) {
    var promises = [];
    $scope.attributionReady = false;
    $scope.isAddOptionCollapsed = true;

    promises.push(dataService.crudGetTable('screens').then(function(response) {
        $scope.screens = response;
    }));

    promises.push(dataService.crudGetTable('sequences').then(function (response) {
        $scope.sequences = response;
    }));

    promises.push(dataService.crudGetTable('schedules').then(function (response) {
        $scope.schedules = response;
    }));

    promises.push(dataService.crudGetRecords('attributions').then(function (response) {
        $scope.attributions = response.data.map(function(attr) {
            return {
                id: attr.id,
                screen: $scope.screens[attr.data.screen].name,
                sequence: $scope.sequences[attr.data.sequence].name,
                schedule: $scope.schedules[attr.data.schedule].name
            }
        });
    }));

    $q.all(promises)
        .then(function() {
            $scope.attributionReady = true;
        });

    $scope.deleteAttribution= function(id) {
        dataService.crudDeleteRecord('attributions', id);
    }
});

