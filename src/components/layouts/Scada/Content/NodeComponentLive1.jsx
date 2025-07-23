
import React, { useEffect, useState, memo, useCallback,useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { selectedPlant, dashBtnGrp ,scadaContentVisibleState, 
  scadaContentVisibleEditState,scadaIdState,currentScadaViewSkeleton,IsSocketOn} from 'recoilStore/atoms';
import { useRecoilState } from 'recoil';
import moment from 'moment';
import useFetchDashboardData from 'components/layouts/Dashboards/hooks/useFetchDashboardData';
import TabIcon from 'assets/neo_icons/Menu/scada/defaulttoolbar/New_Tab_Icon.svg?react';
import configParam from 'config';
import { socket } from 'components/socket';
import { _check_and_get_token } from 'config';
import { refesh_neo_token } from 'config';
import NoImage from 'assets/image-not-found.png';
import { debounce } from 'lodash'; // or any debounce utility
import { useNavigate } from "react-router-dom"; 
import ChartIcon from 'assets/neo_icons/Menu/scada/defaulttoolbar/chart-dots_Icon.svg?react'; 
// import ExploreModel from './ExploreModel';
import ExploreView from './ExploreView';
 

// const NodeComponent = ({ id,data, selected  }) => {
const NodeComponent= React.forwardRef((props, ref)=> {
  const { id,data, selected  } = props
  const ExploreRef = useRef();
  const navigate = useNavigate();
  const [, setScadaContentVisible] = useRecoilState(scadaContentVisibleState);
  const [, setScadaContentVisibleEdit] = useRecoilState(scadaContentVisibleEditState);
  const [, setScadaId] = useRecoilState(scadaIdState);
  const [, setSelectedScadaViewSkeleton] = useRecoilState(currentScadaViewSkeleton);
  // console.log(data,"datadatView")
 // Add a map to store values for each unique node.
const [nodeValues, setNodeValues] = useState({});
  const [nodeData, setNodeData] = useState(data);
  const [hasFetched, setHasFetched] = useState(false);
  const [btGroupValue] = useRecoilState(dashBtnGrp);
  const [headPlant] = useRecoilState(selectedPlant);
  const [OpenModel,setOpenModel] = useState(false);
  const [isListening, setIsListening] = useRecoilState(IsSocketOn); 
  const [existData,setExistData] = useState([]);
  let Neotoken = localStorage.getItem('neoToken')
  const [Token, setToken] = useState(Neotoken);
  const [NeedToken,setNeedToken]= useState(false);
  // if (existData && existData.length > 0) {
  //   // If data from socket exists, use that value
  //   const newValue = existData[0]?.value;
  //   console.log('value need to bind',newValue)
  // }

  //console.log('set data',existData[0].value)
  let scada_dashboard_data = existData

  // const debouncedSetNodeData = debounce((newValue) => {
  //   setNodeData((prevData) => ({
  //     ...prevData,
  //     value: newValue,
  //   }));
  // }, 100); // Adjust the delay as needed (e.g., 100ms)


  const {
    fetchDashboardData,
    getfetchDashboard,
    fetchDashboardLoading,
    fetchDashboardError,
  } = useFetchDashboardData();

  const lastTime = configParam.DATE_ARR(btGroupValue, headPlant);
  const isDisplayNode = data.styleType;
  const to = moment();
  const from = moment(moment().subtract(1, 'day')).format("YYYY-MM-DDTHH:mm:ss"); // 24 hours ago
  const startrange = formatWithOffset(from);
  const endrange = formatWithOffset(to);

  function formatWithOffset(date) {
    let isoString = moment(date).format("YYYY-MM-DDTHH:mm:ssZ");
    // let offset = '+05:30'; // Specify the required offset
    return isoString; // Replace 'Z' (UTC) with the desired offset
  }
  const { label, value, device, styleType,  icon: Icon, image, details } = nodeData;
  const [messages, setMessages] = useState([]);
  const [singlemessage, setsinglemessage] = useState('-');
  
  //console.log('isDisplayNode:', isDisplayNode);
 
  const fetchNodeData = useCallback(() => {
    if (isDisplayNode === 'display' && !hasFetched && headPlant.schema) {
      
      const params = {
        schema: headPlant.schema,
        instrument: data.details.instrumentid,
        metric: data.details.metric,
        type: 'singleText',
        from: startrange,
        to: endrange,
        isConsumption: false,
      };
      let metField = []
      if(Array.isArray(data.details.metric)){
        params.type = 'line'
        let metArr = data.details.metric.filter(f=> f.name !== 'execution').map(m=> m.name+"-"+m.title)
        metField = {
          "field1": {
              "metric": metArr,
                "instrument": data.details.instrumentid
            }
        }
      }
      // console.log(data,"isDisplayNode",isDisplayNode,btGroupValue,params, metField)
      //getfetchDashboard('/dashboards/getdashboard', params);
      getfetchDashboard("/dashboards/getdashboard", params, metField, false, [], '', lastTime);
      setIsListening(true)
      // refesh_neo_token("", (token) => {
        // console.log("INSISISISISISI__________________") 
        socket.auth = { 'token': Token }
        // localStorage.setItem('neoToken', token)
    // })
    
      setHasFetched(true);
    }
    
    return () => {
      socket.off('mqtt_message', handleMessage);
    };
  //   else  if (isDisplayNode === 'display' && hasFetched) {
  //       refesh_neo_token("", (token) => {
  //           socket.auth = { 'token': token }
  //           socket.open()
  //           // console.log("Z - INITIAL JOIN")
  //           // socket.disconnect()
  //           initialJoinRoom()
  //           scada_dashboard_data = []
  //       })
    
  //  fetchData()
  //     }
  }, [
    isDisplayNode,
    hasFetched,
    headPlant.schema,
    startrange,
    endrange,
  ]);
  //console.log(`${headPlant?.schema}/data/${data.details.instrumentid}/${data.details.metric}`);
  useEffect(() => {
    fetchNodeData();
  }, []);

  const handleMessage = (data) => {
    console.log('Message received socketOff:', data);
  };

  useEffect(() => {

    if(fetchDashboardData){
      setTimeout(() => {
        // refesh_neo_token("", (token) => {
          // let token = localStorage.getItem('neoToken')
            socket.auth = { 'token': Token }
            socket.open()
            // console.log("Z - INITIAL JOIN")
            // socket.disconnect()
            initialJoinRoom()
            // custome_dashboard_data = []
        // })
    }, 1000)
    }
   
  },[fetchDashboardData])

useEffect(()=>{
  if(NeedToken){
    setNeedToken(false)
    refesh_neo_token("", (token) => {
      // console.log("INSISISISISISI__________________")
      // socket.auth = { 'token': token }
      setToken(token)
      socket.auth = { 'token': token }
      localStorage.setItem('neoToken', token)
      socket.open()
      initialJoinRoom()
    })
  }
},[NeedToken])

 

  const liveFetchData = ()=>{

    socket.on('mqtt_message', (msg) => {
      // console.log("enter",msg.message,details)
      const parsedJson = JSON.parse(msg.message)
      // console.log(details,"Live",nodeData,fetchDashboardData )
      // console.log(data.details.instrumentid , parsedJson.key,"gnhghhgvhgh",parsedJson,parsedJson.iid)
      if(Object.keys(parsedJson).length > 0 && Array.isArray(details.metric) && Number(details.instrumentid) ===  Number(parsedJson.iid)){
        // console.log(data.details.instrumentid , parsedJson.key,"gnhghhgvhgh")
        setMessages(prev =>
          prev.map((m, i) =>
            m.name === parsedJson.key ? {...m,...parsedJson } : m
          )) 
      }else{
        if(Object.keys(parsedJson).length > 0 && details.metric === parsedJson.key && Number(details.instrumentid) ===  Number(parsedJson.iid)){
          // console.log("enterSingle",parsedJson)
          setsinglemessage(parsedJson.value)
          // debouncedSetNodeData(parsedJson.value)
          // setNodeData((prevData) => ({
          //   ...prevData,
          //   value: parsedJson.value,
          // }));
        }
        
      }
      // let 
      // setmqttData(JSON.parse(msg.message))

  });

  socket.on('disconnect', (reason) => {
      // console.log('Socket DISCONNECT REASON', reason)
      // props?.startRefresh() 
      // if(selectedDashboard[0].custome_dashboard === true){
      // refesh_neo_token("", (token) => {
          // socket.auth = { 'token': token }
          // let token = localStorage.getItem('neoToken')
          reconnect(Token)
      // })
  })

  socket.on('Error', (reason) => {
    // console.log('Socket Error REASON', reason.msg)
    if(reason.msg === "Authentication denied: Provide proper Token" && !NeedToken){
        setNeedToken(true)
       
    }
    
   
  })
  
  socket.on('connect', () => {
      // console.log("Connected to Socket - from Scada ")
      // socket.emit('join_room',  `${headPlant?.schema}/data/t0001/part_count`);
  })

    
  }
  

  useEffect(() => {
    // Check if we should display the node
    if (isDisplayNode === 'display') {
      // Show loading text while fetching
      if (fetchDashboardLoading) {
        // console.log('Loading...');
        if(Array.isArray(data.details.metric)){
          data.details.metric.filter(f=> f.name !== 'execution').map(v=>{
            setMessages((prev) => [...prev, {...v,value: '-'}]);
            
          })
        }else{
          setsinglemessage('Loading..')
          // setNodeData((prevData) => ({
          //   ...prevData,
          //   value: 'Loading..',  // This can be a string like "Loading..." while waiting for data
          // }));
        }
        
      } else {
        // If existData has value, use it
        if (existData && existData.length > 0) {
          const newValue = existData[0]?.value;
          // console.log('new value from existData', newValue);
          setNodeData((prevData) => ({
            ...prevData,
            value: newValue,
          }));
        }
        // If socket data (nodeValues) is available, use it
        else if (nodeValues[`${data.details.instrumentid}_${data.details.metric}`]) {
          const newValue = nodeValues[`${data.details.instrumentid}_${data.details.metric}`]?.value;
          // console.log('new value from socket for this node:', newValue);
          setNodeData((prevData) => ({
            ...prevData,
            value: newValue,
          }));
        }
        // If no socket data, fallback to fetchDashboardData
        else if (fetchDashboardData && fetchDashboardData.length > 0) {
          // console.log(fetchDashboardData,"fetchDashboardData",nodeData)
          if(Array.isArray(data.details.metric)){
            // data.details.metric.map(v=>{
              
              setMessages(prev =>
                prev.map((m, i) =>{
                  let newVal = fetchDashboardData.filter(f=> f.key === m.name)
                  return {...m,value: newVal.length ? newVal[newVal.length-1].value : '-'} 
                }
                  
              )) 
             
          }else{
            const newValue = fetchDashboardData[0]?.value;
            // console.log('new value from API:', newValue);
            setsinglemessage(newValue)
            // setNodeData((prevData) => ({
            //   ...prevData,
            //   value: newValue,
            // }));
          }
          if (isListening) {
            liveFetchData()
          } else {
            socket.removeAllListeners('mqtt_message');
            socket.off("mqtt_message", handleMessage); // Cleanup when paused
          }
          
        } else {
          // If no data available, show "No data available" or keep loading state
          // console.log('No value available from any source');
          // setNodeData((prevData) => ({
          //   ...prevData,
          //   value: '--',  // Optional fallback message when no data found
          // }));
          setsinglemessage('--')
        }
      }
    }
  }, [nodeValues, fetchDashboardData, fetchDashboardError, fetchDashboardLoading, isDisplayNode, existData,isListening]);
  

const reconnect = (token) => {
  // console.log("RECONNECT TOKEN  - ", token)
  socket.auth = { 'token': token }
        if (!socket.connected) {
            socket.open()
            socket.connect()
            // props.endrefresh()
        }
        if (data && Array.isArray(data.details.metric)) {
          data.details.metric.filter(f=> f.name !== 'execution').map(d=>{
            socket.emit('join_room', `${headPlant}/data/${data.details.instrumentid}/${d.name}`, (response) => {
              console.log('Server acknowledged the message:', response);
            })
          })
        }else{
          socket.emit('join_room', `${headPlant}/data/${data.details.instrumentid}/${data.details.metric}`, (response) => {
            console.log('Server acknowledged the message:', response);
          })
        }
            

}
//console.log('instrument id',data.details.instrumentid)
  const initialJoinRoom = () => {
    // For Scada Dashoard - socket Connection
    try {
      // console.log(data,"JOIN ROOM - Connected -",socket.connected,headPlant)

      if (data && Array.isArray(data.details.metric)) {
          // data = [ ...data, props.detail?.meta?.metric[0]?.split('-')[0]]
          // console.log( socket.id,"socket.id")
          data.details.metric.filter(f=> f.name !== 'execution').map(d=>{
            socket.emit('join_room', `${headPlant?.schema}/data/${data.details.instrumentid}/${d.name}`);    
          })
          // roomsdata.push(`${props.detail?.meta?.instrument}/${props.detail?.meta?.metric[0]?.split('-')[0]}`)

      }else{
        socket.emit('join_room', `${headPlant?.schema}/data/${data.details.instrumentid}/${data.details.metric}`);
      }

  } catch (e) {
      console.log(e)
  }
}

  
  // console.log(data,"details")
 
      const displayNodeStyle = {
        backgroundColor:details && details.metric === 'execution' ? undefined  : '#f0f0f0', // Light gray for display nodes
        // padding: '10px',
        borderRadius: '5px',
        border:'1px solid #ccc',
        // minWidth: data.styleType === "display"  ? "100px" : undefined,
        // maxWidth:data.styleType === "display"  ? 'max-content' : undefined,
        width:data.styleType === "display" ?  undefined   : `${data.style.width}px`, // Dynamically set width
        height: data.styleType === "display" ? undefined :`${data.style.height}px`, // Dynamically set height
        textAlign: 'center',
        transform: `rotate(${data.transform ? data.transform : 0}deg)`,
        transition: 'transform 0.3s ease',
        cursor:"pointer"
        // boxShadow: selected ? '0 4px 8px rgba(0, 123, 255, 0.2)' : 'none',
      };
      
      // Styles for component node (with aspect ratio enforcement)
      const componentNodeStyle = {
        // border:'1px solid #ccc', // Highlight border when selected
        // borderRadius: '5px',
        // padding: 10,
        position: 'relative',
        // backgroundColor: '#fff', // White background for component nodes
        boxShadow: selected ? '0 4px 8px rgba(0, 123, 255, 0.2)' : 'none',
        // width: `${width}px`, // Dynamically set width
        height: '100%',
        // display: 'flex',
        // justifyContent: 'center',
        // alignItems: 'center',
        // position: 'relative',
      };

      const componentTextStyle = {
        // border: selected ? '1px solid #007bff' : '0px solid #ccc', // Highlight border when selected
        backgroundColor: isDisplayNode === 'Link' ? '#0090FF' : 'none', // Light gray for display nodes
        borderRadius: '5px',
        padding: isDisplayNode === 'Link' ? '10px 8px' : 10,
        position: 'relative',
        transform: `rotate(${data.transform ? data.transform : 0}deg)`,
        transition: 'transform 0.3s ease',
        // backgroundColor: '#fff', // White background for component nodes
     //   boxShadow: selected ? '0 4px 8px rgba(0, 123, 255, 0.2)' : 'none',
        width: '100%', // Dynamically set width
        height: '100%', // Dynamically set height 
        overflow: 'hidden' 
      };

      const TextStyle = isDisplayNode === 'display' ? displayNodeStyle : componentTextStyle
      const nodeStyle = isDisplayNode ? TextStyle : componentNodeStyle;
      
      const TextNodeCss ={  
        overflow: 'hidden',
        whiteSpace: 'pre-wrap',
        textOverflow: 'ellipsis'
      }

      useEffect(() => {
        if (data.img) {
          let param={filename: "/scada/Image/"+data.label} 
          configParam.RUN_REST_API('/settings/getScadaImageUrl', param)
          .then((imgres) => {
            // console.log("imageUrlimageUrl",imgres)
            if(imgres){
              const imageUrl = URL.createObjectURL(imgres); // Create a local URL
              document.getElementById(id).src = imageUrl;
            } 
          })
        }
      }, [data.img]);

      const isFlipVertical = data.flipvertical ? data.flipvertical : '';
      const isFlipHorizon = data.fliphorizon ? data.fliphorizon : '';

      function processValue(value) {
        // Check if the value is a number
        if (typeof value === 'number' && !isNaN(value)) {
            // Trim to 3 decimal places
            return parseFloat(value.toFixed(3));
        } else if (typeof value === 'string') {
            // Check if the string can be converted to a number
            const numberValue = parseFloat(value);
            if (!isNaN(numberValue)) {
                // Trim to 3 decimal places
                return parseFloat(numberValue.toFixed(3));
            } else {
                // Return the original string if it's not a number
                return value;
            }
        } else {
            // Return the value as is if it's neither a number nor a string
            return value;
        }
    }

    function NewTab(e){
      // console.log(e,"NewTab")
      let url
      let choosenSchema = localStorage.getItem('plantid')
      if(!e.LinkData.custome_dashboard && e.LinkData.discText !== "SCADA"){
          let choosenType = e.LinkData.name.toLowerCase();
          if(choosenType === 'dryer efficiency'){
            choosenType = 'dryer'
          }else if(choosenType === 'energy'){
            choosenType = 'energy/energy'
          }else if(choosenType === 'condition monitoring'){
            choosenType = 'cms'
          }else if(choosenType === 'power delivery'){
            choosenType = 'contract'
          }
    
          url = `${configParam.APP_URL}/${choosenSchema}/dashboard/${choosenType}`;
      }else if(e.LinkData.custome_dashboard && e.LinkData.discText !== "SCADA"){
        let choosenType = e.LinkData.id
        url = `${configParam.APP_URL}/${choosenSchema}/dashboard/custom/${choosenType}`;
      }else{
        let choosenType = e.LinkData.id
        url = `${configParam.APP_URL}/${choosenSchema}/scada/${choosenType}`;
      } 
            
            // console.log(url,"urlurl")
            window.open(url);
    }
    
    function Redirect(e){ 
      let url
      let choosenSchema = localStorage.getItem('plantid')
      let choosenType
      if(e.LinkData.discText !== "SCADA"){
        if(!e.LinkData.custome_dashboard){
          choosenType = e.LinkData.name.toLowerCase();
          if(choosenType === 'dryer efficiency'){
            choosenType = 'dryer'
          }else if(choosenType === 'energy'){
            choosenType = 'energy/energy'
          }else if(choosenType === 'condition monitoring'){
            choosenType = 'cms'
          }else if(choosenType === 'power delivery'){
            choosenType = 'contract'
          }
          url = `/${choosenSchema}/dashboard/${choosenType}`;
          
        }else {
          choosenType = e.LinkData.id
          url = `/${choosenSchema}/dashboard/custom/${choosenType}`;
        }
          setScadaContentVisible(false);
          setScadaContentVisibleEdit(false);
          setScadaId(null)
          setSelectedScadaViewSkeleton([]);
      }else{
        choosenType = e.LinkData.id
        url = `/${choosenSchema}/scada/${choosenType}`;
      } 
      navigate(url, {
        state: {
          routeObj: e.LinkData 
        }
      });
    }
    // console.log(isDisplayNode,"isDisplayNode",details,data)
    function HandleClose(){
      // ExploreRef.current.handleEntityDialog()
      // setOpenModel(false)
      setIsListening(true)
    }

    function handleOpenChart(){
      ExploreRef.current.handleEntityDialog()
      // setOpenModel(true)
      setIsListening(false)
    }

    
  return (
    <div
      className={`${device || 'default-node'} ${selected ? 'selected-node' : ''} ${value ==="ACTIVE" ? 'bg-[rgba(48,164,108)]' : value ==="IDLE"  ? 'bg-[rgba(48,164,108,0.5)]' :(value ==="STOPPED" || value ==="--" ) ? "bg-[rgba(206,206,206)]" : ''} cursor-pointer`}
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
        {!isDisplayNode && Icon && <Icon 
          style={{ width: `${data.style.width}`, 
                  height: `${data.style.height}`,
                  transform: `${isFlipVertical} ${isFlipHorizon} rotate(${data.transform ? data.transform : 0}deg)`,
                  transition: 'transform 0.3s ease',
                  transformOrigin: 'center center', // Ensure the flip happens around the center 
          }} 
        />}
        {/* {!isDisplayNode && <span style={{ fontSize: '0.35rem' }}>{label}</span>} */}
        {/* Render an image if provided */}
        {data.img && !Icon && (
          <img
            id={id}
            alt={label || 'Node'}
            src={NoImage}
            style={{
              transform: `${isFlipVertical} ${isFlipHorizon} rotate(${data.transform ? data.transform : 0}deg)`,
              transition: 'transform 0.3s ease',
              transformOrigin: 'center center', // Ensure the flip happens around the center
              // maxWidth: `${imageMaxWidth}px`,  // Maximum width
              // maxHeight: `${imageMaxHeight}px`, // Maximum height
              width: `${data.style.width}px`,  // Let the icon scale down proportionally
              height: `${data.style.height}px`, // Let the icon scale down proportionally 
            }}
          />
        )}
      </div>

      {/* Render additional value if provided for component node */}
      {/* {value && !isDisplayNode && <div style={{ padding: 5 }}>{value}</div>} */}

      {/* For display node, render instrument, metric, and unit- Working code  */}
      {/* {isDisplayNode && details && (
        <div style={{ padding: '3px', textAlign: 'center', fontSize: '0.35rem' }}>
          <div>{`${details.instrument} (${details.instrumentid})`}</div>
          <div>{`${details.metric}`}</div>
          {value && <div style={{ padding: 5 }}>{value} </div>}
          <div>{`${details.metricUnit}`}</div>
        </div>
      )} */}

      {/* For display node, render instrument, metric, and unit */}
      {isDisplayNode === 'display' && details && !Array.isArray(details.metric) && (
        <div className='font-geist-mono font-extrabold' style={{ textAlign: 'center', fontSize: '28px',overflow:'hidden',whiteSpace:'nowrap', padding: 6 }}>
          {/* Render instrument and instrument ID */}
          {/* {details.assets && details.assets!=='N/A' && <div>{details.assets}</div>}    // as per srini comments the names are removed
          <div>{`${details.instrument} (${details.instrumentid})`}</div> */}

          {/* Render metric */}
          {/* <div>{details.metrictitle || details.metric}</div> */}

          {/* Render value and metric unit on the same line */}
          {singlemessage && details.metricUnit && (
            <div   style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',gap:18}}>
              <div   style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <div  style={{ marginRight: '5px' }}>{processValue(singlemessage)}</div>
                <div>{value !== 'Loading..' && `${details.metricUnit}`}</div>
              </div>
              <div >
                <ChartIcon onClick={(e) => handleOpenChart()}/>
              </div>
            </div>
          )}

        </div>
      )}

      {isDisplayNode === 'display' && details && Array.isArray(details.metric) && (
        <div>
          <table className="w-full text-[28px] text-left"  >
            <thead className="text-Text-text-primary dark:text-Text-text-primary-dark  font-geist-sans    bg-Background-bg-tertiary dark:bg-Background-bg-tertiary-dark border border-solid border-Border-border-50 dark:border-Border-border-dark-50">
              <tr>
                <th className={"border-t pl-2 border-Border-border-50 dark:border-Border-border-dark-50"} >
                  <div className="flex items-center justify-between">
                    <div style={{width: `${data.style.width-60}px`}}>
                      <p style={{overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis'  }}>
                        {`${details.assets} - ${details.instrument}`  }
                      </p>
                    </div>
                    <div style={{paddingRight: 10}}>
                      <ChartIcon onClick={(e) => handleOpenChart() }/>
                    </div>
                  </div>
                  
                </th>
              </tr>
            </thead>
            <tbody style={{display:'block',overflow:'scroll',height:data.style.height-48}}>
              {messages.map(m=>(
                <tr style={{display:'block'}} className={`bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark ${' border-b border-Border-border-50  dark:border-Border-border-dark-50'}`}>
                  <td style={{display:'block'}}>
                    <div className="flex items-center justify-between pl-2">
                        <div style={{...TextNodeCss,minWidth: 50}}>
                          {m.title}
                        </div>
                        <div style={{...TextNodeCss,width: 130}}>
                          {m.value} {m.unit}
                        </div>
                    </div>
                  </td>
                </tr>
              ))} 
            </tbody>
          </table>
        </div>
      )}

      {isDisplayNode === 'text' && details && (
        <p className="TextNodeCss" style={{...TextNodeCss,textAlign:details.textAlign,fontSize: details.fontSize, color: details.fontColor, fontWeight: details.fontWeight ? 'bold' : 'normal', fontStyle: details.fontStyle ? 'italic' : 'normal',textDecoration: details.fontUnderline ? 'underline' : 'none'}}>{label}</p>
      )}
      {isDisplayNode === 'Link' && details && (
        <div style={{ display: 'flex', alignItems: 'center',justifyContent:'center', cursor:'pointer',gap:8}}>
          <p onClick={()=>Redirect(details)} className="text-[20px] font-bold leading-[20px]" style={{...TextNodeCss,color: "#FCFCFC", textDecoration: 'underline'}}>{label}</p>
          <TabIcon onClick={()=>NewTab(details)}/>
        </div>
      )}


        <ExploreView ref={ExploreRef} detail={isDisplayNode === 'display' && details ? details : ''} />
    </div>
  );
});

export default memo(NodeComponent);





