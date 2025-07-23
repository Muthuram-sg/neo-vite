import React from "react";
import ProductNew from 'components/layouts/Settings/Production/Product/index';
import ReasonsNew from 'components/layouts/Settings/Production/Reasons/index';
import Qualitynew from "components/layouts/Settings/Production/Quality/index";
import Execution from "components/layouts/Settings/Production/Execution/index";
import WorkOrder from "components/layouts/Settings/Production/WorkOrder/index";
import SteelData from "components/layouts/Settings/Production/Steel/index";

export const SubMenuList =[
    {
        title:'Products',
        content:<ProductNew />,
        tabValue:0,
        id:"3f55f3f6-cfba-4e83-bdf7-9b508b0abd0e"
    },
    {
        title:'Work Order',
        content:<WorkOrder/>,
        tabValue:1,
        id:"a61afc10-e341-4dbf-ad10-10b58c6a19f7"
    },
    {
        title:'Execution',
        content:<Execution/>,
        tabValue:2,
        id:"77ca2888-5afd-4347-874c-7125d2deee7e"
    },
    {
        title:"Reasons",
        content:<ReasonsNew/>,
        tabValue:3,
        id:"37d7aeef-ab6f-4358-9bb6-14ed9ec14d4d"
    },
    // {
    //     title:"Quality",
    //     content:<Qualitynew/>,
    //     tabValue:4
    // },
    {
        title:"Steel Data",
        content:<SteelData/>,
        tabValue:4,
        id:"c3eb619f-37ef-4f9b-9b13-e6b2c13bbe70"
    }

]
