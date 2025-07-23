// Filename - App.jsx

import React from "react";
import Charts from "components/layouts/Dashboards/Content/standard/EnergyDashboard/components/ChartJS/Chart"

const PriorityBreakDown = (props) => {

    const data = [
        {
            label:"Priority Breakdown",
            backgroundColor: props.data.map(val => val.color),
            data: props.data.map(val => val.data),
            barThickness: 80,
            dataseries: props.data
        }
       
    ];
    const name=props.data.map(val => val.name)
   
    const customtooltip = (context) => {
        return (context[0].label)
    }
   
    return (
        <div style={{width:"100%",height:"260px"}}>
        <Charts
        charttype={"Childbar"}
        yAxisTitle={"Tasks"}
        labels={name}
        data={data}
        isBar
        customtooltip={customtooltip}
    /></div>
    );
};

export default PriorityBreakDown;
