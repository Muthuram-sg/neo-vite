import React,{useRef, useState} from 'react'; 
import useTheme from "TailwindTheme";
import ParagraphText from "components/Core/Typography/TypographyNDL";
import Duplicate from 'assets/neo_icons/Menu/duplicate.svg?react';
import Editpencil from 'assets/neo_icons/Menu/blackEdit.svg?react';
import Delete from 'assets/neo_icons/Menu/ActionDelete.svg?react'; 
import MoreVertLight from 'assets/neo_icons/Menu/3_dot_vertical.svg?react';
import ListNDL from 'components/Core/DropdownList/ListNDL';
import Button from 'components/Core/ButtonNDL';
import DeleteModel from "../HierarchyList/DeleteModel"
function HierarchyList(props){

    const theme = useTheme();
    const [openGap,setOpenGap] = useState(false); 
    const [AnchorPos,setAnchorPos] = useState(null); 
    const [openDialog,setopenDialog] = useState(false)
    const DeleteRef = useRef()
    const menuOptions = [
        {id:"duplicate",name:"Duplicate",toggle: false,stroke:theme.colorPalette.primary,icon:Duplicate,RightIcon:false},
        {id:"edit",name:"Edit",stroke:theme.colorPalette.primary,icon:Editpencil,toggle: false,RightIcon:false},
        {id:"delete",name:"Delete",stroke:theme.palette.error.main,color:theme.palette.error.main,icon:Delete,toggle: false,RightIcon:false}

    ] 


    const handleDeleteHierarchy = (index) => {
       setopenDialog(true)
      }
    function optionChange(e) {
      
            if(e === "duplicate"){
                props.duplicateHierarchy(props.id)
                handleClose()
            }else if(e === 'edit'){
                props.edithierarchyfn(e, props.id)
                handleClose()

            }else{
                handleDeleteHierarchy(props.index)
                handleClose()

            }
        
       

    }
    const handleNullPopper = (e) => {
        setOpenGap(!openGap)
        setAnchorPos(e.currentTarget)
    }

  
    const handleClose = () => {
        setOpenGap(false)
        setAnchorPos(null)
    };
    const handleDialogClose =()=>{
        setopenDialog(false)
    }
    // console.log(props,'props.isSelected')
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return( 
        <li divider className=' hover:bg-Secondary_Interaction-secondary-hover mb-1 dark:hover:bg-Secondary_Interaction-secondary-hover-dark cursor-pointer rounded-md' style={{ padding: 8, cursor: "pointer",display:'flex',alignItems: 'center', backgroundColor:(props.selectedHierarchy && props.selectedHierarchy.id === props.id) ? (props.curTheme === 'dark' ? "#222222" : "#E0E0E0") : undefined }} selected={props.isSelected}>
            <div 
                id={'view-' + props.index} 
                style={{flex: '1 1 auto'}} 
                onClick={(event) => props.handleChange(event, props.id)} 
                
            >
                <div className='flex flex-col gap-1'>
                <ParagraphText variant="label-02-s" value={props.name}  style={{width: '200px', textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden"}}/>
                <ParagraphText  variant="paragraph-xs" color="secondary" value={props.updatedUser}/> 
                </div>
            </div>
            <Button id='threeDot' type="ghost" icon={MoreVertLight} onClick={(e) => handleNullPopper(e)} />
            <ListNDL
                                                options={menuOptions}
                                                Open={openGap}
                                                optionChange={optionChange}
                                                keyValue={"name"}
                                                keyId={"id"}
                                                id={"popper-Gap"}
                                                onclose={handleClose}
                                                isIcon
                                                anchorEl={AnchorPos}
                                                width="170px"
                                            />
                                            <DeleteModel 
                                            ref = {DeleteRef}
                                            openDialog={openDialog}
                                            handleDialogClose={handleDialogClose}
                                            deleteHierarchyLoading={props.deleteHierarchyLoading}
                                            deleteHierarhy ={()=>props.deleteHierarhy(props.id)}
                                            name={props.name}
                                            />
        </li>
    )    
}
const isNotRender = (prev,next)=>{
    return prev.isSelected !== next.isSelected || prev.selectedHierarchy !== next.selectedHierarchy ? false : true;
}
export default React.memo(HierarchyList,isNotRender)