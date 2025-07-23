import React,{useCallback } from "react";
import { getSmoothStepPath, getStraightPath ,Position,useReactFlow} from "reactflow";


const PipeLineDashed = ({ id, sourceX, sourceY, targetX, targetY, source, target,sourceHandle, targetHandle,style,data }) => {
  const { getNode } = useReactFlow();
  const { getEdges } = useReactFlow();
  const { setEdges } = useReactFlow();
  let SourceID = getEdges(source).find(f=> f.id === id)
  const IsreversConn = SourceID.markerEnd.type
  // console.log('Target Node ID:', target);  // Target node ID
  // console.log('Target Node:', targetNode); // Full node object
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
        case "conveyor":
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

       
  return (
     
    <g>
       

      {/* Inner Pipeline Path with Horizontal Gradient */}
      <path
        d={edgePath}
        stroke={`#fff`}
        strokeWidth={style.strokeWidth+10}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={edgePath}
        stroke={`${style.stroke+"FF"}`}
        strokeWidth={style.strokeWidth+10}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={edgePath}
        stroke={`#fff`}
        strokeWidth={style.strokeWidth+6}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={edgePath}
        stroke={`${style.stroke+"BF"}`}
        strokeWidth={style.strokeWidth+6}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={edgePath}
        stroke={`#fff`}
        strokeWidth={style.strokeWidth+1}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={edgePath}
        stroke={`${style.stroke+"80"}`}
        strokeWidth={style.strokeWidth+1}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={edgePath}
        stroke={`#fff`}
        strokeWidth={style.strokeWidth/2}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={edgePath}
        stroke={`${style.stroke+"40"}`}
        strokeWidth={style.strokeWidth/2}
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
};

export default PipeLineDashed;

// 🔹 Opacity Levels for #0863DF:

// #0863DFFF → 100% (fully opaque)
// #0863DFBF → 75% opacity
// #0863DF80 → 50% opacity
// #0863DF40 → 25% opacity
// #0863DF00 → 0% (fully transparent)
