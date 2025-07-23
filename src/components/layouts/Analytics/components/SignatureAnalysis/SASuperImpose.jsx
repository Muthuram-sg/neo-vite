import React, { useEffect, useState } from 'react';
import { useRecoilState } from "recoil";
import { themeMode, superData, SALineData } from "recoilStore/atoms";
import Chart from "react-apexcharts";
import moment from 'moment';
import { useAuth } from "components/Context";
import KpiCards from "components/Core/KPICards/KpiCardsNDL"
import TypographyNDL from 'components/Core/Typography/TypographyNDL';

export default function SASuperImpose(props) {
  const { HF } = useAuth();
  const [curTheme] = useRecoilState(themeMode);
  const [dataSuper] = useRecoilState(superData);
  const [LineSA] = useRecoilState(SALineData);
  const [series, setSeries] = useState([]);

  const Normalize = (templinedata) => {
    const sortedData = templinedata.sort((a, b) => {
      if (a.name > b.name) return 1;
      if (b.name > a.name) return -1;
      return 0;
    });

    templinedata.forEach((s) => {
      let max = Math.max(...s.data.map(o => o.y));
      s.data = s.data.map((d) => ({
        ...d,
        y: (d.y / max).toFixed(4)
      }));
    });

    return sortedData;
  };

  const seriesOrder = (nameA, nameB) => {
    if (nameA > nameB) return 1;
    if (nameB > nameA) return -1;
    return 0;
  };

  const sortSeries = (series1) => {
    return series1.sort((a, b) => seriesOrder(a.name, b.name));
  };

  useEffect(() => {
    let temp_series = [];

    try {
      const unique = [...new Set(dataSuper.Data.map(item => item.name))];
      unique.forEach((k) => {
        temp_series.push({
          name: k,
          data: dataSuper.Data.filter(data => data.name === k).map(filteredvalues => filteredvalues.data[0])
        });
      });

      if (props.normalize) {
        const normalizedSeries = Normalize(temp_series);
        setSeries(normalizedSeries);
      } else {
        const sortedSeries = sortSeries(temp_series);
        setSeries(sortedSeries);
      }

    } catch (err) {
      console.log("SA SuperImpose err", err);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSuper, props.normalize]);

  return (
    <div style={{ width: '100%' }}>
       <KpiCards>
       <TypographyNDL value='Signature Analysis' color='secondary' variant='heading-01-xs' />
      <Chart
        height={500}
        options={{
          theme: {
            mode: curTheme
          },
          stroke: {
            width: 2,
            curve: dataSuper.stroke.length > 0 ? dataSuper.stroke.map(v => v.value) : [],
          },
          chart: {
            type: 'area',
            stacked: false,
            animations: {
              enabled: false
            },
            background: '0',
            height: 350,
            zoom: {
              type: 'x',
              enabled: true,
              autoScaleYaxis: true
            },
            toolbar: {
              autoSelected: 'zoom',
              export: {
                csv: {
                  dateFormatter(timestamp) {
                    return moment(new Date(timestamp)).format('Do MMM YYYY ' + HF.HMSS);
                  }
                }
              }
            }
          },
          dataLabels: {
            enabled: false
          },
          markers: {
            size: 0,
          },
          xaxis: {
            tickAmount: 25,
            labels: {
              hideOverlappingLabels: false,
            }
          },
          yaxis: {
            min: LineSA.MaxMin.length > 0 && !props.normalize ? LineSA.MaxMin[0].min : undefined,
            max: LineSA.MaxMin.length > 0 && !props.normalize ? LineSA.MaxMin[0].max : undefined,
          },
          tooltip: {
            shared: false,
            y: {
              formatter: function (val) {
                return val;
              }
            },
            x: {
              formatter: function (val) {
                return val;
              }
            }
          }
        }}
        series={series}
      />
      </KpiCards>
    </div>
  );
}
