import React,{useCallback } from "react";
import { getSmoothStepPath, getStraightPath ,Position,useReactFlow} from "reactflow";


const DashedConnector = ({ id, sourceX, sourceY, targetX, targetY, source, target,sourceHandle, targetHandle,style,data }) => {
  const { getNode } = useReactFlow();
  const { getEdges } = useReactFlow();
  const { setEdges } = useReactFlow();
  let SourceID = getEdges(source).find(f=> f.id === id)
  const IsreversConn = SourceID.markerEnd.type
  // console.log('Target Node ID:', target);  // Target node ID
  // console.log('Target Node:', targetNode); // Full node object
  let markerEndID
  let markerstartID
    const determinePosition = (sourceX, sourceY, targetX, targetY) => {
        let sourcePosition, targetPosition;
        
      console.log(sourceX, sourceY, targetX, targetY,"sourceX, sourceY, targetX, targetY",id,SourceID,style,data)
      if(SourceID && SourceID.sourceHandle === 'bottom-out' && SourceID.targetHandle === 'right-in'){
        sourcePosition = Position.Bottom;
        targetPosition = Position.Right;
        markerEndID = `arrow-right-${id}`
        markerstartID = `arrow-bottom-${id}`
      } else if (SourceID && SourceID.sourceHandle === 'bottom-out' && SourceID.targetHandle === 'bottom-in') {
        sourcePosition = Position.Bottom;
        targetPosition = Position.Bottom;
        markerEndID = `arrow-bottom-${id}`
        markerstartID = `arrow-bottom-${id}`
      } else if (SourceID && SourceID.sourceHandle === 'bottom-out' && SourceID.targetHandle === 'top-in') {
        sourcePosition = Position.Bottom;
        targetPosition = Position.Top;
        markerEndID = `arrow-top-${id}`
        markerstartID = `arrow-bottom-${id}`
      } else if (SourceID && SourceID.sourceHandle === 'bottom-out' && SourceID.targetHandle === 'left-in') {
        sourcePosition = Position.Bottom;
        targetPosition = Position.Left;
        markerEndID = `arrow-left-${id}`
        markerstartID = `arrow-bottom-${id}`
      } else if(SourceID && SourceID.sourceHandle === 'right-out' && SourceID.targetHandle === 'right-in'){
        sourcePosition = Position.Right;
        targetPosition = Position.Right;
        markerEndID = `arrow-right-${id}`
        markerstartID = `arrow-right-${id}`
      } else if (SourceID && SourceID.sourceHandle === 'right-out' && SourceID.targetHandle === 'bottom-in') {
        sourcePosition = Position.Right;
        targetPosition = Position.Bottom;
        markerEndID = `arrow-bottom-${id}`
        markerstartID = `arrow-right-${id}`
      } else if (SourceID && SourceID.sourceHandle === 'right-out' && SourceID.targetHandle === 'top-in') {
        sourcePosition = Position.Right;
        targetPosition = Position.Top;
        markerEndID = `arrow-top-${id}`
        markerstartID = `arrow-right-${id}`
      } else if (SourceID && SourceID.sourceHandle === 'right-out' && SourceID.targetHandle === 'left-in') {
        sourcePosition = Position.Right;
        targetPosition = Position.Left;
        markerEndID = `arrow-left-${id}`
        markerstartID = `arrow-right-${id}`
      } else if(SourceID && SourceID.sourceHandle === 'top-out' && SourceID.targetHandle === 'right-in') { 
          sourcePosition = Position.Top;
          targetPosition = Position.Right;
          markerEndID = `arrow-right-${id}`
          markerstartID = `arrow-top-${id}`
        }else if (SourceID && SourceID.sourceHandle === 'top-out' && SourceID.targetHandle === 'bottom-in') {
          sourcePosition = Position.Top;
          targetPosition = Position.Bottom;
          markerEndID = `arrow-bottom-${id}`
          markerstartID = `arrow-top-${id}`
        } else if (SourceID && SourceID.sourceHandle === 'top-out' && SourceID.targetHandle === 'top-in') {
          sourcePosition = Position.Top;
          targetPosition = Position.Top;
          markerEndID = `arrow-top-${id}`
          markerstartID = `arrow-top-${id}`
        } else if (SourceID && SourceID.sourceHandle === 'top-out' && SourceID.targetHandle === 'left-in') {
          sourcePosition = Position.Top;
          targetPosition = Position.Left;
          markerEndID = `arrow-left-${id}`
          markerstartID = `arrow-top-${id}`
        } else if (SourceID && SourceID.sourceHandle === 'left-out' && SourceID.targetHandle === 'right-in') { 
          sourcePosition = Position.Left;
          targetPosition = Position.Right;
          markerEndID = `arrow-right-${id}`
          markerstartID = `arrow-left-${id}`
        }else if (SourceID && SourceID.sourceHandle === 'left-out' && SourceID.targetHandle === 'bottom-in') {
          sourcePosition = Position.Left;
          targetPosition = Position.Bottom;
          markerEndID = `arrow-bottom-${id}`
          markerstartID = `arrow-left-${id}`
        } else if (SourceID && SourceID.sourceHandle === 'left-out' && SourceID.targetHandle === 'top-in') {
          sourcePosition = Position.Left;
          targetPosition = Position.Top;
          markerEndID = `arrow-top-${id}`
          markerstartID = `arrow-left-${id}`
        } else if (SourceID && SourceID.sourceHandle === 'left-out' && SourceID.targetHandle === 'left-in') {
          sourcePosition = Position.Left;
          targetPosition = Position.Left;
          markerEndID = `arrow-left-${id}`
          markerstartID = `arrow-left-${id}`
        } else { 
          sourcePosition = Position.Top;
          targetPosition = Position.Bottom;
          markerEndID = `arrow-bottom-${id}`
          markerstartID = `arrow-top-${id}`
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

      const conDashspace = (5 + style.strokeWidth)

       console.log(markerstartID,"markerID",markerEndID,IsreversConn,SourceID)
  return (
     
    <g>
      {/* Define Arrow Marker */}
      <defs>
        <marker
          id={`arrow-left-${id}`}
          viewBox="0 0 10 10"
          refX="0"
          refY="5"
          markerWidth={(style.strokeWidth/2)+3}
          markerHeight={(style.strokeWidth/2)+3}
          orient="180"
        >
          <path d="M 0 5 L 10 0 L 10 10 Z" fill={style.stroke} />
        </marker>

        <marker
          id={`arrow-right-${id}`}
          viewBox="0 0 10 10"
          refX="0"
          refY="5"
          markerWidth={(style.strokeWidth/2)+3}
          markerHeight={(style.strokeWidth/2)+3}
          orient="auto-start"
        >
          <path d="M 0 5 L 10 0 L 10 10 Z" fill={style.stroke} />
        </marker>

        <marker
          id={`arrow-top-${id}`}
          viewBox="0 0 10 10"
          refX="0"
          refY="5"
          markerWidth={(style.strokeWidth/2)+3}
          markerHeight={(style.strokeWidth/2)+3}
          orient="-90"
        >
          <path d="M 0 5 L 10 0 L 10 10 Z" fill={style.stroke} />
        </marker>
        
        <marker
          id={`arrow-bottom-${id}`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth={(style.strokeWidth/2)+3}
          markerHeight={(style.strokeWidth/2)+3}
          orient="-90"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={style.stroke} />
        </marker>
      </defs>

      {/* Dashed Line Edge */}
      <path
        id={id}
        d={edgePath}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth+1}
        fill="none"
        strokeDasharray={`5,${conDashspace}`} // Dashed effect
        strokeLinecap="round"
        markerEnd={IsreversConn ? `url(#${markerEndID})` : 'none'} // Attach marker at start
        markerStart={IsreversConn ? 'none':`url(#${markerstartID})`} // Attach marker at start
        
      />
    </g>
  );
};

export default DashedConnector; 
