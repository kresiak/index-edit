'use strict';

app.controller("schedulesController", function ($scope, dataService) {

    var tablename = 'schedules';
    // inherits $scope.filesInDb

    var initDBSchedules = function () {
        return dataService.crudGetRecords(tablename)
            .then(function (response) {
                $scope.schedules = response.data;
            });
    };
    initDBSchedules();


    var initEmptyScheduleElement = function () {
        $scope.newSchedule = { id: "", data: { name: '' } };
        $scope.scheduleselected = $scope.newSchedule;
    }
    initEmptyScheduleElement();

    $scope.saveSchedule = function () {
        var schedule = $scope.scheduleselected;
        if (schedule && schedule.data && !String.IsNullOrEmpty(schedule.data.name)) {
            var func = schedule.id
                ? function () { return dataService.crudUpdateRecord(tablename, schedule.id, schedule.data); }
                : function () { return dataService.crudCreateRecord(tablename, schedule.data); };
            func().then(function (response) {
                initDBSchedules();
                initEmptyScheduleElement();
            }, function (response) { });
        }
    }

    // ============
    // Handle Tabs
    // ============

    $scope.tabNo = 0;

    $scope.setTab = function (tabNo) {
        $scope.tabNo = tabNo;
    }

    $scope.getTab = function () {
        return $scope.tabNo;
    }

    // =====================
    // Handle Selcted items
    // =====================

    $scope.scheduleSelected = function (schedule) {
        if (!schedule) schedule = $scope.newSchedule;
        $scope.scheduleselected = schedule;
    }

    $scope.isScheduleTheActiveOne = function (schedule) {
        if (!schedule) schedule = $scope.newSchedule;
        return $scope.scheduleselected === schedule;
    }

    $scope.isScheduleNameEmpty = function () {
        return String.IsNullOrEmpty($scope.scheduleselected.data.name.Trim());
    }


});

