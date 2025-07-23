import { memo } from 'react';
import { Handle, Position } from 'reactflow';

const MudMixer = ({ data, isConnectable }) => {
  return (
    <div className={data.device}>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable}/>
      <Handle type="target" position={Position.Left} isConnectable={isConnectable}/>
      <div style={{ padding: 10 }}>{data.label}</div>
      <div style={{ padding: 10 }}>{data.value}</div>
      <Handle type="source" position={Position.Right} isConnectable={isConnectable}/>
    </div>
  );
};

export default memo(MudMixer);