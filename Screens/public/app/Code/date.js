Date.toUTC= function (d) {
    if (!d || !d.getFullYear) return 0;
    return Date.UTC(d.getFullYear(),
              d.getMonth(), d.getDate());
}

Date.toDays= function (d) {
    d = d || 0;
    return d / 24 / 60 / 60 / 1000;
}

Date.daysBetween= function (d1, d2) {
    return Date.toDays(Date.toUTC(d2) - Date.toUTC(d1));
}

Date.hoursBetween = function (d1, d2) {
    return (d1 - d2) / 3600000;
}

Date.minutesBetween = function (d1, d2) {
    return (d1 - d2) / 60000;
}

Date.composeTimeAndDate= function (time, date) {
    return new Date(date.getYear(),
        date.getMonth(),
        date.getDate(),
        time.getHours(),
        time.getMinutes(),
        time.getSeconds(),
        time.getMilliseconds());
}

Date.composeTimeAndNow= function (time) {
    return composeTimeAndDate(time, Date.now());
}


Date.firstDayInMonth= function (day, m, y) {
    // day is in range 0 Sunday to 6 Saturday 
    var y = y || new Date(Date.now()).getFullYear();
    var m = m || new Date(Date.now()).getMonth();
    return new Date(y, m, 1 + (day - new Date(y, m, 1).getDay() + 7) % 7);
}

Date.nthDayInMonth= function (n, day, m, y) {
    // day is in range 0 Sunday to 6 Saturday 
    if (n > 5) return undefined;
    var y = y || new Date(Date.now()).getFullYear();
    var m = m || new Date(Date.now()).getMonth();
    var d = firstDayInMonth(day, m, y);
    var result = new Date(d.getFullYear(), d.getMonth(), d.getDate() + (n - 1) * 7); // Notice that there can be a 5th day in a month but if there isn't then you get the first day in the following month.
    if (n === 5 && result > Date.lastDayOfMonthAtDate(new Date(y, m, 1))) {   //let's correct this, so that 5 can be used to find last day in month
        return Date.nthDayInMonth(4, day, m, y);
    }
    return result;
}

Date.lastDayOfMonthAtDate = function(date) {
    var lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return lastDayOfMonth;
}


