import React from 'react';
import ModalNDL from 'components/Core/ModalNDL';
import AddPartSteelData from './AddPartSteelData'
function SteelModalDialog(props){
    return(
        <ModalNDL  onClose={props.handleAddDataDialogClose} maxWidth={"xs"} open={props.addDataDialog}>
            <AddPartSteelData
                    addDataDialog={props.AddDataDialog}
                    handleAddDataDialogClose={props.handleAddDataDialogClose}
                    ref={props.AddPartSteelDataRef}
                    SteelForm={props.SteelForm}
                    partTime={props.partTime}
                    openNotification={props.openNotification}
                    isEdit={props.isEdit}
                    configData={props.configData}
                    treiggerOEE={props.treiggerOEE}
                    entity_id={props.entity_id}
                    latestData={props.latestData}
                    getLatestSteelData={props.getLatestSteelData}
            />
        </ModalNDL>
    )
}
const isRender = (prev, next) => {
    return prev.addDataDialog !== next.addDataDialog ? false : true
}
const SteelModal = React.memo(SteelModalDialog, isRender)
export default SteelModal;
