// //working code
// import { memo } from 'react';
// import { Handle, Position } from 'reactflow';

// const NodeComponent = ({ data, selected }) => {
//   const { label, value, device, icon: Icon, image, styleType, details, metricValue } = data;

//   const isDisplayNode = styleType === 'display';

//   // Styles for display node
//   const displayNodeStyle = {
//     backgroundColor: '#f0f0f0', // Light gray for display nodes
//     padding: '10px',
//     borderRadius: '5px',
//     width: '150px',
//     textAlign: 'center',
//     boxShadow: selected ? '0 4px 8px rgba(0, 123, 255, 0.2)' : 'none',
//   };

//   // Styles for component node (default)
//   const componentNodeStyle = {
//     border: selected ? '1px solid #007bff' : '1px solid #ccc', // Highlight border when selected
//     borderRadius: '5px',
//     padding: 10,
//     position: 'relative',
//     backgroundColor: '#fff', // White background for component nodes
//     boxShadow: selected ? '0 4px 8px rgba(0, 123, 255, 0.2)' : 'none',
//   };

//   // Conditionally use either displayNodeStyle or componentNodeStyle based on the node type
//   const nodeStyle = isDisplayNode ? displayNodeStyle : componentNodeStyle;

//   return (
//     <div
//       className={`${device || 'default-node'} ${selected ? 'selected-node' : ''}`}
//       style={nodeStyle}
//     >
//       {/* Render connection handles */}
//       {!isDisplayNode && (
//         <>
//       <Handle type="target" position={Position.Left} id="left-in" style={{ top: '50%' }} />
//       <Handle type="source" position={Position.Left} id="left-out" style={{ top: '50%' }} />
//       <Handle type="target" position={Position.Right} id="right-in" style={{ top: '50%' }} />
//       <Handle type="source" position={Position.Right} id="right-out" style={{ top: '50%' }} />
//       <Handle type="target" position={Position.Top} id="top-in" style={{ left: '50%' }} />
//       <Handle type="source" position={Position.Top} id="top-out" style={{ left: '50%' }} />
//       <Handle type="target" position={Position.Bottom} id="bottom-in" style={{ left: '50%' }} />
//       <Handle type="source" position={Position.Bottom} id="bottom-out" style={{ left: '50%' }} />
//       </>
//       )}

//       <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
//         {/* Render the React component icon if provided */}
//         {!isDisplayNode && Icon && <Icon style={{ width: 60, height: 55, marginBottom: 5 }} />}
        
//         {/* Render an image if provided */}
//         {/* {image && !Icon && (
//           <img
//             src={image}
//             alt={label || 'Node'}
//             style={{
//               maxWidth: '100%',
//               maxHeight: '60px',
//               marginBottom: 5,
//             }}
//           />
//         )} */}
        
//         {/* Fallback to display the label */}
//         <span style={{ fontSize: '0.35rem' }}>{label}</span>
//       </div>

//       {/* Render additional value if provided for component node */}
//       {value && !isDisplayNode && <div style={{ padding: 5 }}>{value}</div>}

//       {/* For display node, render instrument, metric, and unit */}
//       {isDisplayNode && details && (
//         <div style={{ padding: '3px', textAlign: 'center', fontSize: '0.35rem' }}>
//           <div>{` ${details.instrument} (${details.instrumentid})`}</div>
//           <div>{` ${details.metric} `}</div>
//           {metricValue && (
//              <div>{` {metricValue} ${details.metricUnit}`}</div>
//           )}
//           <div>{` ${details.value} ${details.metricUnit}`}</div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default memo(NodeComponent);

//new apihit4 seems working

