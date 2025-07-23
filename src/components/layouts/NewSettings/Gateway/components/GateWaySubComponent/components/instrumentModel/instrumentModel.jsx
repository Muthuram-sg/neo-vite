import React, {  useState, useImperativeHandle, forwardRef, useRef } from "react";
import ModalNDL from "components/Core/ModalNDL";
import InstrumentConfiguration from "./instrumentConfiguration";




const InstrumentModel = forwardRef((props, ref) => {
    const [InstrumentDialog, setInstrumentDialog] = useState(false);
  const [dialogMode,setdialogMode] = useState(false)

    const AddInstrumentref = useRef();
    useImperativeHandle(ref, () =>
    (
        {
            handleFormulaCrudDialogEdit: (id, data) => {
                setInstrumentDialog(true)
                setdialogMode("edit")
                setTimeout(() => {
                    AddInstrumentref.current.handleFormulaCrudDialogEdit(id, data)
                }, 200)
            },
            handleFormulaCrudDialogDelete:(id,data)=> {
                setInstrumentDialog(true)
                setdialogMode("delete")

                setTimeout(() => {
                    AddInstrumentref.current.handleFormulaCrudDialogDelete(id, data)
                }, 200)
            },

        }
    )
    )

    function handleInstrumentDialogClose() {
        setInstrumentDialog(false)
    }

    return (
        <ModalNDL open={InstrumentDialog}>

            <InstrumentConfiguration
                ref={AddInstrumentref}
                path={props.path}
                getGateWayInstrumentConfig={props.getGateWayInstrumentConfig}
                GateWayConfigData={props.GateWayConfigData}
                GateWayId={props.GateWayId}
                handleInstrumentDialogClose={handleInstrumentDialogClose}
                rtulist ={props.rtulist}
                tcplist={props.tcplist}
                dialogMode={dialogMode}
                />
                

        </ModalNDL>

    )
}
)


export default InstrumentModel;