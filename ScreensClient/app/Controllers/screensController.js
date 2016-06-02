'use strict';

app.controller("screensController", function($scope, dataService, $q) {
    var promises = [];
    $scope.slides = [];

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
            });
    }

    initData();


    var screenSelected;

    $scope.screenSelected = function (screen) {
        function initSlides(screen) {
            var attributionsToScreen = attributions.filter(function(attr) {
                return attr.data.screen === screen.id;
            });

            $scope.seqTitle = '<rien du tout>';
            if (attributionsToScreen.length > 0) {
                var seq = sequencesDict[attributionsToScreen[0].data.sequence];
                $scope.seqTitle = seq.name;
                var count = 0;
                $scope.slides = seq.files.map(function (fileid) {
                    count++;
                    return {
                        id: count,
                        url: $scope.getFileUrl($scope.getFileInfoById(fileid).filename),
                        name: $scope.getFileInfoById(fileid).filename
                    };
                });
            } else {
                $scope.slides = [];
            }
        }

        screenSelected = screen;
        initSlides(screen);
    }

    $scope.isScreenTheActiveOne = function (screen) {
        return screenSelected === screen;
    }

});
