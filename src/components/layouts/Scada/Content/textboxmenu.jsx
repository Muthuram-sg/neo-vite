//other menu
import React, { useState, useEffect, useRef } from "react";

import Button from 'components/Core/ButtonNDL';
import useTheme from 'TailwindTheme';
import ListNDL from 'components/Core/DropdownList/ListNDL.jsx';
import TooltipNDL from 'components/Core/ToolTips/TooltipNDL';
import InputFieldNDL from 'components/Core/InputFieldNDL';
import { useRecoilState } from 'recoil';
import {  fetchedDashboardDataState} from "recoilStore/atoms"; // Recoil variables
import { useRecoilValue } from 'recoil';
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import Delete from 'assets/neo_icons/Menu/scada/defaulttoolbar/Delete.svg?react';
import Switch from 'assets/neo_icons/Menu/scada/defaulttoolbar/Switch.svg?react';
import Separator from 'assets/neo_icons/Menu/scada/defaulttoolbar/Separator.svg?react';
import Cam from 'assets/neo_icons/Menu/scada/defaulttoolbar/device-camera-phone.svg?react';
import Fileex from 'assets/neo_icons/Menu/scada/defaulttoolbar/file-import.svg?react';
import Hex from 'assets/neo_icons/Menu/scada/defaulttoolbar/hexagon-3d.svg?react';


