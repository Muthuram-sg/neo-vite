import React, { forwardRef, useEffect, useState, useImperativeHandle } from 'react';
import {useLocation} from 'react-router-dom'
import FileInput from 'components/Core/FileInput/FileInputNDL';
import Button from 'components/Core/ButtonNDL';
import { useRecoilState } from 'recoil';
import { selectedPlant, lineEntity, user, ErrorPage } from 'recoilStore/atoms';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import Select from 'components/Core/DropdownList/DropdownListNDL'
import DatePickerNDL from "components/Core/DatepickerNDL";
import useGetReportType from '../hooks/useGetReportType';
import useInsertCalendarReport from '../hooks/useInsertCalendarReport';
import useFileUpload from '../hooks/useFileUpload';
import useUpdateCalendarReport from '../hooks/useUpdateCalendarData';
import Toast from "components/Core/Toast/ToastNDL";





const CalendarFileUpload = forwardRef((props, ref) => {
    const { t } = useTranslation();
    const [, setErrorPage] = useRecoilState(ErrorPage);
    const [openSnack, setOpenSnack] = useState(false);
    const [message, SetMessage] = useState('');
    const [type, SetType] = useState('');
    const [headPlant] = useRecoilState(selectedPlant);
    const [curruser] = useRecoilState(user);
    const [date, setdate] = useState({ value: new Date(), isValid: true })
    const [uploadZipData, setuploadZipData] = useState(null)
    const [selectedEntity, setselectedEntity] = useState('')
    const [selectedReportType, setselectedReportType] = useState('')
    const [fileName, setfileName] = useState('')
    const [EntityList] = useRecoilState(lineEntity);
    const [checkAsset, setcheckAsset] = useState(false)
    const [checkReportType, setcheckReportType] = useState(false)
    const [Below, setBelow] = useState(false)
    const { GetReportTypeLoading, GetReportTypedata, GetReportTypeerror, getGetReportType } = useGetReportType()
    const { InsertCalendarReportLoading, InsertCalendarReportData, InsertCalendarReportError, getInsertCalendarReport } = useInsertCalendarReport()
    const { FileUploadLoading, FileUploadData, FileUploadError, getTaskFileUpload } = useFileUpload()//NOSONAR
    const { UpdateCalendarReportLoading, UpdateCalendarReportData, UpdateCalendarReportError, getUpdateCalendarReport } = useUpdateCalendarReport()
    const [IsEdit, setIsEdit] = useState('')
    const [reportID,setreportID] = useState('')
    const [confirmSave,setconfirmSave] =useState(false)
    const [DuplicateSave,setDuplicateSave] =useState({})
    
    useImperativeHandle(ref, () => ({

        UpdateDialog: (data) => {
            handleEdit(data)

        }


    }))
console.log(props.range,"range")
    useEffect(() => {
      if(props.moduleFlag){
        if(props.assetParam && props.range && props.Technique){
            handleEntity({target:{value:props.assetParam}})
            handleReportType({target:{value:1}})
        }
      }
            getGetReportType()
        
       
    }, [headPlant])

    useEffect(()=>{
        if(!GetReportTypeLoading && GetReportTypedata && !GetReportTypeerror && props.Technique && EntityList.length){
            let Techniqueval = GetReportTypedata.filter(f=> f.name === props.Technique)
            if(Techniqueval.length ===0){
                setErrorPage(true)
            }
            let astArry = EntityList.filter(x=>x.entity_type === 3)
            if(astArry.filter(f=> f.id === props.assetParam).length === 0){
                setErrorPage(true)
            }
        }

    },[GetReportTypeLoading, GetReportTypedata, GetReportTypeerror,EntityList])

    useEffect(() => {
        if(props.assetName){
            handleEntity({target:{value:EntityList.filter(x=>x.name === props.assetName)[0].id}})
        }
    }, [props.assetName])

    useEffect(() => {
        if (!InsertCalendarReportLoading && InsertCalendarReportData && !InsertCalendarReportError) {
            handleFileUpload()
            props.handleSnackBar("success", "File Upload Successfully")
            props.handleCloseDialog()
            props.triggerCalendar()
            props.handleAssetClick({id:selectedEntity,name:props.assetName},{},true)

            

        } else if (InsertCalendarReportError) {
            props.handleSnackBar("warning", "Unable to Upload File")
            props.handleCloseDialog()

        }

    }, [InsertCalendarReportLoading, InsertCalendarReportData, InsertCalendarReportError])
    useEffect(()=>{
        if(!UpdateCalendarReportLoading && UpdateCalendarReportData &&  !UpdateCalendarReportError){
            handleFileUpload()
            props.handleSnackBar("success", "File Updated Successfully")
            props.handleCloseDialog()
            console.log(selectedEntity,props.startDate,props.endDate,'entity_id,props.startDate,props.endDate')
            props.handleAssetClick({id:selectedEntity,name:props.assetName},DuplicateSave,true)
            

        } else if (UpdateCalendarReportError) {
            props.handleSnackBar("warning", "Unable to Updated File")
            props.handleCloseDialog()

        }
        

    },[UpdateCalendarReportLoading, UpdateCalendarReportData, UpdateCalendarReportError,])

    
    const handleEdit = (data) => {
        setIsEdit('edit')
        setreportID(data.id)
        setselectedEntity(data.entity_id)
        setselectedReportType(data.report_type)
        setdate({ value: new Date(data.upload_date), isValid: true })
        console.log(data, "Edit")
    }
    
    function modifyFileName(fileName, insertText) {
        const lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex === -1) {
            return fileName; // No extension found
        }
        const namePart = fileName.substring(0, lastDotIndex);
        const extension = fileName.substring(lastDotIndex);
        return `${namePart}${'_' + insertText}${extension}`;
    }

    const fileUpload = (e) => {
        console.log(e.target.files, "e.target.value")
        if (e.target.files && e.target.files[0]) {
            const supportedFormats = ['application/pdf'];
            const file = e.target.files[0];
    
            // Convert bytes to MB
            const bytesToMB = (bytes) => {
                return bytes / (1024 * 1024);
            };
    
            // Set the file name and size check
           
            if (Number(bytesToMB(file.size)) > 10) {
                setBelow(true);
            } else {
                setBelow(false);
            }
    
            // Check if the file format is supported
            if (supportedFormats.indexOf(file.type) >= 0) {
                console.log(file, "file");
    
                // Rename the file
                
                let updatedName=  modifyFileName(file.name,moment(date.value).unix())
               
                const renamedFile = new File([file], updatedName, { type: file.type });
                setfileName(renamedFile.name);
                setuploadZipData(renamedFile);
            } else {
                setuploadZipData({});
                handleSnackBar('warning', 'Please Upload Supported Format files');
            }
        }
    }

    const handleSnackBar = (type, message) => {
        SetType(type); SetMessage(message); setOpenSnack(true);
    }
    const handleEntity = (e) => {
        console.log(e.target.value,"e asset val")
        setselectedEntity(e.target.value)
        setcheckAsset(false)
    }

    const handleReportType = (e) => {
        console.log(e.target.value,"e report val")
        setselectedReportType(e.target.value)
        setcheckReportType(false)
    }
    const handleUpload = () => {
        let body = {}
        let DuplicateCheck = props.rawCalendarData.filter(x=>x.upload_date ===  moment(date.value).format("YYYY-MM-DDT00:00:00") && x.report_type === selectedReportType && x.entity_id === selectedEntity)
        console.log(props.rawCalendarData,DuplicateCheck,'hhhhhhh')
      
        if (!selectedEntity) {
            setcheckAsset(true)
            return false
        }
        if (!selectedReportType) {
            setcheckReportType(true)
            return false
        }
        if (Below) {
            handleSnackBar('warning', 'Please upload file less then 10MB')
            return false
        }
        if(!fileName){
            handleSnackBar('warning', 'Please upload a file')
            return false
        }
        
        if(DuplicateCheck.length > 0){
           body = {
                id:DuplicateCheck[0].id,
                updated_by: curruser.id,
                path_name: fileName,
            }
            console.log("enter")
            setDuplicateSave(body)
            // getUpdateCalendarReport(body)
            return false
        }

        body = {
            created_by: curruser.id,
            updated_by: curruser.id,
            report_type: selectedReportType,
            path_name: fileName,
            entity_id: selectedEntity,
            upload_date: moment(date.value).format("YYYY-MM-DDT00:00:00Z"),
            line_id: headPlant.id
        }
        getInsertCalendarReport(body)


    }

    const handleFileUpload = () => {
        const formData = new FormData()
        formData.append("file",uploadZipData )
        getTaskFileUpload(formData)

    }
    const handleEditUpload =()=>{
        let body ={}
      
        if (Below) {
            handleSnackBar('warning', 'Please upload file less then 10MB')
            return false
        }
        if(!fileName){
            handleSnackBar('warning', 'Please upload a file')
            return false
        }

        body = {
            id:reportID,
            updated_by: curruser.id,
            path_name: fileName,
        }
        getUpdateCalendarReport(body)
    }
    const renderModelHeader=()=>{
        if(confirmSave || Object.keys(DuplicateSave).length > 0){
            return "Confirmation"

        }else if(IsEdit === 'edit' && !confirmSave){
            return 'Update Asset Data'
        }else{
            return "Upload Asset Data"
        }

    }
    const renderButtonName=()=>{
        if(confirmSave || Object.keys(DuplicateSave).length > 0){
            return "Continue"

        }else if(IsEdit === 'edit' && !confirmSave){
            return 'Update'
        }else{
            return "Submit"
        }

    }
    const renderButtonAction =()=>{
        if(confirmSave){
             handleEditUpload()
        }else if(IsEdit === 'edit'){
           setconfirmSave(true)
        }else if(Object.keys(DuplicateSave).length > 0){
            getUpdateCalendarReport(DuplicateSave)
        }else{
            handleUpload()
        }
    }
    return (

        <React.Fragment>
      <Toast type={type} message={message} toastBar={openSnack}  handleSnackClose={() => setOpenSnack(false)} ></Toast>

            <ModalHeaderNDL>
                <TypographyNDL variant="heading-02-xs" model value={renderModelHeader()} />
            </ModalHeaderNDL>
            <ModalContentNDL>
                {
                  ( ( confirmSave && Object.keys(DuplicateSave).length === 0) || (Object.keys(DuplicateSave).length > 0 &&  IsEdit !== 'edit' &&  !confirmSave) ) && 
                    <TypographyNDL variant={'paragraph-xs'} color='danger' value={"Uploading the file for the selected date will overwrite any existing file on that date. This action cannot be undone."} />

                }

                {
                    IsEdit === 'edit' && !confirmSave && Object.keys(DuplicateSave).length === 0 && 
                    <React.Fragment>
                        <Select
                            label={"Report Type"}
                            labelId="assetSelect"
                            id="assetSelect"
                            auto={false}
                            placeholder={t("Select an report type")}
                            multiple={false}
                            options={!GetReportTypeLoading && GetReportTypedata && !GetReportTypeerror ? GetReportTypedata : []}
                            isMArray={true}
                            checkbox={false}
                            value={props.Technique ? props.Technique : selectedReportType}
                            onChange={handleReportType}
                            keyValue="name"
                            keyId="id"
                            disabled={true}
                            error={checkReportType}
                            msg={"Please Select Report Type"}

                        />
                        <TypographyNDL value="Select the type  of the report file you want to upload"  variant='paragraph-xs' color='tertiary'/>
                        <br></br>
                        <TypographyNDL value="Date *" variant='paragraph-xs'/>
                       <DatePickerNDL
                            id="custom-range-starts"
                            onChange={(dates) => {
                                console.log(dates,"dates")
                                setdate({ value: dates, isValid: true })
                            }}
                            startDate={date.value ? new Date(date.value) : new Date()}
                            placeholder={t("Enter  Date")}
                            dateFormat={'MMM dd yyyy'}
                            disabled={true}
                            maxDate={new Date()}
                        />
                       
                        
                        <br></br>

                        <FileInput
                            accept={'.pdf'}
                            multiple={false}
                            onChange={(e) => fileUpload(e)}
                            onClose={(val, index, e) => val.type ? console.log(index, e) : console.log(index, val)}
                            helperText={"System Supports any files and file name Ex: E1010_VA.pdf, Max Size of each file is 10MB"}
                        />
                    </React.Fragment>
                }
            
                {
                     IsEdit !== 'edit' &&  !confirmSave && Object.keys(DuplicateSave).length === 0 && 
                    <React.Fragment>
                        <Select
                            label={"Asset"}
                            labelId="assetSelect"
                            id="assetSelect"
                            auto
                            placeholder={t("Select an asset")}
                            multiple={false}
                            options={EntityList.length > 0 ? EntityList.filter(x=>x.entity_type === 3) : []}
                            isMArray={true}
                            checkbox={false}
                            value={selectedEntity}
                            onChange={handleEntity}
                            keyValue="name"
                            keyId="id"
                            error={checkAsset}
                            disabled = {props.assetName ? true : false}
                            msg={"Please Select Asset"}

                        />
                        <TypographyNDL value="Select an asset for which you want to upload report file" variant='lable-01-s' color={"tertiary"} />
                        <br></br>
                        <Select
                            label={"Report Type"}
                            labelId="assetSelect"
                            id="assetSelect"
                            auto={false}
                            placeholder={t("Select an report type")}
                            multiple={false}
                            options={!GetReportTypeLoading && GetReportTypedata && !GetReportTypeerror ? GetReportTypedata : []}
                            isMArray={true}
                            checkbox={false}
                            value={selectedReportType}
                            onChange={handleReportType}
                            keyValue="name"
                            keyId="id"
                            error={checkReportType}
                            msg={"Please Select Report Type"}

                        />
                        <TypographyNDL value="Select the type  of the report file you want to upload" variant='lable-01-s' color={"tertiary"} />
                        <br></br>
                        <TypographyNDL value="Date *" variant='paragraph-xs'/>

                        <DatePickerNDL
                            id="custom-range-starts"
                            onChange={(dates) => {
                                console.log(dates,"dates")
                                setdate({ value: dates, isValid: true })
                            }}
                            startDate={props.range ? new Date(props.range) : (date.value ? new Date(date.value) : new Date())}
                            placeholder={t("Enter  Date")}
                            dateFormat={'MMM dd yyyy'}
                            maxDate={new Date()}
                        //   minDate={new Date()}
                        />
                        <br></br>

                        <FileInput
                            multiple={false}
                            onChange={(e) => fileUpload(e)}
                            accept={'.pdf'}
                            onClose={(val, index, e) => val.type ? console.log(index, e) : console.log(index, val)}
                            helperText={"System Supports any files and file name Ex: E1010_VA.pdf, Max Size of each file is 10MB"}
                        />
                    </React.Fragment>
                }
            </ModalContentNDL>
            <ModalFooterNDL>
                <Button  value={t('Cancel')} type={'secondary'} onClick={props.handleCloseDialog} />
                <Button  value={renderButtonName()} onClick={renderButtonAction} />

            </ModalFooterNDL>
        </React.Fragment>



    )

}
)



export default CalendarFileUpload;