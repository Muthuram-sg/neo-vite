import React, { useState, useEffect } from "react";
import DatePickerNDL from 'components/Core/DatepickerNDL';
import { useRecoilState } from 'recoil';
import {
    faultRange,customdates
} from "recoilStore/atoms";
import moment from 'moment';


function DateRange(props) {
    console.log(props.range,"range val")
    const [rangeSelected,setrangeSelected] = useRecoilState(faultRange);
    const [Customdatesval] = useRecoilState(customdates);
    const [selectedDateStart, setSelectedDateStart] = useState(Customdatesval.StartDate);
    const [selectedDateEnd, setSelectedDateEnd] = useState(Customdatesval.EndDate);
    const [flag,setflag] = useState(true)
    useEffect(() => {
        if(props.range && flag){
            setrangeSelected(14)
            localStorage.setItem("faultRange", 14)
            setflag(false)
        }else{
            if (localStorage.getItem("faultRange")) {
                if (isNaN(localStorage.getItem("faultRange"))) {
                    localStorage.setItem("faultRange", 14)
                } else {
                    localStorage.setItem("faultRange", rangeSelected)
                } 
            } else {
                localStorage.setItem("faultRange", 14)
            }
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rangeSelected])

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
             dateFormat="dd/MM/yyyy HH:mm:ss"
            selectsRange={true}
            timeFormat="HH:mm:ss"
            customRange={true}
            defaultDate={rangeSelected}
            Dropdowndefine='FaultAnalysis' 
            maxDays={6}
            queryDate={props.range}
            maxDate={new Date()}
            setMax={true}
            minDate={moment().subtract(6, 'days').toDate()}
            setMin={true}
            pdmdates={true}
        />
    )
}

export default DateRange;