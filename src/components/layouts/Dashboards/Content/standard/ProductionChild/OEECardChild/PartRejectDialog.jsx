import React,{ useEffect ,useState} from 'react'; 
import ModalNDL from 'components/Core/ModalNDL'; 
import PartRejectModal from './RejectDialog' 


function PartReject(props){
    
    const [rejectDialog,setrejectDialog] = useState(false);  

    useEffect(()=>{
        setrejectDialog(props.rejectDialog)
    },[props.rejectDialog])
     
    const handleRejectDialogClose =()=>{  
        props.handleRejectDialogClose();
    }

return(
    <ModalNDL onClose={handleRejectDialogClose} maxWidth={"xs"} open={rejectDialog}>
        <PartRejectModal 
            handleRejectDialogClose={handleRejectDialogClose} 
            rejectDialog={props.rejectDialog}
            rejectParts={props.rejectParts}  
            filteredArrs={props.filteredArrs}
            partsReasonList={props.partsReasonList}
            openNotification={props.openNotification}
            rejectPart={props.rejectPart}
            BulkParts={props.BulkParts} 

             /> 
    
    </ModalNDL>
)
}
const isRender = (prev, next) => {
    return (prev.rejectDialog !== next.rejectDialog )  ? false : true
}
const PartRejectDialog = React.memo(PartReject, isRender)
export default PartRejectDialog;