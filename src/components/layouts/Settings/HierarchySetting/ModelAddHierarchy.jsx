import React, { useState,forwardRef, useImperativeHandle, useRef } from 'react'; 
import ModalNDL from 'components/Core/ModalNDL';
import AddHierarchy from './AddHierarchy';

const ModelAddHierarchy = forwardRef((props,ref)=>{
    const [dialog,setDialog] = useState(false); 
    const DetailRef = useRef()
   
    useImperativeHandle(ref,()=>({
        openDialog:(hier)=>{
            setDialog(true);
            if(hier){
                setTimeout(()=>{ 
                    DetailRef.current.openDialog(hier)
                },500)
            }},
            closeDialog:()=>{setDialog(false)}

        
    }))
   
    function addDuplicateHierarchy(val,heir){ 
        props.addDuplicateHierarchy(val,heir)
    }
    return (
        <ModalNDL open={dialog} onClose={()=>{setDialog(false)}} > 
            <AddHierarchy handleDialogHieClose={()=>{setDialog(false)}} ref={DetailRef} 
             addDuplicateHierarchy={addDuplicateHierarchy} 
             addNewHierarchy={props.addNewHierarchy} 
             instrumentcategory={props.instrumentcategory} />
             
        </ModalNDL> 
    )
})
export default ModelAddHierarchy;