import React, { useEffect, useState, memo, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { selectedPlant, dashBtnGrp } from 'recoilStore/atoms';
import { useRecoilState } from 'recoil';
import useFetchDashboardData from 'components/layouts/Dashboards/hooks/useFetchDashboardData';
import configParam from 'config';

const NodeComponent = ({ data, selected  }) => {
 
  const [nodeData, setNodeData] = useState(data);
  // console.log('Raw Data',data);
  // console.log ('Node Data',nodeData);
  const [hasFetched, setHasFetched] = useState(false);
  const [btGroupValue] = useRecoilState(dashBtnGrp);
  const [headPlant] = useRecoilState(selectedPlant);

  const {
    fetchDashboardData,
    getfetchDashboard,
    fetchDashboardLoading,
    fetchDashboardError,
  } = useFetchDashboardData();

  const lastTime = configParam.DATE_ARR(btGroupValue, headPlant);
  //console.log(`${headPlant?.schema}/data/${data.details.instrumentid}/${data.details.metric}`);
  const to = new Date();
  const from = new Date(to.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
  const startrange = formatWithOffset(from);
  const endrange = formatWithOffset(to);

  function formatWithOffset(date) {
    let isoString = date.toISOString();
    let offset = '+05:30'; // Specify the required offset
    return isoString.replace('Z', offset); // Replace 'Z' (UTC) with the desired offset
  }

  const isDisplayNode = data.styleType === 'display';
  //console.log('isDisplayNode:', isDisplayNode);
  const fetchNodeData = useCallback(() => {
    if (isDisplayNode && !hasFetched) {
      const params = {
        schema: headPlant.schema,
        instrument: data.details.instrumentid,
        metric: data.details.metric,
        type: 'singleText',
        from: startrange,
        to: endrange,
        isConsumption: false,
      };
      //getfetchDashboard('/dashboards/getdashboard', params);
      getfetchDashboard("/dashboards/getdashboard", params, [], false, [], '', lastTime);
      setHasFetched(true);
    }
  }, [
    isDisplayNode,
    hasFetched,
    
    headPlant.schema,
    startrange,
    endrange,
    getfetchDashboard,
  ]);

  useEffect(() => {
    fetchNodeData();
  }, [fetchNodeData]);

 
  useEffect(() => {
   // console.log('fetchDashboardData:', fetchDashboardData);
    if (isDisplayNode) {
      if (fetchDashboardData && fetchDashboardData.length > 0) {
        const newValue = fetchDashboardData[0]?.value;
       // console.log('Updating value in node data:', newValue);
        setNodeData((prevData) => ({
          ...prevData,
          value: newValue,
        }));
      } else if (fetchDashboardError) {
       // console.error('Error fetching data:', fetchDashboardError);
        setNodeData((prevData) => ({
          ...prevData,
          value: 'Error',
        }));
      } else if (!fetchDashboardLoading && !fetchDashboardData) {
       // console.log('No data available');
        setNodeData((prevData) => ({
          ...prevData,
          value: 'N/A',
        }));
      }
    }
  }, [fetchDashboardData, fetchDashboardError, fetchDashboardLoading, isDisplayNode]);
  
  

  const { label, value, device, styleType,  icon: Icon, image, details } = nodeData;
  // const { label, value, device, icon: Icon, image, styleType, details, metricValue } = data;
  const nodeStyle = isDisplayNode
    ? {
        backgroundColor: '#f0f0f0',
        padding: '10px',
        borderRadius: '5px',
        width: '150px',
        textAlign: 'center',
        boxShadow: selected ? '0 4px 8px rgba(0, 123, 255, 0.2)' : 'none',
      }
    : {
        border: selected ? '1px solid #007bff' : '1px solid #ccc',
        borderRadius: '5px',
        padding: 10,
        position: 'relative',
        backgroundColor: '#fff',
        boxShadow: selected ? '0 4px 8px rgba(0, 123, 255, 0.2)' : 'none',
      };

  return (
    <div
      className={`${device || 'default-node'} ${selected ? 'selected-node' : ''}`}
      style={nodeStyle}
    >
      {/* Render connection handles */}
      {!isDisplayNode && (
        <>
          <Handle type="target" position={Position.Left} id="left-in" style={{ top: '50%' }} />
          <Handle type="source" position={Position.Left} id="left-out" style={{ top: '50%' }} />
          <Handle type="target" position={Position.Right} id="right-in" style={{ top: '50%' }} />
          <Handle type="source" position={Position.Right} id="right-out" style={{ top: '50%' }} />
          <Handle type="target" position={Position.Top} id="top-in" style={{ left: '50%' }} />
          <Handle type="source" position={Position.Top} id="top-out" style={{ left: '50%' }} />
          <Handle type="target" position={Position.Bottom} id="bottom-in" style={{ left: '50%' }} />
          <Handle type="source" position={Position.Bottom} id="bottom-out" style={{ left: '50%' }} />
        </>
      )}

      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', cursor:'pointer' }}>
        {/* Render the React component icon if provided */}
        {!isDisplayNode && Icon && <Icon style={{ width: 60, height: 55, marginBottom: 5 }} />}
        {!isDisplayNode && <span style={{ fontSize: '0.35rem' }}>{label}</span>}
      </div>

      {/* Render additional value if provided for component node */}
      {/* {value && !isDisplayNode && <div style={{ padding: 5 }}>{value}</div>} */}

      {/* For display node, render instrument, metric, and unit */}
      {isDisplayNode && details && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 5  }}>
          <div>{`${details.instrument} (${details.instrumentid})`}</div>
          <div>{`${details.metric}`}</div>
          {value && <div style={{ padding: 5 }}>{value} </div>}
          <div>{`${details.metricUnit}`}</div>
        </div>
      )}



    </div>
  );
};

export default memo(NodeComponent);





