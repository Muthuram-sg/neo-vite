import React, { useState, useEffect, useCallback, forwardRef, useRef } from 'react';
import ReactFlow, {
    ReactFlowProvider, useNodesState, useEdgesState, addEdge, MiniMap, Controls,
    useReactFlow,Background,MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useRecoilState } from 'recoil';
import { drawerMode, selectedPlant, user, currentScadaJson, defaultScadaView, currentScadaViewSkeleton, scadaViewEditMode, scadaInstance,
     FullScreenmode , nodesAtom, scadaSelectedDetailsState,fetchedDashboardDataState, dashBtnGrp,ProgressLoad,selectedScadaViewState,
      scadaContentVisibleState, scadaContentVisibleEditState} from "recoilStore/atoms"; // Recoil variables
import { useRecoilValue } from 'recoil';
import CustomEdge, { DashedEdge, ColoredEdge, AnimatedEdge  } from './CustomEdge';
import PipeLineDashed from './PipeLineDashed';
import ComponentModal from './ComponentModal';
import CustomNode from './CustomNode';
import NodeComponent from './NodeComponent'; // Generic Node Component
import { categorizedComponentsData } from './Componentdata';
import configParam from 'config';
// import useMeterReadingsV2 from "../../Explore/BrowserContent/hooks/useMeterReadingsV2"
import useFetchDashboardData from 'components/layouts/Dashboards/hooks/useFetchDashboardData';
import './assets.css';
import DefaultToolbox from './defaultmenu';
import LineToolbox from './textboxmenu';
import NodeToolbox from './Nodetoolbar';
import DisplayToolbox from './Displaytoolbar';
import TextLabelMenu from './TextLabelMenu';
import useCurrentScadadetails from '../hooks/useGetcurentScadadetails';
import PositionableEdge from "./PositionableEdge";
import PipeLine from "./PipeLine"
import DashedConnector from './DashedConnector';
import { isArray } from 'lodash';

const snapGrid = [20, 20];


const nodeTypes = {
    customNode: NodeComponent, // Associate customNode type with NodeComponent
  };


const edgeTypes = {
  'pipe-line': PipeLine,
    'pipe-line-dashed': PipeLineDashed,
    'pipe-line-solid': PipeLineDashed,
    'conveyor': PipeLineDashed,
    'dashed-connector': DashedConnector
}

const CustomMarker = () => (
    <svg width="100" height="100" style={{ position: 'absolute', visibility: 'hidden' }}>
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="black" />
        </marker>
      </defs>
    </svg>
  );
 
const defaultViewport = { x: 0, y: 0, zoom: 1.5 };

const proOptions = { hideAttribution: true };

const initialEdges = []; // Add edges if needed

