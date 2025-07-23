import React,{useRef, useImperativeHandle, useState} from 'react';  
import ModalNDL from 'components/Core/ModalNDL'; 
import ExecutionWorkOrder from './EditWorkOrderExecution'
  

const ModalExecution= React.forwardRef((props, ref) => {  
    const EditExecutionRef = useRef();
    const [dialog,setDialog] = useState(false);  

    useImperativeHandle(ref,()=>({
        handleEditWorkOrderExecutionDialogOpen:(detail)=>{ 
            setDialog(true);
            setTimeout(()=>{ 
                EditExecutionRef.current.handleEditWorkOrderExecutionDialogOpen(detail)
            },200)
        }
    }))
    
    return(
        <ModalNDL onClose={()=>setDialog(false)} size="lg" open={dialog}>
            <ExecutionWorkOrder
            ref={EditExecutionRef}
            getUpdatedWorkOrderExecutionList={props.getUpdatedWorkOrderExecutionList}
            setLoading={props.setLoading}
            executiondata = {props.executiondata}
            handleDialogClose={()=>setDialog(false)}
             
            />
        </ModalNDL>
    )
})
export default ModalExecution;