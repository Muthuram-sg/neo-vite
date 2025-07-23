// DefaultToolbox.jsx
import React, { useState, useEffect, useRef } from "react";

import Button from 'components/Core/ButtonNDL';
import useTheme from 'TailwindTheme';
import ListNDL from 'components/Core/DropdownList/ListNDL.jsx';
import TooltipNDL from 'components/Core/ToolTips/TooltipNDL';
import { useRecoilState } from 'recoil';
import {  fetchedDashboardDataState} from "recoilStore/atoms"; // Recoil variables
import { useRecoilValue } from 'recoil';

import Flipv from 'assets/neo_icons/Menu/scada/defaulttoolbar/FlipVer.svg?react';
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


import ComponentModal from './ComponentModal';
import DisplayContent from './DisplayContentForm';
import Confirmclear from './ConfirmclearModal';
const NodeToolbox = ({ onAddNode, onRotate,onCopy,onFlipvertical,onFliphorizontal, onDeleteNodeChange}) => {
    //const [isModalOpen, setModalOpen] = useState(false);
 
  
    const [selectedNode, setSelectedNode] = useState(null); 
    const [components, setComponents] = useState([]);
    
  
    const [selectedButton, setSelectedButton] = useState('move'); 
     
 // Function to handle button click
 const handleButtonClick = (action) => {
  setSelectedButton(action); // Highlight selected button
  switch (action) {
      case 'flipvertical':
          onFlipvertical(); // Call the flip vertical function
          break;
      case 'fliphorizontal':
          onFliphorizontal(); // Call the flip horizontal function
          break;
      case 'duplicate':
          onCopy(); // Call the copy function
          break;
      case 'rotate':
          onRotate(); // Call the rotate function
          break;
      default:
          break;
  }
};

  // Function to change SVG icon color
  const getIconColor = (buttonName) => {
    return selectedButton === buttonName ? '#ffffff' : '#646464'; // White for selected, black otherwise
  };

       
                // Handle delete edge
   const handleNodedelete = () => {
    onDeleteNodeChange(); // Trigger the delete function passed down from parent
};

              // Handle delete edge
              const handleRotate= () => {
                onRotate(); // Trigger the delete function passed down from parent
            };
              // Handle delete edge
              const handleFlipVertical= () => {
                onFlipvertical(); // Trigger the delete function passed down from parent
            };

  return (
    <>
    <div  style={{ border:'1px solid #f0f0f0', background:'#fff' }} className="mt-1 toolbox flex gap-2 absolute top-14 left-1/2 z-50  p-2 rounded-xl ">
        
         
        <div className="flex items-center h-8  rounded-md"> 
        {/* (e) =>{ handleButtonClick('undo'); e.currentTarget.blur();handleButtonClick('move')}}  */}
          <TooltipNDL title={"Flip Vertical"} placement="bottom" arrow   > 
          <Button
              icon={Fliph}
              stroke={getIconColor('flipvertical')}
              type={selectedButton === 'flipvertical' ? 'primary' : 'ghost'}
              onClick={(e)=>{handleFlipVertical();e.currentTarget.blur()}} // Set 'move' as selected on click
              noStroke
            />

          </TooltipNDL>
        </div>

         <div className="flex items-center h-8  ">
          <TooltipNDL title={"Flip Horizontal"} placement="bottom" arrow   >
             <Button  icon={Flipv} 
             stroke={getIconColor('fliphorizontal')}
             type={selectedButton === 'fliphorizontal' ? 'primary' : 'ghost'}
             onClick={(e) => {handleButtonClick('fliphorizontal');e.currentTarget.blur()}} 
             noStroke />
             </TooltipNDL>
         </div>
      

       <div className="flex items-center h-8  ">  
        <TooltipNDL title={"Duplicate"} placement="bottom" arrow   > 
          <Button  icon={Copy}
          stroke={getIconColor('duplicate')}
          type={selectedButton === 'duplicate' ? 'primary' : 'ghost'}
          onClick={(e) => {handleButtonClick('duplicate');e.currentTarget.blur()}}
          noStroke  
          />
        </TooltipNDL>

        </div>
        <div className="flex items-center h-8  ">
      <Separator/>
        </div>

     <div className="flex items-center h-8 "> 
      <TooltipNDL title={"Rotate"} placement="bottom" arrow   >  
        <Button  icon={Rotate} 
         stroke={getIconColor('rotate')}
         type={selectedButton === 'rotate' ? 'primary' : 'ghost'}
         onClick={(e)=>{handleRotate();e.currentTarget.blur()}} 
         noStroke />
      </TooltipNDL>
      </div>

      <div className="flex items-center h-8  ">
      <Separator/>
        </div>
     
     <div className="flex items-center h-8 ">
      <TooltipNDL title={"Remove"} placement="bottom" arrow   >
         <Button  icon={Delete} type='ghost' onClick={handleNodedelete}  />
      </TooltipNDL>
    </div>
      
      

    </div>
   
    <div>
   
  </div>
  </>
  );
};

export default NodeToolbox;
