/* eslint-disable no-unused-vars */
import React, { useState, useImperativeHandle } from 'react';
import ModalNDL from 'components/Core/ModalNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import configParam from "config";
import {useParams} from "react-router-dom"
 

 
import Button from "components/Core/ButtonNDL";
import { useTranslation } from 'react-i18next';

const downloadPopupModal = React.forwardRef((props, ref) => {
    const { t } = useTranslation();
    const [modalDialog, setModalDialog] = useState(false); 
    let {schema,moduleName,subModule1,subModule2} = useParams()
    const [, setRemoveOkAlarm] = useState(false);
  

    useImperativeHandle(ref, () =>
    (
        {
            handleAlarmDownloadModal: (val) => {
                setModalDialog(val)
                if(props.viewType === 'downtime' || props.viewType === 'tool'){
                    setRemoveOkAlarm(true)
                    props.getRemoveOkAlarm(true)
                }
                
            },
            handleDownloadModalClose: () =>{
                handleDownloadModalClose()
            }
        }
    )
    )

    function handleDownloadModalClose() {
        setModalDialog(false)
        props.setEnableModal(false)
     
    }

   

   

    const handleDownloadClick = (e) =>{
        setModalDialog(false);
        props.setEnableModal(false)
        // props.forwardBulkRef()
        localStorage.setItem("isBulkOpen",true); 
        window.open(configParam.APP_URL + '/'+schema+'/reports');
        
    }

 

    return (
        <ModalNDL onClose={() => handleDownloadModalClose} open={modalDialog} >
            <ModalHeaderNDL>
                    <div style={{ display: "block" }}>
                        <TypographyNDL variant="heading-02-s" value={"Generating Your Report"} />
                    </div>
            </ModalHeaderNDL>
            <ModalContentNDL height={"100%"}>
            <TypographyNDL variant="paragraph-s" color="secondary" value={"Your report is being generated in the background , Please check the status of the report by clicking on View Progress"} />
            </ModalContentNDL>
            <ModalFooterNDL>
                <Button type="secondary" style={{ width: "80px" }} value={t('Close')} onClick={() => handleDownloadModalClose()} />
                <Button type="primary" style={{ width: "150px" }} value={t("View Progress")} onClick={() => handleDownloadClick()} loading={props.loading} />
            </ModalFooterNDL>
        </ModalNDL>
    )
})
export default downloadPopupModal;