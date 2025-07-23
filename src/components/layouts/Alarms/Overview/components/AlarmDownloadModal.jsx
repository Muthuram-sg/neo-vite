/* eslint-disable no-unused-vars */
import React, { useState, useImperativeHandle } from 'react';
import ModalNDL from 'components/Core/ModalNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import Grid from 'components/Core/GridNDL';
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import CustomSwitch from "components/Core/CustomSwitch/CustomSwitchNDL";
import Button from "components/Core/ButtonNDL";
import { useTranslation } from 'react-i18next';

const DownloadModal = React.forwardRef((props, ref) => {
    const { t } = useTranslation();
    const [modalDialog, setModalDialog] = useState(false); 
    const [removeRepeatAlarm, setRemoveRepeatAlarm] = useState(false);
    const [removeOkAlarm, setRemoveOkAlarm] = useState(false);
    const [exceptionFilter, setExceptionFilter] = useState('');
    const [isValidException, setIsValidException] = useState(false);

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
        setRemoveRepeatAlarm(false)
        setRemoveOkAlarm(false)
        setIsValidException(false)
        setExceptionFilter('')
        props.getRemoveOkAlarm(false)
        props.getRemoveRepeatAlarm('')
    }

    const handleRemoveRepeatAlarm = () =>{
        setRemoveRepeatAlarm(!removeRepeatAlarm)
        setExceptionFilter('')
        props.getRemoveRepeatAlarm('')
    }

    const handleRemoveOkAlarm = () =>{
        setRemoveOkAlarm(!removeOkAlarm)
        props.getRemoveOkAlarm(!removeOkAlarm)
    }

    const handleExceptionChange = (e) =>{
        setExceptionFilter(e.target.value)
        setIsValidException(false)
        props.getRemoveRepeatAlarm(e.target.value)
    }

    const handleDownloadClick = (e) =>{

        if(removeRepeatAlarm && exceptionFilter === ""){
            setIsValidException(true)
            return false
        }
        
        
        props.handleDownloadClick()
        console.log("handleDownloadClick")
    }

    const exceptionOption = [
        { id: 1, name: t("Minimum") },
        { id: 2, name: t("Maximum") },
        { id: 3, name: t("Recent") },
        { id: 4, name: t("Oldest") }
    ]

    return (
        <ModalNDL onClose={() => handleDownloadModalClose} open={modalDialog} >
            <ModalHeaderNDL>
                    <div style={{ display: "block" }}>
                        <TypographyNDL variant="heading-02-s" value={t("Download Alarms")} />
                    </div>
            </ModalHeaderNDL>
            <ModalContentNDL height={"100%"}>
                <React.Fragment>
                    <Grid container>
                        <Grid item xs={12} sm={12}>
                            <TypographyNDL variant="paragraph-s" color={'secondary'} value={t("Confirm the initiation of a download within the specific range. Customize your download preferences by selecting options below.")} ></TypographyNDL>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                                <div >
                                    <TypographyNDL variant={"label-02-s"} >{t("Remove Repetitions")}</TypographyNDL>
                                    <TypographyNDL variant={"lable-01-s"} color={"secondary"} >{t('Enabling this will remove repeated alarms while downloading.')}</TypographyNDL>
                                </div>
                                <CustomSwitch
                                    id={"switch"}
                                    switch={true}
                                    checked={removeRepeatAlarm}
                                    onChange={handleRemoveRepeatAlarm}
                                    size="small"
                                />
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                        {
                            removeRepeatAlarm && 
                            <SelectBox
                                labelId="Select-sort-label"
                                id="selectSortLabel"
                                value={exceptionFilter}
                                placeholder={t('Choose Exception')}
                                options={props.viewType !== 'downtime' && props.viewType !== 'tool' ? exceptionOption : exceptionOption.filter(f=>f.id !== 1 && f.id !== 2)}
                                onChange={handleExceptionChange}
                                multiple={false}
                                isMArray={true}
                                auto={false}
                                keyValue="name"
                                keyId="id"
                                error={isValidException}
                                msg={t("Please select Exception")}
                            />
                        }
                        </Grid>
                        {props.viewType !== 'downtime' && props.viewType !== 'tool' &&
                        <Grid item xs={12} sm={12}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                                <div >
                                    <TypographyNDL variant={"label-02-s"} >{t("Remove “Ok” Alarms")}</TypographyNDL>
                                    <TypographyNDL variant={"lable-01-s"} color={"secondary"} >{t('Enabling this will remove “Ok” alarms while downloading.')}</TypographyNDL>
                                </div>
                                <CustomSwitch
                                    id={"switch"}
                                    switch={true}
                                    checked={removeOkAlarm}
                                    onChange={handleRemoveOkAlarm}
                                    size="small"
                                />
                            </div>
                        </Grid>}
                    </Grid>

                </React.Fragment>
            </ModalContentNDL>
            <ModalFooterNDL>
                <Button type="secondary" style={{ width: "80px" }} value={t('Cancel')} onClick={() => handleDownloadModalClose()} />
                <Button type="primary" style={{ width: "80px" }} value={t("Download")} onClick={() => handleDownloadClick()} loading={props.loading} />
            </ModalFooterNDL>
        </ModalNDL>
    )
})
export default DownloadModal;