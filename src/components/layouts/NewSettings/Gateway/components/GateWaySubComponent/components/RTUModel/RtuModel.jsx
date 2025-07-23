import React, { useState, useImperativeHandle,forwardRef,useRef } from "react";
import ModalNDL from "components/Core/ModalNDL";
import RTUConfiguration from "./RtuConfiguration";




const RTUModel = forwardRef((props,ref) => {
    const [RTUDialog, setRTUDialog] = useState(false);
    const [openDialogMode,setopenDialogMode] = useState('create')

    const AddRTUref = useRef();
    useImperativeHandle(ref, () =>
    (
        {
            handleRTUDialogAdd: () => {
                setRTUDialog(true)
                setopenDialogMode("create")
                setTimeout(() => {
                    AddRTUref.current.handleRTUDialogAdd()
                }, 200)
            },
            handleRTUDialogEdit:(id,value)=>{
                setopenDialogMode("edit")
                setRTUDialog(true)
                setTimeout(() => {
                    AddRTUref.current.handleRTUDialogEdit(id,value)
                }, 200)
            },
            handleRTUDialogDelete:(id,value)=>{
                setopenDialogMode("delete")
                setRTUDialog(true)
                setTimeout(() => {
                    AddRTUref.current.handleRTUDialogDelete(id,value)
                }, 200)
            }

        }
    )
    )

    function handleRTUDialogClose(){
        setRTUDialog(false)
    }
    return (
        <ModalNDL open={RTUDialog}>

            <RTUConfiguration ref={AddRTUref} removedCom={props.removedCom} TriggerRTU={props.TriggerRTU} path ={props.path} handleRTUDialogClose={handleRTUDialogClose} openDialogMode={openDialogMode} />

        </ModalNDL>

    )
}
)


export default RTUModel;