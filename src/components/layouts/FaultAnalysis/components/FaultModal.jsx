/* eslint-disable no-unused-vars */
import React, { useState, useRef, useImperativeHandle, useEffect } from 'react';
import ModalNDL from 'components/Core/ModalNDL';
import ActionModal from './ActionModal';

const FaultModal = React.forwardRef((props, ref) => {
    const [modalDialog, setModalDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState('');
    const [ackType, setAckType] = useState(-1);

    const ActionModalRef = useRef();

    useImperativeHandle(ref, () => ({
        handleFaultDialog: (val) => {
            setModalDialog(val);
        },

        handleFFTDialog: (instrument, instrument_name, asset_name, ffttrends) => {
            setModalDialog(true);
            setDialogMode('fft');
            setTimeout(() => {
                ActionModalRef.current.getTrends(instrument, instrument_name, asset_name, "fft", ffttrends);
            }, 200);
        },        
        handleRemarks: (instrument, instrument_name, asset_name, ackCount) => {
            setAckType(props.ackType)
            setModalDialog(true);
            setDialogMode('remarks');
            setTimeout(() => {
                ActionModalRef.current.getRemarks(instrument, instrument_name, asset_name, ackCount, "remarks");
            }, 200);
        },
        handleTrend: (instrument, instrument_name, asset_name) => {
            let matchedFault = instrument
            if(instrument.RecentAlarmAt){
                matchedFault = props.fault.find(fault => 
                    fault.iid === instrument.iid && fault.metrics === instrument.Metrics
                );
            }
            setModalDialog(true);
            setDialogMode('trend');
            setTimeout(() => {
                ActionModalRef.current.getTrendgraph(matchedFault, instrument_name, asset_name, "trend");
            }, 200);
        },
        handleCreateTask: (instrumentdata, value) => {
            setModalDialog(true);
            setDialogMode('createtask');
            setTimeout(() => {
                ActionModalRef.current.getCreateTask(instrumentdata, value, "createtask");
            }, 200);
        }
    }));

    function handleSaveFaultAcknowlwdgement(data, ischecked) {
        props.handleSaveFaultAcknowlwdgement(data, ischecked);
        setModalDialog(false);
    }

    function handleFaultDialogClose() {
        setModalDialog(false);
    }

    return (
        <ModalNDL onClose={handleFaultDialogClose} width={dialogMode === 'remarks' ? undefined : "86%"} height={dialogMode === 'remarks' ? undefined : ""} open={modalDialog}>
            <ActionModal 
                handleFaultDialogClose={handleFaultDialogClose} 
                ref={ActionModalRef} 
                handleSaveFaultAcknowlwdgement={handleSaveFaultAcknowlwdgement}
                ackType={ackType}
            />
        </ModalNDL>
    );
});
export default FaultModal;