const ScadaContent = forwardRef((props) => {
    const [IsPopupOpen, setIsPopupOpen] = useState(false);
    const [nodesatom, setNodesAtom] = useRecoilState(nodesAtom); 
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [isDefaultToolbox, setIsDefaultToolbox] = useState(true);
    const [isConnectionToolbox, setConnectionToolbox] = useState(true); 
    const [selectedScadaView,setSelectedScadaView] = useRecoilState(selectedScadaViewState);
    // const [isEditModeOn] = useRecoilState(scadaViewEditMode);
    const [isEditModeOn,setisEditModeOn] = useState(true);
    const [selectedScadaViewSkeleton, setSelectedScadaViewSkeleton] = useRecoilState(currentScadaViewSkeleton);
     const [isScadaContentVisible, setScadaContentVisible] = useRecoilState(scadaContentVisibleState);
    const [isScadaContentVisibleEdit, setScadaContentVisibleEdit] = useRecoilState(scadaContentVisibleEditState);
    const [headPlant] = useRecoilState(selectedPlant);
    const [rfInstance, setRfInstance] = useRecoilState(scadaInstance);
    const { setViewport } = useReactFlow(); 
    const [selectedNode, setSelectedNode] = useState(null); 
    const fetchedDashboardData = useRecoilValue(fetchedDashboardDataState);
    const { fetchDashboardData, getfetchDashboard, fetchDashboardLoading, fetchDashboardError } = useFetchDashboardData();
    const [btGroupValue] = useRecoilState(dashBtnGrp);
    const [selectionType, setSelectionType] = useState(null);
   // console.log('selectionType',selectionType)
    const [,setProgressBar] = useRecoilState(ProgressLoad);
    const { CurrentscadaUserLoading, CurrentscadaUserError, CurrentscadaUserData, getCurrentScadadetails } = useCurrentScadadetails();
    // const [color, setColor] = useState('#000000'); // Default color
     const [color, setColor] = useState('#0090FF'); // Default color
    //  const [number, setNumber] = useState(1); // Default number
    const [selectedOption, setSelectedOption] = useState('smoothstep'); // Default connection type
      const [number, setNumber] = useState(1); // Default number
      const [selectedEdge, setSelectedEdge] = useState(null);
      const [nodeType, setnodeType] = useState(null);
      const [UndoArr, setUndoArr] = useState([]);
      const [RedoArr, setRedoArr] = useState([]);
      const [Textvalue,setTextvalue] = useState('');
      const [TextStyle,setTextStyle] = useState({color: 'black',size: 12,weight: false,style: false,underline: false,align: 'left'});
      const { zoomIn, zoomOut ,fitView,getNodes,getEdges} = useReactFlow();
     // console.log('sel option',selectedOption )
const lastTime = configParam.DATE_ARR(btGroupValue, headPlant);
const to = new Date();
const from = new Date(to.getTime() - 2 * 60 * 60 * 1000); // Two hours ago
const startrange = formatWithOffset(from);
const endrange = formatWithOffset(to); 
const tooBarRef = useRef()
const [copiedItems, setCopiedItems] = useState({ nodes: [], edges: [] });
const [isMorethenOneSelect,setisMorethenOneSelect] = useState({isSelected:false,Arr:[]})
const CopyRef = useRef()

const handleArrowKey = useCallback((event) => {
  // console.log("newXnewX",event,selectedNode)
    // /if (!selectedNode) return;
    let undoarr = [...UndoArr]
    if(isMorethenOneSelect.isSelected){
      undoarr.push({nodes:isMorethenOneSelect.Arr,isMultiChange:true,id:"Position"+new Date().getTime(),type:'customNode' })
    }else{
      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          // console.log(node,"nodenodenodeMove",isMorethenOneSelect)
          if (selectedNode && node.id === selectedNode.id && !isMorethenOneSelect.isSelected) {
            const movement = 10; // Move by 10 pixels

            let newX = node.position.x;
            let newY = node.position.y;

            if (event === "ArrowUp") newY -= movement;
            if (event === "ArrowDown") newY += movement;
            if (event === "ArrowLeft") newX -= movement;
            if (event === "ArrowRight") newX += movement;  
            // console.log(newX,"newXnewX",undoarr)
            undoarr.push({...node,selected:false,onChange:true})
            return { ...node, position: { x: newX, y: newY } };
          }
          return node;
        })
      );
    } 
    setUndoArr(undoarr) 
}, [setNodes,selectedNode,UndoArr]);

  useEffect(() => {
    // console.log(nodes,"nodesnodes")
    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener("mousedown", preventCtrlClick);
    return () => {
      window.removeEventListener('keydown', handleKeyPress); // Cleanup listener
      window.removeEventListener("mousedown", preventCtrlClick);
    };
    
  }, [UndoArr,nodes,props,isMorethenOneSelect,IsPopupOpen]);

  

  const preventCtrlClick = (event) => {
    // console.log("Ctrl + Left Click blocked!",event);
    if (event.ctrlKey && event.button === 0) {
      
      event.preventDefault();  // Prevent default browser behavior
      event.stopPropagation(); // Stop propagation to React Flow
      
    }
  };
  const handleZoomIn = useCallback(() => {
    zoomIn();
  }, [zoomIn]);

  const handleZoomOut = useCallback(() => {
    zoomOut();
  }, [zoomOut]);


  const handleResetZoom = useCallback(() => {
    setViewport({ x: 0, y: 0, zoom: 1.5 }); // Reset to default zoom and position
  }, [setViewport]);

  const handleFitView = useCallback(() => {
    fitView({ padding: 0.2 }); // Optional padding around the nodes
  }, [fitView]);

  const handleDeselectAll = useCallback(() => {
    setNodes((nodes) =>
      nodes.map((node) => ({
        ...node,
        selected: false, // Deselect the node
      }))
    );

    setEdges((edges) =>
      edges.map((edge) => ({
        ...edge,
        selected: false, // Deselect the edge
      }))
    );
  }, [setNodes, setEdges]);

  const handleselectAll = useCallback(() => {
    setNodes((nodes) =>
      nodes.map((node) => ({
        ...node,
        selected: true, // Deselect the node
      }))
    );

    setEdges((edges) =>
      edges.map((edge) => ({
        ...edge,
        selected: true, // Deselect the edge
      }))
    );
    // setisMorethenOneSelect({isSelected:true,Arr:nodes})
  }, [setNodes, setEdges]);

  useEffect(()=>{
    if(nodes && nodes.length > 0){
      const selectedNodes = nodes.filter((node) => node.selected);
      const selectedEdges = edges.filter((edge) => edge.selected);
  
      if (selectedNodes.length > 1 || selectedEdges.length > 1) {
        //  console.log(nodes,'slenbnbnjhv')
          setisMorethenOneSelect({isSelected:true,Arr:selectedNodes})
        // console.log('Copied Items:', { nodes: selectedNodes, edges: selectedEdges });
      }else{
        setisMorethenOneSelect({isSelected:false,Arr:[]})
  
      }
    }
   

  },[nodes,edges])


 

  const handleCopy = () => {
    const selectedNodes = getNodes().filter((node) => node.selected);
    const selectedEdges = getEdges().filter((edge) => edge.selected);

    if (selectedNodes.length > 0 || selectedEdges.length > 0) {
      setCopiedItems({ nodes: selectedNodes, edges: selectedEdges });
      // console.log('Copied Items:', { nodes: selectedNodes, edges: selectedEdges });
    }
  }
  useEffect(() => {
    CopyRef.current = copiedItems;
  }, [copiedItems]);
  // Paste copied items

  const handleMultipleCopy =()=>{
    const selectedNodes = getNodes().filter((node) => node.selected);
    const selectedEdges = getEdges().filter((edge) => edge.selected);
    if (selectedNodes.length > 0 || selectedEdges.length > 0) {
      const nodes = selectedNodes
      const edges = selectedEdges

       if (nodes.length === 0 && edges.length === 0) return;

    // Create copies of the nodes with new IDs and adjusted positions
    handleDeselectAll()
    const newNodes = nodes.map((node) => ({
      ...node,
      id: `${node.id}-copy-${Date.now()}`,
      position: { x: node.position.x + 80, y: node.position.y + 80 },
      selected: true, // Keep the copied nodes selected
    }));

    // Create copies of the edges with new IDs and updated source/target
    const newEdges = edges.map((edge) => ({
      ...edge,
      id: `${edge.id}-copy-${Date.now()}`,
      source: `${edge.source}-copy-${Date.now()}`, // Update source ID
      target: `${edge.target}-copy-${Date.now()}`, // Update target ID
      selected: true, // Keep the copied edges selected
    }));
    let undoObj = [...UndoArr]
    undoObj.push({nodes:newNodes,onChange:false, selected: false,isMultiNodesDuplicate:true,id:"duplicate",type:'customNode' })
    setUndoArr(undoObj)

    // Add the new nodes and edges to the flow
    setNodes((prevNodes) => [...prevNodes, ...newNodes]);
    setEdges((prevEdges) => [...prevEdges, ...newEdges]);
    
    }
  }
  const handleCut = useCallback(() => {
    const selectedNodes = getNodes().filter((node) => node.selected);
    const selectedEdges = getEdges().filter((edge) => edge.selected);

    if (selectedNodes.length > 0 || selectedEdges.length > 0) {
      const copiedData = { nodes: selectedNodes, edges: selectedEdges };
      setCopiedItems(copiedData); // Update state
      // CopyRef.current = copiedData; // Update ref synchronously
      // console.log('Cut Items:', copiedData);

      // Remove the selected nodes and edges from the flow
      setNodes((prevNodes) => prevNodes.filter((node) => !node.selected));
      setEdges((prevEdges) => prevEdges.filter((edge) => !edge.selected));
    }
  }, [getNodes, getEdges, setNodes, setEdges]);

  const handlePaste = useCallback(() => {
    const { nodes, edges } = CopyRef.current; // Use ref to get the latest copied items
    // console.log(nodes, edges, 'initialCondition');

    if (nodes.length === 0 && edges.length === 0) return;

    // Create copies of the nodes with new IDs and adjusted positions
    const newNodes = nodes.map((node) => ({
      ...node,
      id: `${node.id}-copy-${Date.now()}`,
      position: { x: node.position.x + 80, y: node.position.y + 80 },
      selected: true, // Keep the copied nodes selected
    }));

    // Create copies of the edges with new IDs and updated source/target
    const newEdges = edges.map((edge) => ({
      ...edge,
      id: `${edge.id}-copy-${Date.now()}`,
      source: `${edge.source}-copy-${Date.now()}`, // Update source ID
      target: `${edge.target}-copy-${Date.now()}`, // Update target ID
      selected: true, // Keep the copied edges selected
    }));
    let undoObj = [...UndoArr]
    undoObj.push({nodes:newNodes,onChange:false, selected: false,isMultiNodesDuplicate:true,id:"duplicate",type:'customNode' })
    setUndoArr(undoObj)
    setSelectedNode(null)
    setSelectionType(null)
    // Add the new nodes and edges to the flow
    setNodes((prevNodes) => [...prevNodes, ...newNodes]);
    setEdges((prevEdges) => [...prevEdges, ...newEdges]);

    // console.log('Pasted Items:', { nodes: newNodes, edges: newEdges });
  }, [setNodes, setEdges]);

  const handlePasteInPlace = useCallback(() => {
    const { nodes, edges } = CopyRef.current; // Use ref to get the latest copied items
    // console.log(nodes, edges, 'initialCondition');
  
    if (nodes.length === 0 && edges.length === 0) return;
  
    // Create copies of the nodes with new IDs and same positions
    const newNodes = nodes.map((node) => ({
      ...node,
      id: `${node.id}-copy-${Date.now()}`,
      position: { x: node.position.x, y: node.position.y }, // Same position
      selected: true, // Keep the copied nodes selected
    }));
  
    // Create copies of the edges with new IDs and updated source/target
    const newEdges = edges.map((edge) => ({
      ...edge,
      id: `${edge.id}-copy-${Date.now()}`,
      source: `${edge.source}-copy-${Date.now()}`, // Update source ID
      target: `${edge.target}-copy-${Date.now()}`, // Update target ID
      selected: true, // Keep the copied edges selected
    }));
  
    // Add the new nodes and edges to the flow
    let undoObj = [...UndoArr]
    undoObj.push({nodes:newNodes,onChange:false, selected: false,isMultiNodesDuplicate:true,id:"duplicate",type:'customNode' })
    setUndoArr(undoObj)

    setNodes((prevNodes) => [...prevNodes, ...newNodes]);
    setEdges((prevEdges) => [...prevEdges, ...newEdges]);
  
    // console.log('Pasted Items in Place:', { nodes: newNodes, edges: newEdges });
  }, [setNodes, setEdges]);

  

  const handleKeyPress = (event) => {
    const { ctrlKey,shiftKey, key, code } = event;
    if(IsPopupOpen){
      return false
    }
    // Prevent default behavior for all Ctrl + key combinations
    if (ctrlKey) {
      event.preventDefault();
      event.stopPropagation();
    }
    const normalizedKey = key.toLowerCase();

  
    // Define a map of key combinations and their corresponding actions
    const keyActions = {
      "z": () => handleUndo("undo"),
      "y": () => handleRedo("redo"),
      "delete": () => {
        if(isMorethenOneSelect.isSelected){

          handleDeleteMultipleNode()
        }else{
          // console.log("entersss")
          tooBarRef.current.handleDeleteDisplay()
        }
      },
      // "backspace": () => {
      //   const isNodeSelected = nodes.some((node) => node.selected);
      //   if (isNodeSelected) {
      //     // Prevent the default behavior (e.g., node removal)
      //     event.preventDefault();
      //     event.stopPropagation();
      //   }
      // },
      "s": () => props.handleSave(),
      'd': () => {
        if(isMorethenOneSelect.isSelected){
          handleMultipleCopy()
        }else{
          // console.log("isenter")
          handleCopyNode()
        }
        },
      'escape': () => handleDeselectAll(),
      '=': () => handleZoomIn(),
      '-': () => handleZoomOut(),
      '0': () => {
        handleResetZoom();
        handleFitView();
      },
      'c': () => {
        // console.log('Copying Selected Items');
        handleCopy();
      },
      'x': () => {
        // console.log('Cutting Selected Items');
        handleCut();
      },
      'v': () => {
        // console.log('Pasting Copied Items');
        handleDeselectAll();
        if (ctrlKey && shiftKey) {
          handlePasteInPlace(); // Paste in place (Ctrl + Shift + V)
        } else {
          handlePaste(); // Paste with offset (Ctrl + V)
        }
      },
      'a': () => handleselectAll(),
      'arrowup': ()=> handleArrowKey("ArrowUp"),
      'arrowdown': ()=> handleArrowKey('ArrowDown'),
      'arrowleft': ()=> handleArrowKey('ArrowLeft'),
      'arrowright': ()=> handleArrowKey('ArrowRight'),
    }; 
  
    // Execute the corresponding action if the key is in the map
    if (ctrlKey && keyActions[normalizedKey]) {
      keyActions[normalizedKey]();
    } else if (normalizedKey === 'delete' || normalizedKey === 'escape'||  normalizedKey === 'arrowright'||  normalizedKey === 'arrowup'||  normalizedKey === 'arrowdown'||  normalizedKey === 'arrowleft' ) {
      keyActions[normalizedKey]();
    } 
    else {
      console.log('Other Key Pressed:', normalizedKey, ctrlKey);
    }
  };


