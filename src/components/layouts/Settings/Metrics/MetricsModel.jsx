import React, { useState, useRef, useImperativeHandle } from 'react';
import ModalNDL from 'components/Core/ModalNDL';
import AddMetrics from "./AddMetrics"

const MetricsModel = React.forwardRef((props, ref) => {
    const [metricsDialog, setMetricsDialog] = useState({ open: false, type: "" });

    const dialogRef = useRef();

    useImperativeHandle(ref, () => ({
        openDialog: () => {
            setMetricsDialog({ open: true, type: 'create' })
            setTimeout(() => {
                dialogRef.current.openDialog()
            }, 200)
        },
        editDialog: (val) => {
            setMetricsDialog({ open: true, type: 'edit' });
            setTimeout(() => {
                dialogRef.current.editDialog(val)
            }, 200)
        }
    }))


    function handleMetricDialogClose() {
        setMetricsDialog({ open: false, type: "" });
    }


    return (
        <ModalNDL open={metricsDialog.open}>
            <AddMetrics
                handleMetricDialogClose={handleMetricDialogClose}
                ref={dialogRef}
                metricsList={props.metricsList}
                metricsListData={props.metricsListData}
            />

        </ModalNDL>
    )

}
)


export default MetricsModel;
