
import React, { useEffect, useState, memo, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { selectedPlant, dashBtnGrp } from 'recoilStore/atoms';
import { useRecoilState } from 'recoil';
import useFetchDashboardData from 'components/layouts/Dashboards/hooks/useFetchDashboardData';
import configParam from 'config';
import { socket } from 'components/socket';
import { _check_and_get_token } from 'config';
import { refesh_neo_token } from 'config';

const NodeComponent = ({ data, selected  }) => {
 
  const [nodeData, setNodeData] = useState(data);
  const [hasFetched, setHasFetched] = useState(false);
  const [btGroupValue] = useRecoilState(dashBtnGrp);
  const [headPlant] = useRecoilState(selectedPlant);
  var socketRooms = [] 
  var iidRooms = []
  const [existData,setExistData] = useState([]);
  // if (existData && existData.length > 0) {
  //   // If data from socket exists, use that value
  //   const newValue = existData[0]?.value;
  //   console.log('value need to bind',newValue)
  // }

  //console.log('set data',existData[0].value)
  let scada_dashboard_data = existData

  const {
    fetchDashboardData,
    getfetchDashboard,
    fetchDashboardLoading,
    fetchDashboardError,
  } = useFetchDashboardData();

  const lastTime = configParam.DATE_ARR(btGroupValue, headPlant);

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
  //console.log(`${headPlant?.schema}/data/${data.details.instrumentid}/${data.details.metric}`);
  useEffect(() => {
    fetchNodeData();
  }, [fetchNodeData]);

 
  useEffect(() => {
   // console.log('fetchDashboardData:', fetchDashboardData);
    if (isDisplayNode) {
      if (existData && existData.length > 0) {
        // If data from socket exists, use that value
        const newValue = existData[0]?.value;
        console.log('new value to be displayed',newValue)
        setNodeData((prevData) => ({
          ...prevData,
          value: newValue,
         
        }));
      } else if (fetchDashboardData && fetchDashboardData.length > 0) {
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

  //Live Data Code 
  useEffect(() => {
    if (isDisplayNode && hasFetched) {
        refesh_neo_token("", (token) => {
            socket.auth = { 'token': token }
            socket.open()
            // console.log("Z - INITIAL JOIN")
            // socket.disconnect()
            initialJoinRoom()
            scada_dashboard_data = []
        })
    
   fetchData()
      }
})

//one value fetch correct

const fetchData = ()=>{

    // console.log(socketRooms)
    socket.on('mqtt_message', (msg) => {
      
            try {
                // console.log('response __', JSON.parse(msg.message))
     //   if(socketRooms.includes(JSON.parse(msg.message).key) && iidRooms.includes(JSON.parse(msg.message).iid.toString())){
            //props?.endrefresh(false)
              let te = JSON.parse(msg.message);  // Parse the incoming JSON message
              const scada_dashboard_data = [{
                  iid: te.iid,
                  key: te.key,
                  value: te.value,
                  time: te.time
              }];
  
              //console.log('Scada Dashboard data', scada_dashboard_data);
              setExistData(scada_dashboard_data);  
              setNodeData((prevData) => ({
                ...prevData,
                value: te.value, // Update the node value directly
            }));

              setTimeout(() => {
                console.log('Closing socket after 2 minutes');
                socket.close()
                socket.disconnect();  // This will close the socket connection
            }, 120000); // 2 minutes in milliseconds


              // }else{
        //   console.log('test ')
        // }// Assuming this updates your UI or state
          } catch (error) {
              console.error('Error parsing message', error);
          }
        
       
    });
       
    socket.on('disconnect', (reason) => {
        console.log('DISCONNECT REASON', reason)
       // props?.startRefresh() 
        // if(selectedDashboard[0].custome_dashboard === true){
            refesh_neo_token("", (token) => {
                // socket.auth = { 'token': token }
                reconnect(token)
            })
        // } else {
        //     props.endrefresh()
        // }
    })

    socket.on('connect', () => {
        console.log("Connected to Socket - ")
    })


   
}



  socket.on('connect', () => {
    console.log("Connected to Socket - from scada ")
})

const reconnect = (token) => {
  // console.log("RECONNECT TOKEN  - ", token)
  socket.auth = { 'token': token }
  if(!socket.connected){
      socket.open()
      socket.connect()
      //props.endrefresh()
  }
  let headPlant = localStorage.getItem('headPlant')
      const rooms = [ ...new Set(localStorage?.getItem('rooms')?.trim()?.split(',')) ]
      rooms?.map((x, index) => {
              // console.log(`Connecting to (${index}) - ${headPlant}/data/${x}`)
              socket.emit('join_room', `${headPlant}/data/${x}`,  (response) => {
                  console.log('Server acknowledged the message:', response);
                } )
          }
      )

}
//console.log('instrument id',data.details.instrumentid)
  const initialJoinRoom = () => {
    // For Scada Dashoard - socket Connection
    try{
   
        
        console.log("JOIN ROOM - Connected -",socket.connected)
        let roomsdata =  []
        localStorage.getItem('rooms') && roomsdata.push(localStorage.getItem('rooms'))
       // var data = []
        var iid = []
        localStorage.setItem('headPlant', headPlant?.schema)
       
            iid =  [data.details.instrumentid]
            roomsdata.push(`${data.details.instrumentid}/${data.details.metric}`)
            socket.emit('join_room',  `${headPlant?.schema}/data/${data.details.instrumentid}/${data.details.metric}`);
       //console.log(`${headPlant?.schema}/data/${data.details.instrumentid}/${data.details.metric}`);
        localStorage.setItem('rooms', roomsdata)
   
} catch(e){
    console.log(e)
}
}


socket.on('disconnect', (reason) => {
   console.log('DISCONNECT REASON', reason)
  
      refesh_neo_token("", (token) => {
          // socket.auth = { 'token': token }
          reconnect(token)
      })
  
})


  const { label, value, device, styleType,  icon: Icon, image, details } = nodeData;
  // const { label, value, device, icon: Icon, image, styleType, details, metricValue } = data;
  const nodeStyle = isDisplayNode
    ? {
        backgroundColor: details && details.metric === 'execution' ? undefined  :'#f0f0f0',
        padding: '10px',
        borderRadius: '5px',
        cursor:"pointer",
        width: '150px',
        textAlign: 'center',
        boxShadow: selected ? '0 4px 8px rgba(0, 123, 255, 0.2)' : 'none',
      }
    : {
        border: selected ? '1px solid #007bff' : '1px solid #ccc',
        borderRadius: '5px',
        padding: 10,
        cursor:"pointer",
        position: 'relative',
        backgroundColor: '#fff',
        boxShadow: selected ? '0 4px 8px rgba(0, 123, 255, 0.2)' : 'none',
      };

  return (
    <div
      className={`${device || 'default-node'} ${selected ? 'selected-node' : ''} ${value ==="ACTIVE" ? 'bg-[rgba(48,164,108)]' : value ==="IDLE"  ? 'bg-[rgba(48,164,108,0.5)]' :(value ==="STOPPED" || value ==="--" ) ? "bg-[rgba(206,206,206)]" : ''}  cursor-pointer`}
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
        <div style={{ padding: '3px', textAlign: 'center', fontSize: '0.35rem' }}>
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