const TextToolbox = ({onConnect, onColorChange, onConnectionTypeChange, onNumberChange, onReverseChange, onDeleteChange, selectedColor,selectedlinewidth, selectedline}) => {
 
    const [selectedButton, setSelectedButton] = useState('move'); 
    const [color, setColor] = useState(selectedColor);
    const [number, setNumber] = useState(0); // Default number
 //cont [linewidth,setLinewidth]=useState(selectedlinewidth);
  const [reverseConnection, setReverseConnection] = useState(false);

  const [selectedOption, setSelectedOption] = useState(selectedline); // Default connection type

  useEffect(()=>{
    setSelectedOption(selectedline)
    setNumber(selectedlinewidth)
    setColor(selectedColor)
    // console.log(selectedlinewidth,"selectedlinewidth",selectedline)
  },[selectedline,selectedlinewidth,selectedColor])
  const connectionOption = [
   // { id: "default", name: "Default" },
   { id: "smoothstep", name: "Smoothstep" },
    { id: "straight", name: "Straight" },
    { id: "step", name: "Step" },
    {id:"pipe-line", name: "Pipeline"},
    {id:"pipe-line-dashed", name: "Pipeline Dashed"},
    {id:"pipe-line-solid", name: "Pipeline Solid"},
    {id:"conveyor", name: "Conveyor"},
    {id:"dashed-connector", name: "Dashed connector"},
   
  ]

   // Handle color change
   const handleColorChange = (e) => {
    const newColor = e.target.value;
    setSelectedButton(newColor)
    onColorChange(newColor); // Pass color up to parent
  };

  // Handle connection type change
  const handleConnectionTypeChange = (e) => {
    const newType = e.target.value;
    // setSelectedOption(newType);
    setSelectedButton(newType)
    onConnectionTypeChange(newType); // Pass connection type up to parent
  };

  


  // Toggle reverse connection state and call the parent function
  const handleReverseConnection = () => {
    
    const newState = !reverseConnection;
    setSelectedButton(newState)
    setReverseConnection(newState);
    onReverseChange(newState); // Pass the new state to the parent component
  };

   // Handle delete edge
   const handleDeleteEdge = () => {
    onDeleteChange(); // Trigger the delete function passed down from parent
};

  // Handle number increment and decrement
  const increment = () => {
    setNumber(number + 1);
  };

  const decrement = () => {
    setNumber(number - 1);
  };

  // Handle select box change
  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
  };

  // Handle select box change
  const handleSelectWidth = (e) => {
    const newNumber = Number(e.target.value); 
    // onNumberChange(newNumber)
    setSelectedButton(newNumber)
    if(newNumber >0){
        onNumberChange(newNumber)
        setSelectedButton(newNumber)
    }else{
        onNumberChange(1)
        setSelectedButton(1)
    }
  };

  const handleIncrement = (type) => {
    let newNumber = Number(selectedlinewidth - 1); 
    if(type === 'plus'){
        newNumber = Number(selectedlinewidth + 1); 
    }  
    if(newNumber>0){
        onNumberChange(newNumber)
        setSelectedButton(newNumber)
    } 
  }; 

  
  return (
    <div  style={{ border:'1px solid #f0f0f0', background:'#fff', marginLeft: '-35px' }} className="mt-1 toolbox flex gap-2 absolute top-14 left-1/2 z-50  p-2 rounded-xl ">
        
         
        <div className="flex items-center h-8 gap-2  rounded-md"> 
    <div className="flex items-center h-8  p-2 border border-inherit rounded-md"> 
      {/* Color Picker */}
      <div className="flex items-center gap-2 space-x-2 p-2">
        {/* <label htmlFor="colorPicker" className="text-sm font-semibold">Color:</label> */}
        <input
          type="color"
          id="colorPicker"
          value={color}
          onChange={handleColorChange}
          className="w-4 h-4 rounded-full border-none  cursor-pointer"
        />
        {/* <span className="text-sm font-semibold">{color}</span> */}
      </div>
    </div>
      {/* Number Adjustment Buttons */}
      <div className="flex items-center space-x-2">
       
        {/* <input
          type="number"
          value={number}
          onChange={(e) =>  handleSelectWidth(e)}
          className="w-16  border border-gray-300 rounded-md text-center"
        /> */}
        <div className="w-[100px]  ">
        <InputFieldNDL 
          type="number"
          value={number}
          onChange={(e) =>  handleSelectWidth(e)}
          dynamic={selectedButton}
          isCounter
          handleIncrement={handleIncrement}
          /></div>
         {/* <button
          onClick={decrement}
          className="px-3 py-1 border border-inherit rounded-md"
        >
          -
        </button>
        <button
          onClick={increment}
          className="px-3 py-1 border border-inherit rounded-md"
        >
          +
        </button> */}
      </div>
      <div className="flex items-center space-x-2 ">
      <div className="flex items-center h-8 " style={{width:'125px'}}> 

      <SelectBox
                                id="connection-type"
                              
                                placeholder="Connection Type"
                                edit
                                disableCloseOnSelect
                                auto={false}
                                options={connectionOption}
                                isMArray={true}
                                keyValue="name"
                                keyId="id"
                                multiple={false}
                                value={selectedOption}
                                //onChange={handleSelectChange}
                                noSorting
                                onChange={(e) => handleConnectionTypeChange(e)} 
                                
                            />
                            </div>
                            </div>
      {/* Select Box */}
      {/* <select
        value={selectedOption}
        onChange={handleSelectChange}
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
      >
        <option value="default">Default</option>
        <option value="straight">Straight</option>
        <option value="step">Step</option>
        <option value="smoothstep">smoothstep</option>
      </select> */}
      <div className="flex items-center space-x-2 ">
      <div className="flex items-center h-8 "> 
       <TooltipNDL title={"Reverse Connection"} placement="bottom" arrow   >  
              <Button  icon={Switch} 
              //  stroke={getIconColor('text')}
                type={reverseConnection === 'text' ? 'primary' : 'ghost'}
                onClick={handleReverseConnection}
              //  onClick={() => handleButtonClick('text')} 
              //  noStroke 
              />
            </TooltipNDL>
            </div>
            </div>
            <div className="flex items-center space-x-2 ">
             <div className="flex items-center  h-8 "> 
                  <Separator/>
                  </div>
                  </div>
            <div className="flex items-center space-x-2 ">
            <div className="flex items-center h-8 ">
             <TooltipNDL title={"Delete"} placement="bottom" arrow   >  
                    <Button  icon={Delete} 
                    //  stroke={getIconColor('text')}
                      type={selectedButton === 'text' ? 'primary' : 'ghost'}
                      onClick={handleDeleteEdge}
                    //  onClick={() => handleButtonClick('text')} 
                    //  noStroke 
                     />
                  </TooltipNDL>
                  </div>
                  </div>
                   {/* Example of connection button */}
      


    </div>
    </div>
  );
};


export default TextToolbox;

