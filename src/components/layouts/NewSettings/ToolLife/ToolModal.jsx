import React,{useRef,useImperativeHandle} from 'react'; 
import ModalNDL from 'components/Core/ModalNDL'; 
import NewTool from './Newtool'
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
          setTimeout(()=>{
            ToolRef.current.handleToolDialogOpen(data)
          },200)
          
        }
      }
    )
    )

    function handleToolDialogClose(){
      // NOSONAR  -  skip
        props.handleToolDialogClose()//NOSONAR
    }
    
    // NOSONAR start -  skip
    return(
        <ModalNDL disableEnforceFocus onClose={handleToolDialogClose}  aria-labelledby="Tool-dialog-title" 
        
        open={props.ToolDialog}//NOSONAR
        >
          
            <NewTool 
            ref={ToolRef}
            ToolList={props.ToolList}//NOSONAR
            refreshTable={props.refreshTable}//NOSONAR
            dialogMode={props.dialogMode}//NOSONAR
            handleToolDialogClose={handleToolDialogClose} //NOSONAR
            AssetTypeData={props.AssetTypeData}/>
        </ModalNDL>
    )
    // NOSONAR  end -  skip
})
export default Toolmodal;