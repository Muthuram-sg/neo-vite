/* eslint-disable eqeqeq */
import moment from "moment";
import configParam from 'config';


const getBetweenDates = (from, to, groupBy) => {


    let now = from.clone(), dates = [];
    try {
        while (now.isSameOrBefore(to)) {
            let start = moment(now).startOf(groupBy).format('YYYY-MM-DDTHH:mm:ss');
            let end = moment(now).endOf(groupBy).format('YYYY-MM-DDTHH:mm:ss');
            dates.push({ start: start, end: end });
            now.add(1, groupBy + 's');
        }

        return dates;
    } catch (err) {
        console.log("error at getting dates", err)
        return []
    }

}

const getShiftBetweenDates = (from, to, shift) => {

    try {
        let now = from.clone(), dates = [];
        while (now.isSameOrBefore(to)) {
            if (shift.ShiftType === "Weekly") {
                let t = new Date(now).getDay() - 1 < 0 ? "6" : new Date(now).getDay() - 1  ;
                for (let i = 0; i < Object.keys(shift.shifts).length; i++) {
                   
                    if (t == Object.keys(shift.shifts)[i]) {
                        console.log(t, Object.keys(shift.shifts)[i],"avail")
                        for (let j of shift.shifts[i]) {
                            let shifStartDate = j.startDate.split(":")
                            let shifEndDate = j.endDate.split(":")
                            let offset = moment(now).utcOffset()
                            let tempStart = moment(now).set('hour', parseInt(shifStartDate[0])).set('minute', parseInt(shifStartDate[1])).set('seconds', 0)
                            let tempEnd = moment(now).set('hour', parseInt(shifEndDate[0])).set('minute', parseInt(shifEndDate[1])).set('seconds', 0)
                            
                            if (new Date(tempEnd) < new Date(tempStart)) { tempEnd.add(1, 'day') }
                            dates.push({ start: moment(tempStart).add(offset, 'minutes').format("YYYY-MM-DDTHH:mm:ssZ"), end: moment(tempEnd).add(offset, 'minutes').format("YYYY-MM-DDTHH:mm:ssZ"), name: j.name })
                        }
                        now.add(1, 'days');
                    }
                    
                }
            } else {
                for (let i of shift.shifts) {
                    let shifStartDate = i.startDate.split(":")
                    let shifEndDate = i.endDate.split(":")
                    let offset = moment(now).utcOffset()
                    let tempStart = moment(now).set('hour', parseInt(shifStartDate[0])).set('minute', parseInt(shifStartDate[1])).set('seconds', 0)
                    let tempEnd = moment(now).set('hour', parseInt(shifEndDate[0])).set('minute', parseInt(shifEndDate[1])).set('seconds', 0)
                    if (new Date(tempEnd) < new Date(tempStart)) { tempEnd.add(1, 'day') }
                    dates.push({ start: moment(tempStart).add(offset, 'minutes').format("YYYY-MM-DDTHH:mm:ssZ"), end: moment(tempEnd).add(offset, 'minutes').format("YYYY-MM-DDTHH:mm:ssZ"), name: i.name })
                }
                now.add(1, 'days');
            }

        }

        return dates;
    }
    catch (error) {
        console.log("Error at getShiftBetweenDates : ", { message: error.message, stack: error.stack })

        return [];
    }
}
const getShiftBetweenDates2 = (from, to, shift) => {

    try {
        let now = from.clone(), dates = [],count =1; 
        while (now.isSameOrBefore(to)) {

            let t = new Date(now).getDay() - 1 < 0 ?6:new Date(now).getDay() - 1;
            if (shift.ShiftType === "Weekly") { 
                for (let i = 0; i < Object.keys(shift.shifts).length; i++) {

                    if (t == Object.keys(shift.shifts)[i]) {  
                        for (let j = 0; j < shift.shifts[i].length; j++) {
                            let shifStartDate = shift.shifts[i][j].startDate.split(":")
                            let shifEndDate = shift.shifts[i][j].endDate.split(":")
                            let offset = moment(now).utcOffset()     
                            let tempStart = moment(now).set('hour', parseInt(shifStartDate[0])).set('minute', parseInt(shifStartDate[1])).set('seconds', 0);
                            let tempEnd = moment(now).set('hour', parseInt(shifEndDate[0])).set('minute', parseInt(shifEndDate[1])).set('seconds', 0);                            
                            tempStart.add(offset,'minutes');
                            tempEnd.add(offset,'minutes');                            
                            if(new Date(moment(now).format('YYYY-MM-DD'))< new Date(moment(tempStart).format('YYYY-MM-DD'))){
                                tempStart = tempStart.subtract(1,'day');
                            }
                            if(j === 0 && count ===1){
                                count++;
                                const startoftheday = moment(now).startOf('day');
                                if(!startoftheday.isSame(tempStart)){   
                                    const prevDayshifts = t===0? shift.shifts[Object.keys(shift.shifts).length-1]:shift.shifts[t-1];    
                                    const lastshift = prevDayshifts[prevDayshifts.length-1]; 
                                    let lastshifStartDate = lastshift.startDate.split(":")
                                    let lastshifEndDate = lastshift.endDate.split(":")
                                    let lastoffset = moment(now).utcOffset()
                                    let now2 = moment(now).subtract(1,'day');
                                    let lasttempStart = moment(now2).set('hour', parseInt(lastshifStartDate[0])).set('minute', parseInt(lastshifStartDate[1])).set('seconds', 0);
                                    let lasttempEnd = moment(now2).set('hour', parseInt(lastshifEndDate[0])).set('minute', parseInt(lastshifEndDate[1])).set('seconds', 0);                                    
                                    lasttempStart.add(lastoffset,'minutes');
                                    lasttempEnd.add(lastoffset,'minutes');
                                    if(new Date(moment(now2).format('YYYY-MM-DD'))< new Date(moment(lasttempStart).format('YYYY-MM-DD'))){
                                        lasttempStart = lasttempStart.subtract(1,'day');
                                    }
                                    if(new Date(lasttempEnd) < new Date(lasttempStart)) { lasttempEnd = moment(lasttempEnd).add(1, 'day') }
                                    if(moment(now).isBetween(moment(lasttempStart),moment(lasttempEnd))){
                                        dates.push({ start: moment(lasttempStart).format("YYYY-MM-DDTHH:mm:ssZ"), end: moment(lasttempEnd).format("YYYY-MM-DDTHH:mm:ssZ"), name: lastshift.name })
                                    }
                                }
                            }
                            
                            if (new Date(tempEnd) < new Date(tempStart)) { tempEnd = moment(tempEnd).add(1, 'day') }
                            dates.push({ start: moment(tempStart).format("YYYY-MM-DDTHH:mm:ssZ"), end: moment(tempEnd).format("YYYY-MM-DDTHH:mm:ssZ"), name: shift.shifts[i][j].name })
                        }
                    }
                }
                now.add(1, 'days');
            } else {
                for (let i = 0; i < shift.shifts.length; i++) {
                    let shifStartDate = shift.shifts[i].startDate.split(":")
                    let shifEndDate = shift.shifts[i].endDate.split(":")
                    let offset = moment(now).utcOffset()
                    let tempStart = moment(now).set('hour', parseInt(shifStartDate[0])).set('minute', parseInt(shifStartDate[1])).set('seconds', 0)
                    let tempEnd = moment(now).set('hour', parseInt(shifEndDate[0])).set('minute', parseInt(shifEndDate[1])).set('seconds', 0)
                    if(i === 0 && count ===1){
                        count++;
                        const startoftheday = moment(now).startOf('day');
                        if(!startoftheday.isSame(tempStart)){                             
                            const lastshift = shift.shifts[shift.shifts.length-1];
                            let lastshifStartDate = lastshift.startDate.split(":")
                            let lastshifEndDate = lastshift.endDate.split(":")
                            let lastoffset = moment(now).utcOffset()
                            let lasttempStart = moment(now).set('hour', parseInt(lastshifStartDate[0])).set('minute', parseInt(lastshifStartDate[1])).set('seconds', 0)
                            let lasttempEnd = moment(now).set('hour', parseInt(lastshifEndDate[0])).set('minute', parseInt(lastshifEndDate[1])).set('seconds', 0)
                            if(new Date(lasttempEnd) < new Date(lasttempStart)) { lasttempStart.subtract(1, 'day') }
                            // eslint-disable-next-line no-sequences
                            if(moment(now).isBetween(lasttempStart,lasttempEnd)){
                                dates.push({ start: moment(lasttempStart).add(lastoffset, 'minutes').format("YYYY-MM-DDTHH:mm:ssZ"), end: moment(lasttempEnd).add(lastoffset, 'minutes').format("YYYY-MM-DDTHH:mm:ssZ"), name: shift.shifts[shift.shifts.length-1].name })
                            }
                        }
                    }
                    if (new Date(tempEnd) < new Date(tempStart)) { tempEnd.add(1, 'day') }
                    dates.push({ start: moment(tempStart).add(offset, 'minutes').format("YYYY-MM-DDTHH:mm:ssZ"), end: moment(tempEnd).add(offset, 'minutes').format("YYYY-MM-DDTHH:mm:ssZ"), name: shift.shifts[i].name })
                }
                now.add(1, 'days');
            }
        }
        
        return dates;
    }
    catch (error) {
        console.log("Error at getShiftBetweenDates : ", { message: error.message, stack: error.stack })

        return [];
    }
}

