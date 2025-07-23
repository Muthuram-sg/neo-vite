import React, { useMemo } from 'react';
import Chart from "react-apexcharts";

function Bar(props) {
  console.log(props.centerValue, "props 1");

  const plotoptions = useMemo(() => {
    return props.centerValue
      ? {
          pie: {
            expandOnClick: false,
            donut: {
              size: "62%",
              labels: {
                show: true,
                name: { show: false },
                value: {
                  fontSize: '17.42px',
                  fontWeight: '600',
                  color: "#161616",
                },
                total: {
                  show: true,
                  showAlways: true,
                  label: 'Total',
                  formatter: function () {
                    console.log(props.centerValue, "props 2");
                    return props.centerValue + "%";
                  },
                  style: {
                    fontSize: '17.42px',
                    fontWeight: '600',
                    color: "#161616",
                  },
                },
              },
            },
          },
        }
      : {
          donut: { size: '30%' },
        };
  }, [props.centerValue]);

  // Generate a unique key to force reinitialization
  const chartKey = useMemo(() => {
    return `chart-${props.centerValue}`;
  }, [props.centerValue]);

  return (
    <React.Fragment>
      <Chart
        key={chartKey} // Force reinitialization of the chart
        height={props.height}
        type="donut"
        series={props.data.map(x => x.count)}
        options={{
          plotOptions: plotoptions,
          dataLabels: { enabled: false },
          legend: { show: props.showLegend !== false },
          colors: props.colors || ["#28BD41", "#007BFF", "#FF0D00", "#FFCC00", "#FF9500", "#08ABF7", "#3432CD", "#FF002F"],
          labels: props.data.map(x => x.name),
          tooltip: {
            enabled: !props.isNoData, // Hide tooltip when showTooltip is false
          },
        }}
      />
    </React.Fragment>
  );
}

export default Bar;
