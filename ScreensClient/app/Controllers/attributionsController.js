'use strict';

app.controller("attributionsController", function ($scope, dataService, $q) {
    var promises = [];
    var tablename = 'attributions';
    $scope.attributionReady = false;
    $scope.isAddOptionCollapsed = true;

    function initData() {
        promises.push(dataService.crudGetRecords('screens').then(function (response) {
            $scope.screens = response.data;
            $scope.screensDict = dataService.transformIntoDictionary($scope.screens);
        }));

        promises.push(dataService.crudGetRecords('sequences').then(function (response) {
            $scope.sequences = response.data;
            $scope.sequencesDict = dataService.transformIntoDictionary($scope.sequences);
        }));

        promises.push(dataService.crudGetRecords('schedules').then(function (response) {
            $scope.schedules = response.data;
            $scope.schedulesDict = dataService.transformIntoDictionary($scope.schedules);
        }));

        promises.push(dataService.crudGetRecords(tablename).then(function (response) {
            $scope.attributions = response.data.map(function (attr) {
                return {
                    id: attr.id,
                    screen: $scope.screensDict[attr.data.screen].name,
                    sequence: $scope.sequencesDict[attr.data.sequence].name,
                    schedule: $scope.schedulesDict[attr.data.schedule].name
                }
            });
        }));

        $q.all(promises)
            .then(function () {
                $scope.attributionReady = true;
            });
    }

    initData();


    $scope.deleteAttribution= function(id) {
        dataService.crudDeleteRecord(tablename, id).then(function() {
            initData();
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
                initData();
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

