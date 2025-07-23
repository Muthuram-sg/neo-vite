import React, { forwardRef, useEffect, useState } from 'react';
import FileInput from 'components/Core/FileInput/FileInputNDL';
import Button from "components/Core/ButtonNDL" 
import useFileUpload from './Hooks/useFileUpload'; 
import { useRecoilState } from 'recoil';
import { selectedPlant, snackToggle, snackMessage, snackType } from 'recoilStore/atoms'; 
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import ModalNDL from 'components/Core/ModalNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL"; 

import * as xlsx from 'xlsx'; // Importing XLSX for Excel file handling

const OfflineFileUpload = forwardRef((props,ref)=>{
    const { t } = useTranslation();
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);   
    const [headPlant] = useRecoilState(selectedPlant);
    const [extractData,setExtractData] = useState([]);
    const [confirmDialog,setConfirmDialog] = useState(false);
    const { fileUploadLoading, fileUploadData, fileUploadError, getfileUpload } = useFileUpload()
    
    useEffect(()=>{
        if(!fileUploadLoading && fileUploadData && !fileUploadError){
            handleSnackBar('success',t('Data added successfully'));   
            setConfirmDialog(false);  
            handleCloseDialog()
        }
        if(!fileUploadLoading && !fileUploadData && fileUploadError){
            handleSnackBar('warning',t('Problem in adding data'));    
            setConfirmDialog(false);
            handleCloseDialog()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[fileUploadLoading, fileUploadData, fileUploadError])
    
    const handleCloseDialog=()=> {
        props.handleCloseDialog()
    }

    const handleSnackBar  =(type,message) =>{
        SetType(type);SetMessage(message);setOpenSnack(true);
    } 
    const fileUpload = (e)=>{
        if(e.target.files && e.target.files[0]){ 
            const supportedFormats = ['application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','text/csv'];            
            const file = e.target.files[0]
            if(supportedFormats.indexOf(file.type) >= 0){
                console.log('hi')
                const reader = new FileReader();
                reader.onload = (event) => {
                    const data = event.target.result;
                    const workbook = xlsx.read(data, { type: "array" });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const json = xlsx.utils.sheet_to_json(worksheet);
                    console.log(data,workbook,sheetName,worksheet,json,"data val")
                    if(json && json.length > 0){
                        // eslint-disable-next-line array-callback-return
                        const filterdata = json.filter(x=>{         
                                        if(x.Data && x.Data !=='' && x['Date(YYYY-MM-DD HH:mm)'] && moment(x['Date(YYYY-MM-DD HH:mm)'],'YYYY-MM-DD HH:mm').isValid() && new Date(x['Date(YYYY-MM-DD HH:mm)']) <= new Date()){
                                            x['Date'] = moment(x['Date(YYYY-MM-DD HH:mm)']).format('YYYY-MM-DDTHH:mm:00Z')
                                            return x;
                                        }
                                    }); 
                        setExtractData(filterdata);
                    }else{
                        setExtractData([])
                    } 
                };
                reader.readAsArrayBuffer(e.target.files[0]); 
            }else{
                handleSnackBar('warning',t('Please upload a valid file'));     
            }            
        }else{
            handleSnackBar('warning',t('Please upload a file')); 
        }        
    }
    const uploadData = () =>{
        if(extractData.length > 0){
            getfileUpload(headPlant.schema,extractData);
        }else{
            handleSnackBar('warning',t('Please select a valid file')); 
        }                
    }
    const enableConfirmDialog = () =>{
        if(extractData.length > 0){
        setConfirmDialog(true);
        }else{
            handleSnackBar('warning',t('Please select a valid file')); 
        }                
    }
    const handleConfirmDialog = () =>{
        setConfirmDialog(false);
    }

    useEffect(()=>{
        if(!props.offlineDialog){
            handleCloseDialog()
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[props.offlineDialog])

    return(
        <React.Fragment> 
            <ModalHeaderNDL>
                <TypographyNDL variant="heading-02-xs" value={t("Upload File")}/>           
            </ModalHeaderNDL>
            <ModalContentNDL>
                    <FileInput
                        multiple={false}
                        onChange={(e) => fileUpload(e)}
                        onClose={(val, index, e) => val.type ? console.log(index, e) : console.log(index, val)}
                        helperText={"Supports CSV files only, Max size of each file is 10MB"}
                    />
                    <div className='mb-3' />
            <TypographyNDL value={"Note: Continuing will override the data in the selected range if it was previously added."}  variant={'paragraph-s'} color="danger" />
             </ModalContentNDL>
             <ModalFooterNDL>
                <Button   value={t('Cancel')} type={'secondary'} onClick={handleCloseDialog}/>
                <Button  value={t('Upload')} onClick={enableConfirmDialog}/>
             
             </ModalFooterNDL>
            <ModalNDL onClose={handleConfirmDialog}  aria-labelledby="entity-dialog-title" open={confirmDialog}>
                <ModalHeaderNDL>
                    <TypographyNDL variant="heading-02-xs" value={t("Are you sure want to upload?")}></TypographyNDL>
                </ModalHeaderNDL>
                <ModalContentNDL>
                <TypographyNDL  variant='paragraph-s' color='secondary' value={t("Do you really want to upload bulk data to the selected range? Continuing will override the data in the selected range if it was previously added. This action cannot be undone.")}></TypographyNDL>
                </ModalContentNDL>
                <ModalFooterNDL>
                <Button  value={t('Cancel')} danger type={'secondary'} onClick={handleConfirmDialog}/>
                <Button  type="primary" loading={fileUploadLoading} value={"Continue"} onClick={uploadData}/>

                </ModalFooterNDL>
            </ModalNDL> 
        </React.Fragment>
    )
})
export default OfflineFileUpload;