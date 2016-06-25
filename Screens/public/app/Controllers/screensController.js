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
    
    function isAttributionCandidate(attrid) {
        var now = Date.now();
        var todaysWeekDay = now.getDay;
        var last = attributionsDict[attrid].lastDisplay;

        var attribution = attributionsDict[attrid];
        var schedule = schedulesDict[attribution.schedule];
        
        if (schedule.type !== 'once') {
            var validityStart = attribution.validity.dateStart;
            var validityEnd = attribution.validity.dateEnd;
            var validityInDayStart = attribution.validityinday.start;
            var validityInDayEnd = attribution.validityinday.end;

            if (now < validityStart || now > validityEnd) return false;
            if (now < Date.composeTimeAndNow(validityInDayStart) || now > Date.composeTimeAndNow(validityInDayEnd)) return false;
        }

        var isDayCandidate = false;

        switch (schedule.type) {
            case 'once':
                if (last) return false;
                var dateOnce =  Date.composeTimeAndDate(attribution.once.time, attribution.once.date) ;
                return now > dateOnce;
                break;
            case 'daily':
                isDayCandidate = !last || Date.daysBetween(now, last) >= attribution.daily.frequency;
                break;
            case 'weekly':
                isDayCandidate = (todaysWeekDay === 0 && attribution.weekly.dimanche) ||
                (todaysWeekDay === 1 && attribution.weekly.lundi) ||
                (todaysWeekDay === 2 && attribution.weekly.mardi) ||
                (todaysWeekDay === 3 && attribution.weekly.mercredi) ||
                (todaysWeekDay === 4 && attribution.weekly.jeudi) ||
                (todaysWeekDay === 5 && attribution.weekly.vendredi) ||
                (todaysWeekDay === 6 && attribution.weekly.samedi);
                break;
            case 'monthly':
                break;
            case 'monthlyii':
                break;            
        default:
        }

        if (!isDayCandidate) return false;

    }


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
