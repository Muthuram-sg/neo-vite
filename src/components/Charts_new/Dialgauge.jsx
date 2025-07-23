import React from 'react'; 
import moment from 'moment'; 
import { useGauge } from "use-gauge"; 
export default function Dialgauge(props){ 
    let value = props.latestValue?props.latestValue:0;
    let timerange = props.latestTime?props.latestTime:"";
    const arc1 = props.arc1Min && props.arc2Max? props.arc1Max:33.4; 
    const arc2 = props.arc1Min && props.arc2Max ? props.arc2Min:66.8;
    const arc3 = props.arc1Min && props.arc2Max ? props.arc2Max:100;
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
        numTicks: 11, // the number of ticks to display between the min and max values
        diameter: props.width?props.width - (60/100*props.width):0, // diameter of the gauge itself
        domain: props.arc1Min && props.arc2Max?[props.arc1Min,props.arc2Max]:[0, 100], // Min and max values for your gauge. *Please* use a min that's smaller than the max :)
    });  
    const { tip, base, points } = getNeedleProps({
        value,
        baseRadius: 6,
        tipRadius: 1,
      });
    return(
        <div> 
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
                  endAngle: valueToAngle(arc1)
                })}
                stroke={props.color1?props.color1:"#76CA66"}
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
                stroke={props.color2?props.color2:"#FBC756"}
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
                stroke={props.color3?props.color3:"#F35151"} 
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
          <p style={{textAlign: 'center',fontSize: 16,fontWeight: 500,marginBlockStart: 0,marginBlockEnd: 0}}>{`${value?Number(value).toFixed(2):0}${value && props.unit?props.unit:''}`}</p>
          <p style={{textAlign: 'center',fontSize: 13,fontWeight: 500,marginBlockStart: 0,marginBlockEnd: 0}}>{`${moment(timerange).format('HH:mm:ss')}`}</p>
        </div> 
    )
}