import React,{forwardRef} from 'react';
import ModalNDL from 'components/Core/ModalNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL"; 
import { useTranslation } from 'react-i18next';
import Button from 'components/Core/ButtonNDL';


const DeleteConfirmDialog = forwardRef((props,ref)=>{
    const { t } = useTranslation();
    const handleDialogClose =()=>{
        props.handleDialogClose()
    }
return(
    <ModalNDL onClose={handleDialogClose} maxWidth={"md"} aria-labelledby="entity-dialog-title" open={props.openDialog}>
        <ModalHeaderNDL>
            <TypographyNDL id="entity-dialog-title" variant="heading-02-xs" model value={t("Are you sure want to delete ?")} />
        </ModalHeaderNDL>
        <ModalContentNDL>
            <TypographyNDL variant='paragraph-s' color='secondary' value={`Do you really want to delete the ${props.name} hierarchy ? This action cannot be undone`} />
        </ModalContentNDL>
        <ModalFooterNDL>
            <Button value={t('Cancel')}  type="secondary" onClick={() => { handleDialogClose() }} />
            <Button value={t('Delete')} loading={props.deleteHierarchyLoading} danger  onClick={()=>props.deleteHierarhy()} />
       
        </ModalFooterNDL>
    </ModalNDL> 
)
})
export default DeleteConfirmDialog;