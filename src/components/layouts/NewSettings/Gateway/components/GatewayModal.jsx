import React from 'react'; 
import ModalNDL from 'components/Core/ModalNDL'; 
import NewGateway from './Newgateway'
const Gatewaymodal= React.forwardRef((props, ref) => {  

    function handleEntityDialogClose(){
        props.handleDialogClose()
    }
    
    return(
        <ModalNDL disableEnforceFocus onClose={handleEntityDialogClose}  aria-labelledby="entity-dialog-title" open={props.GatewayDialog}>
            <NewGateway
             GatewayDialog={props.GatewayDialog}
            dialogMode={props.dialogMode}    
            headPlant={props.headPlant}       
            handleDialogClose={() => props.handleDialogClose()}      
            triggerTableData={props.triggerTableData}
            editValue={props.editValue}
            GateWayData={props.GateWayData}
            Instrumentarray={props.Instrumentarray}
            
                        />
        </ModalNDL>
    )
})
export default Gatewaymodal;