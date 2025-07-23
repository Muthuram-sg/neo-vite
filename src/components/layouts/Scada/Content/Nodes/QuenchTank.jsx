import { memo } from 'react';
import { Handle, Position } from 'reactflow';

const QuenchTank = ({ data }) => {
  return (
    <div className={data.device}>
      <Handle type="target" position={Position.Left} />
      <div style={{ padding: 10 }}>{data.label}</div>
      <div style={{ padding: 10 }}>{data.value}</div>
    </div>
  );
};

export default memo(QuenchTank);