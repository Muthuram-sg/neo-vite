import React from 'react';
import SolidGauge from 'components/Core/SolidGauge/SolidGauge';

function OEEChildDashboardFunction(props){    

    return (
     <SolidGauge isDryer={props.isDryer} machineAvailablity={props.machineAvailablity} Performance={props.Performance} Quality={props.Quality} />
    );
 
    // return( 
    //     <>
    //         <Chart
    //             height={280}
    //             options={{
    //                 grid: {
    //                     show: true,
    //                     padding: {
    //                         top: 0,
    //                         right: 0,
    //                         bottom: 0,
    //                         left: 0
    //                     },
    //                 },
    //                 colors: ['rgba(238, 14, 81, 0.3)', 'rgba(93, 231, 0, 0.3)', 'rgba(0, 205, 220, 0.3)'],
    //                 states: {
    //                     hover: {
    //                         filter: {
    //                             type: 'none',
    //                         }
    //                     },
    //                 },
    //                 plotOptions: {
    //                     radialBar: {
    //                         hollow: {
    //                             margin: 5,
    //                             size: "30%",
    //                         },
    //                         track: {
    //                             background: ['rgba(168, 168, 168, 1)', 'rgba(168, 168, 168, 1)', 'rgba(168, 168, 168, 1)'],
    //                             opacity:"15%"
    //                         },
    //                         dataLabels: {
    //                             showOn: "always",
    //                             name: {
    //                                 show: false
    //                             },
    //                             value: {
    //                                 color: maintheme.colorPalette.primary,
    //                                 fontFamily: "Inter",
    //                                 fontSize: "28px",
    //                                 fontWeight: 600,
    //                                 show: true,
    //                                 formatter: function (val) {
    //                                     return parseInt(val) + '%'
    //                                 }
    //                             },
    //                             total: {
    //                                 show: true,
    //                                 label: 'OEE',
    //                                 formatter: function (w) {
    //                                     if(props.isDryer){
    //                                         return parseInt(((w.globals.seriesTotals[0] + w.globals.seriesTotals[1] + w.globals.seriesTotals[2]) / 3)) + "%"
    //                                     }else{
    //                                         return parseInt((w.globals.seriesTotals[0] * w.globals.seriesTotals[1] * w.globals.seriesTotals[2]) / 10000) + "%"
    //                                     }
                                        
    //                                 }
    //                             }
    //                         }
    //                     }
    //                 },
    //                 fill: {
    //                     type: "gradient",
    //                     gradient: {
    //                       shade: "dark",
    //                       type: "vertical",
    //                       gradientToColors: ["#EE0E51","#C6FF92","#00CDDC"],
    //                       stops: [0,100 ]
    //                     }
    //                   },
                     
    //                 labels: ['Availability', 'Efficiency', 'Quality'],
    //                 stroke: {
    //                     lineCap: "round",
    //                 }
                    
    //             }}
    //             series={props.OEE !== undefined ? [props.machineAvailablity * 100, props.Performance * 100, props.Quality * 100] : [10, 50, 0]}
    //             type="radialBar"
    //         /> 
    //     </> 
    // )
}
function reRender(prevprops, nextprops) { 
    return false; // do not rerender when sidenav is expanding
  }
const OEEChildDashboard = React.memo(OEEChildDashboardFunction,reRender);
export default OEEChildDashboard;


// background: linear-gradient(180deg, #EE0E51 0%, #FF9DB2 100%);

// background: linear-gradient(21.97deg, #C6FF92 11.52%, #5DE700 84.66%);

// background: linear-gradient(180deg, #00CDDC 0%, #A2FCFF 100%);


