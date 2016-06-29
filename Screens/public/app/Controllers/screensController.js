'use strict';

app.controller("screensController", function ($scope, dataService, $q) {
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
        var now = new Date(Date.now());
        var todaysWeekDay = now.getDay();
        var last = attributionsDict[attrid].lastDisplay;
        
        var attribution = attributionsDict[attrid];
        var schedule = schedulesDict[attribution.schedule];
        
        if (schedule.type !== 'once') {
            var validityStart = schedule.validity.dateStart;
            var validityEnd = schedule.validity.dateEnd;
            var validityInDayStart = schedule.validityinday.start;
            var validityInDayEnd = schedule.validityinday.end;
            
            if ((validityStart && now < validityStart) || (validityEnd && now > validityEnd))
                return false;
            if (schedule.typeForDay !== 'onceForDay' && ((validityInDayStart && now < Date.composeTimeAndNow(validityInDayStart)) || 
                (validityInDayEnd && now > Date.composeTimeAndNow(validityInDayEnd))))
                return false;
        }
        
        var isDayCandidate = false;
        
        switch (schedule.type) {
            case 'once':
                if (last) return false;
                var dateOnce = Date.composeTimeAndDate(new Date(schedule.once.time), new Date(schedule.once.date));
                return now > dateOnce;
                break;
            case 'daily':
                isDayCandidate = !last || Date.daysBetween(now, last) >= schedule.daily.frequency;
                break;
            case 'weekly':
                isDayCandidate = (todaysWeekDay === 0 && schedule.weekly.dimanche) ||
                (todaysWeekDay === 1 && schedule.weekly.lundi) ||
                (todaysWeekDay === 2 && schedule.weekly.mardi) ||
                (todaysWeekDay === 3 && schedule.weekly.mercredi) ||
                (todaysWeekDay === 4 && schedule.weekly.jeudi) ||
                (todaysWeekDay === 5 && schedule.weekly.vendredi) ||
                (todaysWeekDay === 6 && schedule.weekly.samedi);
                break;
            case 'monthly':
                var map = { lundi: 1, mardi: 2, mercredi: 3, jeudi: 4, vendredi: 5, samedi: 6, dimanche: 0 };
                var requestedDay = map[schedule.monthly.weekday];
                var map2 = { premier: 1, second: 2, '3 -ème': 3, '4-ème': 4, dernier: 5 };
                var dateToCheck = Date.nthDayInMonth(map2[schedule.monthly.frequency], requestedDay);
                isDayCandidate = Date.daysBetween(now, dateToCheck) === 0;
                break;
            case 'monthlyii':
                var lastDayThisMonth = Date.lastDayOfMonthAtDate(now).getDate();
                var requestedDateInMonth = lastDayThisMonth < schedule.monthlyii.frequency ? lastDayThisMonth : schedule.monthlyii.frequency;
                isDayCandidate = Date.daysBetween(now, new Date(now.getFullYear(), now.getMonth(), requestedDateInMonth)) === 0;
                break;
            default:
        }
        
        if (!isDayCandidate) return false;
        
        switch (schedule.typeForDay) {
            case 'onceForDay':
                return !last || Date.daysBetween(now, last) !== 0;
                break;
            case 'minutelyForDay':
                return !last || Date.minutesBetween(now, last) >= schedule.minutelyForDay.frequency;
                break;
            case 'hourlyForDay':
                return !last || Date.hoursBetween(now, last) >= schedule.hourlyForDay.frequency;
                break;
            default:
                return false;
        }
    }
    
    
    var screenSelected, attributionSelected;
    
    $scope.screenSelected = function (screen) {
        function initAttributions(screen) {
            $scope.attributionsToScreen = attributions.filter(function (attr) {
                return attr.data.screen === screen.id;
            });
            
            $scope.attributionsToScreen.forEach(function (attr) {
                var isOk = isAttributionCandidate(attr.id);
            });

        }
        
        screenSelected = screen;
        initAttributions(screen);
    }
    
    $scope.attributionSelected = function (attribution) {
        attributionSelected = attribution;
        function initSlides(attribution) {
            $scope.seqTitle = '<rien du tout>';
            var seq = sequencesDict[attribution.data.sequence];
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
        }
        
        initSlides(attribution);
    }
    
    $scope.getAttributionTitle = function (attribution) {
        var seq = sequencesDict[attribution.data.sequence];
        var program = schedulesDict[attribution.data.schedule];
        return seq.name + ': ' + program.name;
    }
    
    $scope.isScreenTheActiveOne = function (screen) {
        return screenSelected === screen;
    }
    
    $scope.isAttributionTheActiveOne = function (attribution) {
        return attributionSelected === attribution;
    }

});
