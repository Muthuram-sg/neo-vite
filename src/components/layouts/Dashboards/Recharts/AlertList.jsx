
import React,{useState,useEffect} from "react";
import moment from "moment";
import { useRecoilState } from "recoil";
import {  metricsList,instrumentsList,selectedPlant} from "recoilStore/atoms"; 
import Typography from 'components/Core/Typography/TypographyNDL';
import { useTranslation } from "react-i18next"; 
import configParam from "config";
import gqlQueries from "components/layouts/Queries";
import { useAuth } from "components/Context";
import useGetTheme from 'TailwindTheme'; 
import { AutoSizer,List, CellMeasurer, CellMeasurerCache  } from "react-virtualized";

export default function AlertList(props) {
    const theme= useGetTheme()
    const classes ={   
      level: {
        width: 64,
        textAlign: 'center',
        padding: '3px',
        borderRadius: '4px',
        color: '#fff',
        fontSize: '12px',
        fontWeight: 500,
       
      },
      
      warning: {
        background: theme.warning,
      },
      critical: {
        background: theme.critical
      },
      ok: {
        background: theme.ok
      },
      text1: theme.text1,
      text2: theme.text2
    };
    const { HF } = useAuth();
    const { t } = useTranslation();  
    const [metricsli,] = useRecoilState(metricsList) 
    const [Instruments] = useRecoilState(instrumentsList);
    const [InstrumentMetricList,setInstrumentMetricList] = useState([])
    const [headPlant] = useRecoilState(selectedPlant);
    let janOffset = moment({M:0, d:1}).utcOffset(); //checking for Daylight offset
    let julOffset = moment({M:6, d:1}).utcOffset(); //checking for Daylight offset
    let stdOffset = Math.min(janOffset, julOffset);// Then we can make a Moment object with the current time at that fixed offset 
    
    const cache = new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 80,
    });

    // useEffect(()=>{
    //   console.log(props.dictdata,"props.dictdata")
    // },[props.dictdata])
    useEffect(() => {
      
      getInstrumentMetrics()
      
    }, [headPlant]);


    function instruName(met) {
      let intru = Instruments.filter(int => int.id === met)
      return intru.length > 0 && intru[0].name ? intru[0].name : "" ;
    }


    const timeFormat = (val) => {
        const result = moment(val).diff(moment(new Date()), 'days');
        if (result == 0) {
            return moment(val).utcOffset(stdOffset).format(HF.HMS);
        } else {
            return moment(val).utcOffset(stdOffset).format("DD-MM-YYYY "+HF.HMS);
        }

    }
    function getInstrumentMetrics() { 
      configParam.RUN_GQL_API(gqlQueries.getInstrumentmetrics, {  })
          .then((instruments) => {
            const instrumentArr = instruments !== undefined && instruments.neo_skeleton_instruments_metrics && instruments.neo_skeleton_instruments_metrics.length > 0 ? instruments.neo_skeleton_instruments_metrics : [];
            
            setInstrumentMetricList(instrumentArr);
          });
  }

    function intrumetric(id,key){
      let listMet = InstrumentMetricList.filter(x=> x.instruments_id === id)
      
      if(listMet.length > 0){
        let MetVal = listMet.filter(e=> e.metric.name === key)
        return MetVal[0] ? MetVal[0].metric.title : ''
      }
      
      return ""
    } 

   const renderRow = ({ index, key, style, parent }) => {
      
        let MinMaxValues = ''
        if((props.dictdata[index].alert_level === "critical" ||props.dictdata[index].alert_level === "warning") && props.dictdata[index].alert_level_min && props.dictdata[index].alert_level_max ){
          MinMaxValues = `Min - ${props.dictdata[index].alert_level_min},Max - ${props.dictdata[index].alert_level_max}` 
        }else if(props.dictdata[index].alert_type === "above" || props.dictdata[index].alert_type === "below"){
          MinMaxValues =  props.dictdata[index].alert_level_value 
        }else{
          MinMaxValues =  props.dictdata[index].alert_level_value 
        }
        const metrics = metricsli.filter(x => x.name === props.dictdata[index].key);
        let OkCss = props.dictdata[index].alert_level === 'ok' ? classes.ok : classes.critical
        let OkText = props.dictdata[index].alert_level === 'ok' ? 'Ok' : 'Critical'
          return (
             <CellMeasurer
                key={key}
                cache={cache}
                parent={parent}
                columnIndex={0}
                rowIndex={index}
              >
              <div key={key} style={style} className={"row"+index}>
                  <ul style={{overflow : "auto"}}>
                    <li key={key} style={{borderBottom: `1px solid ${theme.colorPalette.divider}`,padding:"8px"}}>
                        <div className="flex gap-4">
                              <div 
                                style={{...classes.level,...(props.dictdata[index].alert_level === 'warn' || props.dictdata[index].alert_level === 'warning') ? classes.warning : OkCss}}
                              >
                                {(props.dictdata[index].alert_level === 'warn' || props.dictdata[index].alert_level === 'warning') ? 'Warning' : OkText}
                        
                              </div>
                              <Typography  variant="label-02-m" value={t("Alarm Triggered (" + props.dictdata[index].alert_name + ") (limit -" + MinMaxValues + ")")} />
                        </div>
                        <div style={{ marginTop: '10px' }}>
                                {metrics.length > 0 && <Typography variant="lable-01-s" value={`${props.dictdata[index].value} @ ${timeFormat(props.dictdata[index].value_time)} - ${instruName(props.dictdata[index].iid)} - ${intrumetric(props.dictdata[index].iid, alert.key)}- ${timeFormat(props.dictdata[index].time)}`} className={classes.text2} />}
                        </div>
                    </li>
                  </ul>  
              </div>
              </CellMeasurer>
          ) 

    }

    if (props.dictdata !== undefined && props.dictdata.length !== 0) { 

         return ( 
        <AutoSizer>
          {({ width, height }) => (
            <List
              width={width}
              height={height}
              deferredMeasurementCache={cache}
              rowHeight={cache.rowHeight}
              rowRenderer={renderRow}
              rowCount={props.dictdata.length}
              overscanRowCount={3}
            />
          )}
        </AutoSizer> 
      )
    }

    return (
        <div style={{ textAlign: "center"}} > 
            <Typography variant="4xl-body-01" value={t("No Alerts")} color="primary" />
            <Typography value={t("EditORReload")}  variant="heading-02-sm" />
                
             
        </div>
    );

}
