import React,{useRef, useImperativeHandle, useState} from 'react';  
import ModalNDL from 'components/Core/ModalNDL'; 
import DashboardForm from './DashboarForm' 

const DashboardModal= React.forwardRef((props, ref) => {  
    const formRef = useRef();
    const [dialog,setDialog] = useState(false);  
     
     
    useImperativeHandle(ref,()=>({
        openDialog:(detail,obj)=>{ 
            setDialog(true);
            setTimeout(()=>{
                formRef.current.openDialog(detail,obj)
            },200)
        }
    }))
    
    return(
        <ModalNDL onClose={()=>setDialog(false)} size="lg" open={dialog}>
            <DashboardForm
            UserOption={props.UserOption}
            handleDialogClose={()=> setDialog(false)}
            ref={formRef} 
            getDashboardList={props.getDashboardList}
            handleSnackbar={props.handleSnackbar}
            
            />
        </ModalNDL>
    )
})
export default DashboardModal;