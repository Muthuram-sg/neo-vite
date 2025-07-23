import React, { useState, useEffect } from "react";
import DatePickerNDL from 'components/Core/DatepickerNDL';
import {useParams} from "react-router-dom"
import { useRecoilState } from 'recoil';
import {
    TaskRange,customdates
} from "recoilStore/atoms";



function DateRange() { 
   let {moduleName} = useParams()
   const paramsArray = moduleName ? moduleName.split('&') : []; 
    const queryParamss = {};
    paramsArray.forEach(param => {   
        const [key, value] = param.split('=');   
        queryParamss[key] = value;
    }); 
    console.log(paramsArray, queryParamss, "check"); 
    const range = queryParamss['range'];
    const [RangeParam,setRangeParam] = useState(range)
    const [rangeSelected, setRangeSelected] = useRecoilState(TaskRange);
    const [Customdatesval] = useRecoilState(customdates);
    const [selectedDateStart, setSelectedDateStart] = useState(Customdatesval.StartDate);
    const [selectedDateEnd, setSelectedDateEnd] = useState(Customdatesval.EndDate);
      
    useEffect(() => {
        if (moduleName) {
            if (moduleName.includes('&') || moduleName.includes('=')) {
                
                if (range) {
                    setRangeParam(range)
                    setRangeSelected(17);
                }
            } else {
                setRangeSelected(26);
            }
        } else {
            setRangeSelected(26);
        }
    
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    

    return (

        <DatePickerNDL
            id="custom-range-dashboard"
            onChange={(dates) => {
                const [start, end] = dates;
                setSelectedDateStart(start);
                setSelectedDateEnd(end);
            }}
            startDate={selectedDateStart}
            endDate={selectedDateEnd}
            disabled={true}
            dateFormat="dd MMM yyyy "
            selectsRange={true}
            timeFormat="HH:mm:ss"
            customRange={true}
            defaultDate={rangeSelected}
            Dropdowndefine='Task' 
            maxDays={180}
            queryDate={RangeParam}

        />
    )
}

export default DateRange;