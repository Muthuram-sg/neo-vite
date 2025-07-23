import { memo } from 'react';
import { Handle, Position } from 'reactflow';

const NodeComponent = ({ data }) => {
  const { label, value, device, icon: Icon, image } = data;

  return (
    <div className={device || 'default-node'}>
      {/* Left connection node */}
      <Handle
        type="target"
        position={Position.Left} // Left position for vertical connections
        id="left-in"
        style={{ top: '10%' }} // Position the handle at the middle of the left side
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-out"
        style={{ top: '90%' }} // Position the handle at the middle of the left side
      />
      
      {/* Right connection node */}
      <Handle
        type="target"
        position={Position.Right} // Right position for vertical connections
        id="right-in"
        style={{ top: '10%' }} // Position the handle at the middle of the right side
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-out"
        style={{ top: '90%' }} // Position the handle at the middle of the right side
      />

      {/* Top connection node */}
      <Handle
        type="target"
        position={Position.Top} // Top position for horizontal connections
        id="top-in"
        style={{ left: '50%' }} // Position the handle at the middle of the top side
      />
      <Handle
        type="source"
        position={Position.Top}
        id="top-out"
        style={{ left: '50%' }} // Position the handle at the middle of the top side
      />

      {/* Bottom connection node */}
      <Handle
        type="target"
        position={Position.Bottom} // Bottom position for horizontal connections
        id="bottom-in"
        style={{ left: '50%' }} // Position the handle at the middle of the bottom side
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-out"
        style={{ left: '50%' }} // Position the handle at the middle of the bottom side
      />

      <div style={{ padding: 10, display: 'flex', alignItems: 'center', flexDirection: 'column', cursor:'pointer' }}>
        {/* Render the React component icon if provided */}
        {Icon && <Icon style={{ width: 60, height: 55, marginBottom: 5 }} />}
        
        {/* Render an image if provided (e.g., from a URL or static path) */}
        {image && !Icon && (
          <img
            src={image}
            alt={label || 'Node'}
            style={{
              maxWidth: '100%',
              maxHeight: '60px',
              marginBottom: 5,
            }}
          />
        )}
        
        {/* Fallback to display the label */}
        <span style={{ fontSize: '0.50rem' }}>{label}</span>
      </div>
      
      {/* Render additional value if provided */}
      {value && <div style={{ padding: 10 }}>{value}</div>}
    </div>
  );
};

export default memo(NodeComponent);
