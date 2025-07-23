import React,{useRef,useEffect} from "react"; 
import useGetTheme from 'TailwindTheme';  
import GaugeChart from 'react-gauge-chart' 
import { useTranslation } from 'react-i18next'; 
import  Typography  from "components/Core/Typography/TypographyNDL"; 
import { useRecoilState } from 'recoil';
import { metricsArry } from 'recoilStore/atoms';



export default function DialGauge(props) {
  console.log("DialGauge",props.meta)
  const { t } = useTranslation();
  const theme = useGetTheme(); 
  const [Arc,setArc]=React.useState({arc1:0.3,arc2:0.5,arc3:0.2})
  const chartRef = useRef(null);
  const [metricList] = useRecoilState(metricsArry); 



  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.chartRef.current.update(); // Trigger chart update
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  React.useEffect(()=>{
    let ARC1 = Number(props.meta.arc1 ? props.meta.arc1 : 0) - 0
    let ARC2 = Number(props.meta.arc2 ? props.meta.arc2 : 0) - Number(props.meta.arc1 ? props.meta.arc1 : 0)
    let ARC3 = Number(props.meta.arc3 ? props.meta.arc3 : 0) - Number(props.meta.arc2 ? props.meta.arc2 : 0)
    setArc({arc1:ARC1,arc2:ARC2,arc3:ARC3})
  },[props.meta.arc1,props.meta.arc2,props.meta.arc3])
  // eslint-disable-next-line no-unused-vars 
  const gaugeheight =  document.getElementById("arcGauge") ? document.getElementById("arcGauge").getElementsByTagName("svg")[0].clientHeight : "100%"

  if (props.data !== undefined && props.data.length !== 0 && props.existData.length !==0) {
    let value = 0;
    let Metric = ''
    if (props.data && props.data.length > 0) {
        const lastItem = props.data[props.data.length - 1];
        if (lastItem && lastItem["value"] !== undefined) {
            value = !isNaN(props.meta.decimalPoint) ? Number(lastItem["value"]).toFixed(Number(props.meta.decimalPoint)) : lastItem["value"];
            Metric = metricList.find(x=>x.name === lastItem["key"]).metricUnitByMetricUnit.unit
          }
    }



  
    let Unit =props.meta.unit?props.meta.unit:""
      return (
        <React.Fragment>
          <GaugeChart
            id="arcGauge"
            style={{ height: '98%', width: props.width -24, display: 'flex', alignItems: 'center' }}
            animate={false}
            colors={[props.meta.color1 ? props.meta.color1 : "#ef5350", props.meta.color2 ? props.meta.color2 : "#ffee58", props.meta.color3 ? props.meta.color3 : "#66bb6a"]}
          
            textColor={theme.colorPalette.primary}
            needleColor={theme.colorPalette.primary}
            percent={parseFloat(value) / 100}
            formatTextValue={val => isNaN(val) ? 'No Data' : !isNaN(props.meta.decimalPoint) ? (Number(val).toFixed(Number(props.meta.decimalPoint)) + " " + Unit) + " " + Metric   : (val + " " + Unit) + " " + Metric }
            arcsLength={[Arc.arc1 ? Arc.arc1 : 33.3, Arc.arc2 ? Arc.arc2 : 33.3, Arc.arc3 ? Arc.arc3 : 33.3]}
          />
        
        </React.Fragment>
       
        // </div>
      );
    }
    return (
      <div style={{ textAlign: "center" }}>
        <Typography variant="4xl-body-01" style={{color:'#0F6FFF'}}  value={t('No Data')}  />
        
        <Typography value={t('EditORReload')} variant="heading-02-sm" />
      </div>
    );
  }