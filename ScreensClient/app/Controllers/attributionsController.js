'use strict';

app.controller("attributionsController", function ($scope, $rootScope, dataService, $q) {
    var promises = [];
    var tablename = 'attributions';
    $scope.attributionReady = false;
    $scope.isAddOptionCollapsed = true;

    var screensDict, sequencesDict, schedulesDict, attributions, sequences;
    var seqselected = $scope.seqselected;

    if (seqselected) {
        $scope.$watch('seqselected',
            function (newValue, oldValue) {
                seqselected = newValue;
                filterData();
            });
    }

    $scope.$on("attributionChange", function (event, args) {
        initAttributionData();
    });


    $scope.isRestricted= function() {
        return seqselected;
    }

    function filterData() {
        if (seqselected) {
            $scope.attributionsToDisplay = attributions.filter(function(attr) {
                return attr.sequenceId === seqselected.id;
            });
            $scope.sequencesToDisplay = sequences.filter(function (seq) {
                return seq.id === seqselected.id;
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

    $scope.addAttribution = function () {
        if ($scope.addAttributionPossible()) {
            dataService.crudCreateRecord(tablename,
            {
                screen: $scope.screenselected.id,
                sequence: $scope.seqselected.id,
                schedule: $scope.scheduleselected.id
            }).then(function () {
                $rootScope.$broadcast('attributionChange', {});
            });
        }
    }

    // =====================
    // Handle Selected items
    // =====================

    $scope.screenSelected = function (screen) {
        $scope.screenselected = screen;
    }

    $scope.isScreenTheActiveOne = function (screen) {
        return $scope.screenselected === screen;
    }


    $scope.sequenceSelected = function (seq) {
        $scope.seqselected = seq;
    }

    $scope.isSequenceTheActiveOne = function (seq) {
        return $scope.seqselected === seq;
    }

    $scope.scheduleSelected = function (schedule) {
        $scope.scheduleselected = schedule;
    }

    $scope.isScheduleTheActiveOne = function (schedule) {
        return $scope.scheduleselected === schedule;
    }

    $scope.addAttributionPossible= function() {
        return $scope.screenselected && $scope.scheduleselected && $scope.seqselected;
    }

});

