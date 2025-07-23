
import React, { useState,useEffect } from 'react';
import moment from 'moment'; 
import { useGauge } from "use-gauge";
import { useTranslation } from 'react-i18next'; 
import  Typography  from "components/Core/Typography/TypographyNDL";
import { metricsArry } from 'recoilStore/atoms';
import { useRecoilState } from 'recoil';

export default function DialGaugeNew(props) {
  const { t } = useTranslation(); 
  const [widthgauage,setwidthgauage] = useState('') 
  const [metricList] = useRecoilState(metricsArry); 
  
  useEffect(() => {  
    let rangeW = props.width - props.height 
    let rangeH = props.height - props.width 
    if(rangeW > 150){
      let h = props.height
      if(h < 150){
        h= 5
      }
      setwidthgauage(h)
    }else{
      if(rangeH > 150){
        let w = props.width
        if(w < 150){
          w= 50
        }
        setwidthgauage(w)
      } else{
        let w = props.width
        if(w < 150){
          w= 5
        }
        if(props.height < 150){
          w= 5
        }
        setwidthgauage(w)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.width,props.height]);
  let value = 0;
  let time = 0;
  let Metric= ''
  const arc1 = props.meta.arc1? props.meta.arc1:33.4; 
  const arc2 = props.meta.arc2 ? props.meta.arc2:66.8;
  const arc3 = props.meta.arc3 ? props.meta.arc3:100;
  const {
    ticks,
    valueToAngle,
    angleToValue,
    getTickProps,
    getLabelProps,
    getArcProps,
    getNeedleProps,
    getSVGProps,
  } = useGauge({
    startAngle: 45, // determines where the gauge starts
    endAngle: 315, // determines where the gauge ends
    numTicks: (props.meta.arc3 < 13 ? props.meta.arc3 + 1  : 11) , // the number of ticks to display between the min and max values
    diameter: widthgauage - (60/100*widthgauage), // diameter of the gauge itself
    domain: (props.meta.arc1 && props.meta.arc3 ? [0,props.meta.arc3]:[0, 100]), // Min and max values for your gauge. *Please* use a min that's smaller than the max :)
  });  

  if (props.data !== undefined && props.data.length > 0) {    
    const lastItem = props.data[props.data.length - 1];
    if (lastItem && lastItem["value"] !== undefined) {
        value = !isNaN(props.meta.decimalPoint) ? Number(lastItem["value"]).toFixed(Number(props.meta.decimalPoint)) : lastItem["value"];
        Metric = metricList.find(x=>x.name === lastItem["key"]).metricUnitByMetricUnit.unit
      }
    time = props.data[props.data.length-1]['time'];
   

  }
  const { tip, base, points } = getNeedleProps({
    value,
    baseRadius: 6,
    tipRadius: 1,
  });
  let fontExp = "48px"
    if(props.width< 150){
        fontExp = "25px"
    } 
  // eslint-disable-next-line no-unused-vars 
  if (props.data !== undefined && props.data.length !== 0 && props.existData.length !==0) { 
    
      return (
        <React.Fragment>
        {(Number(widthgauage) === 5) &&
          <React.Fragment></React.Fragment>
        }
        {(Number(widthgauage) !== 5) &&
        <div  style={{marginTop: 50}} className="gauge-container"> 
          <svg className="w-full overflow-visible p-2" {...getSVGProps()}>
            <g id="arcs">
            <path
                {...getArcProps({
                  offset: 30,
                  startAngle: 45,
                  endAngle:315
                })}                
                fill="none" 
                className="stroke-gay-200"
                strokeLinecap="square"
                strokeWidth={20}
              /> 
              <path
                {...getArcProps({
                  offset: 30,
                  startAngle:45,
                  endAngle: valueToAngle(arc1)
                })}
                stroke={props.meta.color1?props.meta.color1:"#76CA66"}
                fill="none" 
                strokeLinecap="square"
                strokeWidth={20}
              /> 
              <path
                {...getArcProps({
                  offset: 30,
                  startAngle: valueToAngle(arc1),
                  endAngle: valueToAngle(arc2)
                })}
                fill="none" 
                stroke={props.meta.color2?props.meta.color2:"#FBC756"}
                strokeLinecap="square"
                strokeWidth={20}
              />     
              <path
                {...getArcProps({
                  offset: 30,
                  startAngle: valueToAngle(arc2),
                  endAngle: valueToAngle(arc3)
                })}
                fill="none"
                stroke={props.meta.color3?props.meta.color3:"#F35151"} 
                strokeLinecap="square"
                strokeWidth={20}
              />
            </g>
            <g id="ticks">
              {ticks.map((angle) => {
                const asValue = angleToValue(angle);  
                return (
                  <React.Fragment key={`tick-group-${angle}`}>
                    <line
                      className="stroke-gray-300"
                      strokeWidth={2}
                      {...getTickProps({ angle, length: 6 })}
                    /> 
                      <text
                        className="text-sm fill-gray-400 font-medium"
                        {...getLabelProps({ angle, offset: 20 })}
                      >
                        {asValue + " " + Metric}
                      </text> 
                  </React.Fragment>
                );
              })}
            </g> 
            <g id="needle">
              <circle fill="#C4C4C4" {...base} r={20} />
              <circle fill="#C4C4C4" {...base} />
              <circle fill="#C4C4C4" {...tip} />
              <polyline stroke="#C4C4C4"  points={points} />
              <circle   {...base} r={5} />
            </g>
          </svg>
          <p className='text-Text-text-primary dark:text-Text-text-primary-dark' style={{textAlign: 'center',fontSize: 16,fontWeight: 500,marginBlockStart: 0,marginBlockEnd: 0}}>{`${value?(!isNaN(props.meta.decimalPoint) ? (Number(value).toFixed(Number(props.meta.decimalPoint))) : (Math.floor(value))):0}${props.meta.unit?props.meta.unit:''}`}</p>
          {/* {
            Metric && 
            <p style={{textAlign: 'center',fontSize: 13,fontWeight: 500,marginBlockStart: 0,marginBlockEnd: 0}}>{Metric}</p>
           } */}
          <p className='text-Text-text-primary dark:text-Text-text-primary-dark'  style={{textAlign: 'center',fontSize: 13,fontWeight: 500,marginBlockStart: 0,marginBlockEnd: 0}}>{`${moment(time).format('HH:mm:ss')}`}</p>
        </div> }
        </React.Fragment>
      );
    }
    return (
      <div style={{ textAlign: "center" }}>
        <Typography variant="4xl-body-01" style={{color:'#0F6FFF', textAlign: "center", fontSize:fontExp }} value={t('No Data')}/>
        <Typography value={t('EditORReload')}  variant="heading-02-sm" />
      </div>
    );
  }