function formatWithOffset(date) {
    let isoString = date.toISOString();
    let offset = '+05:30'; // Specify the required offset
    return isoString.replace('Z', offset); // Replace 'Z' (UTC) with the desired offset
}


const deleteNode = (nodeId) => {
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));
    setEdges((prevEdges) => prevEdges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  };

// Function to trigger the API call for fetching the dashboard data
const triggerApiCall = (params) => {
    getfetchDashboard("/dashboards/getdashboard", params, [], false, [], '', lastTime);
};

const handleNodeSelection = (node) => {
    setSelectedNode(node);
    //console.log(node)
    setnodeType(node.data.styleType);
    // if (node.data.styleType === 'text') {
    //     console.log('Selected node is of type Text');
    //     setTextvalue(node.data.label)
    //     let styleObj = node.data.details
    //     setTextStyle({color: styleObj.fontColor,size: styleObj.fontSize,weight: styleObj.fontWeight,style: styleObj.fontStyle,underline: styleObj.fontUnderline,align: styleObj.textAlign})
    // }  
};


 // Handler for flip vertical
//  const handleFlipvertical = () => {
//     if (selectedNode) {
//         selectedNode.flipVertical(); // Assuming flipVertical is a method available on the node object
//         console.log('Node flipped vertically');
//     }
// };

// const handleFlipHorizontal = () => {
//     if (selectedNode) {
//       // Apply scaleX(-1) to flip the node horizontally
//       setNodes((nds) =>
//         nds.map((node) => {
//           if (node.id === selectedNode.id) {
//             // Check if the node already has scaleX(-1) applied
//             const currentTransform = node.style?.transform || '';
//             const isFlippedHorizontally = currentTransform.includes('scaleX(-1)');

//             // Toggle the flip state based on the current transform
//             return {
//               ...node,
//               style: {
//                 ...node.style,
//                 transform: isFlippedHorizontally
//                   ? currentTransform.replace('scaleX(-1)', '')
//                   : `${currentTransform} scaleX(-1)` // Flip horizontally
//               }
//             };
//           }
//           return node;
//         })
//       );
//     } else {
//       console.log("No node selected to flip.");
//     }
//   };

//center flip
const handleFlipHorizontal = () => {
  if (selectedNode) {
    let undoarr = [...UndoArr]
    // Apply scaleX(-1) to flip the node horizontally around its center
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          // Check if the node already has scaleX(-1) applied s
          // const currentTransform = node.style?.transform || `translate(${node.position.x}px, ${node.position.y}px)`+` rotate(${0}deg)`;
          // const isFlippedHorizontally = currentTransform.includes('scaleX(-1)');

          // Toggle the flip state based on the current transform
          let nodeObj = {
            ...node,
            data:{
              ...node.data,
              fliphorizon: node.data.fliphorizon ? '' : 'scaleX(-1)'
            }
            // style: {
            //   ...node.style,
            //   transform: isFlippedHorizontally
            //     ? currentTransform.replace('scaleX(-1)', '')
            //     : `${currentTransform} scaleX(-1)`, // Flip horizontally
            //   transformOrigin: 'center center', // Ensure the flip happens around the center
            // },
          };
          undoarr.push({...node,selected:false,onChange:true})
          return nodeObj
        }
        return node;
      })
    );
    setUndoArr(undoarr)
  } else {
    console.log("No node selected to flip.");
  }
};

// Handler for flip horizontal
// const handleFlipvertical = () => {
//     if (selectedNode) {
//       // Apply scaleY(-1) to flip the node vertically
//       setNodes((nds) =>
//         nds.map((node) => {
//           if (node.id === selectedNode.id) {
//             // Toggle the flip by checking if the scaleY(-1) is already applied
//             const currentTransform = node.style?.transform || '';
//             const isFlippedVertically = currentTransform.includes('scaleY(-1)');

//             // Flip or unflip the node based on its current state
//             return {
//               ...node,
//               style: {
//                 ...node.style,
//                 transform: isFlippedVertically
//                   ? currentTransform.replace('scaleY(-1)', '')
//                   : `${currentTransform} scaleY(-1)` // Flip vertically
//               }
//             };
//           }
//           return node;
//         })
//       );
//     } else {
//       console.log("No node selected to flip.");
//     }
//   };

//center flip
const handleFlipvertical = () => {
  if (selectedNode) {
    let undoarr = [...UndoArr]
    // Apply scaleY(-1) to flip the node vertically around its center
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          // Toggle the flip by checking if the scaleY(-1) is already applied
          // const currentTransform = node.style?.transform || `translate(${node.position.x}px, ${node.position.y}px)`+` rotate(${0}deg)`;
          // const isFlippedVertically = currentTransform.includes('scaleY(-1)');

          // Flip or unflip the node based on its current state
          let nodeObj = {
            ...node,
            data:{
              ...node.data,
              flipvertical: node.data.flipvertical ? '' : 'scaleY(-1)'
            }
            // style: {
            //   ...node.style,
            //   transform: isFlippedVertically
            //     ? currentTransform.replace('scaleY(-1)', '')
            //     : `${currentTransform} scaleY(-1)`, // Flip vertically
            //   transformOrigin: 'center center', // Ensure the flip happens around the center
              
            // },
          };
          undoarr.push({...node,selected:false,onChange:true})
          return nodeObj
        }
        
        return node;
      })
    );
    setUndoArr(undoarr)
  } else {
    console.log("No node selected to flip.");
  }
};


// Handler for copy
const handleCopyNode = () => {
    if (selectedNode) {
      // Get the current position of the selected node
      let PrevNodes = nodes.map((node) => {
                          if (node.id === selectedNode.id) { // Correct comparison to selectedNode.id
                               
                              // return node
                              return {
                                  ...node,
                                  selected:false
                              };
                          }
                          return node;
                      })
      let selupdatedNode = nodes.find(n => n.id === selectedNode.id)                       
      const { x, y } = selupdatedNode.position;
      let noderotate = selupdatedNode.data.transform ? selupdatedNode.data.transform : 0
      // Create a copy of the selected node with a new id and a slight offset
      let uniqID = `${new Date().getTime()}-copy` 
      const copiedNode = {
        ...selupdatedNode,
        id: uniqID, // New unique id
        selected:true,
        data:{
          ...selupdatedNode.data,
          style: selupdatedNode.style,
          id: uniqID,
        },
        position: { x: x + 50, y: y + 50 }, // Add a small offset to avoid overlap
      };
      // console.log(copiedNode,"copiedNodecopiedNode",selupdatedNode,selectedNode)
      let undoObj = [...UndoArr]
      undoObj.push(copiedNode)
      setUndoArr(undoObj)
      // Add the copied node to the nodes state
      setNodes([...PrevNodes, copiedNode]);
      setSelectedNode(null)
      setSelectionType(null)
    } else {
      console.log("No node selected to copy.");
    }
  };

// Handler for rotate
// const handleRotate = () => {
//    // console.log('rotate clicked');
//     if (selectedNode) {
//         setNodes((nds) =>
//             nds.map((node) => {
//                 if (node.id === selectedNode.id) { // Correct comparison to selectedNode.id
//                     // Ensure the node has a style object and transform property
//                     const currentRotation = parseInt(node.style?.transform?.replace('rotate(', '').replace('deg)', ''), 10) || 0;
//                     const newRotation = currentRotation + 45; // Rotate by 15 degrees
//                     return {
//                         ...node,
//                         style: { 
//                             ...node.style, 
//                             transform: `rotate(${newRotation}deg)` // Update the transform style
//                         }
//                     };
//                 }
//                 return node;
//             })
//         );
//     } else {
//         console.log("No node selected to rotate.");
//     }
// };

//handle rotate in smooth 

const handleRotate = () => { 
  if (selectedNode) {
    let undoObj = [...UndoArr]
      setNodes((nds) =>
          nds.map((node) => {
              if (node.id === selectedNode.id) { // Correct comparison to selectedNode.id
                  // Get current transform and parse rotation if it exists
                  const currentTransform = node.data?.transform || 0; 
                  const newRotation = currentTransform + 45; // Rotate by 45 degrees

                  // Update transform with existing transforms (flip, scale, etc.) and add new rotation
                  // console.log(node,"nodeRotate",newRotation,currentTransform)
                  // return node
                  let nodeobj= {
                      ...node,
                      // style:{
                      //   ...node.style,
                      //   transformOrigin: 'center center',
                      //   transform: `translate(${node.position.x}px, ${node.position.y}px)`+` rotate(${newRotation}deg)`,
                      //   transition: 'transform 0.3s ease'
                      // },
                      data: {
                        ...node.data,
                        transform: newRotation, // Apply new rotation without resetting previous transformations
                      }
                  };
                  // console.log({...nodeobj,selected:false,onChange:true},"RotateundoObj")
                  
                  // undoObj.push({...nodeobj,selected:false,onChange:true})
                  undoObj.push({...node,selected:false,onChange:true})
                  return nodeobj
              }
              return node;
          })
      );
      // console.log(undoObj,"RotateundoObj")
      setUndoArr(undoObj)
  } else {
      console.log("No node selected to rotate.");
  }
};


