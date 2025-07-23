import React,{useRef,useImperativeHandle} from 'react'; 
import ModalNDL from 'components/Core/ModalNDL'; 
import NewCo2 from './NewCo2'
const Toolmodal= React.forwardRef((props, ref) => {  
    const ToolRef = useRef();

    useImperativeHandle(ref, () =>
    (
      {
        handleToolDelete: (id,data) => {
          setTimeout(()=>{
            ToolRef.current.handleToolDelete(data)
          },200)
        }, 
        handleEditToolDialogOpen: (data) => { 
          setTimeout(()=>{
            ToolRef.current.handleToolDialogOpen(data)
          },200)
          
        },
        handleDefault: (data) => { 
            setTimeout(()=>{
              ToolRef.current.handleDefault(data)
            },200)
            
          }
      }
    )
    )

    function handleToolDialogClose(){
        props.handleToolDialogClose()
    }
    
    return(
        <ModalNDL disableEnforceFocus onClose={handleToolDialogClose}  aria-labelledby="Tool-dialog-title" 
        
        open={props.ToolDialog}
        >
            <NewCo2 
            ref={ToolRef}
            Co2List={props.Co2List}
            refreshTable={props.refreshTable}
            dialogMode={props.dialogMode}
            handleToolDialogClose={handleToolDialogClose} 
            />
        </ModalNDL>
    )
})
export default Toolmodal;