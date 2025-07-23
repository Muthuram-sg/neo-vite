import React,{useState,useImperativeHandle,forwardRef} from 'react'; 
import ModalNDL from 'components/Core/ModalNDL';
import TaskImageUpload from './TaskImageUpload';

const TaskImageUploadModel= forwardRef((props, ref) => { 
    const [fileUploadDialog, setDialog] = useState(false);

    useImperativeHandle(ref, () => ({
        openDialog: () => {
            setDialog(true);
        }
    })) 

    const handleCloseDialog=()=> {
        setDialog(false);
    }
   


    return(
        <ModalNDL onClose={handleCloseDialog}  open={fileUploadDialog}>
            <TaskImageUpload handleTask={props.handleTask} getTaskList={()=>props.getTaskList()} fileUploadDialog={fileUploadDialog} handleCloseDialog={handleCloseDialog}/>
        </ModalNDL>
    )
})
export default TaskImageUploadModel;