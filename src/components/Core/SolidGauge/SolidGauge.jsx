import React, { useState, useEffect, useRef } from 'react';


import Highcharts from 'highcharts/highcharts';
import highchartsMore from 'highcharts/highcharts-more';
import solidGauge from 'highcharts/modules/solid-gauge';
import HighchartsReact from 'highcharts-react-official';
import { useRecoilState } from 'recoil';
import {themeMode} from 'recoilStore/atoms';


highchartsMore(Highcharts);
solidGauge(Highcharts);


export default function SolidGauge(props){
    const chartRef = useRef(null);
    const [ishover, setishover] = useState(true);
    const [curTheme] = useRecoilState(themeMode);



    useEffect(() => {
        if (chartRef.current) {
          chartRef.current.chart.update(options);
          
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [props]);


      const OEEData = ((props.Quality + props.Performance +props.machineAvailablity) / 3) * 100
      let Dryer1 =  (isFinite(OEEData) || !isNaN(OEEData))  ?  (parseInt(OEEData) + "%") : 0 
      let Dryer2 = (props.status === "STOPPED" && props.actualParts === 0) ? "--" : (parseInt((((props.Quality*100)*(props.Performance*100)*(props.machineAvailablity*100)) / 10000)) + "%")
      let DryerOEE = props.isDryer ? Dryer1 : Dryer2


      const options = {
        chart: {
          type: 'solidgauge',
          backgroundColor: 'transparent', // or backgroundColor: 'none'
          height: '100%'
        },

    
        title: {
          text: 'Activity',
          style: {
            fontSize: '24px',
            display:"none"
          },
        },
    
        tooltip: {
          borderWidth: 0,
          backgroundColor: 'none',
          shadow: false,
          style: {
            fontSize: '10px',
          
          },
          valueSuffix: '%',
          pointFormat: '<span class="font-geist-mono  text-[16px]  text-Text-text-primary dark:text-Text-text-primary-dark text-center" style="color: {point.color}">{point.y}</span>',
          positioner: function (labelWidth) {
            return {
              x: (this.chart.chartWidth - labelWidth) / 2,
              y: this.chart.plotHeight / 2 
            };
          },
        },
    
        pane: {
          startAngle: 0,
          endAngle: 360,
          background: [
            {
              // Track for Move
              outerRadius: '100%',
              innerRadius: '80%',
              backgroundColor: new Highcharts.Color("#a8a8a8").setOpacity("15%").get(),
              borderWidth: "0px",
            },
            {
              // Track for Move
              outerRadius: '75%',
              innerRadius: '55%',
              backgroundColor: new Highcharts.Color("#a8a8a8").setOpacity("15%").get(),
              borderWidth: "0px",
            },
            {
              // Track for Move
              outerRadius: '50%',
              innerRadius: '30%',
              backgroundColor: new Highcharts.Color("#a8a8a8").setOpacity("15%").get(),
              borderWidth: "0px",
            },
          ],
        },
    
        yAxis: {
          min: 0,
          max: 100,
          lineWidth: 0,
          tickPositions: [],
          
        },
    
        plotOptions: {
          solidgauge: {
            dataLabels: {
              enabled:ishover,
              y: -12, // Adjust vertical position of the data label
              borderWidth: 0,
              useHTML: true,
              format: props.Quality && props.Performance && props.machineAvailablity ? ( `
                          
                          <span  class="font-geist-mono  text-[16px]  text-Text-text-secondary dark:text-Text-text-secondary-dark " >
                          ${DryerOEE}
                          </span>
                        `) :
                        ( `<div style="text-align:center">
                          <span   class="font-geist-mono  text-[16px]  text-Text-text-secondary dark:text-Text-text-secondary-dark ">
                          0%
                          </span>
                        `)
        
            },
            linecap: 'round',
            stickyTracking: false,
            rounded: true,
          },
        },
      
        series: [
          {
            // name: 'Move',
            name:"A",
            type: 'solidgauge',
            data: [
              {
                color: {
                  linearGradient: { x1: 0, y1: 1, x2: 1, y2: 0 },
                  stops: [
                    [0, new Highcharts.Color('#EE0E51').setOpacity("100%").get()], // Start color
                    [1, new Highcharts.Color('#FF9DB2').setOpacity("100%").get()], // End color (transparent)
                 
                  ],
                },
                
                radius: '100%',
                innerRadius: '80%',
                y:props.machineAvailablity ?  Number((props.machineAvailablity * 100).toFixed(0)) : 0,
              }              
            ],
          },
          {
            name:"P",
            type: 'solidgauge',
            data: [
             {
                color: {
                  linearGradient: { x1: 0, y1: 1, x2: 1, y2: 0 },
                  stops: [
                    [0,new Highcharts.Color('#5DE700').setOpacity("100%").get()], // Start color
                    [1, new Highcharts.Color('#C6FF92').setOpacity("100%").get()], // End color (transparent)
                 
                  ],
                },
                
                radius: '75%',
                innerRadius: '55%',
                y: props.Performance  ? Number((props.Performance * 100).toFixed(0)) : 0,
              },
            ]
          
          },
          {
          name:"Q",
          type: 'solidgauge',
          data:[
            {
                color: {
                  linearGradient: { x1: 0, y1: 1, x2: 1, y2: 0 },
                  stops: [
                    
                    [0,new Highcharts.Color('#00CDDC').setOpacity("100%").get()], // Start color
                    [1, new Highcharts.Color('#A2FCFF').setOpacity("100%").get()], // End color (transparent)
                 
                  ],
                },
                
                radius: '50%',
                innerRadius: '30%',
                y:props.Quality ?  Number((props.Quality * 100).toFixed(0)) : 0,
              },
          ]
        }
        ],
      };

      return(
        <div onMouseEnter={() => setishover(false)} onMouseLeave={() => setishover(true)} >
        <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />
      </div>
      )
}