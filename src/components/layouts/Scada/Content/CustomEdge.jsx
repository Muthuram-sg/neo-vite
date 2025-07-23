import { BaseEdge, getBezierPath } from 'reactflow';

export default function CustomEdge({ id, sourceX, sourceY, targetX, targetY }) {
  // Ensure there are valid source and target points to render the edge
  if (!sourceX || !sourceY || !targetX || !targetY) {
    return null; // Do not render anything if there are no valid source/target points
  }

  const stepHeight = 30;
  const stepWidth = Math.abs(targetX - sourceX) / 2; // Divide the horizontal length in two

  const points = [
    { x: sourceX, y: sourceY }, // start point
    { x: sourceX + stepWidth, y: sourceY }, // first horizontal step
    { x: sourceX + stepWidth, y: sourceY + stepHeight }, // first vertical step
    { x: targetX - stepWidth, y: targetY - stepHeight }, // second vertical step
    { x: targetX - stepWidth, y: targetY }, // second horizontal step
    { x: targetX, y: targetY }, // end point
  ];

  return (
    <>
      {/* Marker for the arrow */}
      <svg width="0" height="0">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="10"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="blue" />
          </marker>
        </defs>
      </svg>

      {/* BaseEdge component renders the styled edge */}
      <BaseEdge
        id={id}
        path={points}
        markerEnd="url(#arrowhead)" // Add arrow at the end of the line
        style={{
          stroke: 'blue',      // Blue color for the line
          strokeWidth: 1,      // Thickness of the line
        }}
      />
    </>
  );
}

// import React from "react";
// import { getBezierPath } from "reactflow";

// const OilPipelineEdge = ({ id, sourceX, sourceY, targetX, targetY }) => {
//   const [edgePath] = getBezierPath({ sourceX, sourceY, targetX, targetY });

//   return (
//     <g>
//       {/* Define the flowing oil effect */}
//       <defs>
//         <linearGradient id={`gradient-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
//           <stop offset="0%" stopColor="#6b3e26">
//             <animate
//               attributeName="offset"
//               values="0;1"
//               dur="2s"
//               repeatCount="indefinite"
//             />
//           </stop>
//           <stop offset="100%" stopColor="#3b2d1f">
//             <animate
//               attributeName="offset"
//               values="1;0"
//               dur="2s"
//               repeatCount="indefinite"
//             />
//           </stop>
//         </linearGradient>

//         <filter id="pipeShadow" x="-50%" y="-50%" width="200%" height="200%">
//           <feDropShadow
//             dx="2"
//             dy="2"
//             stdDeviation="3"
//             floodColor="#000000"
//             floodOpacity="0.3"
//           />
//         </filter>

//         <style>
//           {`
//             @keyframes oilFlow {
//               from { stroke-dashoffset: 40; }
//               to { stroke-dashoffset: 0; }
//             }
//           `}
//         </style>
//       </defs>

//       {/* Pipe Outer Layer */}
//       <path
//         d={edgePath}
//         stroke="#4d2f1a"
//         strokeWidth="10"
//         strokeLinecap="round"
//         filter="url(#pipeShadow)"
//       />

//       {/* Moving Oil Effect */}
//       <path
//         d={edgePath}
//         stroke={`url(#gradient-${id})`}
//         strokeWidth="6"
//         strokeDasharray="15"
//         strokeLinecap="round"
//         fill="none"
//         style={{
//           animation: "oilFlow 1s linear infinite",
//         }}
//       />
//     </g>
//   );
// };

// export default OilPipelineEdge;

