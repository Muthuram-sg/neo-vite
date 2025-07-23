/* eslint-disable array-callback-return */
import React, { useState, useEffect,useRef, forwardRef, useImperativeHandle } from "react"; 
import { useTranslation } from 'react-i18next';
import { useRecoilState } from "recoil"; 
import "components/style/instrument.css";
import InputFieldNDL from "components/Core/InputFieldNDL";
import Button from "components/Core/ButtonNDL";
import useAddMetricUnit from "Hooks/useAddMetricUnit";
import ModalNDL from 'components/Core/ModalNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL"; 
import { snackToggle, snackMessage, snackType } from "recoilStore/atoms";


const AddMetricUnit = forwardRef((props,ref)=>{
    const { t } = useTranslation(); 
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [MetricUnit, setMetricUnit] = useState('');
    const [, setMetricUnitDesc] = useState('');  
    const [unitDialog,setUnitDialog] = useState(false);
    const [nameNotValid,setNameValid] = useState(false);
    const [descNotValid,setDescValid] = useState(false);
    //HOOKS
    const { AddMetricUnitLoading, AddMetricUnitData, AddMetricUnitError, getAddMetricUnit } = useAddMetricUnit() 
    //REFS
    const metricunit = useRef()
    const metricDescription = useRef() 

    useImperativeHandle(ref,()=>({
        openDialog:()=>{
            setUnitDialog(true)
        }
    }))
    /*ADD METRIC UNIT HOOKS*/
    const handleUnitDialogClose = () => {
        setUnitDialog(false); 
    }

    const saveUnit = () => { 
        if (metricunit.current.value === '') {
            setNameValid(true);
            return false;
        }
        if (metricDescription.current.value === '') {
            setDescValid(true);
            return false;
        }
        setMetricUnit(metricunit.current.value)
        setMetricUnitDesc(metricDescription.current.value)
        getAddMetricUnit(metricunit.current.value, metricDescription.current.value)
    }

    useEffect(() => {
        if (!AddMetricUnitLoading && !AddMetricUnitError && AddMetricUnitData) { 
                SetMessage(t('Added Metric Unit ') + MetricUnit)
                SetType("success");
                setOpenSnack(true);
                setMetricUnit('');
                setMetricUnitDesc('');
                handleUnitDialogClose();
                props.getMetricUnit(); 
        }
        else if (AddMetricUnitError && !AddMetricUnitLoading && !AddMetricUnitData) {
            SetMessage(`${t("Unable to add")} ${MetricUnit}`)
            SetType("error");
            setOpenSnack(true);
            setMetricUnit('');
            setMetricUnitDesc('');
            handleUnitDialogClose();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [AddMetricUnitLoading, AddMetricUnitData, AddMetricUnitError])

    return (
        <React.Fragment>
            {/*ADD METRIC UNIT*/} 
            <ModalNDL open={unitDialog} onClose={handleUnitDialogClose} > 
                <ModalHeaderNDL>
                <TypographyNDL variant="heading-02-xs" model value={t('Add Unit')}/>           
                </ModalHeaderNDL>
                <ModalContentNDL>
                    <InputFieldNDL
                        id="unitname"
                        inputRef={metricunit}
                        placeholder={t('Unit')}
                        label={t('Unit')}
                        error={nameNotValid}
                        helperText={nameNotValid ? t("Please Enter Unit Name") : ''} 
                    />
                    <div className="mb-3" />
                    <InputFieldNDL
                        id="unitdesc"
                        inputRef={metricDescription}
                        placeholder={t('Description')} 
                        label={t('Description')}
                        error={descNotValid}
                        helperText={descNotValid ?t("Please Enter Unit Description") : ''} 
                    />
                </ModalContentNDL>
                <ModalFooterNDL>
                   
                    <Button id='reason-update' type="secondary"   value={t('Cancel')} onClick={() => handleUnitDialogClose()}>
                    </Button>
                    <Button id='reason-update' type="primary"  value={t('Save')} onClick={() => saveUnit()}>
                    </Button>
                </ModalFooterNDL>
            </ModalNDL> 
        </React.Fragment>
    )
})
export default AddMetricUnit;
