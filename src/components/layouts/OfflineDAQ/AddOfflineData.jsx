import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import AddContent from './AddContent';
import DownloadTemplate from './DownloadTemplate';
import useAddOffline from './Hooks/useAddOffline';
import { useRecoilState } from "recoil";
import { selectedPlant, snackToggle, snackMessage, snackType, snackDesc } from "recoilStore/atoms";
import useEditOffline from './Hooks/useEditOffline';
import { useTranslation } from 'react-i18next'; 
import ModalNDL from 'components/Core/ModalNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import Button from "components/Core/ButtonNDL" 

const AddOfflineData = forwardRef((props,ref)=>{
    const { t } = useTranslation();
    const [offlineDialog, setDialog] = useState(false);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, setSnackDesc] = useRecoilState(snackDesc);
    const [, SetType] = useRecoilState(snackType);
    const [fields,setFields] = useState([]);
    const [instrumentid,setInstrumentID] = useState(0);
    const [headPlant] = useRecoilState(selectedPlant);
    const [fieldData,setFieldData] = useState([]);
    const [type,setOffType] = useState('');
    const [time,setTime] = useState('');
    const [frequency,setFrequency] = useState('');
    const [warningDialog,setWarningDialog] = useState(false);
    const [warningType,setWarningType] = useState('');
    const [editedObj,setEditedObj] = useState({});
    const [RangeParam,setRangeParam] = useState('')
    const [fieldArr,setFieldArr] = useState([]);
    const { addOfflineLoading, addOfflineData, addOfflineError, getaddOffline } = useAddOffline();
    const {editOfflineLoading, editOfflineData, editOfflineError, geteditOffline} =useEditOffline();
    // console.log(time,"timeee")
        useImperativeHandle(ref,()=>({
            openDialog: (stype, stime, value, data,rangeParam) => {
            //  console.log(stype,rangeParam,"param",value,data)
             const formattedDateStr = (originalDateStr) => {
                if (originalDateStr) {
                    return originalDateStr.replace(/(\d{2})-(\d{2})-(\d{4}) (\d{2}:\d{2}:\d{2})/, '$3-$2-$1T$4');
                }
                return '';
            };
             if (rangeParam ) {
               
                    console.log(formattedDateStr(rangeParam), "param1");
                    setRangeParam(formattedDateStr(rangeParam));
                
            } 
        
                setInstrumentID(value && value.id ? value.id : 0);
                setFrequency(value.instruments_metrics && value.instruments_metrics.length > 0?value.instruments_metrics[0].frequency:"")
            
                if(data){
                    setFields(value && value.instruments_metrics && value.instruments_metrics.length > 0 ?value.instruments_metrics.filter(x=> x.metric.name === data[0].key):[]);
                }else{
                    setFields(value && value.instruments_metrics && value.instruments_metrics.length > 0 ? value.instruments_metrics : []);
                }
            
                if(data && data.length > 0){
                    setFieldData(data);
                }else{
                    setFieldData([])
                }
                if(stime){
                    setTime(stime)
                }
                console.log(stype,"stype")
                setOffType(stype);
                setDialog(true);
        
            }
            
    }))

    useEffect(()=>{
        if(!addOfflineLoading && !addOfflineError && addOfflineData){
            handleSnackBar('success',t('Offline data added')); 
            setWarningDialog(false);
            setDialog(false)
            props.triggerLastUpdated()
        }
        if(!addOfflineLoading && addOfflineError && !addOfflineData){
            handleSnackBar('error',t('Offline data insert failed'));
            setWarningDialog(false);
            setDialog(false)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[addOfflineData,addOfflineLoading])
    useEffect(()=>{
        if(!editOfflineLoading && !editOfflineError && editOfflineData){ 
            props.refreshData() 
            handleSnackBar('success',t('Offline data Updated'));
            setWarningDialog(false);
            setDialog(false)
        }
        if(!editOfflineLoading && editOfflineError && !editOfflineData){
            handleSnackBar('error',t('Offline data update failed'));
            setWarningDialog(false);
            setDialog(false)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[editOfflineData,editOfflineLoading])
    const handleCloseDialog=()=> setDialog(false);
    const handleSnackBar  =(Type,message) =>{
        SetType(Type);SetMessage(message);setSnackDesc("");setOpenSnack(true);  
    }
    const triggerWarningDialog = (fArr,freq) =>{ 
        if(fArr.length > 0){
            setFieldArr(fArr);   
            setWarningType('add')         
            setWarningDialog(true)
        }else{
            handleSnackBar('warning',t('Please enter anyvalues'))
        }
    }
    const editOfflineValues = (obj)=>{ 
        setEditedObj(obj) 
        setWarningType('edit')         
        setWarningDialog(true)
        // geteditOffline(obj)
    }
    const editOfflineEntry = ()=>{
        geteditOffline(editedObj)
    }
    const handleDownloadTemplate = (categoryID,instrumentTypeId) =>{ 
        if(categoryID && categoryID !== 0){ 
            if(instrumentTypeId && instrumentTypeId !== 0){ 
                props.prepareDownloadTemplate(instrumentTypeId); 
                handleCloseDialog()
            }else{ 
                handleSnackBar('warning',t('Select Type'))
            } 
        }else{ 
            handleSnackBar('warning',"Select Category")
        } 
    } 
    const saveOfflineData = () =>{ 
        getaddOffline(headPlant.id,headPlant.schema,fieldArr,frequency)
    }
    const handleWarningDialog = () =>{
        setWarningDialog(false);
        setFieldArr([])
        setEditedObj({}) 
        setWarningType('')         
    }

    const getModalHeader =(val) => {
        if(val==='add')
            return t('Add Data')
        else
            return val==='edit'?t("Edit Data") : t("Import  Files")
    }
   
    return(
        <React.Fragment>
            <ModalNDL open={offlineDialog} onClose={handleCloseDialog} > 
                <ModalHeaderNDL>
                <TypographyNDL  variant="heading-02-xs" value={getModalHeader(type)}/>  
                {/* <TypographyNDL color='tertiary' variant='paragraph-xs' value={getModalHeadersub(type)} /> */}
                </ModalHeaderNDL>
               
                {
                    type === 'add' || type === 'edit' ?
                  
                        (<AddContent
                            iid={instrumentid}
                            fields={fields}
                            fieldData={fieldData}
                            handleCloseDialog={handleCloseDialog}
                            saveOfflineData={triggerWarningDialog}
                            type={type}
                            time={time}
                            rangeParam={RangeParam}
                            frequency={frequency}
                            triggerSnackbar={() => handleSnackBar('warning', t('Please enter anyvalues'))}
                            showSnackbar={(Type,info)=>handleSnackBar(Type, info)}
                            editOfflineData={editOfflineValues}
                            insertLoading={addOfflineLoading}
                            editLoading={editOfflineLoading}
                        />)
                        :
                        (<DownloadTemplate
                          handleCloseDialog={handleCloseDialog}
                          handleDownloadTemplate={handleDownloadTemplate}
                        />)
                } 
               
            </ModalNDL>
            <ModalNDL onClose={handleWarningDialog} aria-labelledby="entity-dialog-title" open={warningDialog}>
                <ModalHeaderNDL>
                    <TypographyNDL variant="heading-02-xs" value={`Are you sure you want to ${warningType}`} />
                </ModalHeaderNDL>
                <ModalContentNDL>
                <TypographyNDL  variant='paragraph-s' color='secondary' value ={warningType === 'add'? t("Do you really want to add data to the selected range? Continuing will override the data in the selected range if it was previously added.This action cannot be undone."): t("Do you really want to edit the data? Continuing will override the data in the existing time.This action cannot be undone.")} />
                </ModalContentNDL>
                <ModalFooterNDL>
                    <Button   value={t('Cancel')}  type={'secondary'} onClick={handleWarningDialog}/>
                    <Button   type="primary" value={t('Continue')} loading={warningType === 'add'?addOfflineLoading:editOfflineLoading} onClick={warningType === 'add'?saveOfflineData:editOfflineEntry}/>
                
                </ModalFooterNDL>
            </ModalNDL> 
        </React.Fragment>
    )
})
export default AddOfflineData;