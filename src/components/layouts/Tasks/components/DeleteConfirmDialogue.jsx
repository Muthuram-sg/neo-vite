import React,{useState,useEffect,useImperativeHandle,forwardRef} from 'react';
import Button from 'components/Core/ButtonNDL';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import { snackToggle, snackMessage, snackType } from 'recoilStore/atoms';
import useDeleteTask from '../hooks/useDeleteTask';
import ModalNDL from 'components/Core/ModalNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL"; 
const DeleteConfirmDialogue = forwardRef((props,ref)=>{
    const [openDialog,setOpenDialog] = useState(false);
    const [name,setName] = useState(false);
    const [,setDeleteFiles] = useState([]);
    const [taskID,setTaskID] = useState('');
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [, setOpenSnack] = useRecoilState(snackToggle); 
    const {  DeleteTaskLoading, DeleteTaskData, DeleteTaskError, getDeleteTask } = useDeleteTask() 
    const { t } = useTranslation();
    
    useImperativeHandle(ref,()=>({
        openDialog: (value)=>{
            const files = value?value.tasksAttachements.map(val => val.image_path):[];
            setDeleteFiles(files);
            setOpenDialog(true)
            setName(value.task_id)
            setTaskID(value.id)
        }
    }))
    useEffect(()=>{
        if(!DeleteTaskLoading && !DeleteTaskError && DeleteTaskData){
            props.getTaskList(); 
            SetMessage(t(`Task deleted succesfully`))
            SetType("success")
            setOpenSnack(true);
            setOpenDialog(false)
        }
        if(!DeleteTaskData && !DeleteTaskLoading && DeleteTaskError){ 
            SetMessage(t(`Task delete failed`))
            SetType("warning")
            setOpenSnack(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[DeleteTaskData])
    const handlDialogClose = () =>{
        setOpenDialog(false);
    }
    const removeTask = (id)=>{ getDeleteTask(id)}
    return(
        <React.Fragment>
        <ModalNDL onClose={handlDialogClose}  aria-labelledby="entity-dialog-title" open={openDialog}>
            <ModalHeaderNDL>
            <TypographyNDL id="entity-dialog-title" variant="heading-02-s" model value={t("Delete Task")} />
                </ModalHeaderNDL>
                <ModalContentNDL>
                <TypographyNDL  value={`${t('Do you really want to delete the task')} ${name} ${t('NotReversible')}`} variant="lable-01-s" />
                </ModalContentNDL>
            <ModalFooterNDL>
                <Button type={"ghost"} value={t('NoCancel')} style={{ marginTop: 10, marginBottom: 10 }} onClick={() => { handlDialogClose() }} />
                <Button danger value={t('YesDelete')} style={{ marginTop: 10, marginBottom: 10, marginRight: 10 }} onClick={() => { removeTask(taskID) }} />
            
            </ModalFooterNDL>
        </ModalNDL>
        </React.Fragment>
    )
})
export default DeleteConfirmDialogue;