// DefaultToolbox.jsx
import React, { useState, useEffect, useRef, forwardRef,useImperativeHandle } from "react";

import Button from 'components/Core/ButtonNDL';
import useTheme from 'TailwindTheme';
import ListNDL from 'components/Core/DropdownList/ListNDL.jsx';
import TooltipNDL from 'components/Core/ToolTips/TooltipNDL';
 

import Settings from 'assets/neo_icons/Menu/scada/defaulttoolbar/Settings.svg?react';
import Fliph from 'assets/neo_icons/Menu/scada/defaulttoolbar/FlipH.svg?react';
import Separator from 'assets/neo_icons/Menu/scada/defaulttoolbar/Separator.svg?react';
import Rotate from 'assets/neo_icons/Menu/scada/defaulttoolbar/Rotate.svg?react';
import Copy from 'assets/neo_icons/Menu/scada/defaulttoolbar/Copy.svg?react';
import Delete from 'assets/neo_icons/Menu/scada/defaulttoolbar/Delete.svg?react';
import Plus from 'assets/neo_icons/Menu/scada/defaulttoolbar/plus.svg?react';
import TextT from 'assets/neo_icons/Menu/scada/defaulttoolbar/TextT.svg?react';
import Cam from 'assets/neo_icons/Menu/scada/defaulttoolbar/device-camera-phone.svg?react';
import Fileex from 'assets/neo_icons/Menu/scada/defaulttoolbar/file-import.svg?react';
import Hex from 'assets/neo_icons/Menu/scada/defaulttoolbar/hexagon-3d.svg?react';
import LinkModel from './LinkModel';
import UpdateDisplayContent from './UpdateDisplayContentForm'; 


