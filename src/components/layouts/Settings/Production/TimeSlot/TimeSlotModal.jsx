import React, { useState, useRef, useImperativeHandle } from 'react';
import ModalNDL from 'components/Core/ModalNDL';
import AddTimeslot from './AddTimeslot'
import { useRecoilState } from "recoil";
import { snackToggle } from "recoilStore/atoms";
const TimeslotModal = React.forwardRef((props, ref) => {
    const AddTimeslotRef = useRef();
    const [addTimeslotDialog, setAddTimeslotDialog] = useState(false);
    const [, setOpenSnack] = useRecoilState(snackToggle);

    useImperativeHandle(ref, () =>
    (
        {
            handleTimeslotEdit: (data) => {
                setOpenSnack(false)
                setAddTimeslotDialog(true);
                setTimeout(() => {
                    AddTimeslotRef.current.handleTimeslotEdit(data)
                }, 200)

            }
        }
    ))

    function handleTimeDialogClose() {
        setAddTimeslotDialog(false)
    }

    return (
        <ModalNDL open={addTimeslotDialog}  width={'800px'}>
            <AddTimeslot
                handleTimeDialogClose={handleTimeDialogClose}
                ref={AddTimeslotRef}
                headPlant={props.headPlant}
                timeslots={props.timeslots}
                getTimeslotList={props.getTimeslotList}
                getupdatetimeslot={props.getupdatetimeslot}
            />
        </ModalNDL>
    )
})
export default TimeslotModal;