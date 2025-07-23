// DefaultToolbox.jsx
import React, { useState, useEffect, useRef } from "react";

import Button from 'components/Core/ButtonNDL';
import useTheme from 'TailwindTheme';
import ListNDL from 'components/Core/DropdownList/ListNDL.jsx';
import TooltipNDL from 'components/Core/ToolTips/TooltipNDL';
import { useRecoilState } from 'recoil';
import {  fetchedDashboardDataState, snackMessage, snackType, snackToggle, snackDesc, nodesAtom} from "recoilStore/atoms"; // Recoil variables
import { useRecoilValue } from 'recoil';

import Redo from 'assets/neo_icons/Menu/scada/defaulttoolbar/Redo.svg?react';
import Undo from 'assets/neo_icons/Menu/scada/defaulttoolbar/Undo.svg?react';
import Separator from 'assets/neo_icons/Menu/scada/defaulttoolbar/Separator.svg?react';
import Refresh from 'assets/neo_icons/Menu/scada/defaulttoolbar/Refresh.svg?react';
import Move from 'assets/neo_icons/Menu/scada/defaulttoolbar/Move.svg?react';
import MoveW from 'assets/neo_icons/Menu/scada/defaulttoolbar/Move.svg?react';
import Plus from 'assets/neo_icons/Menu/scada/defaulttoolbar/plus.svg?react';
import TextT from 'assets/neo_icons/Menu/scada/defaulttoolbar/TextT.svg?react';

import Cam from 'assets/neo_icons/Menu/scada/defaulttoolbar/device-camera-phone.svg?react';
import Link from 'assets/neo_icons/Menu/scada/defaulttoolbar/Link_Icon.svg?react';
import Fileex from 'assets/neo_icons/Menu/scada/defaulttoolbar/file-import.svg?react';
import Hex from 'assets/neo_icons/Menu/scada/defaulttoolbar/hexagon-3d.svg?react';
import useAddscadaImage from 'components/layouts/Scada/hooks/useAddscadaImage';
import useGetscadaImages from 'components/layouts/Scada/hooks/useGetscadaImages';