// Function to flip a node horizontally
// const flipHorizontal = (nodeId) => {
//     setNodes((nodes) =>
//       nodes.map((node) =>
//         node.id === nodeId
//           ? {
//               ...node,
//               position: {
//                 x: node.position.x * -1,
//                 y: node.position.y,
//               },
//             }
//           : node
//       )
//     );
//   };



  // Function to flip a node vertically
  const flipVertical = (nodeId) => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              position: {
                x: node.position.x,
                y: node.position.y * -1,
              },
            }
          : node
      )
    );
  };

  // Function to rotate a node by 45 degrees
  const rotateNode = (nodeId) => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              style: {
                ...node.style,
                transform: `rotate(45deg)`,
              },
            }
          : node
      )
    );
  };

  // Function to copy a node
  const copyNode = (nodeId) => {
    const nodeToCopy = nodes.find((node) => node.id === nodeId);
    if (nodeToCopy) {
      const copiedNode = {
        ...nodeToCopy,
        id: `${Math.random()}`, // Generate a new ID for the copied node
        position: {
          x: nodeToCopy.position.x + 50, // Offset the copied node's position
          y: nodeToCopy.position.y + 50,
        },
      };
      setNodes((prevNodes) => [...prevNodes, copiedNode]);
    }
  };

const onSelectionChange = (event) => {
    const { nodes, edges } = event;

    // console.log(IsPopupOpen,'Selected nodes:', nodes,edges,event,selectedNode);
    // console.log(event,'Selected edges:', edges,"selectedScadaViewSkeleton",selectedScadaViewSkeleton,rfInstance); 
    if (nodes && nodes.length > 0) {
        const currentNode = nodes[0];
          setSelectionType('node'); 
          // console.log(selectedNode && selectedNode.id !== nodes[0].id ,"MultiSelect",nodes[0],selectedNode)
          if(selectedNode && selectedNode.id !== nodes[0].id){
            handleNodeSelection(currentNode); 
          }else if(!selectedNode){
            handleNodeSelection(currentNode); 
          }
          
        setIsDefaultToolbox(true);  // Node selected, show default toolbox
    } else if (edges && edges.length > 0) {
        // console.log('Selected edge-svd:', edges);
        //const selectedEdge = edges[0];
        setSelectionType('edge');
        setSelectedEdge(edges[0])
        if(selectedEdge && selectedEdge.id !== edges[0].id){
          handleEdgeSelection(edges[0]);
        }else if(!selectedEdge){
          handleEdgeSelection(edges[0]);
        }
        
        setIsDefaultToolbox(false);  // Edge selected, show edge toolbox
        setisEditModeOn(false)
    } else {
        setSelectionType(null);
        setisEditModeOn(true)
        setSelectedEdge(null)
        setSelectedNode(null);
        setNumber(1)
        setSelectedOption('smoothstep')
        setColor('#0090FF');
        setIsDefaultToolbox(true);  // No selection, show default toolbox

    }
};

useEffect(()=>{
  if(nodeType === 'text' && selectedNode){
    setTextvalue(selectedNode.data.label)
    let styleObj = selectedNode.data.details
    setTextStyle({color: styleObj.fontColor,size: styleObj.fontSize,weight: styleObj.fontWeight,style: styleObj.fontStyle,underline: styleObj.fontUnderline,align: styleObj.textAlign})
    // console.log('Selected node is of another type',node,nodeType);
  }
},[selectedNode])



const handleEdgeSelection = (edge) => {
    // console.log("handleEdgeSelection",edge);
    if (edge.style?.stroke) {
      setColor(edge.style.stroke); // Set edge color if available
    } else {
      setColor('#0090FF'); // Default color
    }
    if(edge.style?.strokeWidth){
        setNumber(edge.style.strokeWidth)
    }else{
        setNumber(1)
    }
    if(edge?.type){
        setSelectedOption(edge.type)
    }else{
        setSelectedOption('smoothstep')
    }
  };

const handleColorChange = (newColor) => {

    setColor(newColor);
    if (selectedEdge) {
      let undoObj = [...UndoArr]
        const updatedEdges = edges.map((edge) =>{
          if(edge.id === selectedEdge.id){
            let edgobj ={ ...edge, style: { ...edge.style, stroke: newColor } }
            undoObj.push({...edge,selected:false,onChange:true})
            return edgobj
          } 
          return edge
        });
        setUndoArr(undoObj)
        setEdges(updatedEdges);
      }
  };
  // Function to update connection type
  const handleConnectionTypeChange = (newType) => {
    setSelectedOption(newType);
    if (selectedEdge) {
      let undoObj = [...UndoArr]
        const updatedEdges = edges.map((edge) =>{
          if(edge.id === selectedEdge.id){
            let edgobj = { ...edge, type: newType === 'smoothstep' ? '' : newType,data:{...edge.data, type: newType} }
            undoObj.push({...edge,selected:false,onChange:true})
            return edgobj
          } 
          return edge
        });
        setUndoArr(undoObj)
        setEdges(updatedEdges);
      }
  };


   // Function to update connection type
   const handleConnectionWidth = (newNo) => {
    
    setNumber(newNo);
    if (selectedEdge) {
      let undoObj = [...UndoArr]
        const updatedEdges = edges.map((edge) =>{
        // console.log(selectedEdge,"handleConnectionWidth",edge)
            if(edge.id === selectedEdge.id){
              let edgobj = { ...edge, style: { ...edge.style, strokeWidth: newNo } }
                undoObj.push({...edge,selected:false,onChange:true})
                return edgobj
            }
            return edge
        });
        setUndoArr(undoObj)
        setEdges(updatedEdges);
      }
  };

  const handleDeleteNode = (nodeId) => {

    if (selectedNode) {
        // Remove the selected node from the nodes state
        
        setNodes((prevNodes) =>
            prevNodes.filter((node) => node.id !== selectedNode.id)
        );
        let undoObj = [...UndoArr]
        undoObj.push({...selectedNode,onChange:false,selected:false})
        setUndoArr(undoObj)
        // Clear the selected node
        setSelectedNode(null);
    } else {
        console.log("No node selected to delete.");
    }
};


const handleDeleteMultipleNode = ()=>{
  const removeid =isMorethenOneSelect.Arr.map(x=>x.id)
  // console.log(nodes.filter(x=>!removeid.includes(x.id)),"nodes.filter(x=>!removeid.includes(x.id))")
  setNodes(nodes.filter(x=>!removeid.includes(x.id)));
  let undoObj = [...UndoArr]
  undoObj.push({ nodes:isMorethenOneSelect.Arr,onChange:false, selected: false,isMultiNodes:true,id:0,type:'customNode' })
  setUndoArr(undoObj)
  // Clear the selected node
}

  // Handle reverse button click
  const handleReverseConnection = (reversedEdge) => {
    
    if (selectedEdge) {
      let undoObj = [...UndoArr]
        const updatedEdges = edges.map((edge) =>{
            let MendType = edge.markerEnd && edge.markerEnd.type
            let MstartType = edge.markerStart && edge.markerStart.type
            if(edge.id === selectedEdge.id){
              let edgobj={ ...edge, markerEnd: MendType ? {type:''} : {type:"arrowclosed"}, markerStart: MstartType ? {type:''} : {type:"arrowclosed"}, }
              undoObj.push({...edge,selected:false,onChange:true})
              return edgobj
            }
             return edge
          });
          // console.log(updatedEdges,"reversedEdgereversedEdge")
          setUndoArr(undoObj)
        setEdges(updatedEdges);
      }
};

// Function to delete the edge
const handleDeleteEdge = (edgeId) => {
    // const updatedEdges = edges.filter(edge => edge.id !== edgeId);
    // setEdges(updatedEdges);
    if (selectedEdge) {
        // Remove the selected edge from the edges state
        setEdges((prevEdges) =>
            prevEdges.filter((edge) => edge.id !== selectedEdge.id)
        );
        let undoObj = [...UndoArr]
        undoObj.push(selectedEdge)
        setUndoArr(undoObj)
        // Clear the selected edge
        // setSelectedEdge(null);
        setSelectionType(null);
        setSelectedNode(null);
        setNumber(1)
        setSelectedOption('smoothstep')
        setColor('#0090FF');
        setIsDefaultToolbox(true);
    } else {
        console.log("No edge selected to delete.");
    }
};
// Function to reverse the connection (swap source and target)


 

const handleUpdateLink = (selectedFields) => {
   
  let undoObj = [...UndoArr] 
  // console.log("handleUpdateLink",selectedNode)
  // Update the selected node
  setNodes((prevNodes) => {
      return prevNodes.map((node) => {
          if (node.id === selectedNode.id) {
              // If this is the selected node, update its data
              let nodeobj = {
                  ...node,
                  data: {
                      ...node.data,
                      label: `${selectedFields.name}`, // Display the asset name
                      details: selectedFields,
                  },
              };
              undoObj.push({...node,selected:false,onChange:true})
              setSelectedNode(nodeobj);
              return nodeobj
          }
          // Return unchanged node if it's not the selected one
          return node;
      });
  });
    setUndoArr(undoObj)
};

