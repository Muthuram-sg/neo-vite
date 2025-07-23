import React, {  useState, useImperativeHandle,forwardRef,useRef } from "react";
import ModalNDL from "components/Core/ModalNDL";
import TCPConfiguration from "./TCPConfiguration";




const TCPModel = forwardRef((props,ref) => {
    const [TCPDialog, setTCPDialog] = useState(false);
    const [openDialogMode,setopenDialogMode] = useState('create')
    const AddTCPref = useRef();
    useImperativeHandle(ref, () =>
    (
        {
            handleTCPDialogAdd: () => {
                setTCPDialog(true)
                setopenDialogMode("create")
                setTimeout(() => {
                    AddTCPref.current.handleTCPDialogAdd()
                }, 200)
            },

            handleTCPDialogEdit:(id,value)=>{
                setTCPDialog(true)
                setopenDialogMode("edit")
                setTimeout(() => {
                    AddTCPref.current.handleTCPDialogEdit(id,value)
                }, 200)
            },
            handleTCPDialogDelete:(id,value)=>{
                setTCPDialog(true)
                setopenDialogMode("delete")
                setTimeout(() => {
                    AddTCPref.current.handleTCPDialogDelete(id,value)
                }, 200)
            },

        }
    )
    )

    function handleTCPDialogClose(){
        setTCPDialog(false)
    }
    return (
        <ModalNDL open={TCPDialog}>

            <TCPConfiguration ref={AddTCPref}  path={props.path} TriggerTCP={props.TriggerTCP} handleTCPDialogClose={handleTCPDialogClose} openDialogMode={openDialogMode} />

        </ModalNDL>

    )
}
)


export default TCPModel;