const DisplayToolbox = forwardRef(({ onAddNode,onRotate,onCopy,onAddDisplay, onDeleteDisplayChange, selectedNode, onUpdateDisplayData, nodeType,ModalOpen},ref) => {
    //const [isModalOpen, setModalOpen] = useState(false);
    const [isComponentModalOpen, setIsComponentModalOpen] = useState(false);
    const [openGap,setOpenGap] = useState(false); 
    const [AnchorPos,setAnchorPos] = useState(null);
    //const [selectedNode, setSelectedNode] = useState(null); 
    const [components, setComponents] = useState([]);
    const [isDisplayModalOpen, setDisplayIsModalOpen] = useState(false);
    const [isLinkModalOpen, setLinkIsModalOpen] = useState(false); 
   // const fetchedDashboardData = useRecoilValue(fetchedDashboardDataState); 
    const [selectedButton, setSelectedButton] = useState('move'); 

    const [selectedAsset, setSelectedAsset] = useState(null);
  const [selectedInstrument, setSelectedInstrument] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState(null);
      // Create a ref to the file input
     // const fileInputRef = useRef(null);
    //console.log('fetched data',fetchedDashboardData);
    // const handleAddComponent = (component) => {
    //     setComponents((prev) => [...prev, component]);
    // };

    // const handleAddComponent = (Component) => {
    //   onAddComponent(Component);
    //   setIsModalOpen(false);
    // };
    

    useImperativeHandle((ref),()=>({
      handleDisplayOpen : ()=>handleDisplayOpen(),
      handleDeleteDisplay : ()=>handleDeleteDisplay(),
      handleDuplicate : ()=>handleCopy()
    }))

 const handleCloseDisplayModal = () => {

  setSelectedAsset(null);
  setSelectedInstrument(null);
  setSelectedMetric(null);
 // setSelectedInstrumentlist(null);
  setDisplayIsModalOpen(false);  // Close the modal
  setLinkIsModalOpen(false)
  ModalOpen(false)
};
 // Function to handle button click
 const handleButtonClick = (buttonName) => {
  setSelectedButton(buttonName); // Update selected button
};

  // Function to change SVG icon color
  const getIconColor = (buttonName) => {
    return selectedButton === buttonName ? '#ffffff' : '#646464'; // White for selected, black otherwise
  };

   

            // Handle delete edge
   const handleDeleteDisplay = () => {
    onDeleteDisplayChange(); // Trigger the delete function passed down from parent
};


       const handleDisplayOpen = () => {
        // console.log("enterDialogueOPen",nodeType)
        ModalOpen(true)
        if(nodeType === 'Link'){
          setLinkIsModalOpen(true)
        }else{
          setDisplayIsModalOpen(true);
        }
       }
         
          
         
       // Handle delete edge
       const handleRotate= () => {
        onRotate(); // Trigger the delete function passed down from parent
    };
       // Handle delete edge
       const handleCopy= () => {
        onCopy(); // Trigger the delete function passed down from parent
    };

          

const menuOption = [
    {id:"1",name:"Data Display",icon:Cam,toggle: false},
    {id:"2",name:"Components",icon:Hex,toggle: false},
    {id:"3",name:"Import Components",icon:Fileex,toggle: false},
  ]

  
  
  
    // // Handle the button click event to open the file input
    // const handleFileButtonClick = () => {
    //   // Trigger the file input click
    //   fileInputRef.current.click();
    // };
  
    // // Handle file selection
    // const handleFileChange = (event) => {
    //   const file = event.target.files[0];
    //   if (file) {
    //     console.log('Selected file:', file.name);
    //     // Do something with the selected file (e.g., upload or display it)
    //   }
    // } 
  return (
    <>
    <div  style={{ border:'1px solid #f0f0f0', background:'#fff' }} className="mt-1 toolbox flex gap-2 absolute top-14 left-1/2 z-50  p-2 rounded-xl ">
        <div className="flex items-center h-8   rounded-md" > 
          <TooltipNDL title={"Settings"} placement="bottom" arrow   > 
          <Button
              icon={Settings}
              stroke={getIconColor('settings')}
              type={selectedButton === 'settings' ? 'primary' : 'ghost'}
              onClick={handleDisplayOpen} // Set 'move' as selected on click
              noStroke
            />

          </TooltipNDL>
        </div>

        
      

       <div className="flex items-center h-8 ">  
        <TooltipNDL title={"Copy"} placement="bottom" arrow   > 
          <Button  icon={Copy}
          stroke={getIconColor('copy')}
          type={selectedButton === 'copy' ? 'primary' : 'ghost'}
          onClick={handleCopy} 
          noStroke  
          />
        </TooltipNDL>
        </div>
    
      {selectedNode && selectedNode.data.details && !Array.isArray(selectedNode.data.details.metric) && 
     <div className="flex items-center h-8"> 
      <TooltipNDL title={"Rotate"} placement="bottom" arrow   >  
        <Button  icon={Rotate} 
         stroke={getIconColor('rotate')}
         type={selectedButton === 'rotate' ? 'primary' : 'ghost'}
         onClick={handleRotate} 
         noStroke />
      </TooltipNDL>
      </div>}

      <div className="flex items-center h-8">
      <Separator/>
      </div>
     
     <div className="flex items-center h-8 ">
      <TooltipNDL title={"Remove"} placement="bottom" arrow   >
         <Button  icon={Delete} type='ghost' onClick={handleDeleteDisplay}  />
      </TooltipNDL>
    </div>
      
      

    </div>
   
    <div>
    <UpdateDisplayContent open={isDisplayModalOpen} onClose={handleCloseDisplayModal} onAddDisplay={onAddDisplay} onUpdateDisplayData={onUpdateDisplayData} selectedNode={selectedNode}  nodeType={nodeType} />
    <LinkModel open={isLinkModalOpen} onClose={handleCloseDisplayModal} onAddDisplay={onAddDisplay} selectedNode={selectedNode}  nodeType={nodeType}/>
  </div>
  </>
  );
});

export default DisplayToolbox;
