import React,{useEffect,useState} from "react"; 
import LineChart from '../Recharts/LineCharts';
import BarChart from '../Recharts/BarCharts';
import StackedBarChart from '../Recharts/StackedBarCharts';
import AreaChart from '../Recharts/AreaCharts';
import PieChart from '../Recharts/PieCharts';
import SingleText from "../Recharts/SingleText";
import Gauge from "components/charts/Gauge.jsx"
import DialGauge from "components/charts/DialGauge.jsx"
import DialGaugeNew from "components/charts/DialGaugeNew"
import FillGauge from "components/charts/FillGauge.jsx";
import TextWidget from "../Recharts/TextWidget.jsx";
 import Table from "../Recharts/Table"
import ImageWidget from "../Recharts/ImageWidget.jsx";
import TableWidget from "../Recharts/TableWidget.jsx";
import StatusWidget from "../Recharts/StatusWidget.jsx"; 
import Alerts from "../Recharts/AlertList";
import Map from "components/LeafMap/index"
import { useRecoilState } from "recoil";
import useGetAlertsDashboard from "components/layouts/Dashboards/hooks/useAlertsDashboard.jsx"
import {selectedPlant } from 'recoilStore/atoms'
import Clock from "../components/Clock";

import CountdownTimer from "../components/CountDown";
import CountUpTimer from "../components/CountUp";
import EnergyMeter from "../components/EnergyMeter";
import ThermoMeter from "../components/Thermometer";
import Weather from "../components/Weather";
import VideoComponent from "../components/Video";
import DataOverImage from "../components/DataOverImage";
import GroupedBarCharts from "../components/GroupedBar";
import ComboCharts from "../components/ComboBar";
import Correlogram from "../components/Correlogram";
import ParetoCharts from "../components/Pareto";

