/* eslint-disable array-callback-return */
import React, { useState, useEffect,useRef } from "react"; 
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

export default function AddMetricUnit(props) {
    const { t } = useTranslation(); 
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [, setModulClose] = useState(false);
    const [MetricUnit, setMetricUnit] = useState('');
    const [, setMetricUnitDesc] = useState('');
    
   
  
    //HOOKS
    const { AddMetricUnitLoading, AddMetricUnitData, AddMetricUnitError, getAddMetricUnit } = useAddMetricUnit()
   
    //REFS
    const metricunit = useRef()
    const metricDescription = useRef()
    
  



    /*ADD METRIC UNIT HOOKS*/
    const handleUnitDialogClose = () => {
        props.setUnitDialog(false);
        setMetricUnit('');
        setMetricUnitDesc('');
        setModulClose(false);
    }

    const saveUnit = () => {

        
        if (metricunit.current.value === '' && metricDescription.current.value === '') {
            SetMessage(t('MandatoryField'))
            SetType("warning")
            setOpenSnack(true)
            return false;
        }
        setMetricUnit(metricunit.current.value)
        setMetricUnitDesc(metricDescription.current.value)
        getAddMetricUnit(metricunit.current.value, metricDescription.current.value)
    }

    useEffect(() => {
        if (!AddMetricUnitLoading && !AddMetricUnitError && AddMetricUnitData) {
            if (AddMetricUnitData) {
                SetMessage(t('Added Metric Unit ') + MetricUnit)
                SetType("success");
                setOpenSnack(true);
                setMetricUnit('');
                setMetricUnitDesc('');
                handleUnitDialogClose();
                props.getMetricUnit();
            } else {
                SetMessage(`"${t("Metric Unit")}" ${MetricUnit} ${t("Already Exist")}`)
                SetType("info");
                setOpenSnack(true);
                setMetricUnit('');
                setMetricUnitDesc('');
                handleUnitDialogClose();
            }
        }
        else if (AddMetricUnitError && !AddMetricUnitLoading && AddMetricUnitData === null) {
            SetMessage(`${t("Metric Unit")} ${MetricUnit} ${t("Already Exist")}`)
            SetType("info");
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
            <ModalNDL open={props.UnitDialog} onClose={handleUnitDialogClose} size="lg"> 
                <ModalHeaderNDL>
                <TypographyNDL variant="heading-02-s" model value={t('Add Unit')}/>           
                </ModalHeaderNDL>
                <ModalContentNDL>
                    <InputFieldNDL
                        id="unitname"
                        inputRef={metricunit}
                        placeholder={t('Unit')}
                        label={t('Unit')}
                    />
                    <InputFieldNDL
                        id="unitdesc"
                        inputRef={metricDescription}
                        placeholder={t('Description')}
                        onChange={(e) => setMetricUnitDesc(e.target.value)}
                        label={t('Description')}
                    />
                </ModalContentNDL>
                <ModalFooterNDL>
                    <Button id='reason-update' type="primary" value={t('Save')} onClick={() => saveUnit()}>
                    </Button>
                    <Button id='reason-update' type="secondary" danger value={t('Cancel')} onClick={() => handleUnitDialogClose()}>
                    </Button>
                </ModalFooterNDL>
            </ModalNDL>  

        </React.Fragment>
    )
}
