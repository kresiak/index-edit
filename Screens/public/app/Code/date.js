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

Date.composeTimeAndDate= function (time, date) {
    return new Date(date.getYear,
        date.getMonth,
        date.getDate,
        time.getHours,
        time.getMinutes,
        time.getSeconds,
        time.getMilliseconds);
}

Date.composeTimeAndNow= function (time) {
    return composeTimeAndDate(time, Date.now());
}
