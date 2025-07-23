import React, { useState, useEffect } from "react";
import NewDatepicker from "components/Core/DatepickerNDL"
import { useRecoilState } from 'recoil';
import {
    AlarmDaterange, customdates
} from "recoilStore/atoms";   



function AlarmsDateRange(props) { 
    const [rangeValue, setbtGroupValue] = useRecoilState(AlarmDaterange);
    const [Customdatesval] = useRecoilState(customdates);
    const [selectedDateStart, setSelectedDateStart] = useState(Customdatesval.StartDate);
    const [selectedDateEnd, setSelectedDateEnd] = useState(Customdatesval.EndDate);
    const [,setFlag] = useState(true)

console.log(props.range,rangeValue,"range")
    useEffect(() => {
        if(props.range){
            setFlag(false)
            setbtGroupValue(17)
        }else{
            setbtGroupValue(props.btnValue)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.btnValue])
    
  


    const tosetstartdate = (date) => {
        setSelectedDateStart(date); 
    };
    const tosetenddate = (date) => {
        setSelectedDateEnd(date); 
    };

    return (
        
                <NewDatepicker
                    id="custom-range-3"
                    onChange={(dates) => {
                        const [start, end] = dates;
                        tosetstartdate(start);
                        tosetenddate(end);
                    }}
                    startDate={selectedDateStart}
                    endDate={selectedDateEnd}
                    disabled={true}
                    dateFormat="dd MMM yyyy "
                    selectsRange={true}
                    timeFormat="HH:mm:ss"
                    customRange={true}
                    Dropdowndefine={props.Dropdowndefine}
                    defaultDate={rangeValue}
                    maxDays={180}
                    
                    queryDate={props.range}
                />

 
            )
}

export default AlarmsDateRange;