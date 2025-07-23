import React from "react";
import {
  EdgeLabelRenderer,
  getBezierPath,
  getSmoothStepPath,
  getStraightPath,
  useReactFlow,
  Position
} from "reactflow";

import ClickableBaseEdge from "./ClickableBaseEdge"; 

const PositionableEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY, 
  style = {},
  markerEnd,
  source, target,sourceHandle, targetHandle,data
}) =>{
    const { getEdges } = useReactFlow();
    let SourceID = getEdges(source).find(f=> f.id === id)
  const IsreversConn = SourceID.markerEnd.type
  // console.log('Target Node ID:', target);  // Target node ID
  // console.log('Target Node:', targetNode); // Full node object
    const determinePosition = (sourceX, sourceY, targetX, targetY) => {
        let sourcePosition, targetPosition;
        
      console.log(sourceX, sourceY, targetX, targetY,"sourceX, sourceY, targetX, targetY",id,SourceID,style)
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
  const reactFlowInstance = useReactFlow();
  const positionHandlers = data?.positionHandlers ?? [];
  const type = data?.type ?? "default";
  const edgeSegmentsCount = positionHandlers.length + 1;
  let edgeSegmentsArray = [];

  let pathFunction;
  console.log(type);
  switch (type) {
    case "straight":
      pathFunction = getStraightPath;
      break;
    case "smoothstep":
      pathFunction = getSmoothStepPath;
      break;
    default:
      pathFunction = getBezierPath;
  }

  // calculate the origin and destination of all the segments
  for (let i = 0; i < edgeSegmentsCount; i++) {
    let segmentSourceX, segmentSourceY, segmentTargetX, segmentTargetY;

    if (i === 0) {
      segmentSourceX = sourceX;
      segmentSourceY = sourceY;
    } else {
      const handler = positionHandlers[i - 1];
      segmentSourceX = handler.x;
      segmentSourceY = handler.y;
    }

    if (i === edgeSegmentsCount - 1) {
      segmentTargetX = targetX;
      segmentTargetY = targetY;
    } else {
      const handler = positionHandlers[i];
      segmentTargetX = handler.x;
      segmentTargetY = handler.y;
    }

    const [edgePath, labelX, labelY] = pathFunction({
      sourceX: segmentSourceX,
      sourceY: segmentSourceY,
      sourcePosition,
      targetX: segmentTargetX,
      targetY: segmentTargetY,
      targetPosition,
    });
    edgeSegmentsArray.push({ edgePath, labelX, labelY });
  }

  return (
    <>
      {edgeSegmentsArray.map(({ edgePath, labelX, labelY }, index) => (
        <ClickableBaseEdge
          onClick={(event) => {
            const position = reactFlowInstance.screenToFlowPosition({
              x: event.clientX,
              y: event.clientY,
            });

            reactFlowInstance.setEdges((edges) => {
              const edgeIndex = edges.findIndex((edge) => edge.id === id);

              edges[edgeIndex].data.positionHandlers.splice(index, 0, {
                x: position.x,
                y: position.y,
              });
              return edges;
            });
          }}
          key={`edge${id}_segment${index}`}
          path={edgePath}
          markerEnd={markerEnd}
          style={style}
        />
      ))}
      {positionHandlers.map(({ x, y, active }, handlerIndex) => (
        <EdgeLabelRenderer key={`edge${id}_handler${handlerIndex}`}>
          <div
            className="nopan positionHandlerContainer"
            style={{
              transform: `translate(-50%, -50%) translate(${x}px,${y}px)`,
            }}
          >
            <div
              className={`positionHandlerEventContainer ${active} ${
                `${active ?? -1}` !== "-1" ? "active" : ""
              }`}
              data-active={active ?? -1}
              // mouse move is used to move the handler when its been mousedowned on
              onMouseMove={(event) => {
                let activeEdge = parseInt(event.target.dataset.active ?? -1);
                if (activeEdge === -1) {
                  return;
                }
                const position = reactFlowInstance.screenToFlowPosition({
                  x: event.clientX,
                  y: event.clientY,
                });
                reactFlowInstance.setEdges((edges) => {
                  edges[activeEdge].id = Math.random();
                  edges[activeEdge].data.positionHandlers[handlerIndex] = {
                    x: position.x,
                    y: position.y,
                    active: activeEdge,
                  };
                  return edges;
                });
              }}
              // mouse up is used to release all the handlers
              onMouseUp={() => {
                reactFlowInstance.setEdges((edges) => {
                  // const edgeIndex = edges.findIndex((edge) => edge.id === id);
                  for (let i = 0; i < edges.length; i++) {
                    const handlersLength =
                      edges[i].data.positionHandlers.length;
                    for (let j = 0; j < handlersLength; j++) {
                      edges[i].data.positionHandlers[j].active = -1;
                    }
                  }

                  return edges;
                });
              }}
            >
              <button
                className="positionHandler"
                data-active={active ?? -1}
                // mouse down is used to activate the handler
                onMouseDown={() => {
                  reactFlowInstance.setEdges((edges) => {
                    const edgeIndex = edges.findIndex((edge) => edge.id === id);
                    edges[edgeIndex].data.positionHandlers[
                      handlerIndex
                    ].active = edgeIndex;
                    return edges;
                  });
                }}
                // right click is used to delete the handler
                onContextMenu={(event) => {
                  event.preventDefault();
                  reactFlowInstance.setEdges((edges) => {
                    const edgeIndex = edges.findIndex((edge) => edge.id === id);
                    edges[edgeIndex].id = Math.random();
                    edges[edgeIndex].data.positionHandlers.splice(
                      handlerIndex,
                      1
                    );
                    return edges;
                  });
                }}
              ></button>
            </div>
          </div>
        </EdgeLabelRenderer>
      ))}
    </>
  );
}

export default PositionableEdge;
