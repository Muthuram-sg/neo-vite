import React,{useRef,useState,useEffect,useImperativeHandle,forwardRef} from 'react';
import Button from 'components/Core/ButtonNDL';
import InputFieldNDL from 'components/Core/InputFieldNDL';
import { useTranslation } from 'react-i18next';
import useAddPriority from '../hooks/useAddPriority';
import { useRecoilState } from 'recoil';
import { snackToggle, snackMessage, snackType } from 'recoilStore/atoms';
import ModalNDL from 'components/Core/ModalNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL"; 

const CreatePriority = forwardRef((props,ref)=>{
    const [openDialog,setOpenDialog] = useState(false);
    const [isName,setIsName] = useState(false);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const {  AddTaskPriorityLoading, AddTaskPriorityData, AddTaskPriorityError, getAddTaskPriority } = useAddPriority();
    const titleRef = useRef();
    const { t } = useTranslation();
    
    useImperativeHandle(ref,()=>({
        openDialog: (value)=>setOpenDialog(true)
    }))
    useEffect(()=>{
        if(AddTaskPriorityData && AddTaskPriorityData.length>0){
            props.refreshPriorityList();
            SetMessage(t(`Priority created succesfully`))
            SetType("success")
            setOpenSnack(true);
            setOpenDialog(false)
        }
        if(!AddTaskPriorityLoading && !AddTaskPriorityData && AddTaskPriorityError){
            SetMessage(t(`Priorty created failed`))
            SetType("warning")
            setOpenSnack(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[AddTaskPriorityData])
    const handlDialogClose = () =>{
        setOpenDialog(false);
    }
    const saveMaster = () =>{
        if(!titleRef.current.value){
            setIsName(true);
            return false
        }
        getAddTaskPriority(titleRef.current.value)
    }
    return(
        <ModalNDL onClose={handlDialogClose} aria-labelledby="task-add-type-dialog" open={openDialog}>
            <ModalHeaderNDL>
            <TypographyNDL value={t("Add Priority")}  variant="heading-02-s" model  />
            </ModalHeaderNDL>
            <ModalContentNDL>
            <InputFieldNDL
                id="ins-freq-val"
                label={t("Priority")} 
                onBlur={{}}
                inputRef={titleRef}
                required={true}
                placeholder={t('Enter Priority name')}
                error={isName}
                helperText={isName?t('Please enter Priority name'):undefined}
            />  
            </ModalContentNDL>
            <ModalFooterNDL>
                <Button type="secondary"  value={t('Cancel')} onClick={() => { handlDialogClose() }} />
                <Button type="primary" style={{width:"100px",marginLeft:"10px" }} value={t('Save')} onClick={() => saveMaster()} />
            
            </ModalFooterNDL>
        </ModalNDL>
    )
})
export default CreatePriority;