import React,{useState,useEffect,useRef,forwardRef, useImperativeHandle} from "react";   
import { useTranslation } from 'react-i18next'; 
import InputFieldNDL from "components/Core/InputFieldNDL";
import SelectBox from "components/Core/DropdownList/DropdownListNDL"; 
import { useRecoilState } from "recoil";
import { selectedPlant, snackToggle, snackMessage, snackType } from "recoilStore/atoms";  
import Button from 'components/Core/ButtonNDL';    
import useMetricDataType from "Hooks/useMetricDataType";
import useMetricUnit from "Hooks/useMetricUnit";
import useInstrumentCategory from "Hooks/useInstrumentCategory";
import useInstrumentType from "Hooks/useInstrumentType";
import useAddMetric from "Hooks/useAddMetric";
import useUpdateMetric from "./Hooks/useUpdateMetric";
import AddMetricUnit from "./AddMetricUnit";
import AddLight from 'assets/neo_icons/Menu/add.svg?react';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL"; 
import Toast from "components/Core/Toast/ToastNDL";


     // eslint-disable-next-line react-hooks/exhaustive-deps
const AddMetrics = forwardRef((props,ref) =>{ 
    const { t } = useTranslation(); 
    const titleRef = useRef();
    const nameRef = useRef();     
    const unitRef = useRef();
  
    const [headPlant] = useRecoilState(selectedPlant); 
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, setSnackType] = useRecoilState(snackType);
    const [metricsDialog,setMetricsDialog] = useState({open: false, type: 'create'}); 
    console.log("metricsDialog",metricsDialog)
    const [metricID,setMetricID] = useState("");
    const [metricName,setMetricName] = useState("");
    const [nameNotValid,setnameValid] = useState(false);
    const [titleNotValid, setTitleValid] = useState(false);
    const [toast,setToast] = useState(false)
    const [dataType,setDataType] = useState(0);
    const [dataTypeNotValid,setDataTypeValid] = useState(false);
    const [unit,setUnit] = useState(0);
    const [unitNotValid,setUnitValue] = useState(false);
    const [type,setType] = useState(0);
    const [typeNotValid,setTypeValid] = useState(false);
    const [instrumentType,setInstrumentType] = useState(0);
    const [instrumentCategory,setInstrumentCategory] = useState(0);
    const [instrumentNotValid,setInstrumentValid] = useState(false);
    const [instrumentCategoryValid,setInstrumentCategoryValid] = useState(false);
    const { MetricDataTypeListLoading, MetricDataTypeListData, MetricDataTypeListError, getMetricDataType } = useMetricDataType()
    const { MetricUnitListLoading, MetricUnitListData, MetricUnitListError, getMetricUnit } = useMetricUnit()
    const { InstrumentTypeListLoading, InstrumentTypeListData, InstrumentTypeListError, getInstrumentType } = useInstrumentType()
    const { AddMetricLoading, AddMetricData, AddMetricError, getAddMetric } = useAddMetric()
    const { UpdateMetricLoading, UpdateMetricData, UpdateMetricError, getUpdateMetric } = useUpdateMetric()
    const { InstrumentCategoryListLoading, InstrumentCategoryListData, InstrumentCategoryListError, getInstrumentCategory } = useInstrumentCategory()
    const [isMetricNameChange,setisMetricNameChange] = useState('')
    

    useImperativeHandle(ref,()=>({
        openDialog: ()=>{
            setMetricsDialog({open: true, type: 'create'})
        },
        editDialog: (val)=>{
            setMetricsDialog({open: true,type: 'edit'});
            bindEditValues(val);
        }
    }))

    useEffect(()=>{
        getMetricUnit()
        getMetricDataType()
        getInstrumentCategory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    useEffect(()=>{
        if(!AddMetricLoading && !AddMetricError && AddMetricData){
            handleMetricDialogClose();
            props.metricsList();
            handleNotify(true,'success',t('Metric is created'))
        }
        if(!AddMetricLoading && AddMetricError && !AddMetricData){
            handleMetricDialogClose();
            handleNotify(true,'error',t('Unable to create Metric'))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[AddMetricData])
    
    useEffect(()=>{
        if(!UpdateMetricLoading && !UpdateMetricError && UpdateMetricData){
            handleMetricDialogClose();
            props.metricsList();
            handleNotify(true,'success',t('Metric is Updated'))
        }
        if(!UpdateMetricLoading && UpdateMetricError && !UpdateMetricData){
            handleMetricDialogClose();
            handleNotify(true,'error',t('Unable to update Metric'))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[UpdateMetricData])
    
    const handleNotify = (open,Type,message)=>{
        SetMessage(message);
        setSnackType(Type)
        setOpenSnack(open);
    }
    const handleMetricDialogClose = ()=>{
        setDataType('');
        setUnit('');
        setType('');
        setInstrumentType('');
        setInstrumentCategory('');
        setMetricsDialog({open: false,type: ""});
        setnameValid(false)
        setTitleValid(false)
        setDataTypeValid(false)
        setUnitValue(false)
        setTypeValid(false)
        setTypeValid(false)
        setInstrumentValid(false)
        setInstrumentCategoryValid(false)
        props.handleMetricDialogClose()
    }
    const handleDataType = (e) =>{
        setDataType(e.target.value);
    }
    const handleUnit = (e)=>{
        setUnit(e.target.value);
    }
    const handleInstrumentCategory = (e)=>{
        setInstrumentCategory(e.target.value);
        getInstrumentType(e.target.value)
    }
    const handleInstrumentType = (e)=>{
        setInstrumentType(e.target.value);
    }
    const handleMetricType = (e)=>{
        setType(e.target.value);
    }
    const bindEditValues = (row)=>{
        if(row){
            setMetricID(row.id?row.id:0);
            setMetricName(row.title?row.title:"") 
            setDataType(row.metricDatatypeByMetricDatatype && row.metricDatatypeByMetricDatatype.id? row.metricDatatypeByMetricDatatype.id:"");
            setUnit(row.metricUnitByMetricUnit && row.metricUnitByMetricUnit.id?row.metricUnitByMetricUnit.id:"");
            setType(row.type?row.type:"");
            let InstrumentCategoryID = row.instrumentTypeByInstrumentType.instrument_category && row.instrumentTypeByInstrumentType.instrument_category.id?row.instrumentTypeByInstrumentType.instrument_category.id:""
            setInstrumentCategory(InstrumentCategoryID)
            getInstrumentType(InstrumentCategoryID)
            setInstrumentType(row.instrumentTypeByInstrumentType && row.instrumentTypeByInstrumentType.id?row.instrumentTypeByInstrumentType.id:"")
            setTimeout(()=>{ 
                nameRef.current.value = row.name?row.name:"";
                titleRef.current.value = row.title?row.title:"";
            },500) 
            setisMetricNameChange(row.name)
        }        
    }
   
    
    const addMetric = ()=>{
     
        if(!nameRef || nameRef.current.value === ''){
          
            setnameValid(true);
           
            return;
        }else{
            if(nameNotValid) setnameValid(false)
        }
         if (nameRef.current.value !== '') {
          
            var regex = /^[a-zA-Z0-9_]+$/
            var isValid = regex.test(nameRef.current.value);
            if (!isValid) {
                handleNotify(true,'error',t("Name should not contain special characters"))
              return  ;
            } 
                
              }
       
        if(!titleRef || titleRef.current.value === ''){
            setTitleValid(true);
            return;
        }else{
            if(titleNotValid) setTitleValid(false)
        }
        if(!dataType){
            setDataTypeValid(true);
            return;
        }else{
            if(dataTypeNotValid) setDataTypeValid(false)
        }
        
        if(!unit){
            setUnitValue(true);
            return;
        }else{
            if(unitNotValid) setUnitValue(false)
        }
        if(!type){
            setTypeValid(true);
            return;
        }else{
            if(typeNotValid) setTypeValid(false)
        }
        if(!instrumentCategory){
            setInstrumentCategoryValid(true);
            return;
        }else{
            if(instrumentCategoryValid) setInstrumentCategoryValid(false)
        }
        if(!instrumentType){
            setInstrumentValid(true);
            return;
        }else{
            if(instrumentNotValid) setInstrumentValid(false)
        }

        var present
        if(isMetricNameChange === nameRef.current.value ){
            present = -1
        }else{
            present = props.metricsListData.findIndex(val => val.name.toLowerCase() === nameRef.current.value.trim().toLowerCase())

        }
        if (present >= 0 ){
            setToast(true);
            return;
        }

        if(metricsDialog.type==='create'){
            getAddMetric(dataType, unit, nameRef.current.value, titleRef.current.value, type, instrumentType)
        }else if(metricsDialog.type==='edit'){
            getUpdateMetric(metricID,instrumentType,dataType,unit,nameRef.current.value,titleRef.current.value,type);
        }
    } 
  
    const deleteMetric = ()=>{
        console.log("delete metric")
    }
    const handleUnitDialog = () =>{
        unitRef.current.openDialog();
    }
    let title;

            if (metricsDialog.type === "create") {
                title = t('Add Metrics');
            } else if (metricsDialog.type === "edit") {
                title = t('Edit Metrics');
            }
             else {
                title = t('Delete Metrics');
            }
    let dangerValue, buttonValue, clickHandler;

            if (metricsDialog.type === "delete") {
                dangerValue = true;
                // buttonValue = t('YesDelete');
                // clickHandler = deleteMetric;
            } else {
                dangerValue = false;
            
                if (metricsDialog.type === "create") {
                    buttonValue = t('Save');
                } else {
                    buttonValue = t('Update');
                }
            
                clickHandler = addMetric;
            }


    return(
        <React.Fragment>
             <Toast type={'warning'} message={'Tag name already exists'} toastBar={toast}  handleSnackClose={() => setToast(false)} ></Toast>
            <AddMetricUnit
            getMetricUnit={getMetricUnit}
            ref={unitRef}
            /> 
           
                <ModalHeaderNDL>
                <TypographyNDL variant="heading-02-xs" model value={title}/>   
                {/* <TypographyNDL variant="paragraph-xs" color="tertiary" value={t("Personalize your factory's identity, location, and business hierarchy ")} /> */}
                              
                </ModalHeaderNDL>
                <ModalContentNDL>
                    {(metricsDialog.type === "create" || metricsDialog.type === "edit") &&
                    <>
                       {metricsDialog.type === "edit" && (
                        <React.Fragment>
 <TypographyNDL
    variant="lable-01-s"
    color="secondary"
    value={`${t('Change')} ${metricName} ${headPlant.name}`}
  />
  <div className="mt-3" />
                        </React.Fragment>
 
)}

                        <InputFieldNDL
                            id="metric-name"
                            label={t('Tag') }
                            type="text"
                            placeholder={t("Type here")}
                            inputRef={nameRef}
                            error={nameNotValid}
                            helperText={nameNotValid ? t("Please Enter Metric Name") : ''} 
                        />
  <div className="mt-3" />

                        <InputFieldNDL
                            id="metric-title"
                            label={t('Metric Name') }
                            type="text"
                            placeholder={t("Type here")}
                            inputRef={titleRef}
                            error={titleNotValid}
                            helperText={titleNotValid ? t("Please Enter Metric Name") : ''} 
                        /> 
  <div className="mt-3" />

                        <SelectBox
                            labelId="data-type"
                            label={t("Metric Data Type") }
                            id="data-type-id"
                            auto={false}
                            multiple={false}
                            options={!MetricDataTypeListLoading && !MetricDataTypeListError && MetricDataTypeListData && MetricDataTypeListData.length> 0?MetricDataTypeListData:[]}
                            isMArray={true}
                            checkbox={false}
                            value={dataType}
                            onChange={handleDataType}
                            keyValue="type"
                            keyId="id"
                            error={dataTypeNotValid} 
                            msg={dataTypeNotValid ? t("Please Select Data Type") : ''}
                        />
  <div className="mt-3" />

                        {/* <Typography variant="label-02-s" value={t("Metric Unit") +" *"} /> */}
                        <div className="flex items-center   gap-1">
                            <div style={{width:"83%"}}>
                        <SelectBox
                            labelId="metric-unit"
                             label={t("Metric Unit")}
                            id="metric-unit-id"
                            auto={false}
                            multiple={false}
                            options={!MetricUnitListLoading && !MetricUnitListError && MetricUnitListData && MetricUnitListData.length > 0?MetricUnitListData:[]}
                            isMArray={true}
                            checkbox={false}
                            value={unit}
                            onChange={handleUnit}
                            keyValue="unit"
                            keyId="id"
                            error={unitNotValid} 
                            msg={unitNotValid ? t("Please Select Metric Unit") : ''} 
                        />
                        </div>
                        <div className="mt-4">
                        <Button   id='reason-update' type={"tertiary"} value={"Add Unit"} icon={AddLight} onClick={() => handleUnitDialog()}></Button>
                        </div>
                        </div>
  <div className="mt-3" />

                        <SelectBox
                            labelId="Metric-type"
                            label={t("Metric Type")}
                            id="metric-type-id"
                            auto={false}
                            multiple={false}
                            options={[{ "key": 1, "value": "Uniform" }, { "key": 2, "value": "Cumulative" }]}
                            isMArray={true}
                            checkbox={false}
                            value={type}
                            onChange={handleMetricType}
                            keyValue="value"
                            keyId="key"
                            error={typeNotValid} 
                            msg={typeNotValid ? t("Please Select Metric Type") : ''}
                        />
  <div className="mt-3" />

                        <SelectBox
                            labelId="instrument-category"
                            label={t("Instrument Category")}
                            id="instrument-category-id"
                            auto={false}
                            multiple={false}
                            options={!InstrumentCategoryListLoading && !InstrumentCategoryListError && InstrumentCategoryListData && InstrumentCategoryListData.length>0?InstrumentCategoryListData:[]}
                            isMArray={true}
                            checkbox={false}
                            value={instrumentCategory}
                            onChange={handleInstrumentCategory}
                            keyValue="name"
                            keyId="id"
                            error={instrumentCategoryValid} 
                            msg={instrumentCategoryValid ? t("Please Select Instrument Category") : ''}
                        />
  <div className="mt-3" />

                        <SelectBox
                            labelId="instrument-type"
                            label={t("Instrument Type")}
                            id="instrument-type-id"
                            auto={false}
                            multiple={false}
                            options={!InstrumentTypeListLoading && !InstrumentTypeListError && InstrumentTypeListData && InstrumentTypeListData.length>0?InstrumentTypeListData:[]}
                            isMArray={true}
                            checkbox={false}
                            value={instrumentType}
                            onChange={handleInstrumentType}
                            keyValue="name"
                            keyId="id"
                            error={instrumentNotValid} 
                            msg={instrumentNotValid ? t("Please Select Instrument Type") : ''}
                        />
                    </>
                }
                
                {metricsDialog.type === "delete" &&
                    <TypographyNDL variant="lable-01-s" color="secondary" value={t('Delete metrics') + props.SelectRow.name + t('From') + headPlant.name + t('NotReversible')} />
                }
                </ModalContentNDL>
               
            {!AddMetricLoading &&
            <ModalFooterNDL>
                <Button type="secondary"  value={metricsDialog.type === "Delete" ? t('NoCancel') : t('Cancel')} onClick={() => handleMetricDialogClose()}/>
                <Button type="primary"   danger={dangerValue} loading={UpdateMetricLoading || AddMetricLoading} value={buttonValue} 
                onClick={clickHandler}
                />
                
                
            </ModalFooterNDL>
           } 
               
            {/* </ModalNDL>  */}
        </React.Fragment>
    )
})
 
export default AddMetrics;