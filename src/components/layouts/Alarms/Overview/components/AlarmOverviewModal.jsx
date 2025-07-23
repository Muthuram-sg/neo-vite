/* eslint-disable no-unused-vars */
import React, { useState, useRef, useImperativeHandle } from 'react';
import ModalNDL from 'components/Core/ModalNDL';
import ActionModal from './ActionModal';
import { useRecoilState } from "recoil";
import { snackToggle } from "recoilStore/atoms";


const AlarmOverviewModel = React.forwardRef((props, ref) => {
    const [modalDialog, setModalDialog] = useState(false);
    const [dialogMode,setDialogMode] = useState('') 
    const [, setOpenSnack] = useRecoilState(snackToggle);

    const ActionModalRef = useRef();

    useImperativeHandle(ref, () =>
    (
        { 
            handleTrend : (data, EntityName, instrumentName) =>{
                setOpenSnack(false)
                setModalDialog(true)
                setDialogMode('trend')
                console.log("menuItemClick", data)
                setTimeout(() => {
                    ActionModalRef.current.getTrendgraph(data, EntityName, instrumentName, "trend")
                }, 200)
            },
            handleAcknowledge:(data, line_id, OverviewTypes, metricAlarm, alarmStatus, type)=>{
                setOpenSnack(false)
                setModalDialog(true)
                setDialogMode('Acknowledge')
                setTimeout(() => {
                    ActionModalRef.current.handleAcknowledge(data, line_id, OverviewTypes, metricAlarm, alarmStatus, "Acknowledge", type)
                }, 200)
            },
            handleCreateTask:(data, EntityName, instrumentName, EntityID)=>{
                setOpenSnack(false)
                setModalDialog(true)
                setDialogMode('CreateTask')
                setTimeout(() => {
                    ActionModalRef.current.handleCreateTask(data, EntityName, instrumentName, EntityID, "CreateTask")
                }, 200)
            },
            handleAlarmOverviewDialogClose: () => {
                handleAlarmOverviewDialogClose()
            }
        }
    )
    )

    function handleAlarmOverviewDialogClose() {
        setModalDialog(false)
    }

    return (
        <ModalNDL 
        onClose={() => handleAlarmOverviewDialogClose()} 
        width={dialogMode === "trend" ? "90%" : undefined} 
        open={modalDialog}
        >
            <ActionModal 
            handleAlarmOverviewDialogClose={handleAlarmOverviewDialogClose} handleSaveAlarmAcknowlwdgement={(data, alarmAcknowledge, chkAcknowledge)=>props.handleSaveAlarmAcknowlwdgement(data,alarmAcknowledge,chkAcknowledge)}
            ref={ActionModalRef} 
            />
        </ModalNDL>
    )
})
export default AlarmOverviewModel;