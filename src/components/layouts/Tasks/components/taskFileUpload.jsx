import React, { forwardRef, useEffect, useState, useRef } from 'react';
import FileInput from 'components/Core/FileInput/FileInputNDL';
import Button from 'components/Core/ButtonNDL';
import useTaskFileUpload from '../hooks/useTaskFileUpload';
import useTaskListFull from '../hooks/useTaskListWithoutDate'
import { useRecoilState } from 'recoil';
import { selectedPlant, snackToggle, snackMessage, snackType } from 'recoilStore/atoms';
import { useTranslation } from 'react-i18next';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import TaskBulkUploadTemplate from './TaskBulkDownloadTemplate';
import LinkNDL from '../../../Core/LinkNDL';



const TaskFileUpload = forwardRef((props, ref) => {

    const { t } = useTranslation();
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [headPlant] = useRecoilState(selectedPlant);
    const [, setLine_id] = useState();
    const [dupmsg,setDupMsg] =useState(false);
    const [extractData, setExtractData] = useState();
    const { fileUploadLoading, fileUploadData, fileUploadError, getTaskFileUpload } = useTaskFileUpload();
    const { TaskListDataFull, getTaskListWithoutDate } = useTaskListFull();

    const dialogRef = useRef();
    useEffect(() => {
        if (!fileUploadLoading) {
            if (fileUploadData && !fileUploadError) {
                
                if (fileUploadData.success > 0) {
                    handleSnackBar('success', t(`Data added successfully. ${fileUploadData.success} records uploaded.`));
                    props.getTaskList();
                    handleCloseDialog();
                } else {
                    handleSnackBar('error', t('Invalid file format'));
                }
            } else if (!fileUploadData && fileUploadError) {
                handleSnackBar('error', t('Invalid file format'));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fileUploadLoading, fileUploadData, fileUploadError]);    

    console.log("TaskListDataTaskListData", TaskListDataFull)
    useEffect(() => {
        getTaskListWithoutDate(headPlant.id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant.id])

    const handleCloseDialog = () => {
        setExtractData([]);
        setLine_id('');
        setDupMsg(false)
        props.handleCloseDialog();
        props.handleTask()
    }
    const handleSnackBar = (type, message) => {
        SetType(type); SetMessage(message); setOpenSnack(true);
    }

    const fileUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setExtractData(file);
        } else {
          setExtractData(null);
        }
      };
      const uploadData = () => {
        if (!extractData) {
          handleSnackBar('warning', 'Please upload a valid file');
          return;
        }
        const formData = new FormData();
        formData.append("file", extractData);      
        getTaskFileUpload(formData); 
      };      

    const handleClickDownload = () => {
        // Open the dialog when Typography is clicked
        dialogRef.current.openDialog(true);
    };
    return (
        <React.Fragment>
            <ModalHeaderNDL>
                <TypographyNDL variant="heading-02-s" model value={"Upload Tasks"} />
            </ModalHeaderNDL>
            <ModalContentNDL>
                <TypographyNDL variant="paragraph-s" >
                    <div className='flex gap-1'>
                        <div>Step 1. </div>
                        <LinkNDL text='Click here' onClick={handleClickDownload} />
                        <div>to download the Excel template</div>
                    </div>
                </TypographyNDL>
                <div className='p-3 pl-0'><TypographyNDL variant="paragraph-s" value={"Step 2. Upload the Document"} /></div>
                <FileInput
                    multiple={false}
                    onChange={(e) => fileUpload(e)}
                    onClose={(val, index, e) => val.type ? console.log(index, e) : console.log(index, val)}
                    helperText={dupmsg ? "Duplicate entries found in the uploaded file,will be removed":"System Supports CSV files only, Max Size of each file is 10 MB"}
                   error={dupmsg}
                  
                />
            </ModalContentNDL>
            <ModalFooterNDL>
                <Button value={t('Cancel')} type={'secondary'} onClick={handleCloseDialog} />
                <Button value={t('Upload')} loading={fileUploadLoading} onClick={uploadData} />

            </ModalFooterNDL>
            <TaskBulkUploadTemplate ref={dialogRef} />
        </React.Fragment>
    )
})
export default TaskFileUpload;