import React,{useState,useRef,useImperativeHandle} from 'react';  
import ModalNDL from 'components/Core/ModalNDL'; 
import AddWorkOrderExecution from './AddWorkOrderExecution'
const WOExeModal= React.forwardRef((props, ref) => {  
    const WorkOrderExecutionRef = useRef();
    const [workOrderDialog, setWorkOrderDialog] = useState(false);

    useImperativeHandle(ref, () =>
    (
        { 
            handleWorkOrderExecutionDialog: (data) => {
                setWorkOrderDialog(true);
                setTimeout(()=>{
                    WorkOrderExecutionRef.current.handleWorkOrderExecutionDialog(data)
                },200)
                
            } 
        }
    )
    )

    function handleWorkOrderExecutionDialogClose(){
        setWorkOrderDialog(false)
    }
    
    return(
        <ModalNDL onClose={handleWorkOrderExecutionDialogClose}  open={workOrderDialog}>
            <AddWorkOrderExecution
            handleWorkOrderExecutionDialogClose={handleWorkOrderExecutionDialogClose}
            ref={WorkOrderExecutionRef}
            getUpdatedWorkOrderList={() => props.getUpdatedWorkOrderList()}
            workorderlist={props.workorderlist}
             
            />
        </ModalNDL>
    )
})
export default WOExeModal;