const handleAddDisplay = (selectedFields,type) => {
    let metricValue = '-'; // Use 'let' to allow reassignment later

 //   console.log('Fetched Dashboard Data:', fetchedDashboardData);

    if (Array.isArray(fetchedDashboardData) && fetchedDashboardData.length > 0 && !Array.isArray(selectedFields.metric)) {
        // Find the relevant metric value from fetchedDashboardData based on the selected metricId
        const fetchedData = fetchedDashboardData.find(item => item.metricId === selectedFields.metric.id);
        if (fetchedData) {
            // If data is found, update metricValue with the fetched value
            metricValue = fetchedData.value;
        } else {
            // If no matching data is found, set metricValue to 'N/A'
            metricValue = 'N/A';
        }
    } else {
        // Handle case where fetchedDashboardData is not available or empty
        console.log('Fetched data is empty or not an array');
    }

    // Create a new node object with the data you received from the modal
    let newNode
    if(type === 'link'){
      newNode = {
        id: `node-${Date.now()}`, // Unique ID
        type: 'customNode', // You can set this to your custom node type
        position: { x: Math.random() * 250, y: Math.random() * 250 }, // Random position or based on user input
        selected:true,
        data: {
            label: `${selectedFields.name}`, // Display the asset name
            details: selectedFields,
            styleType: 'Link',
            style:{width: 150,height:40},
        },
        style:{width: 150,height:40},
      };
    }else{
      let detObj 
      if(selectedFields.asset.name === 'N/A'){
        detObj = {
          instrument: selectedFields.instrument.name,
          instrumentid: selectedFields.instrument.id,
          metric: selectedFields.metric.name,
          metricUnit: selectedFields.metric.unit,
          value: metricValue, // Use the fetched metric value
          metrictitle: selectedFields.metric.title,
          assets: selectedFields.asset.name,
        }
      }else{
        detObj = {
          instrument: selectedFields.instrument.name,
          instrumentid: selectedFields.instrument.id,
          metric: selectedFields.metric,
          value: metricValue, // Use the fetched metric value
          assets: selectedFields.asset.name,
        }
      }
      newNode = {
        id: `node-${Date.now()}`, // Unique ID
        type: 'customNode', // You can set this to your custom node type
        position: { x: Math.random() * 250, y: Math.random() * 250 }, // Random position or based on user input
        selected:true,
        data: {
            label: `Asset: ${selectedFields.asset.name}`, // Display the asset name
            details: detObj,
            styleType: 'display',
            style:{width: selectedFields.asset.name !== 'N/A' ? 350 : 180,height: selectedFields.asset.name !== 'N/A' ? 100 : 50 },
        },
        style:{width: selectedFields.asset.name !== 'N/A' ? 350 : 180 ,height: selectedFields.asset.name !== 'N/A' ? 100 : 50},
      };
    }
      // console.log(newNode,"newNodenewNode")
// return false
    let undoObj = [...UndoArr]
    undoObj.push(newNode)
    setUndoArr(undoObj)

    // Add the new node to the existing nodes list
    setNodes((prevNodes) => [...prevNodes, newNode]);
};


const handleUpdateDisplay = (selectedFields) => {
  let metricValue = '-'; // Default value

  // Check if fetchedDashboardData is valid and has elements
  if (Array.isArray(fetchedDashboardData) && fetchedDashboardData.length > 0 && !Array.isArray(selectedFields.metric)) {
      // Find the relevant metric value from fetchedDashboardData based on the selected metricId
      const fetchedData = fetchedDashboardData.find(item => item.metricId === selectedFields.metric.id);
      if (fetchedData) {
          // Update metricValue with the fetched value if data is found
          metricValue = fetchedData.value;
      } else {
          // Set metricValue to 'N/A' if no data is found
          metricValue = 'N/A';
      }
  } else {
      console.log('Fetched data is empty or not an array');
  }
  let undoObj = [...UndoArr]
  // Update the selected node
  setNodes((prevNodes) => {
      return prevNodes.map((node) => {
          if (node.id === selectedNode.id) {
              let detObj 
              if(selectedFields.asset.name === 'N/A'){
                detObj = {
                  instrument: selectedFields.instrument.name,
                  instrumentid: selectedFields.instrument.id,
                  metric: selectedFields.metric.name,
                  metricUnit: selectedFields.metric.unit,
                  value: metricValue, // Use the fetched metric value
                  metrictitle: selectedFields.metric.title,
                  assets: selectedFields.asset.name,
                }
              }else{
                detObj = {
                  instrument: selectedFields.instrument.name,
                  instrumentid: selectedFields.instrument.id,
                  metric: selectedFields.metric,
                  value: metricValue, // Use the fetched metric value
                  assets: selectedFields.asset.name,
                }
              }
              let NodeStyle = {...node.data.style}
              if(selectedFields.asset.name !== 'N/A' && NodeStyle.width < 350){
                NodeStyle["width"] = 350
                NodeStyle["height"] = 100
              }else if(selectedFields.asset.name === 'N/A'){
                NodeStyle["width"] = 180
                NodeStyle["height"] = 50
              }
              // If this is the selected node, update its data
              let nodeobj = {
                  ...node,
                  data: {
                      ...node.data,
                      style: NodeStyle,
                      label: `Asset: ${selectedFields.asset.name}`,
                      details: detObj,
                  },
                  style : NodeStyle,
              };
              undoObj.push({...node,selected:false,onChange:true})
              setSelectedNode(nodeobj);
              return nodeobj
          }
          // Return unchanged node if it's not the selected one
          return node;
      });
  });
    setUndoArr(undoObj)
};


// const handleUpdateDisplay = (selectedFields) => {
//   let metricValue = '-'; // Use 'let' to allow reassignment later

// //   console.log('Fetched Dashboard Data:', fetchedDashboardData);

//   if (Array.isArray(fetchedDashboardData) && fetchedDashboardData.length > 0) {
//       // Find the relevant metric value from fetchedDashboardData based on the selected metricId
//       const fetchedData = fetchedDashboardData.find(item => item.metricId === selectedFields.metric.id);
//       if (fetchedData) {
//           // If data is found, update metricValue with the fetched value
//           metricValue = fetchedData.value;
//       } else {
//           // If no matching data is found, set metricValue to 'N/A'
//           metricValue = 'N/A';
//       }
//   } else {
//       // Handle case where fetchedDashboardData is not available or empty
//       console.log('Fetched data is empty or not an array');
//   }

//   // Create a new node object with the data you received from the modal
//   const newNode = {
//       id: `node-${Date.now()}`, // Unique ID
//       type: 'customNode', // You can set this to your custom node type
//       position: { x: Math.random() * 250, y: Math.random() * 250 }, // Random position or based on user input
//       data: {
//           label: `Asset: ${selectedFields.asset.name}`, // Display the asset name
//           details: {
//               instrument: selectedFields.instrument.name,
//               instrumentid: selectedFields.instrument.id,
//               metric: selectedFields.metric.name,
//               metricUnit: selectedFields.metric.unit,
//               value: metricValue, // Bind the fetched metric value
//               metrictitle:selectedFields.metric.title,
//               assets:selectedFields.asset.name
//           },
//           styleType: 'display',
//       },
//   };

