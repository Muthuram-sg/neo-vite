import React,{useState,useImperativeHandle} from 'react'; 
import ModalNDL from 'components/Core/ModalNDL';
import FileUpload from './FileUpload';

const FileUploadModel= React.forwardRef((props, ref) => { 
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
            <FileUpload 
            handleTask={props.handleTask}  
            refreshTable={props.refreshTable} 
            getTaskList={()=>props.getTaskList()} 
            fileUploadDialog={fileUploadDialog} 
            handleCloseDialog={handleCloseDialog}/>
        </ModalNDL>
    )
})
export default FileUploadModel;