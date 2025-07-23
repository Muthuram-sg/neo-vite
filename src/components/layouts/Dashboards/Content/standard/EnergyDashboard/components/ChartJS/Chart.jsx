/* eslint-disable no-eval */
/* eslint-disable array-callback-return */
import React,{useEffect,useRef} from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PieController,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    Filler,

} from 'chart.js';

import { Bar, Line, Scatter,Pie ,Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useRecoilState } from "recoil";
import {themeMode} from 'recoilStore/atoms.jsx'

const doughnutTextPlugin = {
    id: 'doughnutTextPlugin',
    beforeDraw: function(chart) {
        if (chart.config.type !== 'doughnut') {
            return;
        }

        const ctx = chart.ctx;
        const canvasWidth = chart.width;
        const canvasHeight = chart.height;

        // Text to be displayed
        const text = chart.config.options.centerText + '%';

        // Font options
        const fontSize = (canvasHeight / 150).toFixed(2);
        ctx.font = fontSize + "em sans-serif";
        ctx.textBaseline = "middle";
        ctx.fillStyle = 'black'; // Set color for text
        ctx.strokeStyle = 'black';

        // Measure the width of the text
        const textWidth = ctx.measureText(text).width;

        // Calculate coordinates to center the text
        const textX = (canvasWidth - textWidth) * 0.36; // Adjust the division factor as needed to move the text towards the left
        const textY = canvasHeight / 2;

        // Draw the text
        ctx.fillText(text, textX, textY);
        ctx.strokeText(text, textX, textY);
    }
};







ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PieController,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,    
    Filler,
    doughnutTextPlugin,
    ChartDataLabels
);
 


