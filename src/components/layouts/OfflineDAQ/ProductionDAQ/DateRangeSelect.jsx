import React, { useState, useEffect } from "react";
import DatePickerNDL from 'components/Core/DatepickerNDL';
import { useRecoilState } from 'recoil';
import {
 productionDateRange,customdates
} from "recoilStore/atoms";

function DateRangeSlect() {
 const [rangeSelected] = useRecoilState(productionDateRange);
 const [Customdatesval] = useRecoilState(customdates);
 const [selectedDateStart, setSelectedDateStart] = useState(Customdatesval.StartDate);
 const [selectedDateEnd, setSelectedDateEnd] = useState(Customdatesval.EndDate);

    useEffect(() => {
    
        if (localStorage.getItem("productDateRange")) {
            if (isNaN(localStorage.getItem("productDateRange"))) {
                localStorage.setItem("productDateRange", 15)
            } else {
                localStorage.setItem("productDateRange", rangeSelected)
            } 
        } else {
            localStorage.setItem("productDateRange", 15)
        }
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
            dateFormat="dd-MM-yyyy"
            selectsRange={true}
            // timeFormat="HH:mm:ss"
            customRange={true}
            defaultDate={rangeSelected}
            Dropdowndefine='ProductionDateRange' 
            maxDays={90}

        />
    )
}

export default DateRangeSlect;