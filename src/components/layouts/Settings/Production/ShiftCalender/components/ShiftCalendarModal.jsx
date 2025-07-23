import React, { useState, useRef, useImperativeHandle } from "react";
import ModalNDL from "components/Core/ModalNDL";
import AddShiftCalendar from "./AddShiftCalendar";
import { useRecoilState } from "recoil";
import { snackToggle } from "recoilStore/atoms";

const ShiftCalendarModal = React.forwardRef((props, ref) => {
    const AddShiftCalendarRef = useRef();
    const [shiftModel, setShiftModel] = useState(false)
    const [, setOpenSnack] = useRecoilState(snackToggle);

    useImperativeHandle(ref, () =>
    (
        {
            handleShiftEdit: (data) => {
                setOpenSnack(false)
                setShiftModel(true);
                setTimeout(() => {
                    AddShiftCalendarRef.current.handleShiftEdit(data)
                }, 200)

            }
        }
    ))

    function handleShiftDialogClose() {
        setShiftModel(false)
    }

    return (
        <ModalNDL open={shiftModel}>
            <AddShiftCalendar
                handleDialogClose={handleShiftDialogClose}
                ref={AddShiftCalendarRef}
                headPlant={props.headPlant}
                shiftData={props.shiftData}
                getShiftList={props.getShiftList}
                getupdateshiftwithoutID={props.getupdateshiftwithoutID}
            />
        </ModalNDL>
    )
})
export default ShiftCalendarModal;