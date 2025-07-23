import React, { useState, useEffect, useCallback, forwardRef } from 'react';
import {
    ReactFlow, ReactFlowProvider, useNodesState, useEdgesState, addEdge, MiniMap, Controls,
    useReactFlow,Background,MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useRecoilState } from 'recoil';
import { drawerMode, selectedPlant, user, currentScadaJson, defaultScadaView, currentScadaViewSkeleton, scadaViewEditMode, scadaInstance, FullScreenmode , nodesAtom, scadaSelectedDetailsState,fetchedDashboardDataState, dashBtnGrp,ProgressLoad, scadaContentVisibleState, scadaContentVisibleEditState,selectedScadaViewState,scadaContentVisibleDeleteState} from "recoilStore/atoms"; // Recoil variables
import { useRecoilValue } from 'recoil';
import CustomEdge, { DashedEdge, ColoredEdge, AnimatedEdge  } from './CustomEdge';
import ComponentModal from './ComponentModal';
//import CustomNode from './CustomNode';
//import NodeComponent from './NodeComponentold'; // Generic Node Component
import NodeComponent from './NodeComponentLive1';// multiple metric value working correctly
//import NodeComponent from './Nodecomponentlive'; // Generic Node Component
import { categorizedComponentsData } from './Componentdata';
import configParam from 'config';
import FeederIcon from 'assets/neo_icons/ScadaIcon/feeder.svg?react';
import useDeleteScadaView from '../hooks/useDeleteScadaView';

// import Feeders from './Nodes/Feeders';
// import Mixer from './Nodes/Mixer';
// import MudMixer from './Nodes/MudMixer';
// import QuenchTank from './Nodes/QuenchTank';
// import FeederStandL from './Nodes/FeederStandL';
// import FeederStandR from './Nodes/FeederStandR';

// import useMeterReadingsV2 from "../../Explore/BrowserContent/hooks/useMeterReadingsV2"
import useFetchDashboardData from 'components/layouts/Dashboards/hooks/useFetchDashboardData';
import './assets.css';
import DefaultToolbox from './defaultmenu';
import TextToolbox from './textboxmenu';
import PositionableEdge from "./PositionableEdge";
import PipeLine from "./PipeLine"
import DashedConnector from './DashedConnector';
import PipeLineDashed from './PipeLineDashed';


const snapGrid = [20, 20];
// const nodeTypes = {
//     feeder: Feeders,
//     mixer: Mixer,
//     mudmixer: MudMixer,
//     quenchtank: QuenchTank,
//     feederStandL: FeederStandL,
//     feederStandR: FeederStandR,
// };



// Dynamically create nodeTypes
// const nodeTypes = categorizedComponentsData.reduce((acc, category) => {
//   category.components.forEach((component) => {
//     acc[component.type] = NodeComponent;
//   });
//   return acc;
// }, {});

// const nodeTypes = categorizedComponentsData.reduce((acc, category) => {
//     category.components.forEach((component) => {
//       acc[component.type] = (props) => <NodeComponent {...props} />;
//     });
//     return acc;
//   }, {});


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

// Function to delete a node
// const deleteNode = (nodeToDelete) => {
//     setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeToDelete.id));
//     setSelectedNode(null); // Optional: Clear selection after delete
// };


