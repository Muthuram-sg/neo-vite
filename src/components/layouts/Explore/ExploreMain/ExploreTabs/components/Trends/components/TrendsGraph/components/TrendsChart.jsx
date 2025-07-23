/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, forwardRef  } from "react";
import useTheme from "TailwindTheme";
import Chart from "react-apexcharts";
import { useRecoilState, useRecoilValue } from "recoil";
import moment from 'moment';
import ApexCharts from 'apexcharts';
import { useAuth } from "components/Context";
import CustomTextField from "components/Core/InputFieldNDL";
import {
    themeMode,
    onlineTrendsParam,
    TrendschartMode,
    trendsMarkerMode,
    trendLegendView,
    GapMode,
    currentPage,
    alertchartenable,
    dataForecastenable
} from "recoilStore/atoms";
import Downloads from 'assets/neo_icons/Menu/scada/download.png';  
import Left from 'assets/neo_icons/Arrows/boxed_left.svg?react';
import Right from 'assets/neo_icons/Arrows/boxed_right.svg?react';
import EnhancedTable from "components/Table/Table";

var lastZoom = null


const TrendsChart = forwardRef((props, ref) => {

    const theme = useTheme();
    const [curTheme] = useRecoilState(themeMode);
    const [selectedParameter] = useRecoilState(onlineTrendsParam);
    const [charttype] = useRecoilState(TrendschartMode)
    const [markerMode] = useRecoilState(trendsMarkerMode)
    const [gapstatus] = useRecoilState(GapMode);
    const [currpage] = useRecoilState(currentPage)
    const legendView = useRecoilValue(trendLegendView);
    const [alertconfig] = useRecoilState(alertchartenable);
    const forecastconfig = useRecoilValue(dataForecastenable)
    const { HF } = useAuth();
    const [yData, setyData] = useState([])
    let janOffset = moment({ M: 0, d: 1 }).utcOffset(); //checking for Daylight offset
    let julOffset = moment({ M: 6, d: 1 }).utcOffset(); //checking for Daylight offset
    let stdOffset = Math.min(janOffset, julOffset);// Then we can make a Moment object with the current time at that fixed offset 
    
    useEffect(() => {
        if (props.yData && Array.isArray(props.yData.data)) {
          if (!gapstatus && currpage === "explore") {
            setyData({
              ...props.yData,
              data: props.yData.data.map(e => ({
                ...e,
                data: Array.from(new Set(e.data.filter(z => z.y !== null).map(item => item.x))).map(id => e.data.filter(z => z.y !== null).find(item => item.x === id))  
              }))
            });
          } else {
            // alert("SS")
            let temp_ydata = {
                ...props.yData,
                data: props.yData.data.map(e => ({
                  ...e,
                  data: e.data.map(z => ({
                    ...z,
                    peaks: z.peaks ? z.peaks.map(p => {
                      let updatedPeak = { ...p };
                      for (let key in updatedPeak) {
                        if (updatedPeak[key] === "NaN") {
                          updatedPeak[key] = "-";
                        }
                      }
                      return updatedPeak;
                    }) : z.peaks
                  }))
                }))
              }
            //   console.clear()
            //   console.log(temp_ydata.data)
              let temp_2 = {
                ...temp_ydata,
                data: temp_ydata.data.map(e => ({
                    ...e,
                    data: Array.from(new Set(e.data.filter(z => z.y !== null).map(item => item.x))).map(id => e.data.filter(z => z.y !== null).find(item => item.x === id))  
                  }))
              }
            //   console.log(temp_2.data)
            setyData(temp_2);
          }
        }
      }, [props.yData, gapstatus, currpage]);
      

    const addverticalannotations = (x, y, val) => {
        ApexCharts.exec('trendChart' + val.name, 'clearAnnotations')
        let harmonics = []
        for (let i = 1; i < 11; i++) {
            harmonics.push({
                id: val.name.replace(/[ ()\/]/g, '-')+ '-' + val.id + '-',
                x: i * x,
                borderColor: '#FF9500',
                seriesIndex: 0,
                label: {
                    borderColor: '#FF9500',
                    style: {
                        color: '#fff',
                        background: '#FF9500',
                    },
                    text: i + 'x'
                },
            })
        }

        harmonics.forEach(element => {
            ApexCharts.exec('trendChart' + val.name, 'addXaxisAnnotation', element)
        });

    }

    function getYAxisTitle(selectedParameters) {
        if (props.yaxistitle)
            return props.yaxistitle
        else
            return selectedParameters ? selectedParameters.title : ""
    }



    function hideSeriesEvent() {
        if (legendView && legendView.length > 0) {
            legendView.forEach((val1) => {
                const metric = val1.split('-');
                props.hideSeriess(metric[2] + ' (' + metric[1] + ')')
            })
        }
    }

    function getChartHeight() {
        if(props.height){
            const viewportHeight = window.innerHeight;
            return props.height > 100 ? `${props.height}px` : `${(props.height / 100) * viewportHeight}px`;
        } else {
            return "100%";
        }
    }

    function getChartType() {
        return charttype ? 'area' : 'line'
    }

    useEffect(() => {

   }, [charttype]);

    function getXaxisSplittingPoint(){
      let splitAnnotation = [
        {
          x: props.forecastAnnotation,
          strokeDashArray: 4,
          borderColor: "#d4526e",
        },
      ];
    //   console.log(forecastconfig,yData.data)
      return forecastconfig ? splitAnnotation: [];
    }

    function exportAllDataCSV(chart,w,e) {
        const series = chart.w.globals.initialSeries;
        const labels = chart.w.globals.labels;
        
        let csv = 'Time,' + series.map(s => s.name).join(',') + '\n';
    //   console.log(csv,series,labels,"exportAllDataCSV",w,e)
        labels.forEach((label, i) => {
          const row = [moment(label).format('Do MMM YYYY HH:mm:ss:SSS')];
          w.globals.series.forEach(s => {
            row.push(s[i] !== undefined ? s[i] : '');
          });
          csv += row.join(',') + '\n';
        });
      
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'TrendChart.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    return (
        <React.Fragment>
            {yData.charttype === "timeseries" ?
                    <Chart

                        height={getChartHeight()}
                        options={{
                            annotations: {
                                position: 'front',
                                xaxis: getXaxisSplittingPoint()
                            },
                            theme: {
                                mode: curTheme
                            },
                            legend: {
                                show: props.Legend ? true : false
                            },

                            chart: {
                                id: props.id ? props.id : 'trendChart',
                                background: curTheme === 'dark' ? '#111111'  : '#f9f9f9',
                                stacked: false,
                                type: 'rangeArea',
                                animations: {
                                    enabled: false
                                },
                                zoom: {
                                    type: 'xy',
                                    enabled: true,
                                    autoScaleYaxis: true
                                },
                                toolbar: {
                                    show: true,
                                    autoSelected: 'zoom',
                                    offsetY: -3,

                                    style: {
                                        fontFamily:"Geist Mono Variable",
                                        zIndex: 0
                                    },
                                    tools: {
                                        download: true,
                                        selection: true,
                                        customIcons: [
                                            {
                                              icon: `<img src=${Downloads} width="20">`,
                                              title: 'Download CSV',
                                              class: 'custom-download-csv',
                                              click: function (chart, options, e) {
                                                exportAllDataCSV(chart,options,e);
                                              }
                                            }
                                          ]
                                      },
                                      
                                    export: {
                                        csv: {
                                            dateFormatter(timestamp) {
                                                return props.merged ? undefined : moment(new Date(timestamp)).utcOffset(stdOffset).format('Do MMM YYYY ' + HF.HMSS)
                                            },
                                            filename: props.yaxistitle ? props.yaxistitle : undefined,
                                            headerCategory: props.merged ? 'Frequency' : 'Time',
                                        }
                                    }


                                },

                                events: {
                                    zoomed: (_, value) => {

                                        lastZoom = [value.xaxis.min, value.xaxis.max]

                                    },
                                    dataPointMouseEnter: function (event) {
                                      if(!forecastconfig)
                                        event.path[0].style.cursor = "pointer";
                                    },
                                    markerClick: function (event, chartContext, { seriesIndex, dataPointIndex, config }) {
                                      if(!forecastconfig){
                                        let xcoord, ycoord, markedinstrument, markedmetric
                                        xcoord = yData.data[seriesIndex].data[dataPointIndex].x
                                        ycoord = yData.data[seriesIndex].data[dataPointIndex].y
                                        markedinstrument = yData.data[seriesIndex].id
                                        markedmetric = yData.data[seriesIndex].name
                                        props.setcoord(xcoord, ycoord, markedinstrument, markedmetric)
                                        ApexCharts.exec('trendChart', "updateOptions", {
                                            markers: {
                                                discrete: [{
                                                    seriesIndex: seriesIndex,
                                                    dataPointIndex: dataPointIndex,
                                                    fillColor: curTheme === 'dark' ? '#000000' : '#FFFFFF',
                                                    strokeColor: curTheme === 'dark' ? '#000000' : '#FFFFFF',
                                                    size: 5,
                                                    shape: "circle"
                                                }]
                                            }
                                        })
                                      }
                                    }

                                },


                            },
                            dataLabels: {
                                enabled: false

                            },
                            markers: {
                                size: markerMode ? 4 : 0,
                                style: 'hollow'
                            },
                            grid: {
                                show: true,
                                borderColor: curTheme === 'dark' ? '#333333' : '#E6E6E6',
                                strokeDashArray: 2,
                                xaxis: {
                                    lines: {
                                        show: false,
                                    }
                                },
                            },
                            xaxis: {
                                type: yData.charttype === "timeseries" && !props.merged ? 'datetime' : undefined,
                                tickAmount: 10,
                                tooltip: {
                                    enabled: false,
                                },
                                labels:
                                {
                                    datetimeUTC: false,
                                    rotate: 0,
                                    style: {
                                        colors: theme.colorPalette.primary
                                    },
                                    format: yData.charttype === "timeseries" && !props.merged ? 'dd MMM ' + HF.HM : undefined,

                                },
                                min: lastZoom ? lastZoom[0] : undefined,
                                max: lastZoom ? lastZoom[1] : undefined

                            },
                            yaxis: {
                                title: {
                                    text: getYAxisTitle(selectedParameter)

                                },
                                labels: {
                                    offsetY: 0,
                                    showDuplicates: false,
                                    style: {
                                        colors: [theme.colorPalette.primary]
                                    },
                                    formatter:  function (value) {
                                        if (yData.data === undefined || yData.data.length === 0)
                                            return 'No data'
                                        else
                                            return forecastconfig ? value: value && value.toFixed(4)
                                      }
                                },
                                min: props.min,
                                max: props.max


                            },
                            tooltip: {
                                shared: true,
                                enabled: true,
                                x: {
                                    formatter: (val) => {

                                        return moment(val).utcOffset(stdOffset).format('DD MMM ' + HF.HM)
                                    }
                                },

                            },
                            stroke: {
                                // width: 3,
                                width: forecastconfig ? [0, 2] : 3,
                                show: !charttype,
                                curve: alertconfig ? ['straight','stepline','stepline']  : charttype ? 'smooth' : 'straight'
                            },
                            fill: {
                              opacity: forecastconfig ? [0.24, 1] : 1,
                              type: charttype ? 'gradient' : 'solid',
                              gradient: {
                                  shade: "light",
                                  type: "vertical", // can be "vertical" or "horizontal"
                                  shadeIntensity: 0.5,
                                  gradientToColors: ["#CECECE"], // ending color
                                  inverseColors: false,
                                  opacityFrom: 1, // starting opacity
                                  opacityTo: 0.5,  // ending opacity
                                  stops: [0, 90, 100], // color stop percentages
                                },
                            },
                            forecastDataPoints: {
                              count: forecastconfig ? yData.data[0].data.length : 0, //number of daya in forecast api
                            },
                        }}
                        series={yData.data}
                        type={forecastconfig ? "rangeArea" : getChartType()}
                    />
                :
                <div style={{ display: "block", height: props.height ? props.height : "100%" }}>
                    {yData.data && yData.data.map((val, index) => {
                        let yAxisTitleText;
                        if (props.yaxistitle) {
                            yAxisTitleText = val.axis + props.yaxistitle;
                        } else {
                            yAxisTitleText = val.name.includes("time_waveform") ? "mm/sq.sec" : "mm/s";
                        }
                        return (
                            <div key={index+1} style={{ height: props.height ? props.height : "550px",marginBottom:yData.data.length - 1 !== index ? "40px" : undefined }}>
                                {!props.disableMeter &&
                                    <div style={{ float: "right", display: "flex", position: "relative", zIndex: 2, marginRight: "10px" }}>
                                        <Left style={{ cursor: 'pointer' }} id={'moveleft-' + index}
                                            onClick={() => {
                                                if (yData.data[index].selectedIndex !== 0) {
                                                    let tempobj = { ...yData }
                                                    tempobj.data[index].selectedIndex = tempobj.data[index].selectedIndex - 1
                                                    setyData(tempobj)
                                                }
                                            }} />
                                        <CustomTextField
                                            id={"input" + index}
                                            type="text"
                                            value={moment(yData.data[index].data[yData.data[index].selectedIndex].time).utcOffset(stdOffset).format("DD-MM-YYYY hh:mm:ss a")}
                                            disabled={true}
                                        />
                                        <Right style={{ cursor: 'pointer' }} id={'moveright-' + index}
                                            onClick={() => {
                                                if (yData.data[index].selectedIndex !== yData.data[index].data.length - 1) {
                                                    let tempobj = { ...yData }
                                                    tempobj.data[index].selectedIndex = tempobj.data[index].selectedIndex + 1
                                                    setyData(tempobj)

                                                }
                                            }
                                            } />
                                    </div>
                                }
                                <div className="flex p-4">
                                    <div style={{ width: (props.showTable || props.showTable === 'show') ? "60%" : "100%", marginTop:"16px" }}>
                                        <Chart
                                            height={props.height ? props.height : "100%"}
                                            options={{
                                                annotations: {
                                                    position: 'front'
                                                },
                                                theme: {
                                                    mode: curTheme
                                                },
                                                legend: {
                                                    show: false
                                                },

                                                chart: {
                                                    id: "trendChart" + val.name,
                                                    background: curTheme === 'dark' ? '#111111'  : '#f9f9f9',
                                                    stacked: false,
                                                    type: charttype ? 'area' : 'line',
                                                    animations: {
                                                        enabled: false
                                                    },
                                                    zoom: {
                                                        type: 'x',
                                                        enabled: true,
                                                        autoScaleYaxis: false
                                                    },
                                                    toolbar: {
                                                        show: true,
                                                        autoSelected: 'zoom',
                                                        offsetY: 3,

                                                        style: {
                                                            zIndex: 0
                                                        },
                                                        export: {
                                                            csv: {
                                                                filename: props.yaxistitle ? props.yaxistitle : undefined,
                                                                headerCategory: 'frequency',
                                                            }
                                                        }


                                                    },

                                                    events: {
                                                        mounted: () => {
                                                            hideSeriesEvent()

                                                        },

                                                        updated: function (chartContext, config) {
                                                            ApexCharts.exec('trendChart' + val.name, 'clearAnnotations')
                                                        },
                                                        dataPointMouseEnter: function (event) {
                                                            event.path[0].style.cursor = "pointer";
                                                        },

                                                        markerClick: function (event, chartContext, { seriesIndex, dataPointIndex, config }) {
                                                            let xcoord, ycoord
                                                            if (!val.name.includes("time_waveform")) {
                                                                xcoord = val.data[val.selectedIndex].data[dataPointIndex].x
                                                                ycoord = val.data[val.selectedIndex].data[dataPointIndex].y
                                                                // console.log(xcoord, ycoord, val, "xcoord, ycoord, val")

                                                                addverticalannotations(xcoord, ycoord, val)
                                                            }


                                                        }


                                                    },


                                                },
                                                dataLabels: {
                                                    enabled: false
                                                },
                                                markers: {
                                                    size: markerMode ? 4 : 0,
                                                    style: 'hollow'
                                                },
                                                colors: ["#1A90FF", "#76CA66", "#FBC756", "#F35151"],
                                                grid: {
                                                    show: true,
                                                    borderColor: curTheme === 'dark' ? '#333333' : '#E6E6E6',
                                                    strokeDashArray: 2,
                                                    xaxis: {
                                                        lines: {
                                                            show: false,
                                                        }
                                                    },
                                                },
                                                xaxis: {
                                                    title: {
                                                        text: val.name.includes("time_waveform") ? "Seconds(s)" : "Frequency(Hz)",
                                                        style: {
                                                            color:curTheme === 'dark' ?  '#f9f9f9' :'#202020' ,
                                                            fontSize: '12px',
                                                            fontFamily: 'Geist Variable',
                                                            fontWeight: 500,

                                                        },
                                                    },
                                                    tickAmount: 10,
                                                    tooltip: {
                                                        enabled: false,
                                                    },
                                                    min: props.xmin ? props.xmin : undefined

                                                },
                                                yaxis: {
                                                    title: {
                                                        text: yAxisTitleText,
                                                        style: {
                                                            color:curTheme === 'dark' ?  '#f9f9f9' :'#202020' ,
                                                            fontSize: '12px',
                                                            fontFamily: 'Geist Variable',
                                                            fontWeight: 500,

                                                        },

                                                    },
                                                    labels: {
                                                        offsetY: 0,
                                                        showDuplicates: false,
                                                        style: {
                                                            colors: [theme.colorPalette.primary]
                                                        },
                                                        formatter: (value) => { return value.toFixed(2) }
                                                    },
                                                    max: function (max) {
                                                        return max + 0.5
                                                    },
                                                    min: props.ymin ? props.ymin : undefined


                                                },
                                                tooltip: {
                                                    shared: true,
                                                    enabled: true,

                                                },
                                                stroke: {
                                                    width: 3,
                                                    show: !charttype,
                                                    curve: charttype ? 'smooth' : 'straight'
                                                },

                                            }}
                                            series={[
                                                val.data[val.selectedIndex]
                                            ]}
                                            type={getChartType()}
                                        />
                                    </div>
                                    {(props.showTable || props.showTable === 'show') &&
                                        <div style={{ width: "40%", padding:"16px" }}>
                                            <EnhancedTable
                                                headCells={props.headCells}
                                                data={val.data[val.selectedIndex].peaks}
                                                hidePagination
                                                rawdata={val.data[val.selectedIndex].peaks}
                                            />
                                        </div>
                                    }
                                </div>
                            </div>
                        )
                    })
                    }
                </div>

            }
        </React.Fragment>


    );
})
export default TrendsChart;