//   // Add the new node to the existing nodes list
//   setNodes((prevNodes) => [...prevNodes, newNode]);
// };
//this is current file
    // useEffect(() => {
    //   console.log(selectedScadaViewSkeleton,"selectedScadaViewSkeletonEdit")
    //     if (selectedScadaViewSkeleton && selectedScadaViewSkeleton.data) {
    //         // Destructure nodes, edges, and viewport from selectedScadaViewSkeleton.data
    //         const { nodes = [], edges = [], viewport = { x: 0, y: 0, zoom: 1 } } = selectedScadaViewSkeleton.data;
            
    //         // Ensure viewport has all the necessary properties (x, y, zoom)
    //         const { x, y, zoom } = viewport;
    
    //         // Set the state with validated data
    //         setNodes(nodes);
    //         //setEdges(edges);
    //         // If there are edges in the selected data, set them
    //     if (edges && edges.length > 0) {
    //         setEdges(edges);
    //     } else {
    //         // If no edges exist, reset the edges to an empty array
    //         setEdges([]);
    //     }
    //         setViewport({ x, y, zoom });

            
    //     } else {
    //         // If selectedScadaViewSkeleton or selectedScadaViewSkeleton.data is undefined, reset to default
    //         setNodes([]);
    //         setEdges([]);
    //         setViewport({ x: 0, y: 0, zoom: 1 });
    //     }
    // }, [selectedScadaViewSkeleton]); // Only run when selectedScadaViewSkeleton changes
    useEffect(() => {
        // Check if selectedScadaViewSkeleton exists and has at least one element
        if (selectedScadaViewSkeleton && selectedScadaViewSkeleton.length > 0) {
          const selectedData = selectedScadaViewSkeleton[0]; // Get the first element of the array
          const lineId = selectedData.line_id; // Get the line_id from selectedScadaViewSkeleton
    
          // Check if line_id exists and is different from headPlant.id
          if (lineId && headPlant.id !== lineId) {
            setScadaContentVisible(false);
          setScadaContentVisibleEdit(false);
          setSelectedScadaViewSkeleton([]);
          setSelectedScadaView(null);
            // If the ids do not match, refresh the page
          //  window.location.reload(); // Reload the page to reset the state
          } 
        }
      }, [headPlant.id, selectedScadaViewSkeleton]); // Dependency array
    
   
    // useEffect(() => {
    //     setIsDefaultToolbox(true);
    //   }, []);
    
      const switchToolbox = () => {
        setIsDefaultToolbox(!isDefaultToolbox);
      };

  
   useEffect(() => {
    if (selectedScadaViewSkeleton && selectedScadaViewSkeleton.length > 0) {
      //  console.log("Selected Scada View Skeleton: Edit", selectedScadaViewSkeleton);

        // Access the first element of the array
        const selectedData = selectedScadaViewSkeleton[0].data;

        // Check if selectedData is not null or undefined before proceeding
        if (selectedData && selectedData.nodes && selectedData.viewport) {
            const { nodes, viewport } = selectedData;

            // Ensure nodes are available
            if (Array.isArray(nodes) && nodes.length > 0) {
                const updatedNodes = nodes.map((node) => {
                    // You can safely access and modify node data here
                    let Nstyle = node.style ? node.style : {"width": 80,"height": 80}
                    let displaywid = (node.data.styleType === 'display' && !Array.isArray(node.data.details.metric)) ? {"width": 180,"height": 50} : {"width": node.width,"height": node.height}
                    let divStyle = node.data.styleType === 'display' ? displaywid : {"width": node.width,"height": node.height}
                    let detObj = node.data.details
                    if(node.data.styleType === 'display' && node.data.details.assets && node.data.details.assets !== 'N/A'){
                      detObj ={
                        ...node.data.details,
                        metric: Array.isArray(node.data.details.metric) ? node.data.details.metric : []
                      }
                    } 
                    const updatedNodeData = {
                        ...node.data,
                        details: detObj,
                        style: Nstyle,
                        // Example of adding an icon from categorizedComponentsData
                        // icon: categorizedComponentsData
                        //     .flatMap((cat) => cat.components)
                        //     .find((comp) => comp.type === node.type)?.icon || node.data.icon,
                        icon: categorizedComponentsData
                        .flatMap((cat) => cat.components)
                        .find((comp) => comp.name === node.data.label)?.icon || node.data.icon,
                    };

                    return {
                        ...node, 
                        selected:false,
                        style: divStyle,
                        data: updatedNodeData,
                    };
                });
                // console.log(updatedNodes,"nodes found in selectedData.");
                // Set nodes in the state
                setNodes(updatedNodes); // Set the updated nodes
                setViewport({
                    x: viewport.x,
                    y: viewport.y,
                    zoom: viewport.zoom,
                });
            } else {
                console.log("No nodes found in selectedData.");
            }
        } else {
            console.log("Invalid or missing data in selectedScadaViewSkeleton.");
        }

        if (selectedData && selectedData.edges && selectedData.viewport) {
          const updatedEdges = selectedData.edges.map(edge => ({
            ...edge, 
            selected:false,
            id: edge.id,
            source: edge.source,
            target: edge.target,
            type: edge.type === 'smoothstep' ? '': edge.type, // or any custom edge type you want to use
            
          }));
  
          setEdges(updatedEdges);
        }
    } else {
            setNodes([]);
            setEdges([]);
            setViewport({ x: 0, y: 0, zoom: 1 });
        console.log("selectedScadaViewSkeleton is empty or undefined.");
    }
}, [selectedScadaViewSkeleton, categorizedComponentsData]); // Re-run if selectedScadaViewSkeleton or categorizedComponentsData changes


    

    // useEffect(() => {
    //   // console.log(nodesatom,"nodesatomnodesatom")
    //   let undoarr = []
    //     setNodes((prevNodes) => {
    //         // Merge new nodes from `nodesatom` with the existing nodes
    //         if (nodesatom) {
    //             const updatedNodes = [...prevNodes, ...nodesatom];
    //             undoarr = [...nodesatom]
    //             let UniqUndo = undoarr.filter((obj, index) => { // Filter Unique Nodes
    //               return index === undoarr.findIndex(o => obj.id === o.id);
    //             });
    //             // console.log(nodesatom,"nodesatomnodesatom",UniqUndo,updatedNodes)
    //             setUndoArr([...UndoArr,...UniqUndo])
    //             // Ensure no duplicate nodes (optional, if `id` is unique)
    //             let uniqueNodes = updatedNodes.filter((obj, index) => { // Filter Unique Nodes
    //               return index === updatedNodes.findIndex(o => obj.id === o.id);
    //             });
    //             // const uniqueNodes = Array.from(new Map(updatedNodes.map((node) => [node.id, node])).values());
    //             return uniqueNodes;
    //         }
    //         return prevNodes;
    //     });
    
    //     // Update edges if needed
    //     // setEdges((prevEdges) => {
    //     //     // Initialize edges if they are empty, or keep the existing edges
    //     //     return prevEdges.length === 0 ? [] : prevEdges;
    //     // });
    // }, [nodesatom]);
  
//   useEffect(() => {
//     if (selectedEdge && color !== selectedEdge.color) {
//       // If an edge is selected and the color is different from the selected edge's current color
//       const updatedEdges = edges.map((edge) =>
//         edge.id === selectedEdge.id ? { ...edge, color: color } : edge
//       );
//       setEdges(updatedEdges); // Update the edges state with the new color
//       setSelectedEdge({ ...selectedEdge, color: color }); // Update selected edge color directly
//     }
//   }, [selectedEdge, color, edges]);

    // Update node position on drag
    const onNodeDragStop = useCallback(
        (event, node) => {
            setNodes((prevNodes) =>
                prevNodes.map((n) =>
                    n.id === node.id
                        ? { ...n, position: node.position }
                        : n
                )
            );
            // Update the Recoil state if required
            
        },
        [setNodes]
    );

      // Handle connection creation-will allow same node connection
  const onConnect = (params) => {
    // Merge color and connection type with connection params
    // console.log(params,"paramsNew",edges)
    const newID = new Date();
    const updatedEdge = {
      ...params,
      id: "edge-"+newID.getTime(),
      type: 'step',  // Apply the selected connection type
      markerEnd: {
        type: MarkerType.ArrowClosed,
        style: {
            fill: "#0090FF",   // Use the same color as the line for the arrow's fill
            stroke: "#0090FF", // Use the same color as the line for the arrow's stroke
          },
      },
      style: {
        strokeWidth: 1,
        stroke: "#0090FF", // Apply the selected color as stroke 
      },
      data: {
        type: "smoothstep",
        positionHandlers: [
          {
            x: 150.0,
            y: 100.0,
          } 
        ],
      },
    };
    // console.log(updatedEdge,"newEdnewEd")
    let undoarr = [...UndoArr]
    if(updatedEdge){ 
      undoarr.push(updatedEdge) 
      setUndoArr(undoarr)
      // console.log(UndoArr,"UndoArrUndoArr",edges)
    }
    // Add the edge to your state (if using react-flow)
    setEdges((eds) => [
      ...eds,
      updatedEdge
    ]);
    // setEdges((eds) => addEdge(updatedEdge, eds));
  };


  //will not allow same node connection and paritail lines
// const onConnect = useCallback((params) => {
//     // Prevent connecting to the same node (if that's a requirement)
//     if (params.source === params.target) {
//       return;
//     }
  
//     // Merge the default edge configuration with the updated connection params
//     const updatedEdge = {
//       ...params,
//       type: selectedOption,  // Apply the selected connection type
//       markerEnd: {
//         type: MarkerType.ArrowClosed,
//         style: {
//           fill: color,   // Use the same color as the line for the arrow's fill
//           stroke: color, // Use the same color as the line for the arrow's stroke
//         },
//       },
//       style: {
//         strokeWidth: number, // Set the stroke width
//         stroke: color,       // Apply the selected color as stroke
//       },
//     };
  
