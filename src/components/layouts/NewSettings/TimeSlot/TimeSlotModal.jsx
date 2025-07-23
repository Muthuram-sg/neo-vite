import React, { useState, useRef, useImperativeHandle } from 'react';
import AddTimeslot from './AddTimeslot'
import { useRecoilState } from "recoil";
import { snackToggle } from "recoilStore/atoms";
const TimeslotModal = React.forwardRef((props, ref) => {
    const AddTimeslotRef = useRef();
    const [, setAddTimeslotDialog] = useState(false);//NOSONAR
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

            },
            handleTimeslotSave:()=>{
                setTimeout(() => {
                    AddTimeslotRef.current.handleTimeslotSave()
                }, 200) 
            }
        }
    ))

    function handleTimeDialogClose() {
        setAddTimeslotDialog(false)
    }
// NOSONAR start - Design working fine
    return (
            <AddTimeslot
                handleTimeDialogClose={handleTimeDialogClose}
                ref={AddTimeslotRef}
                headPlant={props.headPlant}//NOSONAR
                timeslots={props.timeslots}//NOSONAR
                getTimeslotList={props.getTimeslotList}//NOSONAR
                getupdatetimeslot={props.getupdatetimeslot}//NOSONAR
            />
    )
    // NOSONAR end - Design working fine
})
export default TimeslotModal;