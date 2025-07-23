import React,{useState,useImperativeHandle,useEffect,forwardRef} from 'react'; 
import ModalNDL from 'components/Core/ModalNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import Button from 'components/Core/ButtonNDL';
import useDeleteCalendarReport from '../hooks/useDeleteCalendarReport';
import { useRecoilState } from 'recoil';
import {snackToggle, snackMessage, snackType} from 'recoilStore/atoms';

const  DeleteCalendarReport=forwardRef((props,ref)=>{

    const [fileUploadDialog, setDialog] = useState(false);
    const [reportId,setreportId] = useState('')
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const { DeleteCalendarReportLoading, DeleteCalendarReportData, DeleteCalendarReportError, getDeleteCalendarReport} = useDeleteCalendarReport()





    useImperativeHandle(ref, () => ({
        openDialog: (id) => {
            setDialog(true);
            setreportId(id)
        },
      
    })) 



    useEffect(()=>{
        if(!DeleteCalendarReportLoading && DeleteCalendarReportData && !DeleteCalendarReportError){
            setOpenSnack(true)
            SetMessage('File Deleted Successfully')
            SetType('success')
            handleCloseDialog()
            props.handleAssetClick(props.assetDetail,{},true)
    
        }else if(DeleteCalendarReportError){
            setOpenSnack(true)
            SetMessage('Unable to Delete the File')
            SetType('warning')
            handleCloseDialog()
        }
    
        
      },[DeleteCalendarReportLoading, DeleteCalendarReportData, DeleteCalendarReportError])



    const handleCloseDialog=()=> {
        setDialog(false);
    }

   const  handleDeleteDialog =()=>{
    getDeleteCalendarReport(reportId)
   }
    return(
        <ModalNDL onClose={handleCloseDialog}  open={fileUploadDialog}>
              <ModalHeaderNDL>
                <TypographyNDL variant="heading-02-xs" model value={'Are you sure want to delete?'} />
            </ModalHeaderNDL>
            <ModalContentNDL>
                <TypographyNDL value='Do you really want to file for the asset? This action cannot be undone' variant='paragraph-s' color='secondary' />

            </ModalContentNDL>
            <ModalFooterNDL>
                <Button value={'Cancel'} type={'secondary'} onClick={handleCloseDialog} />
                <Button style={{ width: "100px" }} danger value={'Delete'} onClick={handleDeleteDialog} />
            </ModalFooterNDL>
            </ModalNDL>

    )
}
)

export default DeleteCalendarReport 