const ChartBlock = ({ type, data, width, height,meta,showTable,showChart,markers,existData, viData,cardColor }) => {  
    const [headPlant] = useRecoilState(selectedPlant);
    const  { alertsDashboardLoading, alertsDashboarddata, alertsDashboarderror, getAlertsDashboard } = useGetAlertsDashboard()
    const [extractedValues, setExtractedValues] = useState({});
    useEffect(() => {
        getAlertsDashboard(headPlant.id)
   // eslint-disable-next-line react-hooks/exhaustive-deps
   },[headPlant,meta])
   useEffect(() => {
    if (!alertsDashboardLoading && alertsDashboarddata && !alertsDashboarderror) {
        if (type === 'line' || type === 'bar' || type === 'area') {
       
            let alertID = meta?.alarmLevel?.alert_id;
   
            if (alertID) {
                const alertData = alertsDashboarddata.find(alert => alert.id === alertID);
             //   console.log(alertData,"alertData")
                if (alertData) {
                    const criticalValue = alertData.critical_value;
                    const warnValue = alertData.warn_value;
                    const extractedValues = {
                        c:criticalValue,
                        w:warnValue,
                        alertObj:alertData
                    };
                
                    setExtractedValues(extractedValues);
                } else {
                    console.log("No matching alert found");
                }
            }
        }
    }
}, [alertsDashboardLoading, alertsDashboarddata, alertsDashboarderror]);


  switch (type) {
    case "line":
        if(showTable){
            return (
              <TableWidget type="line" width={width} meta={meta} height={height} data={data} dictdata={data}/>
            )
          }else{        
            return (        
                <LineChart data={data} width={width} height={height} meta={meta} showTable={showTable} cwValues={extractedValues}/>
            );
          } 
    case "bar":
        if(showTable){
            return (
                <TableWidget type="line" width={width} meta={meta} height={height} data={data} dictdata={data}/>
            )
        }else{ 
            console.log("DD________",data)
            // alert("XI")       
            return (        
                <BarChart data={data} width={width} height={height} meta={meta} cwValues={extractedValues}/>
            );
        }
    case "stackedbar":
        if(showTable){
            return (
                <TableWidget type="line" width={width} meta={meta} height={height} data={data} dictdata={data}/>
            )
        }else{        
            return (        
                <StackedBarChart data={data} width={width} height={height} meta={meta} />
            );
        } 
    case "groupedbar":
        return (        
            <GroupedBarCharts data={data} width={width} height={height} meta={meta} cwValues={extractedValues}/>
        );
    case "combobar":
        return (
            <ComboCharts data={data} width={width} height={height} meta={meta}/>
        )
    case "area":
        if(showTable){
            return (
                <TableWidget type="line" width={width} meta={meta} height={height} data={data} dictdata={data}/>
            )
        }else{        
            return (        
                <AreaChart data={data} width={width} height={height} meta={meta} cwValues={extractedValues}/>
            );
        }
    case "pie":
        return (
            <PieChart data={data} width={width} height={height} meta={meta} type={type}/>
        );
    case 'donut': 
        return (
            <PieChart data={data} width={width} height={height} meta={meta} type={type}/>
        );
    case "singleText":
        return (
            <SingleText existData={existData}  showChart={showChart} showTable={showTable} width={width} meta={meta} height={height} data={data} dictdata={data} cardColor={(e)=>cardColor(e)}/>
        );
    case "gauge":
        return (
            <Gauge existData={existData} style={{ height: "100%" }} width={width} meta={meta} height={height} data={data} dictdata={data} />
        );
    case "dialgauge":
        return (
            <DialGauge existData={existData} style={{ height: "100%" }} width={width} meta={meta} height={height} data={data}  />
        );
    case "dialgauge2":
        return (
            <DialGaugeNew existData={existData} style={{ height: "100%" }} width={width} meta={meta} height={height} data={data} />
        );
    case "fillgauge":
        return(
            <FillGauge existData={existData} style={{ height: "100%" }} width={width} meta={meta} height={height} data={data}  />          
        )
    case "Text":
        return(
            <TextWidget meta={meta} cardColor={(e)=>cardColor(e)}/>
        )
    case "Table":
        return(
            <Table  data={data} width={width} height={height} meta={meta} type={type} viData={viData}/>
        )
    case "Image":
        return(
            <ImageWidget width={width} meta={meta} height={height}/>
        )
    case "Status":
        return(
            <StatusWidget data={data} meta={meta} width={width} height={height}/>
        ) 
    case "alerts":
        return <Alerts  style={{ height: "100%" }}width={width} meta={meta} height={height} dictdata={data}  />
    case "map":
        return(
            // null
            <Map width={width} height={height} data={data} meta={meta} Markers={markers}/>
        ) 
    case "clock": 
        if(meta.clockMode === 'countup') {
            return <CountUpTimer width={width} startDate={new Date(meta?.date?.value)?.toISOString()} timeZone={meta.timeZone} timeFormat={meta.timeFormat} showDate={meta.showDate} clockFont={meta.clockFont} />
        }
        else if (meta.clockMode === 'countdown') {
            return <CountdownTimer width={width} targetDate={new Date(meta?.date?.value)?.toISOString()} timeZone={meta.timeZone} timeFormat={meta.timeFormat} showDate={meta.showDate} clockFont={meta.clockFont} />
        }
        else {
            return (
                <Clock width={width} timeZone={meta.timeZone} timeFormat={meta.timeFormat} showDate={meta.showDate} clockFont={meta.clockFont} />
            )
        }
    case 'energymeter':
        return <EnergyMeter width={width} height={height} data={data} meta={meta} />

    case 'thermometer':
        return <ThermoMeter data={data} meta={meta} />

    case 'weather':
        return <Weather width={width} height={height} data={data} meta={meta} />

    case 'video':
        return <VideoComponent width={width} height={height} data={data} meta={meta} />
    
    case 'dataoverimage':
        return <DataOverImage width={width} height={height} data={data} meta={meta} />

    case 'correlogram':
        return <Correlogram width={width} height={height} data={data} meta={meta} />
    case 'pareto':
        return <ParetoCharts data={data} meta={meta} />

    default:
      return null;
  }
};
 
export default ChartBlock;
