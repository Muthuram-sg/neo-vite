import React, {useState, useRef } from "react";
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import { useTranslation } from 'react-i18next';
import InputFieldNDL from "components/Core/InputFieldNDL";
import Button from "components/Core/ButtonNDL";
import Toast from "components/Core/Toast/ToastNDL";



export default function AddReasonTagModel(props){
    const { t } = useTranslation();
    const [toast,setToast] = useState(false)
    const [notag,setnoTag] = useState(false)
const tagref = useRef()



const saveTag =()=>{
    let ids;
    const tag = tagref.current.value;
    if(tag ===""){
        setnoTag(true)
    }else{
        if (props.selectedReason === "Downtime" && props.CheckDatadt) {
            ids = "17";
        } else if (props.selectedReason === "Downtime" && !props.CheckDatadt) {
            ids = "3";
        } else if (props.selectedReason === "Quality" && props.CheckDatadt) {
            ids = "2";
        } else if (props.selectedReason === "Quality" && !props.CheckDatadt) {
            ids = "18";
        } else if (props.selectedReason === "Performance") {
            ids = "16";
        } else if (props.selectedReason === "Others") {
            ids = "10";
        }


        var present = props.Reasontags.findIndex(val => val.reason_tag.toLowerCase() === tag .trim().toLowerCase())
        if (present >= 0 || tag  ==="")
            setToast(true);
        else 
            // getAddReasonTag(tag , props.user, props.headPlant, ids)
            props.saveTag(tag,ids)
        }
    
}

    return(
        <React.Fragment>
            <Toast type={'warning'} message={'Tag name already exists'} toastBar={toast}  handleSnackClose={() => setToast(false)} ></Toast>
        <ModalHeaderNDL>
        <TypographyNDL variant="heading-02-xs" model value={'Add Tag'}/>           
        </ModalHeaderNDL>
        <ModalContentNDL> 
            <InputFieldNDL
                id="tagname"
                placeholder={t('Tag')}
                inputRef={tagref}
                label={t('Tag')}
                error={notag}
                helperText={'Please enter tag name'}
                mandatory
            /> 

        </ModalContentNDL>
        <ModalFooterNDL>
            <Button type="secondary"  value={t('Cancel')} onClick={props.handleTagDialogClose}/>
            <Button type="primary"   value={t('Save')} loading={props.AddReasonTagLoading} onClick={saveTag}/>
        </ModalFooterNDL>
        </React.Fragment>
    )
}