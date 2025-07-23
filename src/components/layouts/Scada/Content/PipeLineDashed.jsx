import React,{useCallback } from "react";
import { getSmoothStepPath, getStraightPath ,Position,useReactFlow} from "reactflow";


const PipeLineDashed = ({ id, sourceX, sourceY, targetX, targetY, source, target,sourceHandle, targetHandle,style,data }) => {
  const { getNode } = useReactFlow();
  const { getEdges } = useReactFlow();
  const { setEdges } = useReactFlow();
  let SourceID = getEdges(source).find(f=> f.id === id)
  const IsreversConn = SourceID.markerEnd.type
  // console.log('Target Node ID:', target);  // Target node ID
  
  let sourNode = getEdges(source).find(f=> f.id === id)
  let TarNode = getEdges(target).find(f=> f.id === id)
  const sourceElement = document.querySelector(`[data-id="${source}-${SourceID.sourceHandle}-source"]`);
  const targetElement = document.querySelector(`[data-id="${target}-${SourceID.targetHandle}-target"]`);
  let sourceRect= sourceElement.getBoundingClientRect();
  let targetRect= targetElement.getBoundingClientRect();  

  let IsStraight = (sourceRect.top === targetRect.top || sourceRect.left === targetRect.left)  
  
  // console.log('Target Node:isEdgeStraight',sourceRect,targetRect,source,IsStraight,IsreversConn); // Full node object

    const determinePosition = (sourceX, sourceY, targetX, targetY) => {
        let sourcePosition, targetPosition;
        
      // console.log(sourceX, sourceY, targetX, targetY,"sourceX, sourceY, targetX, targetY",id,SourceID,style,data)
      if(SourceID && SourceID.sourceHandle === 'bottom-out' && SourceID.targetHandle === 'right-in'){
        sourcePosition = Position.Bottom;
        targetPosition = Position.Right;
      } else if (SourceID && SourceID.sourceHandle === 'bottom-out' && SourceID.targetHandle === 'bottom-in') {
        sourcePosition = Position.Bottom;
        targetPosition = Position.Bottom;
      } else if (SourceID && SourceID.sourceHandle === 'bottom-out' && SourceID.targetHandle === 'top-in') {
        sourcePosition = Position.Bottom;
        targetPosition = Position.Top;
      } else if (SourceID && SourceID.sourceHandle === 'bottom-out' && SourceID.targetHandle === 'left-in') {
        sourcePosition = Position.Bottom;
        targetPosition = Position.Left;
      } else if(SourceID && SourceID.sourceHandle === 'right-out' && SourceID.targetHandle === 'right-in'){
        sourcePosition = Position.Right;
        targetPosition = Position.Right;
      } else if (SourceID && SourceID.sourceHandle === 'right-out' && SourceID.targetHandle === 'bottom-in') {
        sourcePosition = Position.Right;
        targetPosition = Position.Bottom;
      } else if (SourceID && SourceID.sourceHandle === 'right-out' && SourceID.targetHandle === 'top-in') {
        sourcePosition = Position.Right;
        targetPosition = Position.Top;
      } else if (SourceID && SourceID.sourceHandle === 'right-out' && SourceID.targetHandle === 'left-in') {
        sourcePosition = Position.Right;
        targetPosition = Position.Left;
      } else if(SourceID && SourceID.sourceHandle === 'top-out' && SourceID.targetHandle === 'right-in') { 
          sourcePosition = Position.Top;
          targetPosition = Position.Right;
        }else if (SourceID && SourceID.sourceHandle === 'top-out' && SourceID.targetHandle === 'bottom-in') {
          sourcePosition = Position.Top;
          targetPosition = Position.Bottom;
        } else if (SourceID && SourceID.sourceHandle === 'top-out' && SourceID.targetHandle === 'top-in') {
          sourcePosition = Position.Top;
          targetPosition = Position.Top;
        } else if (SourceID && SourceID.sourceHandle === 'top-out' && SourceID.targetHandle === 'left-in') {
          sourcePosition = Position.Top;
          targetPosition = Position.Left;
        } else if (SourceID && SourceID.sourceHandle === 'left-out' && SourceID.targetHandle === 'right-in') { 
          sourcePosition = Position.Left;
          targetPosition = Position.Right;
        }else if (SourceID && SourceID.sourceHandle === 'left-out' && SourceID.targetHandle === 'bottom-in') {
          sourcePosition = Position.Left;
          targetPosition = Position.Bottom;
        } else if (SourceID && SourceID.sourceHandle === 'left-out' && SourceID.targetHandle === 'top-in') {
          sourcePosition = Position.Left;
          targetPosition = Position.Top;
        } else if (SourceID && SourceID.sourceHandle === 'left-out' && SourceID.targetHandle === 'left-in') {
          sourcePosition = Position.Left;
          targetPosition = Position.Left;
        } else { 
          sourcePosition = Position.Top;
          targetPosition = Position.Bottom;
        }
      
        return { sourcePosition, targetPosition };
      };
      
      // Inside the DashedPipelineEdge component
      const { sourcePosition, targetPosition } = determinePosition(sourceX, sourceY, targetX, targetY);

      let pathFunction;
      // console.log(data.type);
      switch (data.type) {
        case "straightpipe":
          pathFunction = getStraightPath;
          break;
        default:
          pathFunction = getSmoothStepPath;
      }
      
      const [edgePath] = pathFunction({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
      }); 

      let Isconveyer = data.type === 'conveyor' ? "6,16" : "10,7"
      const StrokeDash = data.type === "pipe-line-solid" ? "none" : Isconveyer  
      const StrokeWidth = data.type === "pipe-line-solid" ? 4 : 1
      const conDashspace = (6 + style.strokeWidth)
  return (
    <g>
      <defs>
        {/* Updated Gradient with different colors and duration */}
        <linearGradient
          id={`oil-gradient-${id}`}
          x1={"0%"}
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset={"0%"} stopColor={IsreversConn ? (style.stroke+"40") :style.stroke}>
            <animate
              attributeName="offset"
              values="0;1"
              dur="15s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="80%" stopColor={IsreversConn ? style.stroke : style.stroke+"40"}>
            <animate
              attributeName="offset"
              values="1;0"
              dur="15s"
              repeatCount="indefinite"
            />
          </stop>
        </linearGradient>

        <style>
          {`
            @keyframes oilFlowLeft {
              from { stroke-dashoffset: 0; }
              to { stroke-dashoffset: 30; }
            }
            @keyframes oilFlowRight {
              from { stroke-dashoffset: 30; }
              to { stroke-dashoffset: 0; }
            }
          `}
        </style>
      </defs>
      {data.type === 'conveyor' &&
      <path
        id={id}
        d={edgePath}
        stroke="black"
        strokeWidth={style.strokeWidth+ 13}
        fill="none"
        strokeLinecap="round"
      />}
      {data.type === 'conveyor' &&
      <path
        id={id}
        d={edgePath}
        stroke="#fff"
        strokeWidth={style.strokeWidth+ 10}
        fill="none"
        strokeLinecap="round"
      />}
      <path
        id={id}
        d={edgePath}
        stroke="black"
        strokeWidth={style.strokeWidth+8}
        fill="none"
        strokeLinecap="round"
      />
      <path
        id={id}
        d={edgePath}
        stroke="#fff"
        strokeWidth={style.strokeWidth+ 4}
        fill="none"
        strokeLinecap="round"
      />
      {data.type === 'conveyor' &&
      <path
        d={edgePath}
        stroke={IsStraight ? style.stroke: `url(#oil-gradient-${id})`}
        strokeWidth={style.strokeWidth+StrokeWidth}
        strokeDasharray={`0.5,${conDashspace}`}
        strokeLinecap="round"
        fill="none"
        style={{
          animation: `${IsreversConn ? "oilFlowLeft" : "oilFlowRight"} 2s linear infinite`,
        }}
      />}
      {data.type !== 'conveyor' &&
      <path
        d={edgePath}
        stroke={IsStraight ? style.stroke: `url(#oil-gradient-${id})`}
        strokeWidth={style.strokeWidth+StrokeWidth}
        strokeDasharray={StrokeDash}
        strokeLinecap="round"
        fill="none"
        style={{
          animation: `${IsreversConn ? "oilFlowLeft" : "oilFlowRight"} 2s linear infinite`,
          mixBlendMode: "multiply" // Helps with visibility
        }}
      /> }
      {/* <path
        d={edgePath}
        stroke={`url(#oil-gradient-${id})`}
        strokeWidth={3}
        strokeDasharray="1,6"
        strokeLinecap="round"
        fill="none"
        style={{
          animation: "oilFlow 2s linear infinite",
        }}
      />
      <path
        d={edgePath}
        stroke={`url(#oil-gradient-${id})`}
        strokeWidth={3}
        strokeDasharray="8,12"
        strokeLinecap="round"
        fill="none"
        style={{
          animation: "oilFlow 2s linear infinite",
        }}
      /> */}
      
    </g> 
  );
};

export default PipeLineDashed;
