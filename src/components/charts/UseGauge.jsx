import React from "react";
import { useRecoilState } from "recoil";
import { useGauge } from "use-gauge";
import "./gauge.css";
import { themeMode } from "recoilStore/atoms";



export default function UseGauge(props) {
  const [curTheme] = useRecoilState(themeMode)
  const  value = Math.abs(Math.min(props.value, 120));
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
    numTicks: 21, // the number of ticks to display between the min and max values
    diameter: 180, // diameter of the gauge itself
    domain: [0, 120], // Min and max values for your gauge. *Please* use a min that's smaller than the max :)
  });

const { tip, base, points } = getNeedleProps({
    value,
    baseRadius: 4,
    tipRadius: 1,
  });

  return (
    <div style={{height:"60%"}}>
      <svg className="w-full overflow-visible p-2" {...getSVGProps()} width={150}>
        <g id="arcs">
          <path
            {...getArcProps({
              offset: 30,
              startAngle: 45,
              endAngle: 315
            })}
            fill="none"
            className="stroke-gray-200"
            strokeLinecap="round"
            strokeWidth={20}
          />
          <path
            {...getArcProps({
              offset: 30,
              startAngle: 45,
              endAngle:valueToAngle(value)  < 670 ? valueToAngle(value) : 669
            })}
            fill="none"
            className="stroke-green-400"
            strokeLinecap="round"
            strokeWidth={20}
          />
        </g>
        <g id="ticks">
          {ticks.map((angle) => {
            const asValue = angleToValue(angle);
            const showText = asValue === 0  || asValue === 60 || asValue === 120;

            return (
              <React.Fragment key={`tick-group-${angle}`}>
                <line
                  className="stroke-gray-300"
                  strokeWidth={2}
                  {...getTickProps({ angle, length: showText ? 12 : 6 })}
                />
                {showText && (
                  <text
                    className={`text-sm font-medium ${curTheme === 'dark'?"darkText":"lightText"}`} 
                    {...getLabelProps({ angle, offset: 20 })}
                  >
                    {asValue+"%"}
                  </text>
                )}
              </React.Fragment>
            );
          })}
        </g>
        <g id="needle">
          <circle className="fill-gray-300" {...base} r={20} />
          <circle className="fill-gray-700" {...base} />
          <circle className="fill-gray-700" {...tip} />
          <polyline className="fill-gray-700"  points={points} />
          <circle className="fill-gray-700" {...base} r={4} />
        </g>
      </svg>
      <div className="gauge-label">
        {value + "%"}
      </div>
    </div>
  );
}