import ComponentModal from './AddComponent';
import DisplayContent from './DisplayContentForm';
import LinkModel from './LinkModel';
import Confirmclear from './ConfirmclearModal';
const DefaultToolbox = ({ onAddComponent, onAddDisplay, oncanvasclear,handleUndo,handleRedo,handleAddText,headPlant}) => {
    //const [isModalOpen, setModalOpen] = useState(false);
    const dialogRef = useRef();
    const imgRef = useRef();
    const [isComponentModalOpen, setIsComponentModalOpen] = useState(false);
    const [openGap,setOpenGap] = useState(false); 
    const [nodes] = useRecoilState(nodesAtom);
    const [AnchorPos,setAnchorPos] = useState(null);
    const [selectedNode, setSelectedNode] = useState(null); 
    const [components, setComponents] = useState([]);
    const [isDisplayModalOpen, setDisplayIsModalOpen] = useState(false);
    const [isLinkModalOpen, setLinkIsModalOpen] = useState(false);
    const [isconfirmclearModalOpen, setconfirmclearModalOpen] = useState(false);
    const [, SetMessageRecoil] = useRecoilState(snackMessage);
    const [, SetTypeRecoil] = useRecoilState(snackType);
    const [, setOpenSnackRecoil] = useRecoilState(snackToggle);
    const [, setSnackDesc] = useRecoilState(snackDesc);
   // const fetchedDashboardData = useRecoilValue(fetchedDashboardDataState); 
    const [selectedButton, setSelectedButton] = useState('move'); 
    const [images, setImages] = useState([]);
    const { AddscadaImageLoading, AddscadaImageData, AddscadaImageError, getAddscadaImage } = useAddscadaImage();
    const { GetscadaImagesLoading, GetscadaImagesData, GetscadaImagesError, getscadaImages } = useGetscadaImages();
      // Create a ref to the file input
     // const fileInputRef = useRef(null);
//console.log('fetched data',fetchedDashboardData);
    // const handleAddComponent = (component) => {
    //     setComponents((prev) => [...prev, component]);
    // };

    const handleAddComponent = (Component) => {
      onAddComponent(Component);
      // setIsModalOpen(false);
    };

    useEffect(()=>{
      if(GetscadaImagesData){
        setImages(GetscadaImagesData.map(m=> m.image_name))
      }
    },[GetscadaImagesData])

    useEffect(()=>{
        getscadaImages({line_id : headPlant.id})
    },[headPlant])

    useEffect(()=>{
      if(AddscadaImageData){
          // console.log(AddscadaImageData,"AddscadaImageData")
          const newPosition = calculateNewPosition(nodes);
            let Data = AddscadaImageData.record.returning[0]
            // setNodes((prevNodes) => [
            //     ...prevNodes,
            //     {
            //         id: Data.id,
            //         type: "customNode",
            //         selected: true,
            //         data: {
            //             id: Data.id,
            //             label: Data.image_name, 
            //             style:{width: 80,height:80},
            //             img : Data.id
            //         },
            //         style:{width: 80,height:80},
            //         position: newPosition,
            //     },
            // ]);
            let newImg = {
                      id: Data.id,
                      type: "customNode",
                      selected: true,
                      data: {
                          id: Data.id,
                          label: Data.image_name, 
                          style:{width: 80,height:80},
                          img : Data.id
                      },
                      style:{width: 80,height:80},
                      position: newPosition,
                  }
            onAddComponent(newImg)
            SetMessageRecoil("Image imported successfully.");
            SetTypeRecoil("success");
            setOpenSnackRecoil(true);
        
      }  
    },[AddscadaImageData])

    const calculateNewPosition = (existingNodes) => {
      const baseX = 50;
      const baseY = 50;
      const columnOffset = 150;
      const rowOffset = 120;
      const maxColumns = 5;
      const count = existingNodes.length;
      return {
          x: baseX + (count % maxColumns) * columnOffset,
          y: baseY + Math.floor(count / maxColumns) * rowOffset,
      };
  };

 // Function to handle button click
 const handleButtonClick = (buttonName) => {
  if(buttonName === 'undo'){
    handleUndo(buttonName)
  }else if(buttonName === 'redo'){
    handleRedo(buttonName)
  }else if(buttonName === 'text'){
    handleAddText(buttonName)
  }
  setSelectedButton(buttonName); // Update selected button
};

  // Function to change SVG icon color
  const getIconColor = (buttonName) => {
    return selectedButton === buttonName ? '#ffffff' : '#646464'; // White for selected, black otherwise
  };

    function optionChange(e) {
      //  console.log("ListTrigger",e)
            if(e === "1"){
                setOpenGap(!openGap)
                setAnchorPos(null)
                setDisplayIsModalOpen(true);
                setSelectedButton("move")

            }
            if(e === "2"){
                setOpenGap(!openGap)
                setSelectedButton("move")
                setAnchorPos(null)
                dialogRef.current.openDialog()
            }
            if(e === "3"){
                setOpenGap(!openGap)
                setAnchorPos(null);
                setSelectedButton("move")
                setIsComponentModalOpen(false);
                // console.log(imgRef.current,"imggg")
                imgRef.current.click()
               // handleFileButtonClick();
            }
            if(e === "4"){
              setOpenGap(!openGap)
              setAnchorPos(null)
              setLinkIsModalOpen(true);
              setSelectedButton("move")

            }
            // setHideGap(!hideGap)
          
          }
          
          const handleClose = () => {
            setOpenGap(false)
            setAnchorPos(null)
            setSelectedButton("move")
          };
        
          const openModal = () => setIsComponentModalOpen(true);
          const closeModal = () => setIsComponentModalOpen(false);  
        
          const handleCloseDisplayModal = () => {
            setDisplayIsModalOpen(false);  // Close the modal
            setLinkIsModalOpen(false)
          };

          const closeconfirmclearModal = () => {
            setconfirmclearModalOpen(false);  // Close the modal
          };


        const handleNullPopper = (e) => {
            setOpenGap(!openGap)
            setAnchorPos(e.currentTarget)
            setSelectedButton('plus');
           // setIsModalOpen(true); // Ensure this triggers modal open
          }
          
          const handleOpencornfirmmodal = (e) => {
            // setOpenGap(!openGap)
            // setAnchorPos(e.currentTarget)
            setconfirmclearModalOpen(true);
           // setIsModalOpen(true); // Ensure this triggers modal open
          }
    

          

const menuOption = [
    {id:"1",name:"Data Display",icon:Cam,toggle: false},
    {id:"4",name:"Link Panel",icon: Link,toggle: false},
    {id:"2",name:"Components",icon:Hex,toggle: false},
    {id:"3",name:"Import Components",icon:Fileex,toggle: false},
  ]

  
  const handleImageField = (e) => {

    const selectedFiles = e.target.files;
    let fileArr = [];
    const supportedFormats = [
      "image/jpg",
      "image/jpeg",
      "image/gif",
      "image/png",
    ];
    console.log(selectedFiles,"selectedFilesselectedFiles")
    if (!supportedFormats.includes(selectedFiles[0].type)) {
      SetMessageRecoil("Unsupported file format.");
      SetTypeRecoil("warning");
      setOpenSnackRecoil(true);
      return false
    }
    for (let i = 0; i < selectedFiles.length; i++) {
      if (selectedFiles[i].size > 10485760) {
        fileArr.push(selectedFiles[i].size);
      }
    }

    if (fileArr.length > 0) {
      SetMessageRecoil("Total Image Size should not exceed 10MB.");
      SetTypeRecoil("warning");
      setOpenSnackRecoil(true);
      return false;
    } 

    const modifiedFiles = Array.from(selectedFiles).map(file => {
      const originalFileName = file.name;
      const lastDotIndex = originalFileName.lastIndexOf('.');
      const namePart = lastDotIndex === -1 ? originalFileName : originalFileName.substring(0, lastDotIndex);
      const extension = originalFileName.substring(lastDotIndex);
      const newFileName = namePart + "~" + extension;
      return new File([file], newFileName, { type: file.type });
    });
    const duplicateFiles = modifiedFiles.filter(file => images.includes(file.name));
    // console.log(GetscadaImagesData,"GetscadaImagesData",duplicateFiles,modifiedFiles)
    // return false
    if (duplicateFiles.length > 0) {
      SetMessageRecoil("This image has already been uploaded.");
      SetTypeRecoil("warning");
      setOpenSnackRecoil(true);
      return false;
    }  
    const formData = new FormData(); 
    if (modifiedFiles[0] instanceof File) {
      // console.log("Appending file1:", files.file1);
      formData.append("image", modifiedFiles[0]);
    } else {
      console.warn("file1 is missing or invalid.");
    } 
    formData.append("line_id", headPlant.id)
    getAddscadaImage(formData)
    // console.log(images,formData,"imagesimages",modifiedFiles[0])
    
  };

  function canvasclear(){
      oncanvasclear()
      SetMessageRecoil("Workspace Cleared");
      setSnackDesc('The workspace has been successfully cleared.')
      SetTypeRecoil("clear");
      setOpenSnackRecoil(true);
  }
  
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
        
         
        <div className="flex items-center h-8  rounded-md"> 
          <TooltipNDL title={"Move"} placement="bottom" arrow   > 
          <Button
              icon={Move}
              stroke={getIconColor('move')}
              type={selectedButton === 'move' ? 'primary' : 'ghost'}
              onClick={(e) => {handleButtonClick('move')}} // Set 'move' as selected on click
              noStroke
            />

          </TooltipNDL>
        </div>

         <div className="flex items-center h-8  ">
          <TooltipNDL title={"Undo"} placement="bottom" arrow   >
             <Button  icon={Undo} 
             stroke={"#646464"}
             type={'ghost'}
             onClick={(e) =>{ handleButtonClick('undo'); e.currentTarget.blur();handleButtonClick('move')}} 
             noStroke />
             </TooltipNDL>
         </div>
      

       <div className="flex items-center h-8  ">  
        <TooltipNDL title={"Redo"} placement="bottom" arrow   > 
          <Button  icon={Redo}
          stroke={"#646464"}
          type={selectedButton === 'redo' ? 'primary' : 'ghost'}
          onClick={(e) => {handleButtonClick('redo'); e.currentTarget.blur();handleButtonClick('move')}}
          noStroke  
          />
        </TooltipNDL>
        </div>
        <div className="flex items-center h-8 "> 
      <Separator/>
      </div>

     <div className="flex items-center h-8 "> 
      <TooltipNDL title={"Text"} placement="bottom" arrow   >  
        <Button  icon={TextT} 
         stroke={getIconColor('text')}
         type={selectedButton === 'text' ? 'primary' : 'ghost'}
         onClick={() => handleButtonClick('text')} 
         noStroke />
      </TooltipNDL>
      </div>

      <div className="flex items-center h-8 ">
        <TooltipNDL title={"Component"} placement="bottom" arrow   > 
          <Button  icon={Plus}
           stroke={getIconColor('plus')}
          type={openGap && AnchorPos ? 'primary' : 'ghost'}
           onClick={(e) => handleNullPopper(e)}
           noStroke  />
        </TooltipNDL>
      </div> 
      <ListNDL
        options={menuOption}
        Open={openGap}
        optionChange={optionChange}
        keyValue={"name"}
        keyId={"id"}
        id={"popper-Gap"}
        onclose={handleClose}
        IconButton
        isIcon
        anchorEl={AnchorPos}
        width="200px"
        />
       <div className="flex items-center h-8 "> 
      <Separator/>
      </div>
     
     <div className="flex items-center h-8 ">
      <TooltipNDL title={"Clear All"} placement="bottom" arrow   >
         <Button  icon={Refresh} type='ghost' onClick={(e) => handleOpencornfirmmodal(e)}  />
      </TooltipNDL>
    </div>
      
      

    </div>
   
    <div>
    <input
                  style={{
                    height: "100%",
                    opacity: "0",
                    width: "100%",
                    display:"none"
                  }}
                  type="file" 
                  accept="image/*"
                  onChange={handleImageField}
                  ref={imgRef}
              >
              </input>
               
    <ComponentModal ref={dialogRef} headPlant={headPlant} scadaImagesData={GetscadaImagesData} 
      getImages={()=>getscadaImages({line_id : headPlant.id})}
      handleAddComponent={handleAddComponent}
    />
    <DisplayContent open={isDisplayModalOpen} onClose={handleCloseDisplayModal} onAddDisplay={onAddDisplay} />
    <LinkModel open={isLinkModalOpen} onClose={handleCloseDisplayModal} onAddDisplay={onAddDisplay}/>
    <Confirmclear open={isconfirmclearModalOpen} onClose={closeconfirmclearModal} oncanvasclear={canvasclear} />
    {/* <ComponentModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onAddNode={handleAddNode} /> */}
  </div>
  </>
  );
};

export default DefaultToolbox;