const ScadaContent = forwardRef((props, ref) => {
    
    const [nodesatom, setNodesAtom] = useRecoilState(nodesAtom); 
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [Edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [isDefaultToolbox, setIsDefaultToolbox] = useState(true);
    const [currentUser] = useRecoilState(user);
    const [selectedLine] = useRecoilState(selectedPlant);
    const [isDrawerOpened] = useRecoilState(drawerMode);
    //const [selectedScadaView] = useRecoilState(currentScadaJson);
     const [selectedScadaView,setSelectedScadaView] = useRecoilState(selectedScadaViewState);
     //console.log('view page',selectedScadaView)
    const [isEditModeOn] = useRecoilState(scadaViewEditMode);
    const [isFullScreenOn] = useRecoilState(FullScreenmode);
    const [defaultScadaID] = useRecoilState(defaultScadaView);
    const [selectedScadaViewSkeleton, setSelectedScadaViewSkeleton] = useRecoilState(currentScadaViewSkeleton);
    const [headPlant] = useRecoilState(selectedPlant);
    //console.log('current scada view',selectedScadaViewSkeleton);
    //console.log('default scadadata',defaultScadaID);
    const selectedDetails = useRecoilState(scadaSelectedDetailsState);
   // console.log(selectedDetails.assetName);
    const [rfInstance, setRfInstance] = useRecoilState(scadaInstance);
    const { setViewport ,fitView} = useReactFlow();
    const [addedComponents, setAddedComponents] = useState([]);  // State to hold added components
    const [selectedNode, setSelectedNode] = useState(null);
    // const { meterReadingsV2Loading, meterReadingsV2Data, meterReadingsV2Error, getMeterReadingsV2 } = useMeterReadingsV2();
   const [isScadaContentVisible, setScadaContentVisible] = useRecoilState(scadaContentVisibleState);
      const [isScadaContentVisibleEdit, setScadaContentVisibleEdit] = useRecoilState(scadaContentVisibleEditState);
    const [selectedContent, setSelectedContent] = useState(props.selectedContent || null);
    const fetchedDashboardData = useRecoilValue(fetchedDashboardDataState);
    const [scadaviewDel] = useRecoilState(scadaContentVisibleDeleteState);
    const { fetchDashboardData, getfetchDashboard, fetchDashboardLoading, fetchDashboardError } = useFetchDashboardData();
    const [btGroupValue] = useRecoilState(dashBtnGrp);
    const [isApiTriggered, setApiTriggered] = useState(false);
    const { zoomIn, zoomOut } = useReactFlow();

    const [,setProgressBar] = useRecoilState(ProgressLoad);
    const { DeleteScadaViewLoading, DeleteScadaViewData, DeleteScadaViewError, getDeleteScadaView } = useDeleteScadaView();
    //const isApiTriggeredRef = useRef(isApiTriggered);
    
   
  //  console.log('dash page',fetchedDashboardData);
   // const [metricValue, setMetricValue] = useState(null);

    // useEffect(() => {
    //     getMeterReadingsV2(selectedLine.schema)
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [])

   


const lastTime = configParam.DATE_ARR(btGroupValue, headPlant);

// Date range for fetching data (2 hours ago)
const to = new Date();
const from = new Date(to.getTime() - 2 * 60 * 60 * 1000); // Two hours ago
const startrange = formatWithOffset(from);
const endrange = formatWithOffset(to);

function formatWithOffset(date) {
    let isoString = date.toISOString();
    let offset = '+05:30'; // Specify the required offset
    return isoString.replace('Z', offset); // Replace 'Z' (UTC) with the desired offset
}


// Function to trigger the API call for fetching the dashboard data
const triggerApiCall = (params) => {
    getfetchDashboard("/dashboards/getdashboard", params, [], false, [], '', lastTime);
};
 
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

  
    useEffect(() => {
        setIsDefaultToolbox(false);
      }, []);
    
      const switchToolbox = () => {
        setIsDefaultToolbox(!isDefaultToolbox);
      };

    
    const fetchAndProcessData = async (params) => {
        try {
            console.log("Fetching data with params:", params);
    
            // Await the API response
            const response = await getfetchDashboard(
                "/dashboards/getdashboard",
                params,
                [], // Additional parameters as needed
                false,
                [],
                '',
                lastTime
            );
    
            console.log("API response:", response);
    
            // Process the response and return the data
            if (response && response.value) {
                return response.value; // Adjust based on your API response structure
            } else {
                return "N/A"; // Default value if data isn't available
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            return "Error"; // Return fallback or error value
        }
    };
    
   

//old working code
   useEffect(() => {
    if (selectedScadaViewSkeleton && selectedScadaViewSkeleton.length > 0) {
        

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
                    let displaywid = (node.data.styleType === 'display' && !Array.isArray(node.data.details.metric)) ? {"width": 190,"height": 50} : {"width": node.width,"height": node.height}
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
                        style:Nstyle,
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
                // console.log(updatedNodes,"updatedNodes")
                // Set nodes in the state
                setNodes(updatedNodes); // Set the updated nodes
                setViewport({
                    x: viewport.x,
                    y: viewport.y,
                    zoom: viewport.zoom,
                });
            } else {
              setNodes([])
              setEdges([]);
              setViewport({ x: 0, y: 0, zoom: 1 });
              console.log("No nodes found in selectedData.");
            }
        } else {
            console.log("Invalid or missing data in selectedScadaViewSkeleton.");
        }

        // Nodes check
        if (selectedData && selectedData.edges && selectedData.viewport) {
            const updatedEdges = selectedData.edges.map(edge => ({
              ...edge,
              id: edge.id,
              source: edge.source,
              target: edge.target,
              type: edge.type === 'smoothstep' ? '': edge.type, // or any custom edge type you want to use
              markerEnd: edge.markerEnd,
            }));
    
            setEdges(updatedEdges);
        }

    } else {
        setNodes([]);
        setEdges([]);
        setViewport({ x: 0, y: 0, zoom: 1 });
        // console.log("selectedScadaViewSkeleton is empty or undefined.",selectedScadaViewSkeleton);
    }
}, [selectedScadaViewSkeleton]); // Re-run if selectedScadaViewSkeleton or categorizedComponentsData changes
 

    useEffect(() => {
        // console.log(nodesatom,"nodesatomView")
        // if(nodesatom){
        //     setNodes((prevNodes) => {
        //         // Merge new nodes from `nodesatom` with the existing nodes
        //         if (nodesatom) {
        //             let atomNode = nodesatom.map(n=> {return {...n,selected:false}})
        //             const updatedNodes = [...prevNodes, ...atomNode];
        //             // Ensure no duplicate nodes (optional, if `id` is unique)
        //             const uniqueNodes = Array.from(new Map(updatedNodes.map((node) => [node.id, node])).values());
        //             return uniqueNodes;
        //         }
        //         return prevNodes;
        //     });
        // }
        
    
        // Update edges if needed
        setEdges((prevEdges) => {
            // Initialize edges if they are empty, or keep the existing edges
            return prevEdges.length === 0 ? [] : prevEdges;
        });
    }, [nodesatom]);
    

  
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
            setNodesAtom((prevNodes) =>
                prevNodes.map((n) =>
                    n.id === node.id
                        ? { ...n, position: node.position }
                        : n
                )
            );
        },
        [setNodes, setNodesAtom]
    );

   
    

    // Function to handle the node position update when drag stops
  const handleNodeDrag = (event, node) => {
    // Update the position of the dragged node
    setNodes((prevNodes) =>
      prevNodes.map((n) =>
        n.id === node.id ? { ...n, position: node.position } : n
      )
    );
  };

   

      // When a user selects a node (maybe from a list or toolbox):
