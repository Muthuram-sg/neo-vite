
import React, { useState,useEffect } from 'react'; 
import Typography from "components/Core/Typography/TypographyNDL";
import moment from 'moment'; 
import { useGauge } from "use-gauge";
import { useTranslation } from 'react-i18next'; 
import { metricsArry } from 'recoilStore/atoms';
import { useRecoilState } from 'recoil';

export default function FillGauge(props) {
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
        // console.log(((props.width * props.width) / (8 * props.width) + (props.width / 2)),"rangeH",props.width)
      } else{
        let w = props.width
        if(w < 150){
          w= 5
        }
        if(props.height < 150){
          w= 5
        }
        setwidthgauage(w)
        // console.log(((props.width * props.width) / (8 * props.height) + (props.height / 2)),"Elserange",props.width)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.width,props.height]);
  let value = 0;
  let timerange = 0; 
  let Metric = ''
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
    numTicks:(props.meta.arc3 < 13 ? props.meta.arc3 + 1  : 11), // the number of ticks to display between the min and max values
    diameter: widthgauage - (60/100*widthgauage), // diameter of the gauge itself
    domain: props.meta.arc1 && props.meta.arc3?[0,props.meta.arc3]:[0, 100], // Min and max values for your gauge. *Please* use a min that's smaller than the max :)
  }); 
  if (props.data !== undefined && props.data.length > 0 && props.existData.length !==0) {  
    const lastItem = props.data[props.data.length - 1];
      if (lastItem && lastItem["value"] !== undefined) {
          value = !isNaN(props.meta.decimalPoint) ? Number(lastItem["value"]).toFixed(Number(props.meta.decimalPoint)) : lastItem["value"];
          Metric = metricList.find(x=>x.name === lastItem["key"]).metricUnitByMetricUnit.unit
        } 
    timerange = props.data[props.data.length-1]['timerange'];
   
  }
  const { tip, base, points } = getNeedleProps({
    value,
    baseRadius: 6,
    tipRadius: 1,
  });
  const arc1 = props.meta.arc1? props.meta.arc1:33.4; 
  const arc2 = props.meta.arc2 ? props.meta.arc2:66.8;
  const arc3 = props.meta.arc3 ? props.meta.arc3:100;
  let fontExp = "48px"
  if(props.width< 150){
      fontExp = "25px"
  } 
  // eslint-disable-next-line no-unused-vars 
  if (value !== undefined && value > 0) {  
    // //console.log(parseFloat(props.dictdata[0][props.meta.dataName]))
      return (
        <React.Fragment>
          {(Number(widthgauage) === 5 ) &&
          <React.Fragment></React.Fragment>
          }
          {(Number(widthgauage) !== 5 ) &&
          <div  style={{marginTop: 50}}> 
            <svg className="w-full overflow-visible p-2" {...getSVGProps()}>
              <g id="arcs">
                <path
                  {...getArcProps({
                    offset: 30,
                    startAngle: 45,
                    endAngle: 315
                  })}
                  fill="none"
                  className="stroke-gray-200"
                  strokeLinecap="square"
                  strokeWidth={20}
                />              
                <path
                  {...getArcProps({
                    offset: 30,
                    startAngle: 45,
                    endAngle: value < arc1 ? valueToAngle(value):valueToAngle(arc1) 
                  })}
                  stroke={props.meta.color1?props.meta.color1:"#76CA66"}
                  fill="none" 
                  strokeLinecap="square"
                  strokeWidth={20}
                />
                {
                  value > arc1 &&(
                    <path
                      {...getArcProps({
                        offset: 30,
                        startAngle: valueToAngle(arc1),
                        endAngle: value < arc2 ? valueToAngle(value):valueToAngle(arc2)
                      })}
                      fill="none" 
                      stroke={props.meta.color2?props.meta.color2:"#FBC756"}
                      strokeLinecap="square"
                      strokeWidth={20}
                    />
                  )
                }         
                {
                  value >= arc2 &&(
                      <path
                          {...getArcProps({
                          offset: 30,
                          startAngle: valueToAngle(arc2),
                          endAngle: value < arc3 ? valueToAngle(value):valueToAngle(arc3)
                          })}
                          fill="none"
                          stroke={props.meta.color3?props.meta.color3:"#F35151"} 
                          strokeLinecap="square"
                          strokeWidth={20}
                      />
                  )
                } 
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
                          {asValue}
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
            <p className='text-Text-text-primary dark:text-Text-text-primary-dark font-geist-mono'  style={{textAlign: 'center',fontSize: 16,fontWeight: 500,marginBlockStart: 0,marginBlockEnd: 0}}>{`${value?(!isNaN(props.meta.decimalPoint) ? (Number(value).toFixed(Number(props.meta.decimalPoint))) : (Math.floor(value))):0}${props.meta.unit?props.meta.unit:''}`}</p>
           {
            Metric && 
            <p className='text-Text-text-primary dark:text-Text-text-primary-dark font-geist-sans' style={{textAlign: 'center',fontSize: 13,fontWeight: 500,marginBlockStart: 0,marginBlockEnd: 0}}>{Metric}</p>
           }
            <p className='text-Text-text-primary dark:text-Text-text-primary-dark font-geist-mono' style={{textAlign: 'center',fontSize: 13,fontWeight: 500,marginBlockStart: 0,marginBlockEnd: 0}}>{`${moment(timerange).format('HH:mm:ss')}`}</p>
          </div> }
        </React.Fragment>
      );
    }
    return (
      <div style={{ textAlign: "center" }}>
        <Typography variant="4xl-body-01" style={{color:'#0F6FFF', textAlign: "center",fontSize: fontExp}} value={t('No Data')}/>
        
        <Typography  value={t('EditORReload')}  variant="heading-02-sm" />
      </div>
    );
  }