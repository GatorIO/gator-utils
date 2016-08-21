"use strict";
var moment = require("moment-timezone");
exports.timezones = [];
exports.timezones[0] = { code: 'UTC', momentName: 'UTC', name: 'Coordinated Universal Time (UTC)' };
exports.timezones[1] = { code: 'MIT', momentName: 'Pacific/Midway', name: 'Midway Islands Time (MIT)' };
exports.timezones[2] = { code: 'HST', momentName: 'US/Hawaii', name: 'Hawaii Time (HST)' };
exports.timezones[3] = { code: 'AST', momentName: 'US/Alaska', name: 'Alaska Time (AST)' };
exports.timezones[4] = { code: 'PST', momentName: 'US/Pacific', name: 'Pacific Time (PST)' };
exports.timezones[5] = { code: 'PNT', momentName: 'America/Phoenix', name: 'Phoenix Time (PNT)' };
exports.timezones[6] = { code: 'MST', momentName: 'US/Mountain', name: 'Mountain Time (MST)' };
exports.timezones[7] = { code: 'CST', momentName: 'US/Central', name: 'Central Time (CST)' };
exports.timezones[8] = { code: 'EST', momentName: 'US/Eastern', name: 'Eastern Time (EST)' };
exports.timezones[9] = { code: 'IET', momentName: 'US/East-Indiana', name: 'Indiana Eastern Time (IET)' };
exports.timezones[10] = { code: 'PRT', momentName: 'America/Puerto_Rico', name: 'Puerto Rico/US Virgin Islands Time (PRT)' };
exports.timezones[11] = { code: 'CNT', momentName: 'Canada/Newfoundland', name: 'Canada Newfoundland Time (CNT)' };
exports.timezones[12] = { code: 'AGT', momentName: 'America/Argentina/Buenos_Aires', name: 'Argentina Time (AGT)' };
exports.timezones[13] = { code: 'BET', momentName: 'Brazil/East', name: 'Brazil Eastern Time (BET)' };
exports.timezones[14] = { code: 'CAT', momentName: 'Africa/Lusaka', name: 'Central African Time (CAT)' };
exports.timezones[15] = { code: 'GMT', momentName: 'Greenwich', name: 'Greenwich Mean Time (GMT)' };
exports.timezones[16] = { code: 'ECT', momentName: 'Europe/Berlin', name: 'European Central Time (ECT)' };
exports.timezones[17] = { code: 'EET', momentName: 'Europe/Bucharest', name: 'Eastern European Time (EET)' };
exports.timezones[18] = { code: 'ART', momentName: 'Egypt', name: 'Egypt Time (ART)' };
exports.timezones[19] = { code: 'EAT', momentName: 'Africa/Khartoum', name: 'Eastern African Time (EAT)' };
exports.timezones[20] = { code: 'BWT', momentName: 'Brazil/West', name: 'Brazil Western Time (BWT)' };
exports.timezones[21] = { code: 'MSK', momentName: 'Europe/Moscow', name: 'Moscow Time (MSK)' };
exports.timezones[22] = { code: 'PKT', momentName: 'Asia/Karachi', name: 'Pakistan Time (PKT)' };
exports.timezones[23] = { code: 'IT', momentName: 'Asia/Calcutta', name: 'India Time (IT)' };
exports.timezones[24] = { code: 'BST', momentName: 'Asia/Dhaka', name: 'Bangladesh Time (BST)' };
exports.timezones[25] = { code: 'VST', momentName: 'Asia/Ho_Chi_Minh', name: 'Vietnam Time (VST)' };
exports.timezones[26] = { code: 'CTT', momentName: 'Asia/Taipei', name: 'China Taiwan Time (CTT)' };
exports.timezones[27] = { code: 'JST', momentName: 'Asia/Tokyo', name: 'Japan Time (JST)' };
exports.timezones[28] = { code: 'ACT', momentName: 'Australia/Adelaide', name: 'Australia Central Time (ACT)' };
exports.timezones[29] = { code: 'AET', momentName: 'Australia/Sydney', name: 'Australia Eastern Time (AET)' };
exports.timezones[30] = { code: 'AWT', momentName: 'Australia/Perth', name: 'Australia Western Time (AET)' };
exports.timezones[31] = { code: 'NST', momentName: 'Pacific/Auckland', name: 'New Zealand Time (NST)' };
exports.timezones[32] = { code: 'PXT', momentName: 'America/Hermosillo', name: 'Mexico/Pacific Time (PXT)' };
exports.timezones[33] = { code: 'IST', momentName: 'Israel', name: 'Israel Time (IST)' };
exports.timezones[34] = { code: 'CXT', momentName: 'America/Mexico_City', name: 'Mexico/Central Time (CXT)' };
(function (DateIntervals) {
    DateIntervals[DateIntervals["second"] = 0] = "second";
    DateIntervals[DateIntervals["minute"] = 1] = "minute";
    DateIntervals[DateIntervals["hour"] = 2] = "hour";
    DateIntervals[DateIntervals["day"] = 3] = "day";
    DateIntervals[DateIntervals["week"] = 4] = "week";
    DateIntervals[DateIntervals["month"] = 5] = "month";
    DateIntervals[DateIntervals["quarter"] = 6] = "quarter";
    DateIntervals[DateIntervals["year"] = 7] = "year";
})(exports.DateIntervals || (exports.DateIntervals = {}));
var DateIntervals = exports.DateIntervals;
function getTimezoneId(timezone) {
    if (typeof timezone == 'string') {
        timezone = timezone.toUpperCase();
        for (var key in exports.timezones) {
            if (exports.timezones.hasOwnProperty(key)) {
                var tz = exports.timezones[key];
                if (tz.code.toUpperCase() == timezone.toUpperCase())
                    return +key;
                if (tz.momentName && tz.momentName.toUpperCase() == timezone.toUpperCase())
                    return +key;
            }
        }
        return -1;
    }
    else {
        return timezone;
    }
}
exports.getTimezoneId = getTimezoneId;
function utcOffset(timezoneId) {
    var timezone = exports.timezones[this.getTimezoneId(timezoneId)];
    if (!timezone)
        return 0;
    return -moment.tz.zone(timezone.momentName).offset(new Date().getTime()) * 60;
}
exports.utcOffset = utcOffset;
function currentDatetime(utcOffset) {
    if (utcOffset === void 0) { utcOffset = 0; }
    var date = new Date();
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds() + utcOffset));
}
exports.currentDatetime = currentDatetime;
function toUTC(strDate, utcOffset) {
    if (utcOffset === void 0) { utcOffset = 0; }
    var date = new Date(Date.parse(strDate));
    var localOffset = date.getTimezoneOffset() * 60;
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds() + utcOffset + localOffset));
}
exports.toUTC = toUTC;
function currentDate(utcOffset) {
    if (utcOffset === void 0) { utcOffset = 0; }
    var date = new Date();
    if (utcOffset == 0) {
        return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    }
    var adjustedDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds() + utcOffset));
    return new Date(Date.UTC(adjustedDate.getUTCFullYear(), adjustedDate.getUTCMonth(), adjustedDate.getUTCDate()));
}
exports.currentDate = currentDate;
function currentMonth(utcOffset) {
    if (utcOffset === void 0) { utcOffset = 0; }
    return addMonths(month(currentDate(utcOffset)));
}
exports.currentMonth = currentMonth;
function monthCode(date, utcOffset) {
    if (!date)
        date = currentDate(utcOffset);
    return date.getUTCFullYear() + '-' + ('0' + date.getUTCMonth() + 1).slice(-2);
}
exports.monthCode = monthCode;
function dateToString(date, includeTime) {
    if (includeTime === void 0) { includeTime = true; }
    var day = date.getUTCDate();
    var month = date.getUTCMonth() + 1;
    var hour = date.getUTCHours();
    var minute = date.getUTCMinutes();
    var second = date.getUTCSeconds();
    var ret = date.getUTCFullYear() + '-' + (month <= 9 ? '0' + month.toString() : month.toString()) + '-' + (day <= 9 ? '0' + day.toString() : day.toString());
    if (includeTime && (hour != 0 || minute != 0 || second != 0))
        ret += ' ' + (hour <= 9 ? '0' + hour.toString() : hour.toString()) + ":" + (minute <= 9 ? '0' + minute.toString() : minute.toString()) + ':' + (second <= 9 ? '0' + second.toString() : second.toString());
    return ret;
}
exports.dateToString = dateToString;
function addMinutes(minutes, date) {
    if (!date)
        date = start();
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), minutes * 60));
}
exports.addMinutes = addMinutes;
function addHours(hours, date) {
    if (!date)
        date = start();
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), 0, hours * 3600));
}
exports.addHours = addHours;
function addDays(days, date) {
    if (!date)
        date = start();
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + days));
}
exports.addDays = addDays;
function addMonths(months, date) {
    if (!date)
        date = start();
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, date.getUTCDate()));
}
exports.addMonths = addMonths;
function addYears(years, date) {
    if (!date)
        date = start();
    return new Date(Date.UTC(date.getUTCFullYear() + years, date.getUTCMonth(), date.getUTCDate()));
}
exports.addYears = addYears;
function startOfDate(date) {
    if (!date)
        date = start();
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0));
}
exports.startOfDate = startOfDate;
function addSeconds(seconds, date) {
    if (!date)
        date = start();
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds() + seconds));
}
exports.addSeconds = addSeconds;
function diff(interval, date1, date2) {
    if (!date2) {
        date2 = date1;
        date1 = start();
    }
    switch (interval) {
        case DateIntervals.second:
            return second(date2) - second(date1);
        case DateIntervals.minute:
            return minute(date2) - minute(date1);
        case DateIntervals.hour:
            return hour(date2) - hour(date1);
        case DateIntervals.day:
            return day(date2) - day(date1);
        case DateIntervals.week:
            return week(date2) - week(date1);
        case DateIntervals.month:
            return month(date2) - month(date1);
        case DateIntervals.quarter:
            return quarter(date2) - quarter(date1);
        case DateIntervals.year:
            return date2.getUTCFullYear() - date1.getUTCFullYear();
    }
}
exports.diff = diff;
function start() {
    return new Date(Date.UTC(1999, 0, 1));
}
exports.start = start;
function millisecond(date) {
    if (!date)
        date = new Date();
    var msFromEpoch = date.getTime();
    return msFromEpoch - 915148800000;
}
exports.millisecond = millisecond;
function second(date) {
    if (!date)
        date = new Date();
    var secondsFromEpoch = date.getTime() / 1000;
    return Math.round(secondsFromEpoch) - 915148800;
}
exports.second = second;
function minute(date) {
    if (!date)
        date = new Date();
    var date1 = start();
    var date2 = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes()));
    var seconds1 = Math.round(date1.getTime() / 1000) - 915148800;
    var seconds2 = Math.round(date2.getTime() / 1000) - 915148800;
    return Math.round((seconds2 - seconds1) / 60);
}
exports.minute = minute;
function hour(date) {
    if (!date)
        date = new Date();
    var date1 = start();
    var date2 = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours()));
    var seconds1 = Math.round(date1.getTime() / 1000) - 915148800;
    var seconds2 = Math.round(date2.getTime() / 1000) - 915148800;
    return Math.round((seconds2 - seconds1) / 3600);
}
exports.hour = hour;
function day(date) {
    if (!date)
        date = new Date();
    var date1 = start();
    var date2 = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    var seconds1 = Math.round(date1.getTime() / 1000) - 915148800;
    var seconds2 = Math.round(date2.getTime() / 1000) - 915148800;
    return Math.floor((seconds2 - seconds1) / 3600 / 24);
}
exports.day = day;
function week(date) {
    if (!date)
        date = new Date();
    var date1 = start();
    var seconds1 = Math.round(date1.getTime() / 1000) - 915148800 - (24 * 3600 * 5);
    var seconds2 = Math.round(date.getTime() / 1000) - 915148800;
    return Math.floor((seconds2 - seconds1) / 3600 / 24 / 7);
}
exports.week = week;
function month(date) {
    if (!date)
        date = new Date();
    var date1 = start();
    return (date.getUTCFullYear() - date1.getUTCFullYear()) * 12 + (date.getUTCMonth() - date1.getUTCMonth());
}
exports.month = month;
function quarter(date) {
    if (!date)
        date = new Date();
    var date1 = start();
    var q1 = Math.floor(date1.getMonth() / 4);
    var q2 = Math.floor(date.getMonth() / 4);
    return (date.getUTCFullYear() - date1.getUTCFullYear()) * 4 + (q2 - q1);
}
exports.quarter = quarter;
function formatTimezone(param) {
    var timezoneId = 'PST';
    if (param && typeof param == 'string') {
        if (param.indexOf('(') > -1) {
            timezoneId = param.substr(param.indexOf('(') + 1, 3).toUpperCase();
        }
        else {
            timezoneId = param;
        }
    }
    var timezoneFound = false;
    for (var i = 0; i < exports.timezones.length; i++) {
        if (exports.timezones[i + 1].code == timezoneId) {
            timezoneFound = true;
            break;
        }
    }
    if (!timezoneFound) {
        timezoneId = null;
    }
    return timezoneId;
}
exports.formatTimezone = formatTimezone;
//# sourceMappingURL=epoch.js.map