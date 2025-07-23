
import moment from 'moment';
import configParam from 'config';

function getFromandToDate(range,selectedDateStart,selectedDateEnd,headPlant) {
    let janOffset = moment({M:0, d:1}).utcOffset(); //checking for Daylight offset
    let julOffset = moment({M:6, d:1}).utcOffset(); //checking for Daylight offset
    let stdOffset = Math.min(janOffset, julOffset);// Then we can make a Moment object with the current time at that fixed offset 
    let TZone = moment().utcOffset(stdOffset).format('Z') // Time Zone without Daylight 
    let frmDate = "";
    let toDate = "";
    if (Number(range) === 17) {
        frmDate = moment(selectedDateStart).format("YYYY-MM-DDTHH:mm:ss"+TZone)
        toDate = moment(selectedDateEnd).format("YYYY-MM-DDTHH:mm:ss"+TZone)
    } else if (Number(range) === 16) {
        frmDate = configParam.DATE_ARR(Number(range), headPlant)
        toDate = moment(moment().subtract(1, 'month')).endOf('month').format("YYYY-MM-DDTHH:mm:ss"+TZone)
    } else if (Number(range) === 7) {
        frmDate = configParam.DATE_ARR(Number(range), headPlant)
        toDate = moment(moment().subtract(1, 'day')).endOf('day').format("YYYY-MM-DDTHH:mm:ss"+TZone)
    } else if (Number(range) === 21) {
        frmDate = configParam.DATE_ARR(Number(range), headPlant)
        toDate = configParam.DATE_ARR(23, headPlant)
    } else if (Number(range) === 20) {
        frmDate = configParam.DATE_ARR(Number(range), headPlant)
        toDate = configParam.DATE_ARR(22, headPlant)
    }
    else {
        frmDate = configParam.DATE_ARR(Number(range), headPlant)
        toDate = moment().format("YYYY-MM-DDTHH:mm:ss"+TZone)
    }
    return { frmDate, toDate }
}

const common = {
    getFromandToDate: getFromandToDate 

  };
export default common;
