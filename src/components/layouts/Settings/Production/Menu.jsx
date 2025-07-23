import React from "react";
import ProductNew from 'components/layouts/Settings/Production/Product/index';
import ReasonsNew from 'components/layouts/Settings/Production/Reasons/index';
import Calendernew from 'components/layouts/Settings/Production/ShiftCalender/index'; 
import TimeSlot from 'components/layouts/Settings/Production/TimeSlot/index'; 
import Qualitynew from "components/layouts/Settings/Production/Quality/index";
import Execution from "components/layouts/Settings/Production/Execution/index";
import WorkOrder from "components/layouts/Settings/Production/WorkOrder/index";
import SteelData from "components/layouts/Settings/Production/Steel/index";

export const MenuList =[
    {
        title:'Products',
        content:<ProductNew />
    },
    {
        title:'Work Order',
        content:<WorkOrder/>
    },
    {
        title:'Execution',
        content:<Execution/>
    },
    {
        title:"Operationcalendar",
        content:<Calendernew/>
    },
    {
        title:"Time Slot",
        content:<TimeSlot/>
    },
    {
        title:"Reasons",
        content:<ReasonsNew/>
    },
    {
        title:"Quality",
        content:<Qualitynew/>
    },
    {
        title:"Steel Data",
        content:<SteelData/>
    }

]
