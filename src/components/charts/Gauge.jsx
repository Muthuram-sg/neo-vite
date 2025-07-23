import React from "react";
import moment from 'moment';
import Chart from "react-apexcharts";
import { useRecoilState } from "recoil";
import { themeMode } from "recoilStore/atoms";
import { useTranslation } from 'react-i18next';
import  Typography  from "components/Core/Typography/TypographyNDL";

export default function Gauge(props) {
  const { t } = useTranslation();
  const [curTheme] = useRecoilState(themeMode);
  let Unit = props.meta.unit?props.meta.unit:""
  
  if (props.dictdata !== undefined && props.dictdata.length !== 0 && props.existData.length !==0) {
  return (
    // <div style={{ margin: "auto" }} className="app">
    //   <div className="row">
    //     <div className="mixed-chart">
    <Chart
    style={{marginTop: 22,minHeight:props.height}}
    height={props.height + 150}
    width={props.width}
      options={{
        theme: {
          mode: curTheme
        },
        colors: ["#3673E8", "#61B8FF", "#00D7ED", "#3633D7", "#F5B763", "#FD9588", "#96C3D8", "#C8E8FF"],
        chart: {
          background: '0',
          type: 'radialBar',
          offsetY: -10,
          animations: {
            enabled: false,
            animateGradually: {
                enabled: false,
            },
            dynamicAnimation: {
                enabled: false,
            }
        }
        },
        plotOptions: {
          radialBar: {
            startAngle: -90,
            endAngle: 90,
            track: {
              background: "#e7e7e7",
              strokeWidth: '97%',
              margin: 2, // margin is in pixels
              dropShadow: {
                enabled: true,
                top: 2,
                left: 0,
                color: '#999',
                opacity: 1,
                blur: 2
              }
            },
            dataLabels: {
              name: {
                fontSize: '16px',
                color: undefined,
                offsetY: 55
              },
              value: {
                offsetY: 15,
                fontSize: '22px',
                color: undefined,
                formatter: function (val) {
                  return val?parseFloat(val).toFixed(2) + " "+ (Unit):"No Data";
                }
              }
            }
          }
        },
        grid: {
          padding: {
            top: -10
          }
        },
        labels: props.dictdata.map(x => props.meta.isMoment ? moment(x[props.meta.label]).format(props.meta.labelFormat) : x[props.meta.label]),
      }}
      series={props.dictdata.map(x => x[props.meta.dataName]?x[props.meta.dataName]:0)}
      type="radialBar"
    />
    //     </div>
    //   </div>
    // </div>
  );
}
return (
  <div style={{ textAlign: "center" }}>
    <Typography variant="4xl-body-01" style={{color:'#0F6FFF'}}  value={t('No Data')} />
    <Typography  value={t('EditORReload')} variant="heading-02-sm" />
  </div>
);
}