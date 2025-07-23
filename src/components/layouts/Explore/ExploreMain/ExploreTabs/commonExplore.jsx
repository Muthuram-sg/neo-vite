import moment from "moment";
import configParam from "config";



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

const commonexplore = {
    getFromandToDate: getFromandToDate 

  };
export default commonexplore;
