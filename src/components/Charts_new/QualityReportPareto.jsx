import React from 'react';
import Chart from "react-apexcharts";
import { useRecoilState } from "recoil";
import { themeMode } from "recoilStore/atoms";
import moment from 'moment';
import { useAuth } from "components/Context";

export default function QualityReportPareto(props) {
    const { HF } = useAuth();
    const [curTheme] = useRecoilState(themeMode);
    return (
        <Chart
            height={250}
            options={{
                theme: {
                    mode: curTheme
                },
                legend: {
                    show: false,
                    position: 'right'
                },
                chart: {
                    id: "trendChart",
                    background: '0',
                    type: 'area',
                    stacked: false,
                    zoom: {
                        autoScaleYaxis: true
                    },
                    toolbar: {
                        autoSelected: 'zoom',
                        export: {
                            csv: {
                                dateFormatter(timestamp) {
                                    return moment(new Date(timestamp)).format('Do MMM YYYY '+HF.HMSS)
                                }
                            }
                        }

                    }
                },
                    stroke: {
                        width: [4, 0]
                    },
                    dataLabels: {
                        enabled: true,
                        enabledOnSeries: [0]
                    },
                    markers: {
                        size: 0,
                        style: 'hollow',
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
                        tickAmount: 10,
                        categories: props.paretoX,
                        title: {
                            // text: t('Range')
                        },
                        tooltip: {
                            enabled: false,
                        },
                        labels: {
                            rotate: 0,
                            style: {
                                colors: curTheme === 'light' ? "#242424" : "#A6A6A6"
                            },
                        }
                    },
                    yaxis: [{
                        opposite: true,
                        min: 0,
                        max: 100,
                        labels: {
                            formatter: (val) => { return `${val} %` }
                        }
                    }, {
                        title: {
                            text: ""
                        },
                        labels: {
                            formatter: (val) => parseFloat(val).toFixed(2),
                            offsetY: 0,
                            showDuplicates: false,
                            style: {
                                colors: curTheme === 'light' ? ["#242424"] : ["#A6A6A6"]
                            },
                        }
                    }
                    ]
                }
            }
            series={props.paretoY}
        />
    )
}