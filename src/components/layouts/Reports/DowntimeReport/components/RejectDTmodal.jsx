/* eslint-disable no-unused-vars */
import React,{useState,useRef,useImperativeHandle} from 'react'; 
import { useRecoilState } from "recoil";
import { snackToggle} from "recoilStore/atoms"; 
import ModalNDL from 'components/Core/ModalNDL'; 
import RejectDTreport from './RejectDTreport'

const RejectDTModal= React.forwardRef((props, ref) => { 
    const [RejectDTDialog, setRejectDTDialog] = useState(false);
    const [,setOpenSnack] = useRecoilState(snackToggle);
    

    const RejectDTDialogRef = useRef();
  
    

    useImperativeHandle(ref, () =>
    (
      {
        handleRejectDTDialog: () => {
          setOpenSnack(false)
            setRejectDTDialog(true) 
          setTimeout(()=>{
            RejectDTDialogRef.current.handleRejectDTDialog()
          },200)
        },
       
        handleEditDowntimeDialogOpen: (rowData) => {
          setOpenSnack(false)
            setRejectDTDialog(true) 
            setTimeout(()=>{
                RejectDTDialogRef.current.handleEditDowntimeDialogOpen(rowData);
            },200)
        
            
        },
        handleReasonDialogClose:()=>{
            RejectDTDialogRef.current.handleDialogClosefn();

        }
      }
    )
    )
 


    function handleDialogClosefn(){
    
        setRejectDTDialog(false) 
    }

    return(
        <ModalNDL onClose={handleDialogClosefn}  open={RejectDTDialog}>
            <RejectDTreport  ref={RejectDTDialogRef} RejectDTDialog={RejectDTDialog} 
            handleDialogClosefn={handleDialogClosefn}
            getDowntimeReasons={props.getDowntimeReasons}
            createDowntimeReason={props.createDowntimeReason}
            downtimeReasonTagList={props.downtimeReasonTagList}
            prodReasonType={props.prodReasonType}
            Reasons={props.Reasons}
            downtimeAsset={props.downtimeAsset}
            dialogMode={props.dialogMode}
            
            />
         </ModalNDL>
    )
})
export default RejectDTModal;