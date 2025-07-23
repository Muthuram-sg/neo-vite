import { memo } from 'react';
import { Handle, Position } from 'reactflow';

const Feeders = ({ data }) => {
  return (
    <div className={data.device}>
      <Handle type="target" position={Position.Top} />
      <div style={{ padding: 10 }}>{data.label}</div>
      <div style={{ padding: 10 }}>{data.value}</div>
      <Handle type="source" position={Position.Left} />
    </div>
  );
};

export default memo(Feeders);