const handleNodeSelection = (node) => {
    setSelectedNode(node);
};
  
const styledEdges = Edges.map(edge => ({
    ...edge,
    markerEnd:{
      ...edge.markerEnd,
      color: edge.style && edge.style.stroke ? edge.style.stroke : '' 
    },
    markerStart:{
      ...edge.markerStart,
      color: edge.markerStart && edge.markerStart.type && edge.style && edge.style.stroke ? edge.style.stroke : ''
    }
  }));


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
  

  const handleKeyPress=(event)=>{
    if(event.ctrlKey && event.key === '=' ){
        // console.log('Entering for +');
        event.preventDefault();
        event.stopPropagation()
        handleZoomIn()

      }
      else if(event.ctrlKey && event.key === '-' ){
        // console.log('Entering for -');
        event.preventDefault();
        event.stopPropagation()
        handleZoomOut()

      }else if(event.ctrlKey && event.key === '0'){
        event.preventDefault();
        event.stopPropagation()
        handleResetZoom()
        handleFitView();
      }
  }

  
  useEffect(() => {
      
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress); // Cleanup listener
    };
    
  }, [handleKeyPress]);




  
  
  
    return ( 
            <div style={{  height: 'calc(100vh - 49px)' }}>
            {/* <div> */}
           
            
            <CustomMarker /> {/* Render the markers here */}
                <ReactFlow
                 nodes={nodes}
                   // nodes={nodesatom}
                    edges={styledEdges}
                    edgeTypes={edgeTypes}
                    // onNodeDragStop={handleNodeDrag} // When dragging ends, update the node position
                    // onNodesChange={onNodesChange}
                    // onEdgesChange={onEdgesChange}
                   // onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    snapToGrid={true}
                    snapGrid={snapGrid}
                    defaultViewport={defaultViewport}
                    elementsSelectable={false}
                    // nodesDraggable={isEditModeOn}
                    nodesConnectable={false}
                    //deleteKeyCode={isEditModeOn ? 'Delete' : null}
                    // onInit={setRfInstance}
                    fitView
                    proOptions={proOptions}
                    attributionPosition="bottom-left"
                    minZoom={0.1}
                    maxZoom={4}
                >
                    <MiniMap
                       
                    />
                    <Controls showInteractive={false}/>
                    <Background color="transparent" gap={10} />
                </ReactFlow>
            </div> 
    );
});
// export default ScadaContent;
export default (props) => (
    <ReactFlowProvider>
        <ScadaContent {...props}/>
        
    </ReactFlowProvider>
);
