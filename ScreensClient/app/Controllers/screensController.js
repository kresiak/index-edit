'use strict';

app.controller("screensController", function($scope, dataService, $q) {
    var promises = [];
    //$scope.active = 0;

    var screensDict, sequencesDict, schedulesDict, attributions, attributionsDict, sequences, schedules;

    function initData() {
        promises.push(dataService.crudGetRecords('screens').then(function (response) {
            $scope.screens = response.data;
            screensDict = dataService.transformIntoDictionary($scope.screens);
        }));

        promises.push(dataService.crudGetRecords('sequences').then(function (response) {
            sequences = response.data;
            sequencesDict = dataService.transformIntoDictionary(sequences);
        }));

        promises.push(dataService.crudGetRecords('schedules').then(function (response) {
            schedules = response.data;
            schedulesDict = dataService.transformIntoDictionary(schedules);
        }));

        promises.push(dataService.crudGetRecords('attributions').then(function (response) {
            attributions = response.data;
            attributionsDict = dataService.transformIntoDictionary(attributions);
        }));

        $q.all(promises)
            .then(function () {
                $scope.allReady = true;
                var seq = sequences[0];
                var count = 0;
                $scope.slides = seq.data.files.map(function (fileid) {
                    count++;
                    return {
                        id: count,
                        url: $scope.getFileUrl($scope.getFileInfoById(fileid).filename),
                        name: $scope.getFileInfoById(fileid).filename
                    };
                });
            });
    }

    initData();

    var screenSelected;

    $scope.screenSelected = function (screen) {
        screenSelected = screen;
    }

    $scope.isScreenTheActiveOne = function (screen) {
        return screenSelected === screen;
    }

});
