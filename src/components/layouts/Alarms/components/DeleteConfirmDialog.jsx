import React,{useState,useEffect,useImperativeHandle,forwardRef} from 'react';
import Button from 'components/Core/ButtonNDL';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import { snackToggle, snackMessage, snackType } from 'recoilStore/atoms';
import useDeleteAlarm from 'components/layouts/Alarms/hooks/useDeleteAlarm';
import useDeleteConnectivity from 'components/layouts/Alarms/hooks/useDeleteConnectivity';
import ModalNDL from 'components/Core/ModalNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL"; 

const DeleteConfirmDialog = forwardRef((props,ref)=>{
    const [openDialog,setOpenDialog] = useState(false);
    const [name,setName] = useState(false);
    const [alarmID,setAlarmID] = useState('');
    const [type,setType] =useState('');
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [, setOpenSnack] = useRecoilState(snackToggle); 
    const { t } = useTranslation();
    const { DeleteAlarmLoading,  DeleteAlarmData , DeleteAlarmError,getDeleteAlarm } = useDeleteAlarm()
    const{deleteConnectivityLoading, deleteConnectivityData, deleteConnectivityError, deleteConnectivity} = useDeleteConnectivity()
    useImperativeHandle(ref,()=>({
        openDialog: (value)=>{
            if(value.alertType ==="alert" || value.alertType ==="timeslot" || value.alertType ==="connectivity" || value.alertType ==="downtime" || value.alertType ==="tool" ){
                setType(value.alertType)
                setOpenDialog(true)
                setName(value.name)
                setAlarmID(value.id)
            }
           
          
        }
    }))
    useEffect(()=>{
        if( !DeleteAlarmLoading && DeleteAlarmData && !DeleteAlarmError){
          SetType('success');
          SetMessage(t('Alarm Rules Deleted'));
          setOpenSnack(true);
          setOpenDialog(false)
          props.getAlarmList();
        }
        if( DeleteAlarmLoading && !DeleteAlarmData && DeleteAlarmError){
          SetMessage(t("Alarm Deleting has failed"));
          setOpenSnack(true); SetType('error');
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[DeleteAlarmData])
      useEffect(()=>{
        if(!deleteConnectivityLoading && deleteConnectivityData && !deleteConnectivityError ){
          SetType('success');
          SetMessage(t('Alarm Rules Deleted'));
          setOpenSnack(true);
          setOpenDialog(false)
          props.getAlarmList();
        }
        if(deleteConnectivityLoading && !deleteConnectivityData && !deleteConnectivityError){
          SetMessage(t("Alarm Deleting has failed"));
          setOpenSnack(true); SetType('error');
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[deleteConnectivityData])

      
      
     
    const handlDialogClose = () =>{
        setOpenDialog(false);
    }
    const removeAlarm = (id)=>{
        getDeleteAlarm([id])
        }

        const removeConnectivity =(id)=>{
            deleteConnectivity(id)
        }
       
      
    return(
        <ModalNDL onClose={handlDialogClose} maxWidth={"md"} aria-labelledby="entity-dialog-title" open={openDialog}>
            <ModalHeaderNDL>
                <TypographyNDL id="entity-dialog-title" variant="heading-02-xs" model value={t("DeleteEntities")} />
            </ModalHeaderNDL>
            <ModalContentNDL>
                <TypographyNDL value={`${t('Do you really want to delete the Alarm')} ${name} ? this action cannot be undone.`} variant='paragraph-s' color='secondary' />
            </ModalContentNDL>
            <ModalFooterNDL>
                <Button value={t('Cancel')} type='secondary'  onClick={() => { handlDialogClose() }} />
                <Button value={t('Delete')} type="primary" danger style={{ marginLeft: 8 }} onClick={type === "connectivity" ?() => {removeConnectivity(alarmID) }  : () => {removeAlarm(alarmID) }} />
           
            </ModalFooterNDL>
        </ModalNDL> 
    )
})
export default DeleteConfirmDialog;