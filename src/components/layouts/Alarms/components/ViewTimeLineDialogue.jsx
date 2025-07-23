import React, { useState, useImperativeHandle, forwardRef } from 'react';
import ModalNDL from 'components/Core/ModalNDL';
import HistoryModel from './HistoryModel';

const ViewTimeLineDialogue = forwardRef((props, ref) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [name, setName] = useState(null);
    const [metric, setMetric] = useState(null); 
    const [id, setId] = useState(null);

    useImperativeHandle(ref, () => ({
        openDialog: (value) => {
            if (value.alertType === "alert" || value.alertType === "timeslot" || value.alertType === "connectivity" || value.alertType === "tool") {
                setOpenDialog(true);
                setName(value.instrument_name); 
                setMetric(value.instruments_metric.metric.title);
                setId(value.id); 
            }
        }
    }));

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    return (
        <ModalNDL onClose={handleDialogClose} maxWidth={"md"} aria-labelledby="entity-dialog-title" open={openDialog}>
            <HistoryModel name={name} metric={metric} id={id} onClose={handleDialogClose} />
        </ModalNDL>
    );
});

export default ViewTimeLineDialogue;