function setRange(btGroupValue, headPlant, customdatesval) {
    let startrange;
    let endrange;
    try {
        if (Number(btGroupValue) === 7) {
            startrange = moment(moment().subtract(1, 'day')).startOf('day').format("YYYY-MM-DDTHH:mm:ssZ")
            endrange = moment(moment().subtract(1, 'day')).endOf('day').format("YYYY-MM-DDTHH:mm:ssZ")
        }
        else if (Number(btGroupValue) === 17) {
            startrange = moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ssZ")
            endrange = moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ssZ")
        } else if (Number(btGroupValue) === 20) {
            startrange = configParam.DATE_ARR(btGroupValue, headPlant)
            endrange = configParam.DATE_ARR(22, headPlant)
        } else if (Number(btGroupValue) === 21) {
            startrange = configParam.DATE_ARR(btGroupValue, headPlant)
            endrange = configParam.DATE_ARR(23, headPlant)
        } else if (Number(btGroupValue) === 16) {
            startrange = moment(moment().subtract(1, 'month')).startOf('month').format("YYYY-MM-DDTHH:mm:ssZ")
            endrange = moment(moment().subtract(1, 'month')).endOf('month').format("YYYY-MM-DDTHH:mm:ssZ")
        } else if (Number(btGroupValue) === 30) {
            startrange = moment().subtract(30, 'day').format("YYYY-MM-DDTHH:mm:ssZ")
            endrange = moment().format('YYYY-MM-DDTHH:mm:ssZ')
        } else if (Number(btGroupValue) === 60) {
            startrange = moment().subtract(60, 'day').format("YYYY-MM-DDTHH:mm:ssZ");
            endrange = moment().subtract(30, 'day').format("YYYY-MM-DDTHH:mm:ssZ");
        }
        else {
            let shiftStart = configParam.DATE_ARR(btGroupValue, headPlant)

            if (shiftStart !== undefined) {
                startrange = shiftStart
            }
            else {
                startrange = moment().format('YYYY-MM-DDTHH:mm:ssZ')
            }
            endrange = moment().format('YYYY-MM-DDTHH:mm:ssZ')
        }
        return [startrange, endrange, null]
    } catch (err) {
        console.log("Error at getRange", err)
        return [startrange, endrange, err]
    }

}
    
