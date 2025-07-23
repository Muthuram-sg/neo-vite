import React,{useState,useImperativeHandle} from 'react'; 
import ModalNDL from 'components/Core/ModalNDL';
import TaskFileUpload from './taskFileUpload';

const taskFileUploadModel= React.forwardRef((props, ref) => { 
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
            <TaskFileUpload handleTask={props.handleTask} getTaskList={()=>props.getTaskList()} fileUploadDialog={fileUploadDialog} handleCloseDialog={handleCloseDialog}/>
        </ModalNDL>
    )
})
export default taskFileUploadModel;