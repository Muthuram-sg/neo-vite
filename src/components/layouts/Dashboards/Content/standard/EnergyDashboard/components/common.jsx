import moment from "moment";
import configParam from "config"; 
let janOffset = moment({M:0, d:1}).utcOffset(); //checking for Daylight offset
let julOffset = moment({M:6, d:1}).utcOffset(); //checking for Daylight offset
let stdOffset = Math.min(janOffset, julOffset);// Then we can make a Moment object with the current time at that fixed offset 
let TZone = moment().utcOffset(stdOffset).format('Z') // Time Zone without Daylight 

function setRange(btGroupValue, headPlant, customdatesval) {
    let startrange = moment(customdatesval && customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ss"+TZone)
    let endrange = moment(customdatesval && customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ss"+TZone)
    if(btGroupValue === 30){
        startrange = moment().subtract(30, 'day').format("YYYY-MM-DDTHH:mm:ss"+TZone);
        endrange = moment().format("YYYY-MM-DDTHH:mm:ss"+TZone)
    }
    if(btGroupValue === 60){
        startrange = moment().subtract(60, 'day').format("YYYY-MM-DDTHH:mm:ss"+TZone);
        endrange = moment().subtract(30, 'day').format("YYYY-MM-DDTHH:mm:ss"+TZone);
    }
    if(btGroupValue === 6){
        startrange = configParam.DATE_ARR(btGroupValue, headPlant); 
        endrange = moment().format("YYYY-MM-DDTHH:mm:ss"+TZone);
        
    }
    try {
        return [startrange, endrange, null]
    } catch (err) {
        console.log("Error at getRange", err)
        return [startrange, endrange, err]
    }

}

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

function splitDatesMonthWise(startDate, endDate) {
    // Parse input dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = [];
  
    // Ensure the start date is the beginning of the month
    let current = new Date(start.getFullYear(), start.getMonth(), 1);
  
    while (current <= end) {
      // Get the end of the current month
      const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0);
  
      // Adjust to not exceed the end date
      const rangeStart = current < start ? start : current;
      const rangeEnd = monthEnd > end ? end : monthEnd;
  
      // Add the month range to the result
      months.push({
        start: rangeStart.toISOString().slice(0, 10),
        end: rangeEnd.toISOString().slice(0, 10),
      });
  
      // Move to the next month
      current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    }
  
    return months;
  }

const getShiftBetweenDates = (from, to, shift) => {

    try {
        let now = from.clone(), dates = [];
        while (now.isSameOrBefore(to)) {

            if (shift.ShiftType === "Weekly") {
                for (let i = 0; i < Object.keys(shift.shifts).length; i++) {
                    let t = new Date().getDay() - 1;
                    // eslint-disable-next-line eqeqeq
                    if (t == Object.keys(shift.shifts)[i]) {
                        for (let j of shift.shifts[i]) {
                            let shifStartDate = j.startDate.split(":")
                            let shifEndDate = j.endDate.split(":")
                            let offset = moment(now).utcOffset()
                            let tempStart = moment(now).set('hour', parseInt(shifStartDate[0])).set('minute', parseInt(shifStartDate[1])).set('seconds', 0)
                            let tempEnd = moment(now).set('hour', parseInt(shifEndDate[0])).set('minute', parseInt(shifEndDate[1])).set('seconds', 0)
                            tempStart.setUTCHours(parseInt(shifStartDate[0]), parseInt(shifStartDate[1]), 0)
                            tempEnd.setUTCHours(parseInt(shifEndDate[0]), parseInt(shifEndDate[1]), 0)
                            if (new Date(tempEnd) < new Date(tempStart)) { tempEnd.add(1, 'day') }
                            dates.push({ start: moment(tempStart).add(offset, 'minutes').utcOffset(stdOffset).format("YYYY-MM-DDTHH:mm:ssZ"), end: moment(tempEnd).add(offset, 'minutes').utcOffset(stdOffset).format("YYYY-MM-DDTHH:mm:ssZ"), name: shift.shifts[i].name })
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
                    dates.push({ start: moment(tempStart).add(offset, 'minutes').utcOffset(stdOffset).format("YYYY-MM-DDTHH:mm:ssZ"), end: moment(tempEnd).add(offset, 'minutes').utcOffset(stdOffset).format("YYYY-MM-DDTHH:mm:ssZ"), name: i.name })
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

const getmetrictype = (metrics, typelist) => {
    let type = []
    // eslint-disable-next-line array-callback-return
    metrics.map((val) => {
        let index = typelist.findIndex(metric => metric.metric_name === val)
        if (index !== -1) type.push(typelist[index].id)
        else type.push(2)
    })
    return type


}

const getviinfo = (val, typelist) => {

    try{
        let formula = val.formula ? val.formula : ""
        // eslint-disable-next-line no-useless-escape
        let instruments = formula.split(/([-+*\/()\n])/g)
        instruments = instruments.filter(word => word.trim().length > 0);
        let re = '-+*\\/()';
        let regex =/\.([A-Za-z]+)/;
        instruments = instruments.filter(val1 => !re.includes(val1));
        instruments = instruments.filter(val6=>regex.test(val6))
        let metrics = instruments.filter(val2 => val2.split('.')[1]).map((val3) => val3.split('.')[1].toString());
        instruments = instruments.map(val4 => val4.split('.')[0].toString());
        instruments = instruments.map(val5 => val5.toString()).join(',');
        let types = getmetrictype(metrics, typelist)
    
        return [instruments, metrics, types]
    }
    catch(err){
        return [[],[],[]]
    }
    
}

const getDays = (year, month) => new Date(year, month, 0).getDate()

function daysInYear(year) {
    return ((year % 4 === 0 && year % 100 > 0) || year % 400 === 0) ? 366 : 365;
}

const getAverage = (values, length) => {
    let sum = 0
    if (values.length > 0) {
        sum = values.reduce((total, item) => total + item);
    }
    return sum / length;
}
const common = {
    Range: setRange,

    getBetweenDates: getBetweenDates,

    getShiftBetweenDates: getShiftBetweenDates,

    getmetrictype: getmetrictype,

    getVirtualInstrumentInfo: getviinfo,

    getDays: getDays,

    getDaysinYear: daysInYear,

    getAverage: getAverage,

    splitDatesMonthWise: splitDatesMonthWise
}
export default common;