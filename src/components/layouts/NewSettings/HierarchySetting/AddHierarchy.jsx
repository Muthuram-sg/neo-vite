import React, { useState,forwardRef, useImperativeHandle, useRef } from 'react'; 
import Button from 'components/Core/ButtonNDL';
import InputFieldNDL from 'components/Core/InputFieldNDL';
import { useTranslation } from 'react-i18next';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL"; 



const AddHierarchy = forwardRef((props,ref)=>{
    const { t } = useTranslation();
    const nameRef = useRef();
    const [hierarchy,setHierarchy] = useState(null);

   
    useImperativeHandle(ref,()=>({
        openDialog:(hier)=>{ handleDialogOpen(hier)},
    
    }))
    const handleDialogOpen = (hier) =>{  
        nameRef.current.value= hier.name
        setHierarchy(hier.hierarchy ? hier.hierarchy : '')
    }
    const handleDialogHieClose=()=>{
        props.handleDialogHieClose() 
        setHierarchy('')
    }

    return (
        <React.Fragment>
            <ModalHeaderNDL>
            <TypographyNDL variant="heading-02-xs" model value={t('Create') + t('Hierarchy')}/>        
               
            </ModalHeaderNDL>
            <ModalContentNDL>
            <InputFieldNDL label='Hierarchy Name' placeholder={t("Enter hierarchy name")} inputRef={nameRef}  helperText={"This will appear in the overview"} /> 
            
            </ModalContentNDL>
            <ModalFooterNDL>
            <Button type='secondary'  onClick={handleDialogHieClose} value={t('Cancel')}/> 
                {
                hierarchy ?
                    <Button value={t('Create')}  onClick={() => props.addDuplicateHierarchy(nameRef.current.value,hierarchy)} /> : <Button value={t('Create')}  onClick={() => props.addNewHierarchy(nameRef.current.value)} />

                } 
            </ModalFooterNDL>
            </React.Fragment>
    )
})
export default AddHierarchy;