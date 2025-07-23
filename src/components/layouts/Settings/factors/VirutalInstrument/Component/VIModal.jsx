import React, { useState, useRef, useImperativeHandle } from 'react';
import ModalNDL from 'components/Core/ModalNDL';
import AddVirutalInstrument from './AddVirutalInstrument'
import { useRecoilState } from "recoil";
import { snackToggle } from "recoilStore/atoms";
const VIModal = React.forwardRef((props, ref) => {
    const AddInstrumentRef = useRef();
    const [addVIMDialog, setAddVIMDialog] = useState(false);
    const [, setOpenSnack] = useRecoilState(snackToggle);

    useImperativeHandle(ref, () =>
    (
        {
            handleFormulatDialogAdd: () => {
                setOpenSnack(false)
                setAddVIMDialog(true)
                setTimeout(() => {
                    AddInstrumentRef.current.handleFormulatDialogAdd()
                }, 200)
            },
            handleFormulaCrudDialogDelete: (data) => {
                setOpenSnack(false)
                setAddVIMDialog(true);
                setTimeout(() => {
                    AddInstrumentRef.current.handleFormulaCrudDialogDelete(data)
                }, 200)

            },
            handleFormulaCrudDialogEdit: (data) => {
                setOpenSnack(false)
                setAddVIMDialog(true);
                setTimeout(() => {
                    AddInstrumentRef.current.handleFormulaCrudDialogEdit(data)
                }, 200)

            }
        }
    ))

    function handleAddVIMDialogClose() {
        setAddVIMDialog(false)
    }

    return (
        <ModalNDL open={addVIMDialog}>
            <AddVirutalInstrument
                handleAddVIMDialogClose={handleAddVIMDialogClose}
                ref={AddInstrumentRef}
                headPlant={props.headPlant}
                getVIList={props.getVIList}
            />
        </ModalNDL>
    )
})
export default VIModal;