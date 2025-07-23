import React, { useState, useRef, useImperativeHandle } from 'react';
import ModalNDL from 'components/Core/ModalNDL';
import EditContract from './EditContract'

const EditContractModal = React.forwardRef((props, ref) => {
    const ContractRef = useRef();
    const [addEnergyDialog, setEnergyDialog] = useState(false);

    useImperativeHandle(ref, () =>
    (
        {
            handleContractEdit: (data) => {
                setEnergyDialog(true);
                setTimeout(() => {
                    ContractRef.current.handleContractEdit(data)
                }, 200)

            }
        }
    ))

    function handleTimeDialogClose() {
        setEnergyDialog(false)
    }

    return (
        
        <ModalNDL open={addEnergyDialog} width={'1200px'}>
            <EditContract
                handleTimeDialogClose={handleTimeDialogClose}
                ref={ContractRef}
                headPlant={props.headPlant}
                getSavedLineDetails={props.getSavedLineDetails}
                CommunicationChannel={props.CommunicationChannel}
            />
        </ModalNDL>
    )
})
export default EditContractModal;