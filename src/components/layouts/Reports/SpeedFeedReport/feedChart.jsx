import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import moment from "moment";
import { useRecoilState } from "recoil";
import { themeMode } from "recoilStore/atoms";
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import { getDurationInMinutes } from "./constant";

var lastZoom1 = null; 
const FeedChart = ({ ...props }) => {
  let Statusdata = props.Statusdata;
  let dates = Object.keys(Statusdata);

  const [currTheme] = useRecoilState(themeMode);

  return (
    <>
      {dates.map((date, index) => {
        return (
        <Chart
          // height={index === dates.length-1 ? 105 : 65}
          height={index === dates.length-1 ? 105 : 85}
          key={`Chart_${index+1}`}
          width={"100%"}
          options={{
            theme: {
              mode: currTheme,
            },
            chart: {
              id: "asset_status_data",
              background: "0",
              type: "rangeBar",
              sparkline: {
                enabled: false,
              },
              events: {
                zoomed: (_, value) => {
                    lastZoom1 = [value.xaxis.min, value.xaxis.max];
                },
                beforeZoom: function(chartContext, opts) {
                                                
                    return {
                      xaxis: {
                        min: opts.xaxis.min,
                        max: opts.xaxis.max
                      }
                    } 
                },
                beforeResetZoom: function(chartContext, opts) {
                    lastZoom1=null;
                    return {
                      xaxis: {
                        min: new Date(Statusdata[date]?.[0]?.start_of_day).getTime(),
                        max: new Date(Statusdata[date]?.[0]?.end_of_day).getTime()
                      }
                    } 
                } 
              },
              
              toolbar: {
                // show: index === 0 ? true : false,
                show: props.hideToolBar,
                
                tools: {
                  download: false,
                  selection: false,
                  zoom: true,
                  zoomin: true,
                  zoomout: true,
                  pan: true,
                  reset: true
                  // customIcons: []
                },
                offsetX: '100%',
                offsetY: 0
                
              },
           
              zoom: {
                enabled: true,
                autoScaleYaxis: false // Prevents automatic Y-axis zooming
              }
            },
            grid: {
              padding: {
                right: 0,
                left: 0,
              },
            },
            plotOptions: {
              bar: {
                horizontal: true,
                barHeight: "100%",
                rangeBarGroupRows: true,
              },
            },
            colors: [
              '#E5484D',
              "#30A46C",
              currTheme === 'light' ? "#A6A6A6" : "#CECECE",
              // currTheme === 'light' ? '#ffffff00' : '#ffffff00',

            ],
            fill: {
              type: [
                "solid",
                "pattern",
                "solid",
              ],
              pattern: {
                style: "slantedLines",
                width: 4,
                height: 18,
                strokeWidth: 2,
              },
            },

            xaxis: {
              type: "datetime",
              labels: {
                // show: index === dates.length-1 ? true : false, // Hides the x-axis labels
                show: true,
                rotate: 0,
                datetimeUTC: false,
                format: "HH:mm",
                style: {
                    colors: currTheme === 'light' ? "#242424" : "#A6A6A6"
                },
              },
              axisTicks: {
                // show: index === dates.length-1 ? true : false, // Hides x-axis tick marks
                show: true
              },
              axisBorder: {
                show: index === dates.length-1 ? true : false, // Hides x-axis border
              },
              min: lastZoom1 ? lastZoom1[0] : new Date(Statusdata[date]?.[0]?.start_of_day).getTime(),
              max: lastZoom1 ? lastZoom1[1] : new Date(Statusdata[date]?.[0]?.end_of_day).getTime()
            },
            legend: {
              show: index === dates.length-1 ? true : false,
              onItemClick: {
                  toggleDataSeries: false
              },
              onItemHover: {
                  highlightDataSeries: false
              },
            },
            tooltip: {
                enabled: props.hideToolBar,
                marker:{
                  show: true
                },
                intersect: false,
                // shared: true,
                followCursor: true,
                custom: function({ series, seriesIndex, dataPointIndex, w, ...optios }) {
                  // console.log("+++", optios)
                    // console.log("+++++++++++++++++OPTT", w.globals.seriesRange, moment(optios.y1).format("HH:mm:ss"))
                    // let y = options.w.config.series[options.seriesIndex].data[options.dataPointIndex].y
                    const data = w.globals.seriesRange[seriesIndex][dataPointIndex];
                    // <span style="font-weight: bold;">Value: </span>
                    // <span>${options.w.config.series[options.seriesIndex].data[options.dataPointIndex]?.z || '-'}</span>
                    const tooltipContent = `
                        <div class="arrow_box" style="background-color: #fff; border: 1px solid #ccc; padding: 10px; border-radius: 5px;">
                            <span style="font-weight: bold;">Start Time: </span>
                            <span>${moment(optios.y1).format("HH:mm:ss")}</span><br/>
                            <span style="font-weight: bold;">End Time: </span>
                            <span>${moment(optios.y2).format("HH:mm:ss")}</span><br/>
                            <span style="font-weight: bold;">Duration: </span>
                            <span>${getDurationInMinutes(optios.y1, optios.y2)}</span><br/>
                            

                        </div>
                    `;
                    return tooltipContent;
            
                }
            },
          }}
          series={Statusdata[date]}
          type="rangeBar"
        />
      )}
      )}
    </>
  );
};

export default FeedChart;
