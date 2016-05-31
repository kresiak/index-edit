'use strict';

app.controller("attributionsController", function ($scope, $rootScope, dataService, $q) {
    var promises = [];
    var tablename = 'attributions';
    $scope.attributionReady = false;
    $scope.isAddOptionCollapsed = true;

    var screensDict, sequencesDict, schedulesDict, attributions, sequences;
    var masterseqselected = $scope.seqselected;

    if (masterseqselected) {
        $scope.$watch('seqselected',
            function (newValue, oldValue) {
                masterseqselected = newValue;
                filterData();
            });
    }

    $scope.$on("attributionChange", function (event, args) {
        initAttributionData();
    });

    $scope.$on("sequenceChange", function (event, args) {
        initData();
    });


    $scope.isRestricted= function() {
        return masterseqselected;
    }

    function filterData() {
        if (masterseqselected) {
            $scope.attributionsToDisplay = attributions.filter(function(attr) {
                return attr.sequenceId === masterseqselected.id;
            });
            $scope.sequencesToDisplay = sequences.filter(function (seq) {
                return seq.id === masterseqselected.id;
            });
        } else {
            $scope.attributionsToDisplay = attributions;
            $scope.sequencesToDisplay = sequences;
        }
    }

    function initAttributionData() {
        dataService.crudGetRecords(tablename).then(function (response) {
            attributions = response.data.map(function (attr) {
                return {
                    id: attr.id,
                    screen: screensDict[attr.data.screen].name,
                    sequence: sequencesDict[attr.data.sequence].name,
                    schedule: schedulesDict[attr.data.schedule].name,
                    sequenceId: attr.data.sequence
                }
            });
            filterData();
            $scope.attributionReady = true;
        });
    }

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
            $scope.schedules = response.data;
            schedulesDict = dataService.transformIntoDictionary($scope.schedules);
        }));

        $q.all(promises)
            .then(function () {
                initAttributionData();
            });
    }



    initData();



    $scope.deleteAttribution= function(id) {
        dataService.crudDeleteRecord(tablename, id).then(function() {
            $rootScope.$broadcast('attributionChange', { });
        });        
    }

    var screenselected, seqselected, scheduleselected;

    $scope.addAttribution = function () {
        if ($scope.addAttributionPossible()) {
            dataService.crudCreateRecord(tablename,
            {
                screen: screenselected.id,
                sequence: seqselected.id,
                schedule: scheduleselected.id
            }).then(function () {
                $rootScope.$broadcast('attributionChange', {});
            });
        }
    }

    // =====================
    // Handle Selected items
    // =====================


    $scope.screenSelected = function (screen) {
        screenselected = screen;
    }

    $scope.isScreenTheActiveOne = function (screen) {
        return screenselected === screen;
    }


    $scope.sequenceSelected = function (seq) {
        seqselected = seq;
    }

    $scope.isSequenceTheActiveOne = function (seq) {
        return seqselected === seq;
    }

    $scope.scheduleSelected = function (schedule) {
        scheduleselected = schedule;
    }

    $scope.isScheduleTheActiveOne = function (schedule) {
        return scheduleselected === schedule;
    }

    $scope.addAttributionPossible= function() {
        return screenselected && scheduleselected && seqselected;
    }

});

