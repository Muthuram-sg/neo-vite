import React from "react"; 
import Button from "components/Core/ButtonNDL";
import { useTranslation } from 'react-i18next'; 
import ModalNDL from 'components/Core/ModalNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL"; 


export default function ConfirmDelete(props) { 
    const { t } = useTranslation();
     
    const handleDeleteDialogClose=()=>{
        props.handleDeleteDialogClosefn()
    }
    const triggerDeleteDefects=()=>{
        props.triggerDeleteDefectsfn()
    }
    return (
        <React.Fragment> 
            <ModalNDL open={props.deleteDigalog} onClose={handleDeleteDialogClose} size="lg"> 
                <ModalHeaderNDL>
                <TypographyNDL variant="heading-02-xs" model value={ t('DeleteEntities')}/>           
                </ModalHeaderNDL>
                <ModalContentNDL>
                <TypographyNDL  variant='paragraph-s' color='secondary'value={`${t("Do you really want to delete the defect")} ${props.defectName} ${t('NotReversible')}`} />
                </ModalContentNDL>
                <ModalFooterNDL>
                    <Button type="secondary" value={t('Cancel')}  id='reason-update'   onClick={() => handleDeleteDialogClose()}/>
                    <Button type="primary" danger value={t('Delete')} id='reason-update'   onClick={() => triggerDeleteDefects()}/>
               
                </ModalFooterNDL>
            </ModalNDL> 
        </React.Fragment>
    )
}