import React,{ useState  } from "react"
import DatePickerNDL from 'components/Core/DatepickerNDL';
import configParam from 'config'
import { useRecoilState } from "recoil";
import {selectedPlant
} from "recoilStore/atoms";
import moment from "moment";


export default function  EditPicker(props){
    const [headPlant] = useRecoilState(selectedPlant)
    const dateRange = changeCurrentDate(props.selectedRange)
    const [fromDate, setfromDate] = useState(dateRange[0])
    const [toDate, settoDate] = useState(dateRange[1])




    

    function changeCurrentDate(e){
      console.log('showtextvalue',e)
      let startrange;
      let endrange;
      startrange = configParam.DATE_ARR(e, headPlant); 
       if(e === 7){
          endrange = moment(moment().subtract(1, 'day')).endOf('day').format("YYYY-MM-DDTHH:mm:ssZ");
      }else if (e === 20) {
        endrange = configParam.DATE_ARR(22, headPlant)
      } else if (e === 21) {
        endrange = configParam.DATE_ARR(23, headPlant)
      } else if (e === 16) {
        endrange =  moment().subtract(1, 'month').endOf('month').endOf('day').format("YYYY-MM-DDTHH:mm:ssZ");
      } else { 
        endrange = moment().format("YYYY-MM-DDTHH:mm:ssZ")
      }
    
      console.log(startrange,endrange,"startrange,endrange")
      if(startrange && endrange){
          return [new Date(startrange),new Date(endrange)]
      }else{
          return []
      }
    }

    
    return(
        <DatePickerNDL
               id="custom-range-dashboard"
              //  ref={datepickerRef}
               onChange={(dates,range) => {
                 const [start, end] = dates; 
                 setfromDate(start);
                 settoDate(end);
                 props.RangeGeter(range)
               }} 
               startDate={fromDate}
               endDate={toDate}
               disabled={true}
               dateFormat="dd/MM/yyyy HH:mm:ss"
               selectsRange={true}
               timeFormat="HH:mm:ss"
               customRange={true}
              //  width={dashboardDefaultID === 'cdf940e6-9445-4d3d-a175-22caa159d7a0' ? '' : '386px'}
               defaultDate={props.selectedRange} 
               Dropdowndefine={"EditSettings"}
               dynamic={true}
              //  queryDate={props.range}
               
       />
    )
}