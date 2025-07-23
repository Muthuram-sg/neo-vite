import React from 'react';
import { Handle, Position } from 'reactflow';

const CustomNode = ({ data, isConnectable }) => {
    const Icon = data.icon; // Extract the icon

    return (
        <div style={{ padding: 10, border: '1px solid #ccc', borderRadius: 5, textAlign: 'center' }}>
            {Icon && <Icon style={{ width: 40, height: 40 }} />} {/* Render the SVG */}
            <div>{data.label}</div>
            <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
            <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
        </div>
    );
};

export default React.memo(CustomNode);
