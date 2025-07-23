import React,{useRef,useImperativeHandle} from 'react'; 
import ModalNDL from 'components/Core/ModalNDL'; 
import NewTool from 'components/layouts/Settings/ToolLifeMonitoring/Newtool'
const Toolmodal= React.forwardRef((props, ref) => {  
    const ToolRef = useRef();

    useImperativeHandle(ref, () =>
    (
      {
        handleToolDelete: (id,data) => {
        //   setToolDialog(true) 
          setTimeout(()=>{
            ToolRef.current.handleToolDelete(data)
          },200)
        }, 
        handleEditToolDialogOpen: (data) => { 
        //   setToolDialog(true);
          setTimeout(()=>{
            ToolRef.current.handleToolDialogOpen(data)
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
            <NewTool 
            ref={ToolRef}
            ToolList={props.ToolList}
            refreshTable={props.refreshTable}
            dialogMode={props.dialogMode}
            handleToolDialogClose={handleToolDialogClose} 
            AssetTypeData={props.AssetTypeData}/>
        </ModalNDL>
    )
})
export default Toolmodal;