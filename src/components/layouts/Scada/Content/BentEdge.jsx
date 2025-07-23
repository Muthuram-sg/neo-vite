import React from 'react';
import { getBezierPath, getEdgeCenter } from 'reactflow';

const BentEdge = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style, markerEnd }) => {
    // Use getBezierPath for a curved line
    const [path] = getBezierPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition
    });

    return (
        <path
            id={id}
            style={{ ...style, stroke: 'blue', strokeWidth: 2, fill: 'transparent' }} // Blue color for the line
            d={path}
            markerEnd={markerEnd}
        />
    );
};

export default BentEdge;
