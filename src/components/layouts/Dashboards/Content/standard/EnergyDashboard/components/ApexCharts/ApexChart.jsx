import React from "react";
import Chart from "react-apexcharts";

export default function Apexchart(props) {
// console.log(props.series,"props.seriesprops.series",props.categories)
    return (

        <React.Fragment>
            <Chart
                height={props.height}
                options={{
                    theme: {
                        mode: props.theme
                    },
                    chart: {
                        id: props.chartid,
                        type: props.type,
                        stacked: true,
                        background: '0',
                        zoom: {
                            type: 'xy',
                            enabled: true,
                            autoScaleYaxis: false
                        },
                        toolbar: {
                            show: true,
                            autoSelected: 'zoom'
                        },
                        events: {

                            dataPointSelection: (event, chartContext, config) => {
                                props.dataPointSelection(event, chartContext, config)

                            }
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
                    plotOptions: {
                        bar: {
                            distributed: props.distributed,
                            horizontal: false
                        },
                    },

                    grid: {
                        borderColor: props.theme === 'dark' ? '#333333' : '#E6E6E6',
                    },
                    colors: props.colors ? props.colors : ["#008ffb"],
                    xaxis: {
                        type: 'category',
                        categories: props.categories,
                        tickPlacement: 'on',
                        labels: {
                            show: true, // Ensure labels are visible
                          },
                    },
                    labels: props.categories,
                    yaxis: {
                        labels: {
                            formatter: (value) => { return value.toFixed(2) }
                        },
                        title: {
                            text: props.yAxisTitle
                        }
                    },
                    fill: {
                        type: "solid",
                        opacity: 1
                    },
                    tooltip: {

                        marker: {
                            show: false
                        },
                        x: {
                            formatter: props.xAxisTooltip && function (value, { series, seriesIndex, dataPointIndex, w }) {
                                return props.xAxisTooltip(value,series, seriesIndex, dataPointIndex, w )
                            }
                        },
                        y: {
                            
                            title: {
                                formatter: props.yAxixTooltipTitle && function (value, { series, seriesIndex, dataPointIndex, w }) { 
                                    // console.log(w.config.xaxis.categories[dataPointIndex],dataPointIndex,"dataPointIndexdataPointIndex",w.config.xaxis.categories,"w",w,"series",series)
                                    return props.yAxixTooltipTitle(value,series, seriesIndex, dataPointIndex, w)
                                }
                            },
                            formatter: props.yAxixTooltipTitle && function (value, { series, seriesIndex, dataPointIndex, w }) {
                                return props.yAxisTooltipValue(value,series, seriesIndex, dataPointIndex, w)
                            }
                            
                        }
                    },
                    legend:{
                        show : props.legend
                    }
                }}
               
                series={props.series}
                type={props.charttype}
            />
        </React.Fragment>




    )
}