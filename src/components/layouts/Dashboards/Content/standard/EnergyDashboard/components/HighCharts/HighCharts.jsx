import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from "highcharts/highcharts-more";
import Highcharts from 'highcharts';
export default function HighCharts(props) {

    HighchartsMore(Highcharts);
    return (
        <HighchartsReact options={{
            chart: {
                type: props.charttype,
                height : props.height ? props.height : null
            },

            title: {
                text: props.chartTitle
            },

            legend: {
                enabled: props.legend
            },

            xAxis: {
                categories: props.categories?props.categories : undefined,
                title: {
                    text: props.xAxisTitle
                },
                type : "category"
            },

            yAxis: {
                title: {
                    text: props.yAxisTitle
                },


            },
            tooltip :{
                formatter : props.tooltip ?	function() {
                    let point =this ;
                    return props.tooltip(point)}: undefined
            },
            series: props.series
        }} highcharts={Highcharts} />
    )
}