export default function Chart(props) {//NOSONAR
 
    const chartRef = useRef(null);
    const [themeModes] = useRecoilState(themeMode)

    useEffect(() => {
        if (chartRef && chartRef.current) {
            const chartInstance = chartRef.current.chartInstance;
            if (chartInstance) {
                chartInstance.options.plugins.centerText = props.centerText;//NOSONAR
                chartInstance.update();
            }
        }
    }, [props.centerText]);//NOSONAR 

    function getTooltipLabel(context, labelvalue, total) {
        if (props?.charttype === "shiftbar") {
          return context?.[0]?.dataset?.stack ?? null;
        } else if (props?.isTop) {
          const totalLabel = props?.customTotalLabel ?? "Total";
          const displayValue =
            labelvalue ?? (props?.customTotalLabel ? 0 : (total ?? 0).toFixed(0));
          return `${totalLabel}: ${displayValue}`;
        }
        return null;
      }
      
    return (

        <React.Fragment>
            {props.charttype === "line" &&//NOSONAR
                <Line options={{
                    plugins: {
                        title: {
                            display: false,
                            text: props.title,//NOSONAR
                        },
                        legend: {
                            display: false
                        },
                        datalabels: {
                            display: props.datalabels ? props.datalabels : false, //NOSONAR
                            anchor: 'top',
                            align: 'top',
                            formatter: (value, context) => {
                              // Display the value along with dataset label
                                // console.log(context.dataset.stack,"datalabels",props.datalabels,value)
                              return `${isFinite(value) ? value.toFixed(2) : value}`;
                            },
                            color: '#999',
                            font: {
                              size: 10,
                              weight: 'bold',
                            }, 
                        },

                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    let value = context.raw;
                                    // Ensure the value is a valid number before formatting
                                    if (typeof value === 'number' && isFinite(value)) {
                                        return `${context.dataset.label}: ${value.toFixed(2)}`;
                                    }
                                    return `${context.dataset.label}: ${value}`;
                                }
                            }
                        },
                    },
                    elements: {
                        line: {
                            tension: 0.5
                        }
                    },

                    responsive: true,
                    interaction: {
                        intersect: false,
                    },
                    scales: {

                        x: {
                            ticks: {
                                autoSkip: false
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: props.yAxisTitle
                            },

                        }
                    },
                    maintainAspectRatio: false
                }} data={{
                    labels: props.labels,//NOSONAR
                    datasets: props.fill ? [//NOSONAR
                        {
                            fill: true,
                            label: props.toolTipLabel,//NOSONAR
                            data: props.data,//NOSONAR
                            borderColor: '#007BFF',
                            backgroundColor: '#91b8e3',

                        },
                    ] : props.datasets,//NOSONAR
                }} />
            }
             {(props.charttype === "bar" || props.charttype === "shiftbar") && props.noSharedTooltip && //NOSONAR
                <Bar
                    redraw={props.redraw ? true : false}//NOSONAR
                    options={{
                        onClick: (e, element) => {
                            if (element.length > 0) {
                              let index = element[0].datasetIndex
                              let ind = e.chart.config.data.datasets[index];
                            //   console.log(e.chart.config.data," e.chart.config.data")
                              let label = e.chart.config.data.labels[element[0].index];
                              if(props.nodeType === 'hierarchy'){//NOSONAR
                                // console.log({Data : ind, Label: label,e:e,element:element},'ChartReturnData')
                                props.renderChild({Data :{...ind,selectedHierarchy:ind.selectedHierarchy.filter(k=>k.children && k.children.length > 0 && k.name === ind.label)}, Label: label,e:e,element:element})//NOSONAR
                              }else{//NOSONAR
                                props.renderChild({Data : ind, Label: label,e:e,element:element});//NOSONAR

                              }
                            }
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: props.title//NOSONAR
                            },
                            datalabels: {
                                display: props.datalabels ? props.datalabels : false, //NOSONARdata labels
                                anchor: 'top',
                                align: 'top',
                                formatter: (value, context) => {
                                  // Display the value along with dataset label
                                    console.log(context.dataset.stack,"datalabels",props.datalabels)//NOSONAR
                                  return `${context.dataset.stack}`;
                                },
                                color: '#999',
                                font: {
                                  size: 10,
                                  weight: 'bold',
                                }, 
                            },
                            tooltip: {
                                displayColors: false,
                                
                                callbacks: {
                                    title: props.customtooltip ?//NOSONAR
                                        props.customtooltip ://NOSONAR
                                        function (context) { 
                                            const chart = context[0].chart;
                                            const datasets = chart.data.datasets;
                                            const dataIndex = context[0].dataIndex;
                                            const hoverStack = context[0].dataset.stack;
                                            const labelvalue = props.labelData && props.labelDataKey && props.labelData.length > 0 ? props.labelData[dataIndex][props.labelDataKey].toLocaleString("en-us"): null;//NOSONAR

                                            // Calculate total for the hovered stack at current index
                                            const total = datasets
                                                .filter((dataset, i) => {
                                                    const meta = chart.getDatasetMeta(i);
                                                    const value = dataset.data[dataIndex];
                                                    return (
                                                        !meta.hidden &&
                                                        dataset.stack === hoverStack &&
                                                        value !== 0 && value !== null && value !== undefined
                                                    );
                                                })
                                                .reduce((sum, dataset) => sum + dataset.data[dataIndex], 0);
                                    return getTooltipLabel(context,labelvalue,total);//NOSONAR
                                        },
                                        afterBody: function (context) {
                                            const chart = context[0].chart;
                                            const datasets = chart.data.datasets;
                                            const dataIndex = context[0].dataIndex;
                                            const hoverStack = context[0].dataset.stack;
                                        
                                            let labels = datasets
                                                .filter((dataset, i) => {
                                                    const meta = chart.getDatasetMeta(i);
                                                    const value = dataset.data[dataIndex];
                                                    return (
                                                        !meta.hidden &&                    // only visible datasets
                                                        dataset.stack === hoverStack &&     // only hovered stack
                                                        value !== 0 && value !== null && value !== undefined // skip zero/empty values
                                                    );
                                                })
                                                .map((dataset) => {
                                                    const value = dataset.data[dataIndex];
                                                    if(props.islocalString){
                                                        return `${dataset.label}: ${parseFloat(value).toLocaleString('en-us')}`;

                                                    }else{
                                                        return `${dataset.label}: ${parseFloat(value).toFixed(props.withTotal ? 0 : 2) }`;

                                                    }
                                                });
                                        
                                            // Remove duplicates (optional)
                                            labels = Array.from(new Set(labels)); 
                                        
                                            // Remove the first label (which is the hovered stack)
                                            labels = labels.filter(label => !label.includes(context[0].dataset.label));
                                           if(props.withTotal && !props.isTop){
                                            const total = datasets
                                            .filter((dataset, i) => {
                                                const meta = chart.getDatasetMeta(i);
                                                const value = dataset.data[dataIndex];
                                                return (
                                                    !meta.hidden &&                    // only visible datasets
                                                    dataset.stack === hoverStack &&     // only hovered stack
                                                    value !== 0 && value !== null && value !== undefined // skip zero/empty values
                                                );
                                            })
                                            .reduce((sum, dataset) => sum + dataset.data[dataIndex], 0); // Sum the values
                                    
                                        // Add the total to the tooltip
                                        labels.unshift(`Total: ${total.toFixed(0)}`);
                                           }
                                          
                                        
                                            return labels;
                                        }
                                        
                                }
                            },
                            legend: {
                                labels: {
                                    generateLabels: (chart) => {
                                        let labels = [] 
                                        chart.data.datasets.forEach((l, i) => {

                                            if (labels.findIndex((val) => val.text === l.label) === -1) {
                                                labels.push({
                                                    datasetIndex: i,
                                                    text: l.label,
                                                    fillStyle: chart.data.datasets[i].backgroundColor,
                                                    strokeStyle: chart.data.datasets[i].backgroundColor,
                                                    hidden: chart.getDatasetMeta(i).hidden,
                                                    associateddataset: [i],
                                                    fontColor:themeModes === "dark" ? '#FFFFFF' : '#000000'

                                                })
                                            }
                                            else {
                                                labels[labels.findIndex((val) => val.text === l.label)].associateddataset.push(i)
                                            }

                                        }) 
                                        return labels
                                    }

                                },
                                onClick: function (e, legendItem, legend) {
                                    const indices = legendItem.associateddataset;
                                    const ci = legend.chart; 
                                    indices.map((index) => { 
                                        if (ci.isDatasetVisible(index)) { 
                                            ci.hide(index);
                                            legendItem.hidden = true;
                                        } else {
                                            ci.show(index);
                                            legendItem.hidden = false;
                                        }
                                    })
                                },
                                display : props.legend ? props.legend : false,//NOSONAR
                                position : 'bottom'
                                
                            }
                        },
                        responsive: true,
                        interaction: {
                            intersect: false
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
                                    text: props.yAxisTitle//NOSONAR
                                },
                                stacked: true,
                                min : props.ymin ? props.ymin : undefined,//NOSONAR
                                max : props.ymax ? props.ymax : undefined//NOSONAR
                            }
                        },
                        maintainAspectRatio: false
                    }} data={{
                        labels: props.labels,//NOSONAR
                        datasets: props.data//NOSONAR
                    }} />
            }
            {(props.charttype === "bar" || props.charttype === "shiftbar") && !props.noSharedTooltip && //NOSONAR
                <Bar
                    redraw={props.redraw ? true : false}//NOSONAR
                    options={{
                        onClick: (e, element) => {
                            if (element.length > 0) {
                                let index = element[0].datasetIndex
                                let ind = e.chart.config.data.datasets[index];
                                //   console.log(e.chart.config.data," e.chart.config.data")
                                let label = e.chart.config.data.labels[element[0].index];
                                if (props.nodeType === 'hierarchy') {//NOSONAR
                                    // console.log({Data : ind, Label: label,e:e,element:element},'ChartReturnData')
                                    props.renderChild({ Data: { ...ind, selectedHierarchy: ind.selectedHierarchy.filter(k => k.children && k.children.length > 0 && k.name === ind.label) }, Label: label, e: e, element: element })//NOSONAR
                                } else {//NOSONAR
                                    props.renderChild({ Data: ind, Label: label, e: e, element: element });//NOSONAR

                                }
                            }
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: props.title//NOSONAR
                            },
                            datalabels: {
                                display: props.datalabels ? props.datalabels : false, //NOSONARdata labels
                                anchor: 'top',
                                align: 'top',
                                formatter: (value, context) => {
                                    // Display the value along with dataset label
                                    console.log(context.dataset.stack, "datalabels", props.datalabels)//NOSONAR
                                    return `${context.dataset.stack}`;
                                },
                                color: '#999',
                                font: {
                                    size: 10,
                                    weight: 'bold',
                                },
                            },
                            tooltip: {
                                callbacks: {
                                    title: props.customtooltip ?//NOSONAR
                                        props.customtooltip ://NOSONAR
                                        function (context) {
                                            return props.charttype === "shiftbar" ? context[0].dataset.stack : null;//NOSONAR
                                        },
                                    label: function (context) {
                                        let value = context.raw;
                                        return `${context.dataset.label}: ${parseFloat(value).toFixed(2)}`;
                                    }
                                }
                            },
                            legend: {
                                labels: {

                                    generateLabels: (chart) => {
                                        let labels = []
                                        chart.data.datasets.forEach((l, i) => {

                                            if (labels.findIndex((val) => val.text === l.label) === -1) {
                                                labels.push({
                                                    datasetIndex: i,
                                                    text: l.label,
                                                    fillStyle: chart.data.datasets[i].backgroundColor,
                                                    strokeStyle: chart.data.datasets[i].backgroundColor,
                                                    hidden: chart.getDatasetMeta(i).hidden,
                                                    associateddataset: [i],
                                                    fontColor: themeModes === "dark" ? '#FFFFFF' : '#000000'

                                                })
                                            }
                                            else {
                                                labels[labels.findIndex((val) => val.text === l.label)].associateddataset.push(i)
                                            }

                                        })
                                        return labels
                                    }

                                },
                                onClick: function (e, legendItem, legend) {
                                    const indices = legendItem.associateddataset;
                                    const ci = legend.chart;
                                    indices.map((index) => {
                                        if (ci.isDatasetVisible(index)) {
                                            ci.hide(index);
                                            legendItem.hidden = true;
                                        } else {
                                            ci.show(index);
                                            legendItem.hidden = false;
                                        }
                                    })
                                },
                                display: props.legend ? props.legend : false,//NOSONAR
                                position: 'bottom'

                            }
                        },
                        responsive: true,
                        interaction: {
                            intersect: false
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
                                    text: props.yAxisTitle//NOSONAR
                                },
                                stacked: true,
                                min: props.ymin ? props.ymin : undefined,//NOSONAR
                                max: props.ymax ? props.ymax : undefined//NOSONAR
                            }
                        },
                        maintainAspectRatio: false
                    }} data={{
                        labels: props.labels,//NOSONAR
                        datasets: props.data//NOSONAR
                    }} />
            }
           
            {props.charttype === "Childbar" &&//NOSONAR
                <Bar
                    options={{
                         
                        plugins: {
                            title: {
                                display: false,
                                text: props.title//NOSONAR
                            },
                            datalabels: {
                                display: props.datalabels ? props.datalabels : false,//NOSONAR
                            },
                            tooltip: {
                                callbacks: {
                                    title: props.customtooltip ?//NOSONAR
                                        props.customtooltip ://NOSONAR
                                        function (context) {
                                            return null
                                        },
                                        label: function (context) {
                                            let value = context.raw;
                                            return `${context.dataset.label}: ${parseFloat(value).toFixed(2)}`;
                                        }

                                }
                            },
                            legend: {
                                
                                labels: {
 
                                    generateLabels: (chart) => {
                                        let labels = [] 
                                      chart.data.datasets[0].dataseries && chart.data.datasets[0].dataseries.length > 0 && chart.data.datasets[0].dataseries.forEach((l, i) => {
                                            if (labels.findIndex((val) => val.text === l.name) === -1) {
                                                labels.push({
                                                    datasetIndex: i,
                                                    text: l.name,
                                                    fillStyle: l.color,
                                                    strokeStyle: l.color,
                                                    hidden: chart.getDatasetMeta(i).hidden,
                                                    associateddataset: [i],
                                                     fontColor:themeModes === "dark" ? '#FFFFFF' : '#000000'
                                                })
                                            }
                                            else {
                                                labels[labels.findIndex((val) => val.text === l.name)].associateddataset.push(i)
                                            }

                                        }) 
                                        return labels
                                    }

                                },
                                onClick: function (e, legendItem, legend) { 
                                    const ci = legend.chart;
                                    ci.show(0);
                          
                                },
                               
                                position : 'bottom'
                            }
                             
                        },
                        responsive: true,
                        interaction: {
                            intersect: false
                        }, 
                        scales: {
                            x: {
                                grid: {
                                    display: props.isBar ? false : true//NOSONAR
                                },
                                stacked: false,
                                ticks: {
                                    autoSkip: false
                                }

                            },
                            y: {
                                grid: {
                                    display: props.isBar ? false : true//NOSONAR
                                },
                                title: {
                                    display: true,
                                    text: props.yAxisTitle//NOSONAR
                                },
                                stacked: false, 
                            }
                        },
                        maintainAspectRatio: false
                    }} 
                    data={{
                        labels: props.labels,
                        datasets: props.data,
                    }} 
                    />
            }
            {props.charttype === "scatter" &&//NOSONAR
                <Scatter options={{
                    plugins: {
                        title: {
                            display: true,
                            text: props.ChartTitle,//NOSONAR
                        },
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                title: function (context) {
                                    return props.toolTipTitle(context)//NOSONAR
                                },
                                label: function (context) {
                                    return props.toolTipLabel(context);//NOSONAR
                                },

                                beforeBody: function (context) {
                                    return props.toolTipBeforeBody(context)//NOSONAR
                                }

                            }
                        }

                    },
                    responsive: true,
                    interaction: {
                        intersect: false,
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: props.xAxisTitle//NOSONAR
                            },
                        },

                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: props.yAxisTitle//NOSONAR
                            },

                        }
                    },
                    maintainAspectRatio: false

                }} data={{
                    datasets: props.data
                }}>

                </Scatter>

            }

            {props.charttype === "pie" &&
                <Pie 
                options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    aspectRatio: 2,
                    plugins: {
                        legend:{
                            display : props.hidelegend && props.hidelegend === true ? false : true,//NOSONAR
                            position : 'bottom'
                        },
                        datalabels: {
                            display: props.datalabels ? props.datalabels : false, //NOSONAR labels
                            anchor: 'top',
                            align: 'top',
                            formatter: (value, context) => {
                              // Display the value along with dataset label
                                // console.log(context.dataset.stack,"datalabels",props.datalabels,value)
                              return `${isFinite(value) ? value.toFixed(2) : value}`;
                            },
                            color: '#999',
                            font: {
                              size: 10,
                              weight: 'bold',
                            }, 
                        },
                    }
                    
                }}
                    data={{
                        labels: props.labels,//NOSONAR
                        datasets: [{
                           // label: 'My First Dataset',
                            data: props.data,//NOSONAR
                            backgroundColor: props.colors,//NOSONAR
                            hoverOffset: 4
                        }]
                    }} 
                />
            }
             {props.charttype === "doughnut" &&//NOSONAR
                <Doughnut 
                options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    aspectRatio: 2,
                    plugins: {
                        legend:{
                            
                         
                            position : 'right',
                            // onClick: function (e, legendItem, legend) {
                            //     const { index } = legendItem;
                            //     const ci = legend.chart;
                            //     console.log(legendItem);
                            //     ci.toggleDataVisibility(index );
                            //     if (ci.getDataVisibility(index )) {
                            //       ci.hide(index );
                            //       legendItem.hidden = false;
                            //     } else {
                            //       ci.show(index );
                            //       legendItem.hidden = true;
                            //     }
                            // }
                        },
                           
                            tooltip: {
                                callbacks: {
                                    label: function(tooltipItem, data) {
                                     
                                        if (props.data && Array.isArray(props.data)) {//NOSONAR
                                            let currentValue = props.data[tooltipItem.dataIndex];//NOSONAR
                                            if (typeof currentValue !== 'undefined') {
                                                return props.labels[tooltipItem.dataIndex]+ " : "+ currentValue + '%';//NOSONAR
                                            }
                                        }
                                       
                                    }
                                }
                               
                            }
                           
                        },
                        
                    centerText: props.centerText,//NOSONAR
                    onHover: (event, elements) => {
                        if (elements.length > 0) {
                            const segmentIndex = elements[0].index;
                            const segmentValue = props.data[segmentIndex];//NOSONAR
                            props.setCenterText(segmentValue);//NOSONAR
                        } else {
                            props.setCenterText(100);//NOSONAR hovering over segments
                        }
                    },
                   
                }}
                    data={{
                        labels: props.labels,//NOSONAR
                        datasets: [{
                           // label: 'My First Dataset',
                            data: props.data,//NOSONAR
                            backgroundColor: props.colors,//NOSONAR
                            hoverOffset: 4
                        }]
                    }} 
                    
                     
                />
            }

        </React.Fragment>




    )
}


