import React from 'react';
import Chart from "react-apexcharts";
import { useRecoilState } from "recoil";
import {
    themeMode
} from "recoilStore/atoms";
import moment from 'moment';
import { useAuth } from "components/Context";

export default function DrillDownParts(props) {
    const { HF } = useAuth();
    const [curTheme] = useRecoilState(themeMode);
    return (
        <div style={{ maxWidth: '1360px', overflowX: 'auto' }}>
            <Chart
                height={195}
                width={props.data.length > 40 ? props.data.length * 30 : '100%'}
                options={{
                    theme: {
                        mode: curTheme
                    },
                    chart: {
                        background: '0',
                        type: 'bar',
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
                        },

                        events: {
                            dataPointSelection: () => {
                                return null;
                            }
                        }
                    },
                    tooltip: {
                        // shared: true,
                        enabled: true,
                        x: {
                            show: false
                        },
                        y: {
                            formatter: function (value) {
                                return value
                            },
                            title: {
                                formatter: function () {
                                    return "Seconds "
                                }
                            },
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
                    grid: {
                        show: true,
                        padding: {
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0
                        },
                        borderColor: curTheme === 'dark' ? '#333333' : '#E6E6E6',
                        strokeDashArray: 2,
                        xaxis: {
                            lines: {
                                show: false,
                            }
                        },
                    },
                    stroke: {
                        curve: ['straight', 'stepline']
                    },
                    xaxis: {
                        type: 'numeric',
                        tickAmount: 'dataPoints',
                        title: {
                            text: "Part Count"
                        },
                        tooltip: {
                            enabled: false,
                        },
                        labels: {
                            formatter: function (value) {
                                // Use Math.round() to round the float value to the nearest integer
                                return Math.round(value);
                            },
                            rotate: 0,
                            datetimeUTC: false,
                            style: {
                                colors: curTheme === 'light' ? "#242424" : "#A6A6A6"
                            },
                        }
                    },
                    annotations: {
                        position: 'front',
                        yaxis: [{
                            y: props.expectedCycleTime,
                            label: {
                                text: `Expected Cycle Time ${parseInt(props.expectedCycleTime)} Sec`,
                                position: 'start',
                                textAnchor: 'start',
                                style: {
                                    margin: {
                                        left: 30
                                    }
                                }
                            },
                            borderColor: '#FF0D00'
                        }]
                    },
                    yaxis: {
                        title: {
                            text: "Cy-Time(sec)"
                        }
                    }
                    // plotOptions: {
                    //     bar: {
                    //         columnWidth: '100px',
                    //     }
                    // }
                }
                }
                series={[{
                    name: "Parts per Hour",
                    data: props.data
                }]}
                type="bar"
            />
        </div>
    )
}