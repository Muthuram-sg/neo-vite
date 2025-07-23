/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';
import { useTranslation } from 'react-i18next';
import useGetTheme from 'TailwindTheme'; 
import Typography from "components/Core/Typography/TypographyNDL";

Chart.register(...registerables);
//Graphical card view of energy consumption daywise for the given range grouped by timeslots
function Overview(props) {
    const { t } = useTranslation();
    const [labels, setLabels] = useState({ labels: [], datasets: [] });
    const theme = useGetTheme();

    useEffect(() => {
        try {
           
            const timeSlotdata = [...props.data]
            const slots = [...new Set(timeSlotdata.map(val => val.data.map(s => s.name)).flat(1))]
            const days = [...new Set(timeSlotdata.map(val => val.data.map(s => s.day)).flat(1))]
            let slotdata = timeSlotdata.map(v => v.data).length > 0 ? timeSlotdata.map(p => p.data).flat(1) : []
            let date = []
            let datasets = []
            let equalisedslotdata = []
            slots.forEach(function (s) {
                days.forEach(function (d) {
                    let index = slotdata.findIndex(slot => slot.day === d && slot.name === s)
                    if (index >= 0) {
                        equalisedslotdata.push({
                            name: slotdata[index].name,
                            value: slotdata[index].value,
                            day: slotdata[index].day,
                        })
                    } else {
                        equalisedslotdata.push({
                            name: s,
                            value: '-',
                            day: d,
                        })
                    }
                })
            })

            if (equalisedslotdata.length > 0) {
                equalisedslotdata.forEach((x) => {
                    date.push(x.day)
                    const name = x.name;
                    const value = x.value ? x.value : 0;
                    const stdRate = x.stdRate;
                    const exist = datasets.findIndex(y => y.label === name)
                    if (exist >= 0) {
                        let existObj = { ...datasets[exist] };
                        let existData = [...existObj.data];
                        existData.push(value);
                        datasets[exist].data = existData;
                    } else {
                        let obj1 = {
                            label: name,
                            stdRate: stdRate && stdRate !== undefined ? stdRate : 0,
                            data: [value],
                            day: x.day,
                            backgroundColor: props.slots.filter(s => s.name === name)[0] ? props.slots.filter(s => s.name === name)[0].color : undefined
                        }
                        datasets.push(obj1);
                    }
                })
                date = [...new Set(date)];
                setLabels({ labels: date, datasets: datasets });
            } else {
                setLabels({ labels: [], datasets: [] });
            }
        } catch (error) {
            console.log("error at TimeSlot Overview")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props])

    return (

        <div style={{ height: "350px", marginTop: "20px" }}>
            {
                labels.labels.length > 0 ? (
                    <Bar
                        data={labels}
                        options={{
                            plugins: {
                                legend: {
                                    position: 'bottom'
                                },
                                tooltip: {
                                    callbacks: {
                                        title: function (context) {
                                            return context[0].dataset.label;
                                        }
                                        ,
                                        label: function (context) {
                                            return context.raw.toFixed(2) + " kwh"
                                        }
                                    }
                                },
                                datalabels: {
                                    display: props.datalabels ? props.datalabels : false, // Show data labels
                                    anchor: 'top',
                                    align: 'top',
                                    formatter: (value, context) => {
                                      // Display the value along with dataset label
                                      return `${isFinite(value) ? Number(value).toFixed(2) : value}`;
                                    },
                                    color: '#999',
                                    font: {
                                      size: 10,
                                      weight: 'bold',
                                    }, 
                                },
                            },
                            tooltips: {
                                displayColors: true,
                                callbacks: {
                                    mode: 'x',
                                },
                            },
                            scales: {
                                x: {
                                    stacked: true,
                                    ticks: {
                                        autoSkip: false
                                    }

                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: t("Consumption (kwh)")
                                    },
                                    stacked: true
                                }
                            },
                            responsive: true,
                            interaction: {
                                intersect: false
                            },
                            maintainAspectRatio: false
                        }}
                    />
                ) : (
                    <Typography style={{ color: theme.colorPalette.primary, textAlign: 'center' }} value={t("No Data")}  />
                )
            }
        </div>

    )
}
export default Overview;