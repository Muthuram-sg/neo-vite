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
import Left from 'assets/neo_icons/Arrows/boxed_left.svg?react';
import Right from 'assets/neo_icons/Arrows/boxed_right.svg?react';
import EnhancedTable from "components/Table/Table";

var lastZoom = null


const TrendsChartGrouped = forwardRef((props) => {

    const theme = useTheme();
    const [curTheme] = useRecoilState(themeMode);
    const [selectedParameter] = useRecoilState(onlineTrendsParam);
    const [yannotations, setyannotations] = useState( props.annotations)
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
                data: e.data.filter(z => z.y !== null) 
              }))
            });
          } else {
            setyData({
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
            });
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

    function getXaxisSplittingPoint(){
      let splitAnnotation = [
        {
          x: props.forecastAnnotation,
          strokeDashArray: 4,
          borderColor: "#d4526e",
        },
      ];
      return forecastconfig ? splitAnnotation: [];
    }

    return (
        <React.Fragment>
            {yData.charttype === "timeseries" ?
                    <Chart

                        height={getChartHeight()}


                        options={{
                            annotations: {
                                position: 'front',
                                xaxis: getXaxisSplittingPoint(),
                                yaxis: props.details ? props.annotations : yannotations
                            },
                            theme: {
                                mode: curTheme
                            },
                            legend: {
                                // show: props?.showLegend || false,
                                show: true,
                                showForSingleSeries: true,
                            },

                            chart: {
                                id: props?.index ? `trendChart-${props?.index}` : 'trendChart',
                                background: curTheme === 'dark' ? '#191919'  : '#f9f9f9',
                                
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
                                    offsetY: 3,

                                    style: {
                                        fontFamily:"Geist Mono Variable",
                                        zIndex: 0
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
                                    legendClick: function(chartContext, seriesIndex, config) {
                                        let key = config.globals.seriesNames[seriesIndex].split('(')?.[1].replace(')', '')
                                        console.log(key, props.annotations)
                                        let hi = props.annotations.filter((z) => z.key === key)
                                        setyannotations(hi)
                                        
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
                                                    fillColor: '#000000',
                                                    strokeColor: '#000000',
                                                    size: 5,
                                                    shape: "circle"
                                                }]
                                            }
                                        })
                                      }
                                    },

                                   

                                },


                            },
                            dataLabels: {
                                enabled: false

                            },
                            markers: {
                                size: markerMode ? 4 : 0,
                                style: 'hollow',
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
                                  gradientToColors: ["#00c6ff"], // ending color
                                  inverseColors: false,
                                  opacityFrom: 0.8, // starting opacity
                                  opacityTo: 0.1,  // ending opacity
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
                                                    show: true
                                                },

                                                chart: {
                                                    id: "trendChart" + val.name,
                                                    background: curTheme === 'dark' ? '#191919'  : '#f9f9f9',
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
                                                            color: "black",
                                                            fontSize: '12px',
                                                            fontFamily: 'Inter',
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
                                                            color: "black",
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
export default TrendsChartGrouped;