function getDateStr(sqlDate, dateFormat){
    if(sqlDate){
        var dateObj = formatDate(sqlDate, dateFormat);
        if(dateObj){
            return dateObj.str;
        }
        else{
            return 'dateStr'
        }
    }
    else{
        return null;
    }
}

function getDateTimeStr(sqlDate, dateFormat, timeFormat, excludeMidnight){
    if(sqlDate){
        var dateObj = formatDateTime(sqlDate, dateFormat, timeFormat, excludeMidnight);
        if(dateObj){
            return dateObj.str;
        }
        else{
            return 'dateStr'
        }
    }
    else{
        return null;
    }
}

function getFullDateStr(sqlDate, dateFormat, timeFormat, excludeMidnight, dayFormat, dayPlacement){
    if(sqlDate){
        var dateObj = formatFullDate(sqlDate, dateFormat, timeFormat, excludeMidnight, dayFormat, dayPlacement);
        if(dateObj){
            return dateObj.str;
        }
        else{
            return 'dateStr'
        }
    }
    else{
        return null;
    }
}

//returns object, date parameter can be string sqlDate or moment date obj
function formatDate(date, dateFormat){
    var momentDate;
    var dateFormatStr;
    var formattedStr;

    if(typeof(date) === 'string'){
        momentDate = moment.utc(date);
    }
    else if(typeof(date) === 'object'){
        momentDate = date;
    }
    else{
        return null;
    }

    switch(dateFormat){
        case 'default':
            dateFormatStr = 'MM/DD/YYYY';
            break;
        case 'default2Yr':
            dateFormatStr = 'MM/DD/YY';
            break;
        case 'short':
            dateFormatStr = 'M/D/YYYY';
            break;
        case 'short2Yr':
            dateFormatStr = 'M/D/YY';
            break;
        case 'longText':
            dateFormatStr = 'MMMM Do YYYY';
            break;
        case null:
            dateFormatStr = 'MM/DD/YYYY';
            break;
        default:
            dateFormatStr = dateFormat 
    }

    if(dateFormatStr){
        formattedStr = momentDate.format(dateFormatStr);
    }

    return {
        str: formattedStr,
        momentDate: momentDate,
        formatStr: dateFormatStr
    };
}


function formatTime(date, timeFormat){
    var momentDate;
    var timeFormatStr;
    var formattedStr;
    var isMidnight = false;

    if(typeof(date) === 'string'){
        momentDate = moment.utc(date);
    }
    else if(typeof(date) === 'object'){
        momentDate = date;
    }
    else{
        return null;
    }

    switch(timeFormat){
        case 'default':
            timeFormatStr = 'HH:mm:ss';
            break;
        case 'defaultMS':
            timeFormatStr = 'HH:mm:ss:SSS';
            break;
        case 'defaultNoSec':
            timeFormatStr = 'HH:mm';
            break;
        case 'short':
            timeFormatStr = 'H:mm:ss';
            break;
        case 'shortNoSec':
            timeFormatStr = 'H:mm';
            break;
        case 'shortMS':
            timeFormatStr = 'H:mm:ss:SSS';
            break;
        case 'shortAmPm':
            timeFormatStr = 'h:mmA';
            break;
        case 'shortSpaceAmPm':
            timeFormatStr = 'h:mm A';
            break;
        case null:
            timeFormatStr = null;
            break;
        default:
            timeFormatStr = timeFormat;
    }

    // send prop if time is midnight
    if(momentDate.hours() === 0 && momentDate.minutes() === 0 && momentDate.seconds()=== 0){
        isMidnight = true;
    }

    if(timeFormatStr){
       formattedStr = momentDate.format(timeFormatStr);
    }

    return {
        str: formattedStr,
        momentDate: momentDate,
        formatStr: timeFormatStr,
        isMidnight: isMidnight
    };
}

function formatDay(date, dayFormat){
    var momentDate;
    var dayFormatStr;
    var formattedStr;

    if(typeof(date) === 'string'){
        momentDate = moment.utc(date);
    }
    else if(typeof(date) === 'object'){
        momentDate = date;
    }
    else{
        return null;
    }

    switch(dayFormat){
        case 'default':
            dayFormatStr = 'ddd';
            break;
        case 'shortDay':
            dayFormatStr = 'dd';
            break;
        case 'longDay':
            dayFormatStr = 'dddd';
            break;
        case null:
            dayFormatStr = null;
            break;
        default:
            dayFormatStr = dayFormat;
    }

    if(dayFormatStr){
        formattedStr = momentDate.format(dayFormatStr);
    }

    return {
        str: formattedStr,
        momentDate: momentDate,
        formatStr: dayFormatStr
    };
}

function formatDateTime(date, dateFormat, timeFormat, excludeMidnight){
    var momentDate;
    var dateObj;
    var timeObj;
    var formattedStr;
    var fullFormatStr;

    if(typeof(date) === 'string'){
        momentDate = moment.utc(date);
    }
    else if(typeof(date) === 'object'){
        momentDate = date;
    }
    else{
        return null;
    }

    dateObj = formatDate(momentDate, dateFormat);
    timeObj = formatTime(momentDate, timeFormat);

    if(!dateObj){
        return null;
    }
    // remove moment obj to prevent duplicates?
    delete dateObj.momentDate;
    
    formattedStr = dateObj.str;
    fullFormatStr = dateObj.formatStr;

    if(timeObj){
        // remove moment obj to prevent duplicates?
        delete timeObj.momentDate;

        // remove midnight if necessary
        if(!excludeMidnight ||( excludeMidnight && !(timeObj.isMidnight) )){
            formattedStr += ' ' + timeObj.str;
            fullFormatStr += ' ' + timeObj.formatStr;
        }
    }

    return {
        str: formattedStr,
        momentDate: momentDate,
        formatStr: fullFormatStr,
        dateObj: dateObj,
        timeObj: timeObj
    };
}

function formatFullDate(date, dateFormat, timeFormat, excludeMidnight, dayFormat, dayPlacement){
    var momentDate;
    var datetimeObj;
    var dateObj;
    var timeObj;
    var dayObj;
    var formattedStr;
    var fullFormatStr;

    if(typeof(date) === 'string'){
        momentDate = moment.utc(date);
    }
    else if(typeof(date) === 'object'){
        momentDate = date;
    }
    else{
        return null;
    }

    datetimeObj = formatDateTime(momentDate, dateFormat, timeFormat, excludeMidnight);
    dayObj = formatDay(momentDate, dayFormat);

    if(!datetimeObj){
        return null;
    }
    delete datetimeObj.momentDate;

    dateObj = datetimeObj.dateObj;
    timeObj = datetimeObj.timeObj;

    formattedStr = datetimeObj.str;
    formatStr = datetimeObj.formatStr;

    if(dayObj){
        // remove moment obj to prevent duplicates?
        delete dayObj.momentDate;

        // remove midnight if necessary
        switch(dayPlacement){
            // at beginning
            case 'prepend':
                formattedStr = dayObj.str + ', ' + formattedStr;
                fullFormatStr = dayObj.formatStr + ', ' + fullFormatStr;
                break;
            case 'append':
                formattedStr += ' (' + dayObj.str + ')'
                fullFormatStr += ' (' + dayObj.formatStr + ')'
                break;
            default:
        }
    }

    return {
        str: formattedStr,
        momentDate: momentDate,
        formatStr: fullFormatStr,
        dateObj: dateObj,
        timeObj: timeObj,
        dayObj: dayObj
    };
}