function getFromandToDate(range,selectedDateStart,selectedDateEnd,headPlant) {
    let frmDate = "";
    let toDate = "";
    if (Number(range) === 17) {
        frmDate = moment(selectedDateStart).format("YYYY-MM-DDTHH:mm:ssZ")
        toDate = moment(selectedDateEnd).format("YYYY-MM-DDTHH:mm:ssZ")
    } else if (Number(range) === 16) {
        frmDate = configParam.DATE_ARR(Number(range), headPlant)
        toDate = moment(moment().subtract(1, 'month')).endOf('month').format("YYYY-MM-DDTHH:mm:ssZ")
    } else if (Number(range) === 7) {
        frmDate = configParam.DATE_ARR(Number(range), headPlant)
        toDate = moment(moment().subtract(1, 'day')).endOf('day').format("YYYY-MM-DDTHH:mm:ssZ")
    } else if (Number(range) === 21) {
        frmDate = configParam.DATE_ARR(Number(range), headPlant)
        toDate = configParam.DATE_ARR(23, headPlant)
    } else if (Number(range) === 20) {
        frmDate = configParam.DATE_ARR(Number(range), headPlant)
        toDate = configParam.DATE_ARR(22, headPlant)
    }
    else {
        frmDate = configParam.DATE_ARR(Number(range), headPlant)
        toDate = moment().format("YYYY-MM-DDTHH:mm:ssZ")
    }
    return { frmDate, toDate }
}

const formattime = (time, showms) => {
    let finalTimeDiffsecs = moment.duration(time*1000)
    let days = finalTimeDiffsecs.days()
    let months = finalTimeDiffsecs.months() 
    let years = finalTimeDiffsecs.years()  
    let hrs = finalTimeDiffsecs.hours() //Number(finalTimeDiffsecs.split(":")[0]) ? Number(finalTimeDiffsecs.split(":")[0]) : 0
    let mins = finalTimeDiffsecs.minutes() //Number(finalTimeDiffsecs.split(":")[1]) ? Number(finalTimeDiffsecs.split(":")[1]) : 0
    let secs = finalTimeDiffsecs.seconds() //Number(finalTimeDiffsecs.split(":")[2].split(".")[0]) ? Number(finalTimeDiffsecs.split(":")[2].split(".")[0]) : 0
    let millisecs = finalTimeDiffsecs.milliseconds()//Number(finalTimeDiffsecs.split(".")[1]) ? Number(finalTimeDiffsecs.split(".")[1]) : 0

    return (days > 0 ? days + "day(s)" : "")  + (months > 0 ? months + "month(s) " : "")+(years > 0 ? years + "year(s) " : "")+(hrs > 0 ? hrs + "h " : "") + (mins > 0 ? mins + "m " : "") + (secs > 0 ? secs + "s " : "") + (showms && millisecs > 0 ? Math.round(millisecs) + "ms " : "")
}
const common = {
   

    getBetweenDates : getBetweenDates ,

    getShiftBetweenDates : getShiftBetweenDates,

    Range: setRange,

    getShiftBetweenDates2 : getShiftBetweenDates2,
    getFromandToDate : getFromandToDate,
    formattime : formattime
    
}
export default common;