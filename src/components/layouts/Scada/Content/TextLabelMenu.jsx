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
import Rotate from 'assets/neo_icons/Menu/scada/defaulttoolbar/Rotate.svg?react';
import Copy from 'assets/neo_icons/Menu/scada/defaulttoolbar/Copy.svg?react';
import Bold from 'assets/neo_icons/Menu/scada/Bold.svg?react';
import Italics from 'assets/neo_icons/Menu/scada/Italics.svg?react';
import Underline from 'assets/neo_icons/Menu/scada/Underline.svg?react';
import Align_Left from 'assets/neo_icons/Menu/scada/Align_Left.svg?react';
import Align_Rigth from 'assets/neo_icons/Menu/scada/Align_Right.svg?react';
import Align_Center from 'assets/neo_icons/Menu/scada/Align_Center.svg?react';
import Separator from 'assets/neo_icons/Menu/scada/defaulttoolbar/Separator.svg?react';





const TextLabelMenu = ({ onTextChange,onColorChange, onFontChange,onFontAlign, onNumberChange, onReverseChange, onDeleteChange,onCopy,onRotate,Textvalue,TextStyle,selectedNode}) => {
 
    const [selectedButton, setSelectedButton] = useState('move');   

  useEffect(()=>{ 
    // console.log(TextStyle,"selectedTextvalue",Textvalue)
  },[Textvalue,TextStyle])
  const connectionOption = [
   // { id: "default", name: "Default" },
   { id: "smoothstep", name: "Smoothstep" },
    { id: "straight", name: "Straight" },
    { id: "step", name: "Step" },
   
  ]

   // Handle color change
   const handleColorChange = (e) => {
    const newColor = e.target.value;
    setSelectedButton(newColor)
    onColorChange(newColor,"color"); // Pass color up to parent
  }; 

   // Handle delete edge
   const handleDeleteEdge = () => {
    onDeleteChange(); // Trigger the delete function passed down from parent
};

  // Handle number increment and decrement
  const handleIncrement = (type) => {
    let newNumber = Number(TextStyle.size - 1); 
    if(type === 'plus'){
        newNumber = Number(TextStyle.size + 1); 
    }  
    if(newNumber>0){
        onNumberChange(newNumber,"size")
        setSelectedButton(newNumber)
    } 
  }; 

  // Handle select box change
  const handleSelectWidth = (e) => {
    const newNumber = Number(e.target.value); 
    if(newNumber >0){
        onNumberChange(newNumber,"size")
        setSelectedButton(newNumber)
    }else{
        onNumberChange(1,"size")
        setSelectedButton(1)
    }
    // console.log('new number from in',newNumber)
  };

  const handleTextVal = (e) => {
    const newText = e.target.value;  
        onTextChange(newText)
        setSelectedButton(newText) 
    // console.log('new number from in',newText)
  };

  const handleFontstyle = (e) => { 
    setSelectedButton(e+"Btn")
    onFontChange(e,e); // Pass the new state to the parent component
  };

  const handleFontAlign = (e) => { 
    setSelectedButton(e+"Btn")
    onFontAlign(e,e); // Pass the new state to the parent component
  };

   // Function to change SVG icon color
    const getIconColor = (buttonName,type,bool) => {
        let textcolor = (type === 'style') ? '#202020' : '#646464'
        if(type === 'style'){
            return bool ? '#646464' : textcolor; // White for selected, black otherwise    
        }else{
            return (selectedButton === buttonName) ? '#ffffff' : textcolor; // White for selected, black otherwise
        }
        
    }; 

    const handleButtonClick = (action) => {
        setSelectedButton(action); // Highlight selected button
        switch (action) { 
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

  return (
    <div  style={{ border:'1px solid #E8E8E8', background:'#fff',left: '50%', marginLeft: '-230px' }} className="mt-1 p-2 toolbox flex items-center gap-2 absolute top-14 z-50   rounded-xl ">
        
        <div className="flex items-center space-x-2">
            <div className="w-[200px]  ">
                <InputFieldNDL 
                value={Textvalue}
                onChange={(e) =>  handleTextVal(e)}
                dynamic={selectedButton || selectedNode}
                placeholder={"Text Field"}
                />
            </div>
        </div>
        
      {/* Number Adjustment Buttons */}
      <div className="flex items-center space-x-2"> 
        <div className="w-[100px] ">
        <InputFieldNDL 
          type="number"
          isCounter
          value={TextStyle.size}
          onChange={(e) =>  handleSelectWidth(e)}
          dynamic={selectedButton}
          handleIncrement={handleIncrement}
          /></div> 
      </div>

      <div className="flex items-center h-8 pl-1 rounded-md"> 
            <div className="flex items-center h-8 px-2 py-1 border border-inherit rounded-md"> 
            {/* Color Picker */}
            <div className="flex items-center space-x-2">
                {/* <label htmlFor="colorPicker" className="text-sm font-semibold">Color:</label> */}
                <input
                type="color"
                id="colorPicker"
                value={TextStyle.color}
                onChange={handleColorChange}
                className="w-4 h-4 rounded-full border-none cursor-pointer"
                />
                {/* <span className="text-sm font-semibold">{color}</span> */}
            </div>
        </div>

        <div className="flex items-center space-x-2 pl-2">
            <TooltipNDL title={"Bold"} placement="bottom" arrow > 
                <button onClick={()=>handleFontstyle("Bold")}   className={`p-2 h-8 rounded-md ${TextStyle.weight ? "bg-Secondary_Interaction-secondary-active" : "bg-Secondary_Interaction-secondary-default"} hover:bg-Secondary_Interaction-secondary-hover`}>
                    <Bold className="flex" stroke={TextStyle.weight ? "#202020" : "#646464"}/>
                </button> 
              {/* <Button  icon={Bold} 
                stroke={getIconColor('BoldBtn','style',TextStyle.weight)}
                type={(TextStyle.weight) ? 'secondary' : 'ghost'}
                onClick={()=>handleFontstyle("Bold")} 
                noStroke
              /> */}
            </TooltipNDL> 
        </div>
        <div className="flex items-center space-x-2 pl-2"> 
                <TooltipNDL title={"Italics"} placement="bottom" arrow >  
                <button onClick={()=>handleFontstyle("Italics")}   className={`p-2 h-8 rounded-md ${TextStyle.style ? "bg-Secondary_Interaction-secondary-active" : "bg-Secondary_Interaction-secondary-default"} hover:bg-Secondary_Interaction-secondary-hover`}>
                    <Italics className="flex" stroke={TextStyle.style ? "#202020" : "#646464"}/>
                </button> 
                    {/* <Button  icon={Italics} 
                        stroke={getIconColor('ItalicsBtn','style',TextStyle.style)}
                        type={(TextStyle.style) ? 'secondary' : 'ghost'}
                        onClick={()=>handleFontstyle("Italics")} 
                        noStroke
                    /> */}
                </TooltipNDL>  
        </div>
        <div className="flex items-center space-x-2 pl-2">
            <TooltipNDL title={"Underline"} placement="bottom" arrow >  
            <button onClick={()=>handleFontstyle("Underline")}   className={`p-2 h-8 rounded-md ${TextStyle.underline ? "bg-Secondary_Interaction-secondary-active" : "bg-Secondary_Interaction-secondary-default"} hover:bg-Secondary_Interaction-secondary-hover`}>
                    <Underline className="flex" stroke={TextStyle.underline ? "#202020" : "#646464"}/>
                </button> 
                    {/* <Button  icon={Underline} 
                        stroke={getIconColor('UnderlineBtn','style',TextStyle.underline)}
                        type={(TextStyle.underline) ? 'secondary' : 'ghost'}
                        onClick={()=>handleFontstyle("Underline")} 
                        noStroke
                    /> */}
            </TooltipNDL>  
        </div>
        <div className="flex items-center space-x-2 pl-2">
            <TooltipNDL title={"Align-Left"} placement="bottom" arrow >  
            <button onClick={()=>handleFontAlign("left")}   className={`p-2 h-8 rounded-md ${selectedButton === 'leftBtn' ? "bg-Secondary_Interaction-secondary-active" : "bg-Secondary_Interaction-secondary-default"} hover:bg-Secondary_Interaction-secondary-hover`}>
                    <Align_Left className="flex" stroke={selectedButton === 'leftBtn' ? "#202020" : "#646464"}/>
                </button> 
                    {/* <Button  icon={Align_Left} 
                        stroke={getIconColor('leftBtn')}
                        type={selectedButton === 'leftBtn' ? 'secondary' : 'ghost'}
                        onClick={()=>handleFontAlign("left")} 
                        noStroke
                    /> */}
            </TooltipNDL>  
        </div>
        <div className="flex items-center space-x-2 pl-2">
            <TooltipNDL title={"Align-Center"} placement="bottom" arrow >  
            <button onClick={()=>handleFontAlign("center")}   className={`p-2 h-8 rounded-md ${selectedButton === 'centerBtn' ? "bg-Secondary_Interaction-secondary-active" : "bg-Secondary_Interaction-secondary-default"} hover:bg-Secondary_Interaction-secondary-hover`}>
                    <Align_Center className="flex" stroke={selectedButton === 'centerBtn' ? "#202020" : "#646464"}/>
                </button> 
                    {/* <Button  icon={Align_Center} 
                        stroke={getIconColor('centerBtn')}
                        type={selectedButton === 'centerBtn' ? 'secondary' : 'ghost'}
                        onClick={()=>handleFontAlign("center")} 
                        noStroke
                    /> */}
            </TooltipNDL>  
        </div>
        <div className="flex items-center space-x-2 pl-2">
            <TooltipNDL title={"Align-Right"} placement="bottom" arrow >  
            <button onClick={()=>handleFontAlign("right")}   className={`p-2 h-8 rounded-md ${selectedButton === 'rightBtn' ? "bg-Secondary_Interaction-secondary-active" : "bg-Secondary_Interaction-secondary-default"} hover:bg-Secondary_Interaction-secondary-hover`}>
                    <Align_Rigth className="flex" stroke={selectedButton === 'rightBtn' ? "#202020" : "#646464"}/>
                </button> 
                    {/* <Button  icon={Align_Rigth} 
                        stroke={getIconColor('rightBtn')}
                        type={selectedButton === 'rightBtn' ? 'secondary' : 'ghost'}
                        onClick={()=>handleFontAlign("right")} 
                        noStroke
                    /> */}
            </TooltipNDL>  
        </div> 

        <div className="flex items-center pl-2">  
        <TooltipNDL title={"Duplicate"} placement="bottom" arrow   > 
          <Button  icon={Copy}
          stroke={getIconColor('duplicate')}
          type={selectedButton === 'duplicate' ? 'primary' : 'ghost'}
          onClick={() => handleButtonClick('duplicate')}
          noStroke  
          />
        </TooltipNDL>
        </div> 

        <div className="flex items-center pl-2"> 
        <TooltipNDL title={"Rotate"} placement="bottom" arrow   >  
            <Button  icon={Rotate} 
            stroke={getIconColor('rotate')}
            type={selectedButton === 'rotate' ? 'primary' : 'ghost'}
            onClick={() =>handleButtonClick('rotate')} 
            noStroke />
        </TooltipNDL>
        </div>
        <Separator/>

        <div className="flex items-center space-x-2 "> 
            <TooltipNDL title={"Delete"} placement="bottom" arrow   >  
                <Button  icon={Delete}  
                    type={selectedButton === 'text' ? 'primary' : 'ghost'}
                    onClick={handleDeleteEdge} 
                    />
            </TooltipNDL> 
        </div> 
    </div>
    </div>
  );
};


export default TextLabelMenu;

