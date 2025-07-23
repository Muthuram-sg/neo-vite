import { memo, useState, useEffect } from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';
import configParam from "config"; 
import NoImage from 'assets/image-not-found.png'; 
import TabIcon from 'assets/neo_icons/Menu/scada/defaulttoolbar/New_Tab_Icon.svg?react'; 
import ChartIcon from 'assets/neo_icons/Menu/scada/defaulttoolbar/chart-dots_Icon.svg?react'; 

const NodeComponent = ({ node, data, selected, id, deleteNode, onSelectNode, onSelectEdge,height,width  }) => {
  
  const { label, value, device, icon: Icon, img, styleType, details } = data; 
  // State to manage the size of the node
  const [Width, setWidth] = useState(styleType === 'display' ? data.style.width : data.style.width ); // Default width for display node (150) and component node (80)
  const [Height, setHeight] = useState(styleType === 'display' ? data.style.height : data.style.height); // Default height for display node (80) and component node (80)
    // Track the active menu type 
    const [menuType, setMenuType] = useState(null);
//  console.log(Width,'menu selected',Height,styleType,data,id,node)
// console.log('onSelectEdge',onSelectEdge)
  useEffect(()=>{
    if(data.style){
      setWidth(data.style.width)
      setHeight(data.style.height)
    }

  },[data.style])

  const handleDelete = () => {
    deleteNode(id);
   // console.log('deleting node', id);
  };

  const isDisplayNode = styleType;

  // Aspect ratio for resizing (only used if aspect ratio is required)
  const aspectRatio = 1; // Aspect ratio (1:1)

  // Resize event handler to adjust the aspect ratio when the node is resized
  const handleResize = (e, data) => {
    let newWidth = data.width;
    let newHeight = data.height;
    // console.log(rfInstance,"menu selected",e,data,id)
    // Enforce aspect ratio during resizing (only for component nodes)
    // if (!isDisplayNode && newWidth !== Width) {
    //   newHeight = newWidth / aspectRatio;  // Calculate the new height based on the width and aspect ratio
    // }

    // Set the width and height
    setWidth(newWidth);
    setHeight(newHeight);
  };

  // Styles for display node (without maintaining aspect ratio)
  const displayNodeStyle = {
    backgroundColor: '#f0f0f0', // Light gray for display nodes
    border: selected ? '1px solid #007bff' : '1px solid #ccc',
    // padding: '10px',
    borderRadius: '5px',
    // minWidth: data.styleType === "display"  ? "100px" : undefined,
    // maxWidth:data.styleType === "display"  ? 'max-content' : undefined,
    width: data.styleType === "display" ? undefined : `${Width}px`, // Dynamically set width
    height:data.styleType === "display" ?  undefined : `${Height}px`, // Dynamically set height
    textAlign: 'center',
    transform: `rotate(${data.transform ? data.transform : 0}deg)`,
    transition: 'transform 0.3s ease',
    cursor:"pointer",
    height:"100%",
    display: (isDisplayNode === 'display' && details && details.assets !== 'N/A') ? "block":"flex",
    justifyContent: "center",
    alignItems: "center"
   // boxShadow: selected ? '0 4px 8px rgba(0, 123, 255, 0.2)' : 'none',
  };

  // Styles for component node (with aspect ratio enforcement)
  const componentNodeStyle = {
    border: selected ? '1px solid #007bff' : '1px solid #ccc', // Highlight border when selected
    // borderRadius: '5px',
    // padding: 10,
    position: 'relative', 
    cursor:'pointer',
    // backgroundColor: '#fff', // White background for component nodes
 //   boxShadow: selected ? '0 4px 8px rgba(0, 123, 255, 0.2)' : 'none',
    width: `${Width}px`, // Dynamically set width 
    height: `${Height}px`, // Dynamically set height 
  };

  const componentTextStyle = {
    backgroundColor: isDisplayNode === 'Link' ? '#0090FF' : 'none', // Light gray for display nodes
    border: selected ? '1px solid #007bff' : '0px solid #ccc', // Highlight border when selected
    borderRadius: '5px',
    padding: isDisplayNode === 'Link' ? '10px 8px' : 10,
    position: 'relative',
    // backgroundColor: '#fff', // White background for component nodes
 //   boxShadow: selected ? '0 4px 8px rgba(0, 123, 255, 0.2)' : 'none',
    width: `${Width}px`, // Dynamically set width
    height: `${Height}px`, // Dynamically set height
    transform: `rotate(${data.transform ? data.transform : 0}deg)`,
    transition: 'transform 0.3s ease',
    overflow: 'hidden' ,
    cursor:'pointer',

  };

  // Conditionally use either displayNodeStyle or componentNodeStyle based on the node type
  const TextStyle = isDisplayNode === 'display' ? displayNodeStyle : componentTextStyle
  const nodeStyle = isDisplayNode ? TextStyle : componentNodeStyle;

  // Define the image size constraints
  const imageMaxWidth = 100; // Maximum width for the image
  const imageMaxHeight = 100; // Maximum height for the image

  // Icon size constraints (proportional resizing)
  const iconMaxWidth = Width * 0.8;  // 80% of the node width
  const iconMaxHeight = Height * 0.8; // 80% of the node height

  // Set menuType based on selected node or edge
 useEffect(() => {
  if (selected) {
    if (isDisplayNode) {
      setMenuType('displayMenu');
    } else if (styleType === 'component') {
      setMenuType('componentMenu');
    }else{
      setMenuType('connection lines');
    }
  } else {
    setMenuType(null); // Reset menu when no node is selected
  }
}, [selected, styleType, isDisplayNode]); 
useEffect(() => {
  if (data.img) {
    let param={filename: "/scada/Image/"+data.label} 
    configParam.RUN_REST_API('/settings/getScadaImageUrl', param)
    .then((imgres) => {
      if(imgres){
        const imageUrl = URL.createObjectURL(imgres); // Create a local URL
        document.getElementById(id).src = imageUrl;
      }
        // return {...v,src: imageUrl}
    })
  }
}, [data.img]);

const TextNodeCss ={  
  overflow: 'hidden',
  whiteSpace: 'pre-wrap',
  textOverflow: 'ellipsis'
}
 
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

// console.log(isDisplayNode,"isDisplayNode",details)
  return (
    <div
      className={`${device || 'default-node'} ${selected ? 'selected-node' : ''}`}
      style={nodeStyle}
    >
      {/* Render connection handles */}
      {!isDisplayNode && (
        <>
          <Handle type="target" position={Position.Left} id={"left-in"} style={{ top: '50%' }} />
          <Handle type="source" position={Position.Left} id="left-out" style={{ top: '50%' }} />
          <Handle type="target" position={Position.Right} id={"right-in"} style={{ top: '50%' }} />
          <Handle type="source" position={Position.Right} id="right-out" style={{ top: '50%' }} />
          <Handle type="target" position={Position.Top} id="top-in" style={{ left: '50%' }} />
          <Handle type="source" position={Position.Top} id="top-out" style={{ left: '50%' }} />
          <Handle type="target" position={Position.Bottom} id="bottom-in" style={{ left: '50%' }} />
          <Handle type="source" position={Position.Bottom} id={"bottom-out"} style={{ left: '50%' }} />
        </>
      )}
      {!isDisplayNode && 
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' ,cursor:'pointer'}}>
        {/* Render the React component icon if provided */}
        {!isDisplayNode && Icon && (
          <Icon
            style={{
              transform: `${isFlipVertical} ${isFlipHorizon} rotate(${data.transform ? data.transform : 0}deg)`,
              transition: 'transform 0.3s ease',
              transformOrigin: 'center center', // Ensure the flip happens around the center
              // maxWidth: `${iconMaxWidth}px`, // Set maximum width based on node size
              // maxHeight: `${iconMaxHeight}px`, // Set maximum height based on node size
              width: `${Width}px`,  // Let the icon scale down proportionally
              height: `${Height}px`, // Let the icon scale down proportionally
            }}
          />
        )}

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
              width: `${Width}px`,  // Let the icon scale down proportionally
              height: `${Height-2}px`, // Let the icon scale down proportionally
            }}
          />
        )}

        {/* Fallback to display the label */}
        {/* <span style={{ fontSize: '0.35rem' }}>{label}</span> */}
      </div>}

      {/* Render additional value if provided for component node */}
      {value && !isDisplayNode && <div style={{ padding: 5 }}>{value}</div>}

      {/* For display node, render instrument, metric, and unit */}
      {isDisplayNode === 'display' && details && !Array.isArray(details.metric) && (
        <div style={{ textAlign: 'center', fontSize: '28px',overflow:'hidden',whiteSpace:'nowrap' }}>
          {/* {details.assets && details.assets!=='N/A' && <div>{details.assets}</div>} as per srini comments commented
          <div>{` ${details.instrument} (${details.instrumentid})`}</div>
          <div>{details.metrictitle || details.metric}</div> */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 6,gap:18 }}>
            <div className='font-geist-mono font-extrabold' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <div style={{ marginRight: '5px' }}>{` ${processValue(details.value)}`}</div>
              <div>{`${details.metricUnit}`}</div>
            </div>
          
            <div >
              <ChartIcon onClick={(e) => console.log(e)}/>
            </div>
          </div>
        </div>
      )}

      {isDisplayNode === 'display' && details && Array.isArray(details.metric) && (
        <div>
          <table className="w-full text-[28px] text-left"  >
            <thead className="text-Text-text-primary dark:text-Text-text-primary-dark  font-geist-sans    bg-Background-bg-tertiary dark:bg-Background-bg-tertiary-dark border border-solid border-Border-border-50 dark:border-Border-border-dark-50">
              <tr>
                <th className={"border-t pl-2 border-Border-border-50 dark:border-Border-border-dark-50"} >
                  <div className="flex items-center justify-between">
                    <div style={{width: `${Width-60}px`}}>
                      <p style={{overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis'  }}>
                        {`${details.assets} - ${details.instrument}`  }
                      </p>
                    </div>
                    <div style={{paddingRight: 10}}>
                      <ChartIcon onClick={(e) => console.log(e)}/>
                    </div>
                  </div>
                  
                </th>
              </tr>
            </thead>
            <tbody style={{display:'block',overflow:'scroll',height:Height-48}}>
              {details.metric.filter(f=> f.name !== 'execution').map(m=>(
                <tr style={{display:'block'}} className={`bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark ${' border-b border-Border-border-50  dark:border-Border-border-dark-50'}`}>
                  <td style={{display:'block'}}>
                    <div className="flex items-center justify-between pl-2">
                        <div style={{...TextNodeCss,minWidth: 60}}>
                          {m.title}
                        </div>
                        <div style={{...TextNodeCss,width: 100}}>
                          {details.value} {m.unit}
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
          <p className="text-[20px] font-bold leading-[20px]" style={{...TextNodeCss,color: "#FCFCFC", textDecoration: 'underline'}}>{label}</p>
          <TabIcon/>
        </div>
      )}
      {selected && (
        <>
          {/* Delete button in the top-right corner */}
          {/* <button
            onClick={handleDelete}
            className="absolute top-0 left-0 -mt-1 -ml-1 w-2 h-2 flex items-center justify-center rounded-full bg-red-500 text-white"
          >
            -
          </button> */}

          {/* Node Resizer for resizing the node */}
          {
            isDisplayNode !== 'display' &&
            <NodeResizer
            color="#007bff" 
           minWidth={isDisplayNode === 'display' ? 100 : 50}
            minHeight={(isDisplayNode === 'text' || isDisplayNode === 'Link') ? 40 : 50}
            isVisible={selected}
            onResize={handleResize}
          />
          }
          {
            isDisplayNode === 'display' && Array.isArray(details.metric) &&
            <NodeResizer
            color="#007bff" 
           minWidth={350}
            minHeight={100}
            isVisible={selected}
            onResize={handleResize}
          />
          }
          
        </>
      )}
    </div>
  );
};

export default memo(NodeComponent);



// import { useState, useEffect, memo } from 'react';
// import { Handle, Position, NodeResizer } from 'reactflow';

// const NodeComponent = ({ node, data, selected, id, deleteNode, onSelectNode, onSelectEdge }) => {
//   const { label, value, device, icon: Icon, image, styleType, details } = data;
  
//   // State to manage the size of the node
//   const [width, setWidth] = useState(styleType === 'display' ? 150 : 80); 
//   const [height, setHeight] = useState(styleType === 'display' ? 50 : 80);

//   // Track the active menu type
//   const [menuType, setMenuType] = useState(null);

//   // Handle node deletion
//   const handleDelete = () => {
//     deleteNode(id);
//     console.log('deleting node', id);
//   };

//   // Check if it's a display node
//   const isDisplayNode = styleType === 'display';

//   // Set menuType based on selected node or edge
//   useEffect(() => {
//     if (selected) {
//       if (isDisplayNode) {
//         setMenuType('displayMenu');
//       } else if (styleType === 'component') {
//         setMenuType('componentMenu');
//       }
//     } else {
//       setMenuType(null); // Reset menu when no node is selected
//     }
//   }, [selected, styleType, isDisplayNode]);

//   // Styles for the node
//   const nodeStyle = isDisplayNode
//     ? { backgroundColor: '#f0f0f0', width: `${width}px`, height: `${height}px`, padding: '10px', textAlign: 'center' }
//     : { backgroundColor: '#fff', width: `${width}px`, height: `${height}px`, padding: 10 };

//   return (
//     <div
//       className={`${device || 'default-node'} ${selected ? 'selected-node' : ''}`}
//       style={nodeStyle}
//       onClick={() => onSelectNode(id)} // Handle node selection
//     >
//       {/* Render connection handles */}
//       {!isDisplayNode && (
//         <>
//           <Handle type="target" position={Position.Left} id="left-in" style={{ top: '50%' }} />
//           <Handle type="source" position={Position.Left} id="left-out" style={{ top: '50%' }} />
//           <Handle type="target" position={Position.Right} id="right-in" style={{ top: '50%' }} />
//           <Handle type="source" position={Position.Right} id="right-out" style={{ top: '50%' }} />
//           <Handle type="target" position={Position.Top} id="top-in" style={{ left: '50%' }} />
//           <Handle type="source" position={Position.Top} id="top-out" style={{ left: '50%' }} />
//           <Handle type="target" position={Position.Bottom} id="bottom-in" style={{ left: '50%' }} />
//           <Handle type="source" position={Position.Bottom} id="bottom-out" style={{ left: '50%' }} />
//         </>
//       )}

//       <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
//         {/* Render Icon or Image */}
//         {!isDisplayNode && Icon && (
//           <Icon
//             style={{ maxWidth: `${width * 0.8}px`, maxHeight: `${height * 0.8}px`, marginBottom: 5 }}
//           />
//         )}
//         {image && !Icon && (
//           <img
//             src={image}
//             alt={label || 'Node'}
//             style={{
//               maxWidth: '100px', maxHeight: '100px', width: 'auto', height: 'auto', marginBottom: 5,
//             }}
//           />
//         )}
//       </div>

//       {value && !isDisplayNode && <div style={{ padding: 5 }}>{value}</div>}
//       {isDisplayNode && details && (
//         <div style={{ padding: '3px', textAlign: 'center', fontSize: '0.35rem' }}>
//           {details.assets && <div>{details.assets}</div>}
//           <div>{`${details.instrument} (${details.instrumentid})`}</div>
//           <div>{details.metrictitle || details.metric}</div>
//           <div>{`${details.value} ${details.metricUnit}`}</div>
//         </div>
//       )}

//       {selected && (
//         <>
//           {/* Delete button */}
//           <button
//             onClick={handleDelete}
//             className="absolute top-0 left-0 -mt-1 -ml-1 w-2 h-2 flex items-center justify-center rounded-full bg-red-500 text-white"
//           >
//             -
//           </button>
//           {/* Node Resizer */}
//           <NodeResizer minWidth={isDisplayNode ? 100 : 50} minHeight={50} onResize={(e, data) => {
//             setWidth(data.width);
//             setHeight(data.height);
//           }} />
//         </>
//       )}

//       {/* Render the menu based on node type */}
//       {selected && menuType && (
//         <div className="menu-container">
//           {menuType === 'displayMenu' && (
//             <div>Display Node Menu</div> // Show your custom display menu here
//           )}
//           {menuType === 'componentMenu' && (
//             <div>Component Node Menu</div> // Show your custom component menu here
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default memo(NodeComponent);



// import { memo, useState, useEffect } from 'react';
// import { Handle, Position, NodeResizer } from 'reactflow';

// const NodeComponent = ({ node, data, selected, id, deleteNode }) => {
//   const { label, value, device, icon: Icon, image, styleType, details } = data;

//   // State to manage the size of the node
//   // State to manage the size of the node
//   const [width, setWidth] = useState(styleType === 'display' ? 150 : 80);  // Default width for display node (100) and component node (80)
//   const [height, setHeight] = useState(styleType === 'display' ? 80 : 80); // Default height for display node (150) and component node (80)

//   const handleDelete = () => {
//     deleteNode(id);
//     console.log('deleting node', id);
//   };

//   const isDisplayNode = styleType === 'display';

//   // Styles for display node
//   const displayNodeStyle = {
//     backgroundColor: '#f0f0f0', // Light gray for display nodes
//     padding: '10px',
//     borderRadius: '5px',
//     width: `${width}px`, // Dynamically set width
//     height: `${height}px`, // Dynamically set height
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
//     width: `${width}px`, // Dynamically set width
//     height: `${height}px`, // Dynamically set height
//   };

//   // To maintain aspect ratio (e.g., 1:1 or 16:9)
//   const aspectRatio = 1; // Replace with your desired aspect ratio (width / height)

//   // Calculate dynamic height based on width and aspect ratio
//   const calculatedHeight = width / aspectRatio;

//   // Conditionally use either displayNodeStyle or componentNodeStyle based on the node type
//   const nodeStyle = isDisplayNode ? displayNodeStyle : componentNodeStyle;

//   // Resize event handler to adjust the aspect ratio when the node is resized
//   const handleResize = (e, data) => {
//     setWidth(data.width);
//     setHeight(data.height);
//   };

//   // Define the image size constraints
//   const imageMaxWidth = 100; // Maximum width for the image
//   const imageMaxHeight = 100; // Maximum height for the image

//   // Icon size constraints (proportional resizing)
//   const iconMaxWidth = width * 0.8;  // 40% of the node width
//   const iconMaxHeight = height * 0.8; // 40% of the node height

//   return (
//     <div
//       className={`${device || 'default-node'} ${selected ? 'selected-node' : ''}`}
//       style={nodeStyle}
//     >
//       {/* Render connection handles */}
//       {!isDisplayNode && (
//         <>
//           <Handle type="target" position={Position.Left} id="left-in" style={{ top: '50%' }} />
//           <Handle type="source" position={Position.Left} id="left-out" style={{ top: '50%' }} />
//           <Handle type="target" position={Position.Right} id="right-in" style={{ top: '50%' }} />
//           <Handle type="source" position={Position.Right} id="right-out" style={{ top: '50%' }} />
//           <Handle type="target" position={Position.Top} id="top-in" style={{ left: '50%' }} />
//           <Handle type="source" position={Position.Top} id="top-out" style={{ left: '50%' }} />
//           <Handle type="target" position={Position.Bottom} id="bottom-in" style={{ left: '50%' }} />
//           <Handle type="source" position={Position.Bottom} id="bottom-out" style={{ left: '50%' }} />
//         </>
//       )}

//       <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
//         {/* Render the React component icon if provided */}
//         {!isDisplayNode && Icon && (
//           <Icon
//             style={{
//               maxWidth: `${iconMaxWidth}px`, // Set maximum width based on node size
//               maxHeight: `${iconMaxHeight}px`, // Set maximum height based on node size
//               width: 'auto',  // Let the icon scale down proportionally
//               height: 'auto', // Let the icon scale down proportionally
//               marginBottom: 5,
//             }}
//           />
//         )}

//         {/* Render an image if provided */}
//         {image && !Icon && (
//           <img
//             src={image}
//             alt={label || 'Node'}
//             style={{
//               maxWidth: `${imageMaxWidth}px`,  // Maximum width
//               maxHeight: `${imageMaxHeight}px`, // Maximum height
//               width: 'auto', // Let the image scale down proportionally
//               height: 'auto', // Let the image scale down proportionally
//               marginBottom: 5,
//             }}
//           />
//         )}

//         {/* Fallback to display the label */}
//         {/* <span style={{ fontSize: '0.35rem' }}>{label}</span> */}
//       </div>

//       {/* Render additional value if provided for component node */}
//       {value && !isDisplayNode && <div style={{ padding: 5 }}>{value}</div>}

//       {/* For display node, render instrument, metric, and unit */}
//       {isDisplayNode && details && (
//         <div style={{ padding: '3px', textAlign: 'center', fontSize: '0.35rem' }}>
//           {details.assets && <div>{details.assets}</div>}
//           <div>{` ${details.instrument} (${details.instrumentid})`}</div>
//           <div>{details.metrictitle || details.metric}</div>
//           <div>{` ${details.value} ${details.metricUnit}`}</div>
//         </div>
//       )}
      
//       {selected && (
//         <>
//           {/* Delete button in the top-right corner */}
//           <button
//             onClick={handleDelete}
//             className="absolute top-0 left-0 -mt-1 -ml-1 w-2 h-2 flex items-center justify-center rounded-full bg-red-500 text-white"
//           >
//             -
//           </button>

//           {/* Node Resizer for resizing the node */}
//           <NodeResizer
//             minWidth={50}
//             minHeight={50}
//             onResize={handleResize}
//           />
//         </>
//       )}
//     </div>
//   );
// };

// export default memo(NodeComponent);




