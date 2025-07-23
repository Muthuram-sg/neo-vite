import React from "react";

const ClickableBaseEdge = ({
  id,
  path,
  style,
  markerEnd,
  markerStart,
  interactionWidth = 20,
  onClick,
}) => {
  return (
    <>
      <defs>
        {/* Updated Gradient with different colors and duration */}
        <linearGradient
          id={`oil-gradient-${id}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#69B5FF">
            <animate
              attributeName="offset"
              values="0;1"
              dur="30s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stopColor="#0863DF">
            <animate
              attributeName="offset"
              values="1;0"
              dur="30s"
              repeatCount="indefinite"
            />
          </stop>
        </linearGradient>

        <style>
          {`
            @keyframes oilFlow {
              from { stroke-dashoffset: 0; }
              to { stroke-dashoffset: 30; }
            }
          `}
        </style>
      </defs>
      <path
        id={id}
        style={style}
        d={path}
        fill="none"
        className="react-flow__edge-path"
        markerEnd={markerEnd}
        markerStart={markerStart}
      />
      {interactionWidth && (
        <path
          d={path}
          fill="none"
          strokeOpacity={0}
          strokeWidth={interactionWidth}
          className="react-flow__edge-interaction"
          onClick={(e)=>onClick(e)}
        />
      )}
      <path
        id={id}
        d={path}
        stroke="black"
        strokeWidth={8}
        fill="none"
        strokeLinecap="round"
      />
      <path
        id={id}
        d={path}
        stroke="#fff"
        strokeWidth={6}
        fill="none"
        strokeLinecap="round"
        onClick={(e)=>onClick(e)}
      />
      <path
        d={path}
        stroke={"red"}
        strokeWidth={3}
        strokeDasharray="10,7"
        strokeLinecap="round"
        fill="none"
        onClick={(e)=>onClick(e)}
        style={{
          animation: "oilFlow 2s linear infinite",
        }}
      />
    </>
  );
};

ClickableBaseEdge.displayName = "BaseEdge";

export default ClickableBaseEdge;