//     // Now add the updated edge to the React Flow state
//     setEdges((prevEdges) => [...prevEdges, updatedEdge]);
//   }, [color, number, selectedOption]);
  

   
    
    const handleAddComponent = (componentData) => { 
        const newNode =componentData
        let undoObj = [...UndoArr]
        undoObj.push({...newNode,selected:false})
        setUndoArr(undoObj)
        // Append the new node to existing nodes
        setNodes((prevNodes) => [...prevNodes, newNode]);
    };
    
    

    // Function to handle the node position update when drag stops
  const handleNodeDrag = (event, node) => {
    
    // Update the position of the dragged node
    
    setNodes((prevNodes) =>
      prevNodes.map((n) =>{
        if(n.id === node.id){
          let nodeobj = { ...n, position: node.position }
          // if((node.position.x !== n.position.x) || (node.position.y !== n.position.y)){
            
          // } 
          return nodeobj
        }
        return n
      })
    );
    
    // setUndoArr((prevNodes) =>{
    //   // console.log(prevNodes,"prevNodesprevNodesDrag")
    //   return prevNodes.map((n) =>
    //     n.id === node.id ? { ...n, position: node.position } : n
    //   )
    // });
  };

  const onNodeDrag=(e,nodepos)=>{
    // console.log(nodepos,"onNodeDragonNodeDrag",selectedNode,isMorethenOneSelect.isSelected,nodepos)
    if (selectedNode && !isMorethenOneSelect.isSelected) {
      let undoObj = [...UndoArr]
      setNodes((nds) =>
          nds.map((node) => {
              if (node.id === selectedNode.id) { // Correct comparison to selectedNode.id
                  // Get current transform and parse rotation if it exists
                  const currentTransform = node.data?.transform || 0; 
                  const newRotation = currentTransform ; // Rotate by 45 degrees
                  undoObj.push({...node,selected:false,onChange:true})
                  // Update transform with existing transforms (flip, scale, etc.) and add new rotation
                  // console.log(node,"nodeRotate",newRotation,currentTransform)
                  // return node
                  return {
                      ...nodepos,
                      id:node.id
                      // style:{
                      //   ...nodepos.style, 
                      //   transform: `translate(${nodepos.position.x}px, ${nodepos.position.y}px)`+` rotate(${newRotation}deg)`, 
                      //   transition: 'transform 0s ease'
                      // } 
                  };
              }
              return node;
          })
      );
      setUndoArr(undoObj)
    }else if(isMorethenOneSelect.isSelected){
      // setNodes((nds) =>
      //     nds.map((node) => {
      //         if (node.selected) { // Correct comparison to selectedNode.id
                   
      //             // return node
      //             return {
      //                 // ...nodepos,
      //                 id:node.id
      //                 // style:{
      //                 //   ...nodepos.style, 
      //                 //   transform: `translate(${nodepos.position.x}px, ${nodepos.position.y}px)`+` rotate(${newRotation}deg)`, 
      //                 //   transition: 'transform 0s ease'
      //                 // } 
      //             };
      //         }
      //         return node;
      //     })
      // );
    }
  }


const handlecanvasclear =()=>{
   // Reset nodes and edges to empty arrays
    setNodes([]);  // Clear all nodes
    setEdges([]);  // Clear all edges
    setSelectedNode(null);  // Clear selected node
    setSelectedEdge(null);  // Clear selected edge
   
} 

const handleUndo =(e)=>{ 
    
    let LastObj = UndoArr.length ? UndoArr[UndoArr.length -1] : null
    let redoObj = [...RedoArr]
    // console.log(e,"handleUndo",UndoArr,nodes,LastObj)
    if(LastObj){
      // console.log(LastObj,"LastObj")
      setUndoArr(UndoArr.slice(0, UndoArr.length-1))
      const countMap = UndoArr.reduce((acc, obj) => {
        acc[obj.id] = (acc[obj.id] || 0) + 1;
        return acc;
      }, {});
      let isDup =  countMap[LastObj.id] > 1
      if(LastObj.type === 'customNode'){
        let idx = nodes.findIndex(n=> n.id === LastObj.id) 
        if(idx >= 0){
          
          // console.log(countMap,"countMap",isDup)
          // return false
          if(isDup || LastObj.onChange){
            let AllNode =[...nodes]
            AllNode[idx] = LastObj
            setNodes(AllNode) 
            let redobj = nodes[idx]
            // console.log(redobj,"redobjredobj")
            redoObj.push({...redobj,selected:false,onChange:true}) 
            setRedoArr(redoObj)
            return false
          }else{
            setNodes(nodes.filter(n=> n.id !== LastObj.id))
          }
          
        }else if(LastObj.isMultiNodes){
          // console.log("updatedLasteNode")
          setNodes([...nodes,...LastObj.nodes])
        }else if(LastObj.isMultiNodesDuplicate){
          const lastId = LastObj.nodes.map(x=>x.id)
          // console.log(lastId,nodes,"whilepressingctrlz")
          setNodes(nodes.filter(x=>!lastId.includes(x.id)))
        }else if(LastObj.isMultiChange){
          let AllNode =[...nodes]
          LastObj.nodes.forEach(x=>{
            let indx = nodes.findIndex(n=> n.id === x.id) 
            AllNode[indx] = x
          })
          setNodes(AllNode) 
          // console.log(redobj,"redobjredobj")
          redoObj.push(LastObj) 
          setRedoArr(redoObj)
          return false
        }else{
          setNodes([...nodes,...[LastObj]]) 
        }
        // let idxatom = nodesatom.findIndex(n=> n.id === LastObj.id) 
        
        
      }else{
        let idx = edges.findIndex(n=> n.id === LastObj.id) 
        if(idx >= 0){
          if(isDup || LastObj.onChange){
            let allEdge = [...edges]
            allEdge[idx] = LastObj
            setEdges(allEdge)
            let redobj = edges[idx]
            // console.log(redobj,"redobjredobj")
            redoObj.push({...redobj,selected:false,onChange:true}) 
            setRedoArr(redoObj)
            return false
          }else{
            setEdges((prevEdges) =>prevEdges.filter((edge) => edge.id !== LastObj.id));
          }
          
          // setEdges((prevEdges) =>prevEdges.filter((edge) => edge.id !== LastObj.id));
        }else{
          setEdges([...edges,...[LastObj]])
        }
        
      }
      
      redoObj.push({...LastObj,selected:false}) 
      setRedoArr(redoObj)
    }

}

const handleRedo =(e)=>{
  
  let LastObj = RedoArr.length ? RedoArr[RedoArr.length -1] : null
  let undoObj = [...UndoArr]
  // console.log(e,LastObj,"handleRedo",RedoArr,UndoArr)  
  if(LastObj){
    setRedoArr(RedoArr.slice(0, RedoArr.length-1))
    
    const countMap = RedoArr.reduce((acc, obj) => {
      acc[obj.id] = (acc[obj.id] || 0) + 1;
      return acc;
    }, {});
    let isDup =  countMap[LastObj.id] > 1
    if(LastObj.type === 'customNode'){
      let idx = nodes.findIndex(n=> n.id === LastObj.id) 
      if(idx >= 0){
       
        if(isDup || LastObj.onChange){
          let AllNode =[...nodes]
          AllNode[idx] = LastObj
          setNodes(AllNode) 
          let unobj = nodes[idx]
          // console.log(unobj,"redobjredobj")
          undoObj.push({...unobj,selected:false,onChange:true}) 
          setUndoArr(undoObj)
          return false
        }
        else{
          setNodes(nodes.filter(n=> n.id !== LastObj.id))
        }
        
      }else if(LastObj.isMultiNodes){
        const lastId = LastObj.nodes.map(x=>x.id)
        setNodes(nodes.filter(x=>!lastId.includes(x.id)))
      }else if(LastObj.isMultiNodesDuplicate){
        setNodes([...nodes,...LastObj.nodes])
      
      }else if(LastObj.isMultiChange){
        let AllNode =[...nodes]
        LastObj.nodes.forEach(x=>{
          let indx = nodes.findIndex(n=> n.id === x.id) 
          AllNode[indx] = x
        })
        setNodes(AllNode) 
        // console.log(redobj,"redobjredobj")
        undoObj.push(LastObj) 
        setUndoArr(undoObj)
        return false
      }else{
        setNodes([...nodes,...[LastObj]])
      }
      
    }else{
      let idx = edges.findIndex(n=> n.id === LastObj.id) 
      if(idx >= 0){
        if(isDup || LastObj.onChange){
          let allEdge = [...edges]
          allEdge[idx] = LastObj
          setEdges(allEdge)
          let unobj = edges[idx]
          // console.log(unobj,"redobjredobj")
          undoObj.push({...unobj,selected:false,onChange:true}) 
          setUndoArr(undoObj)
          return false
        }else{
          setEdges((prevEdges) =>prevEdges.filter((edge) => edge.id !== LastObj.id));
        }
      }else{
        setEdges([...edges,...[LastObj]])
      }
      
    }
    
    
    undoObj.push({...LastObj,selected:false}) 
    setUndoArr(undoObj)
  }

}

const handleTextChange = (e)=>{
  let undoObj = [...UndoArr]
    
  setTextvalue(e);
  setNodes((prevNodes) => {
      return prevNodes.map((node) => {
          if (node.id === selectedNode.id) {
              // If this is the selected node, update its data
              let nodeobj = {
                  ...node,
                  data: {
                      ...node.data,
                      label: e ? e : 'Text', 
                  },
              };
              undoObj.push({...node,selected:false,onChange:true}) 
              
              return nodeobj
          }
          // Return unchanged node if it's not the selected one
          return node;
      });
  });
  setUndoArr(undoObj)
}

