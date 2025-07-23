/* eslint-disable array-callback-return */
import React, { useState, useEffect ,useRef} from "react";
import SelectBox from "components/Core/DropdownList/DropdownListNDL"; 
import { useRecoilState } from "recoil";
import { useTranslation } from 'react-i18next'; 
import "components/style/instrument.css";
import InputFieldNDL from "components/Core/InputFieldNDL";
import Button from "components/Core/ButtonNDL";
import AddLight from 'assets/neo_icons/Menu/add.svg?react';
import { snackToggle, snackMessage, snackType } from "recoilStore/atoms";
//Hooks 
import useMetricDataType from "Hooks/useMetricDataType";
import useMetricUnit from "Hooks/useMetricUnit";
import useAddMetric from "Hooks/useAddMetric";
import AddMetricUnit from "./AddMetricUnit";
import ModalNDL from 'components/Core/ModalNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL";   

export default function AddMetric(props) {
    const { t } = useTranslation(); 
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [masterMetric, setMasterMetric] = useState('');
    const [UnitDialog, setUnitDialog] = useState(false);
    const [MetricUnitData, setMetricUnitData] = useState([]);
    const [UnitID, setUnitID] = useState('');
    const [MetricDataType, setMetricDataType] = useState([]);
    const [DataTypeID, setDataTypeID] = useState('');
    const [MetrictypeID, setMetricTypeID] = useState('');
    const [, setModulClose] = useState(false);
   

    //HOOKS
    
    const { AddMetricLoading, AddMetricData, AddMetricError, getAddMetric } = useAddMetric()
    const { MetricDataTypeListLoading, MetricDataTypeListData, MetricDataTypeListError, getMetricDataType } = useMetricDataType()
    const { MetricUnitListLoading, MetricUnitListData, MetricUnitListError, getMetricUnit } = useMetricUnit()
   

    //REFS
    const metricname = useRef()
    const metrictitle = useRef()


   
    useEffect(() => {

        getMetricUnit()
        getMetricDataType()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {

        if (!MetricDataTypeListLoading && !MetricDataTypeListError && MetricDataTypeListData) {
            setMetricDataType(MetricDataTypeListData);
        }

    }, [MetricDataTypeListLoading, MetricDataTypeListData, MetricDataTypeListError])

    useEffect(() => {

        if (!MetricUnitListLoading && !MetricUnitListError && MetricUnitListData) {
            setMetricUnitData(MetricUnitListData);
        }

    }, [MetricUnitListLoading, MetricUnitListData, MetricUnitListError])

    const handleMetricDialogClose = () => {
        props.setMetricDialog(false);
        setMasterMetric('')
        setMetricTypeID('')
        setDataTypeID('')
        setUnitID('')
        setModulClose(false);
        props.setInstrumentIdErr("");
        
    }

   

    const handleMetricUnit = (e) => {
        if (e) setUnitID(e.target.value);
    }


    const saveMetric = () => {
        setMasterMetric(metricname.current.value)
        if (metricname.current.value === '' && metrictitle.current.value === '' && MetrictypeID === '' && DataTypeID === '' && metrictitle.current.value === '') {
            SetMessage(t('MandatoryField'))
            SetType("warning")
            setOpenSnack(true)
            return false;
        }

        getAddMetric(DataTypeID, UnitID, metricname.current.value, metrictitle.current.value, MetrictypeID, props.typeID)
    }
    const handleDataType = (e) => {
        if (e) setDataTypeID(e.target.value);
    }

    const handleMetricType = (e) => {
        if (e) setMetricTypeID(e.target.value);
    }
   
    const handleUnitDialog = () => {
        
        setUnitDialog(true);
    }
    useEffect(() => {
        if (!AddMetricLoading && !AddMetricError && AddMetricData) {
            if (AddMetricData) {
               
                SetMessage(t('Added Metric ') + masterMetric)
                SetType("success");
                setOpenSnack(true);
                setMasterMetric('')
                setMetricTypeID('')
                setDataTypeID('')
                setUnitID('')
                handleMetricDialogClose();
                props.getMetricList();
            } else {
                SetMessage(`${t("Metric")} ${masterMetric} ${t("Already Exist")}`)
                SetType("info");
                setOpenSnack(true);
                setMasterMetric('')
                handleMetricDialogClose();
            }
        }
        else if (AddMetricError && !AddMetricLoading && AddMetricData === null) {
            SetMessage(`${t("Failed to add the metric due to missing parameters")}`)
            SetType("info");
            setOpenSnack(true);
            setMasterMetric('')
            handleMetricDialogClose();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [AddMetricLoading, AddMetricData, AddMetricError])



    return (
        <React.Fragment>
            {/* ADD METrics DIALOG*/} 
            <ModalNDL open={props.MetricDialog} onClose={handleMetricDialogClose} size="lg"> 
                <ModalHeaderNDL>
                <TypographyNDL variant="heading-02-s" model value={t('Add Metric')}/>           
                </ModalHeaderNDL>
                <ModalContentNDL>
            
                <div style={{marginBottom : "5px"}}>
                    <InputFieldNDL
                        id="metricname"
                        inputRef={metricname}
                        placeholder={t('Metric')}
                        inputProps={{ 'aria-label': 'naked' }}
                        label={t('Metric')}
                    />
                    </div>
                    <InputFieldNDL
                        id="title"
                        inputRef={metrictitle}
                        placeholder={t('title')}
                        inputProps={{ 'aria-label': 'naked' }}
                        label={t('Title')}
                    />
                    
                    <SelectBox
                        id='metric-type'
                        value={MetrictypeID}
                        onChange={handleMetricType}
                        label={t('type')}
                        isMArray={"true"}
                        options={[{ "key": 1, "value": "Uniform" }, { "key": 2, "value": "Cumulative" }]}
                        keyId="key"
                        keyValue="value"
                        defaultDisableName={t("Select Metric Type")}
                        defaultDisableOption={true}
                    >


                    </SelectBox> 
                    <SelectBox
                        id='data-type'
                        value={DataTypeID}
                        onChange={handleDataType}
                        label={t('DataType')}
                        isMArray={true}
                        options={MetricDataType}
                        keyId={"id"}
                        keyValue={"type"}
                        defaultDisableName={t("Select Metric Data Type")}
                        defaultDisableOption={true}
                    >

                    </SelectBox> 
                    <SelectBox fullWidth
                        id='units'
                        value={UnitID}
                        onChange={handleMetricUnit}
                        label={t('Units')}
                        isMArray={true}
                        options={MetricUnitData}
                        keyId={"id"}
                        keyValue={"unit"} 
                        btnProps={<Button id='reason-update' type={"ghost"} icon={AddLight} onClick={() => handleUnitDialog()}>
                        </Button>}
                    >

                    </SelectBox> 
                </ModalContentNDL>
                <ModalFooterNDL>
                    <Button id='reason-update' type="primary" value={t('Save')} onClick={() => saveMetric()}>
                    </Button>
                    <Button id='reason-update' value={t('Cancel')} type="secondary" danger onClick={() => handleMetricDialogClose()}>
                    </Button> 
                </ModalFooterNDL>
            </ModalNDL>  
            {/*ADD METRIC UNIT DIALOG */}

            <AddMetricUnit
            getMetricUnit={getMetricUnit}
            UnitDialog={UnitDialog}
            setUnitDialog={(val)=>setUnitDialog(val)}
            />

            
        </React.Fragment>
    )
}
