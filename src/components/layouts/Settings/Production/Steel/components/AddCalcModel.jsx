import React, { useState, useRef, useImperativeHandle } from 'react';
import ModalNDL from 'components/Core/ModalNDL';
import AddCalculations from './AddCalculations'
import { useRecoilState } from "recoil";
import {  snackToggle} from "recoilStore/atoms";

const AddCalcModel = React.forwardRef((props, ref) => {
    const AddCalculationsRef = useRef();
    const [addCalcDialog, setAddCalcDialog] = useState(false);
    const [, setOpenSnack] = useRecoilState(snackToggle);
  
    useImperativeHandle(ref, () =>
    (
        {
            handleAddCalcDialog: (data) => {
                setOpenSnack(false)
                setAddCalcDialog(true)
                setTimeout(() => {
                    AddCalculationsRef.current.handleAddCalcDialog(data)
                }, 200)
            },
            handleDeleteDialogOpen: (data) => {
                setOpenSnack(false)
                setAddCalcDialog(true);
                setTimeout(() => {
                    AddCalculationsRef.current.handleDeleteDialogOpen(data)
                }, 200)

            },
            handleEditDialogOpen: (data) => {
                setOpenSnack(false)
                setAddCalcDialog(true);
                setTimeout(() => {
                    AddCalculationsRef.current.handleEditDialogOpen(data)
                }, 200)

            },
            handleConfirmDialogOpen: (data) => {
                setOpenSnack(false)
                setAddCalcDialog(true);
                setTimeout(() => {
                    AddCalculationsRef.current.handleConfirmDialogOpen(data)
                }, 200)

            }
        }
    ))

    function handleAddCalcDialogClose() {
        setAddCalcDialog(false)
    }

    return (
        <React.Fragment>
            <ModalNDL open={addCalcDialog} size="lg">
                <AddCalculations
                    handleAddCalcDialogClose={handleAddCalcDialogClose}
                    ref={AddCalculationsRef}
                    getUpdatedSteelAssetConfig={(id) => props.getUpdatedSteelAssetConfig(id)}
                    setHandleCancelClick={() => props.setHandleCancelClick()}
                    handleSnackbar={(type,message) => props.handleSnackbar(type,message)}
                />
            </ModalNDL>
        </React.Fragment>
    )
})
export default AddCalcModel;