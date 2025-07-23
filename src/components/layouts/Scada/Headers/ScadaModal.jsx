import React,{useRef, useImperativeHandle, useState, useEffect} from 'react';  
import ModalNDL from 'components/Core/ModalNDL'; 
import ScadaForm from './ScadaForm' 

const ScadaModal= React.forwardRef((props, ref) => {  
    const formRef = useRef();
    const [dialog,setDialog] = useState(false); 
    const [formType, setFormType] = useState('add');
   
     
    useImperativeHandle(ref,()=>({
        openDialog:(detail,data)=>{ 
            setDialog(true);
            setFormType(detail)
            setTimeout(()=>{
                    formRef.current.openDialog(detail,data); // Call openDialog on ScadaForm
            },200)
        }
    }))

 
    return(
        <ModalNDL onClose={()=>setDialog(false)} size="lg" open={dialog}>
           
            <ScadaForm
            handleDialogClose={()=> setDialog(false)}
            ref={formRef} 
            formType={formType}
          getscadaviewList={props.getscadaviewList}
        //  getScadaViewList={props.getScadaViewList}
            handleSnackbar={props.handleSnackbar}
           // setListUpdated={props.setListUpdated} // Pass it to the ScadaForm
            
            
            />
            
        </ModalNDL>
    )
})
export default ScadaModal;