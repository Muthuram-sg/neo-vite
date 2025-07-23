/* eslint-disable no-unused-vars */
import React,{useState,useRef,useImperativeHandle} from 'react'; 
import ModalNDL from 'components/Core/ModalNDL'; 
import OverDueList from './OverDueList'

const OverDueModal= React.forwardRef((props, ref) => { 
  
    const [OverdueDialog, setOverDueDialog] = useState(false);  
    const OverDueListRef = useRef(); 

    useImperativeHandle(ref, () =>
    (
      {
        handleOverDialog: () => {
          setOverDueDialog(true) 
        }
        
      }
    )
    )

    function handleDueDialogClose(){
        setOverDueDialog(false)
    }

    return(
        <ModalNDL onClose={handleDueDialogClose}  open={OverdueDialog}>
            <OverDueList handleDueDialogClose={handleDueDialogClose} ref={OverDueListRef} OverdueDialog={OverdueDialog} 
            dueDateExpiredList={props.dueDateExpiredList}
            DueDateExpiredList={props.DueDateExpiredList}
            handleSendReminder={props.handleSendReminder}
            />
        </ModalNDL>
    )
})
export default OverDueModal;