const handleTextStyleChange = (e,type)=>{
  let obj = {...TextStyle}
  if(type === 'color'){
    obj.color = e
  }else if(type === 'size'){
    obj.size = e
  }else if(type === 'Bold'){
    obj.weight = !obj.weight
  }else if(type === 'Italics'){
    obj.style = !obj.style
  }else if(type === 'Underline'){
    obj.underline = !obj.underline
  }else if(type === 'left' || type === 'center' || type === 'right'){
    obj.align = e
  }  
  setTextStyle(obj);
  let undoObj = [...UndoArr]
  
  
  setNodes((prevNodes) => {
      return prevNodes.map((node) => {
          if (node.id === selectedNode.id) {
              // If this is the selected node, update its data
              let newNode = {
                  ...node,
                  data: {
                      ...node.data,
                      details: {
                        ...node.data.details,
                        fontSize: obj.size,
                        fontColor: obj.color,
                        fontWeight: obj.weight,
                        fontUnderline: obj.underline,
                        fontStyle: obj.style,
                        textAlign: obj.align
                    }, 
                  },
              };
              undoObj.push({...node,selected:false,onChange:true})
              return newNode
          }
          // Return unchanged node if it's not the selected one
          return node;
      });
  });
  setUndoArr(undoObj)
}

const handleAddText = (selectedFields) => {
  let Textlen = nodes.filter(n=> n.data.styleType === 'text') 
  // Create a new node object with the data you received from the modal
  const newNode = {
      id: `node-${Date.now()}`, // Unique ID
      type: 'customNode', // You can set this to your custom node type
      position: { x: Math.random() * 250, y: Math.random() * 250 }, // Random position or based on user input
      selected:true,
      style:{width: 60,height:40},
      data: {
          label: 'Text ' + Number(Textlen.length+1), // Display the Text
          details: {
              fontSize: 12,
              fontColor: 'black',
              width: 60,
              height:40,
              fontWeight: false,
              fontUnderline: false,
              fontStyle: false,
              textAlign: 'left'
          },
          styleType: 'text',
          style:{width: 60,height:40},
      },
  };

  let undoObj = [...UndoArr]
  undoObj.push({...newNode,selected:false})
  setUndoArr(undoObj)

  // Add the new node to the existing nodes list
  setNodes((prevNodes) => [...prevNodes, newNode]);
};

// useEffect(()=>{ 
//       console.log(UndoArr,"UndoArrUndoArr",edges) 

// },[UndoArr])
let selectedEdgeID = selectedEdge ? selectedEdge.id : null
const styledEdges = edges.map(edge => ({
  ...edge,
  markerEnd:{
    ...edge.markerEnd,
    color: edge.style && edge.style.stroke ? edge.style.stroke : '' 
  },
  markerStart:{
    ...edge.markerStart,
    color: edge.markerStart && edge.markerStart.type && edge.style && edge.style.stroke ? edge.style.stroke : ''
  },
  style: {
    ...edge.style,
    filter: edge.id === selectedEdgeID ? 'drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.5))' : 'none',
    opacity : edge.id === selectedEdgeID ? 1 : 0.75
  },
}));

// const onPaneClick = useCallback(() => {
//   setNodes((nds) => nds.map((node) => ({ ...node, selected: false })));
//   setEdges((eds) => eds.map((edge) => ({ ...edge, selected: false })));
// }, [setNodes, setEdges]);

const handleNodesChange = useCallback((changes) => {
  let undoObj = [...UndoArr]
  changes.forEach((change) => {
    if (change.type === "dimensions" && change.updateStyle) {
      setNodes((prevNodes) =>
          prevNodes.map((node) =>{
              if(node.id === change.id){
                let nodeobj = { ...node, style: { ...node.style, ...change.dimensions },data:{...node.data,style: { ...node.style,...change.dimensions }} } 
                undoObj.push({...node,selected:false,onChange:true})
                return nodeobj
              }
              return node
            })
      );
      // console.log(undoObj,"undoObj",nodes,change)
      setUndoArr(undoObj)
      // console.log(`Node ${change.id} resized to`,change,nodes);
    }
  });
  onNodesChange(changes); // Ensure state updates
}, [onNodesChange,nodes]);

const onNodeDoubleClick =(e)=>{

  // console.log("enter")
 if(selectionType === 'node' && nodeType === 'display'){
  tooBarRef.current.handleDisplayOpen()
 }

} 
// console.log(selectionType , isDefaultToolbox , isMorethenOneSelect.isSelected,"handleUpdateLink")
  
    return (
        <>
            <div style={{  height: 'calc(100vh - 49px)' }}>
            {/* <div> */}

            {/* {selectionType === 'node' && nodeType === 'display' && ( */}
              <div style={{display:selectionType === 'node' && (nodeType === 'display' || nodeType === 'Link') && !isMorethenOneSelect.isSelected ? "block" : "none"}}>
                <DisplayToolbox 
                        ref={tooBarRef}
                        isMorethenOneSelect={isMorethenOneSelect}
                        onCopy={handleCopyNode}
                        onRotate={handleRotate}
                        onDeleteDisplayChange={handleDeleteNode}
                        selectedNode={selectedNode} 
                        onUpdateDisplayData={handleUpdateDisplay}
                        nodeType={nodeType}
                        onAddDisplay={handleUpdateLink} 
                        ModalOpen={(e)=>setIsPopupOpen(e)}
                        
                />
              </div>
   
{/* )} */}

            {selectionType === 'node' && nodeType !== 'display' && nodeType !== 'text' && nodeType !== 'Link' &&
             <NodeToolbox 
                onFlipvertical={handleFlipvertical}
                onFliphorizontal={handleFlipHorizontal} 
                onCopy={handleCopyNode}
                onRotate={handleRotate}
                onDeleteNodeChange={handleDeleteNode}
            />}
            
            {selectionType === 'edge' && !isMorethenOneSelect.isSelected &&
             <LineToolbox 
                onConnect={onConnect}
                onColorChange={handleColorChange}
                onConnectionTypeChange={handleConnectionTypeChange}
                onNumberChange={handleConnectionWidth} 
                onReverseChange={handleReverseConnection}
                onDeleteChange={handleDeleteEdge}
                selectedColor={color}
                selectedlinewidth={number}
                selectedline={selectedOption}
            />}
            
            {(selectionType === null && isDefaultToolbox || isMorethenOneSelect.isSelected) && <DefaultToolbox  
                onAddComponent={handleAddComponent}
                onAddDisplay={handleAddDisplay} 
                oncanvasclear={handlecanvasclear}
                handleUndo={handleUndo}
                handleRedo={handleRedo}
                handleAddText={handleAddText}
                headPlant={headPlant} 

            />}

            {selectionType === 'node' && nodeType === 'text' && !isMorethenOneSelect.isSelected &&
            
            <TextLabelMenu  
            onTextChange={handleTextChange}
            onColorChange={handleTextStyleChange}
            onFontChange={handleTextStyleChange}
            onNumberChange={handleTextStyleChange}  
            onFontAlign={handleTextStyleChange}  
            Textvalue={Textvalue}
            TextStyle={TextStyle}
            selectedNode={selectedNode}
            onCopy={handleCopyNode}
            onRotate={handleRotate}
            onDeleteChange={handleDeleteNode}
            />} 
    
    {/* Replace `AnotherToolbox` with your alternative component */}
      
            <CustomMarker /> {/* Render the markers here */}
            <ReactFlow
                 nodes={nodes}
                   // nodes={nodesatom}
                    edges={styledEdges}
                    onNodeDragStop={handleNodeDrag} // When dragging ends, update the node position
                    onNodesChange={handleNodesChange}
                    onEdgesChange={onEdgesChange}
                   onConnect={onConnect}
                  //  onConnectEnd={(connectionEnd,ed) => console.log(connectionEnd,"connectionEndconnectionEnd",ed,edges)}
                    onNodeDrag ={onNodeDrag}
                    nodeTypes={nodeTypes}
                    snapToGrid={true}
                    snapGrid={snapGrid}
                    defaultViewport={defaultViewport}
                    edgeTypes={edgeTypes}
                    onSelectionChange={(e)=>onSelectionChange(e)}
                    onNodeDoubleClick={(e)=>onNodeDoubleClick(e)}
                    
                    // onPaneClick={onPaneClick}
                    // nodesDraggable={isEditModeOn}
                    // nodesConnectable={isEditModeOn}
        //             edgesUpdatable={isEditModeOn}
        //             edgesFocusable={isEditModeOn}
                    // elementsSelectable={isEditModeOn}
        //             draggable={isEditModeOn}
        // panOnDrag={isEditModeOn}
        // nodesFocusable={isEditModeOn}
                    //deleteKeyCode={isEditModeOn ? 'Delete' : null}
                    onInit={setRfInstance}
                    
                    fitView
                    proOptions={proOptions}
                    attributionPosition="bottom-left"
                    deleteKeyCode={null} // Disable
                    minZoom={0.1}
                    maxZoom={4}
                    
                >
                    <MiniMap
                    />
                    <Controls showInteractive={false}/>
                    <Background color="#aaa" gap={5} />
                    
                </ReactFlow>
            </div>
        </>
    );
});

export default (props) => (
    <ReactFlowProvider>
        <ScadaContent handleSave={props.handleSave} />   
    </ReactFlowProvider>
);
