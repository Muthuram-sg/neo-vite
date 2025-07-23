import React from "react";
import ManageInstruments from 'components/layouts/ManageInstruments/index';
import PdM from 'components/layouts/FaultAnalysis/index';

export const PDMMenuList =[
    {
        title:'PdM',
        content:<PdM />,
        tabValue:0
    },
    {
        title:'Manage Instruments',
        content:<ManageInstruments />,
        tabValue:1
    }

]
