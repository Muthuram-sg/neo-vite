import React,{useState,useRef,useImperativeHandle,useEffect} from 'react';  
import {useParams} from "react-router-dom"
import ModalNDL from 'components/Core/ModalNDL'; 
import AddWorkOrder from './AddWorkOrder'
const WorkOrderModal= React.forwardRef((props, ref) => {  
    const WorkOrderRef = useRef();
    const [workOrderDialog, setWorkOrderDialog] = useState(false);
    let {moduleName,subModule1} =useParams()
    useEffect(() => {
        console.log(moduleName,subModule1,"MDDD")
      if(moduleName === "work_orders" && subModule1 === "new"){
        setWorkOrderDialog(true)
      }
    },[moduleName,subModule1])
    useImperativeHandle(ref, () =>
    (
        {
            handleWorkOrderDialog: () => {
                setWorkOrderDialog(true) 
                setTimeout(()=>{
                    WorkOrderRef.current.handleWorkOrderDialog()
                },200)
            },
            handleDeleteDialogOpen: (data) => {
                setWorkOrderDialog(true);
                setTimeout(()=>{
                    WorkOrderRef.current.handleDeleteDialogOpen(data)
                },200)
                
            },
            handleEditWorkOrderDialogOpen: (data) => { 
                setWorkOrderDialog(true);
                setTimeout(()=>{
                    WorkOrderRef.current.handleEditWorkOrderDialogOpen(data)
                },200)
            }
        }
    )
    )
console.log(workOrderDialog,"workOrderDialog")
    function handleWorkOrderDialogClose(){
        setWorkOrderDialog(false)
    }
    
    return(
        <ModalNDL onClose={handleWorkOrderDialogClose}  open={workOrderDialog}>
            <AddWorkOrder
            handleWorkOrderDialogClose={handleWorkOrderDialogClose}
            ref={WorkOrderRef}
            workordernames={props.workordernames}
            getUpdatedWorkOrderList={() => props.getUpdatedWorkOrderList()}
            />
        </ModalNDL>
    )
})
export default WorkOrderModal;