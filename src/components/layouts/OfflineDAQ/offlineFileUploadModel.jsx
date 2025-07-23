import React,{useState,useImperativeHandle} from 'react'; 
import ModalNDL from 'components/Core/ModalNDL';
import OfflineFileUpload from './offlineFileUpload';

const offlineFileUploadModel= React.forwardRef((props, ref) => { 
    const [offlineDialog, setDialog] = useState(false);

    useImperativeHandle(ref, () => ({
        openDialog: () => {
            setDialog(true);
        }
    })) 

    const handleCloseDialog=()=> {
        setDialog(false);
    }

    return(
        <ModalNDL onClose={handleCloseDialog}  open={offlineDialog}>
            <OfflineFileUpload offlineDialog={offlineDialog} handleCloseDialog={handleCloseDialog} />
        </ModalNDL>
    )
})
export default offlineFileUploadModel;