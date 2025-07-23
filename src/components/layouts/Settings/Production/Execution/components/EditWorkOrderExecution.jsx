import React, { useState, useEffect, useRef, useImperativeHandle } from "react";
import { useTranslation } from 'react-i18next';
import InputFieldNDL from "components/Core/InputFieldNDL";
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import { useRecoilState } from "recoil";
import { user, userLine, WorkOrders, snackToggle, snackMessage, snackType } from "recoilStore/atoms";
import Button from 'components/Core/ButtonNDL'; 
import DatePickerNDL from "components/Core/DatepickerNDL";
import moment from "moment";
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL"; 

import useUpdateExecution from "../hooks/useUpdateExecution";

const EditWorkOrderExecution = React.forwardRef((props, ref) => {

    const { t } = useTranslation();
    const [currUser] = useRecoilState(user)
    const [operatorsList] = useRecoilState(userLine);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [executionID, setExecutionID] = useState({ value: "", name: "", isValid: true });
    const [, setmanufacturedquantity] = useState({ value: "", isValid: true })
    const [orderID, setOrderID] = useState({ value: "", name: "", isValid: true });
    const [execinfo, setExecInfo] = useState({})
    const [status, setStatus] = useState('')
    const [dateerr, setdateerr] = useState('')
    const [enddateerr, setenddateerr] = useState('')
    const [decline_reason, setDeclineReason] = useState('')
    const [, setstdrate] = useState(0)
    const [, settargetedqty] = useState(0)
    const OrderIDRef = useRef();
    const assetRef = useRef();
    const targetquantityRef = useRef()
    const manufacturedquantityRef = useRef()


    const [date, setdate] = useState({ value: null, isValid: true })
    const [enddate, setenddate] = useState({ value: null, isValid: true })
    const [selectedUser, setselectedUser] = useState({ value: '', isValid: true })
    const [selectedAsset,setselectedAsset] = useState('')

    const [maxdate, setmaxdate] = useState('')
    const [mindate, setmindate] = useState('')

    const [workorderdata] = useRecoilState(WorkOrders)
    const { updateExecutionLoading, updateExecutionData, updateExecutionError, getupdateExecution } = useUpdateExecution();



    useEffect(() => {
        if (!updateExecutionLoading && !updateExecutionError && updateExecutionData) {

            if (updateExecutionData) {
                SetMessage(t('Updated  workorder execution for workorder ') + orderID.name)
                SetType("success")
                setOpenSnack(true);
                props.getUpdatedWorkOrderExecutionList()
                handleWorkOrderExecutionDialogClose();
            } else {
                SetMessage(t('Failed to update a new workorder execution for workorder ') + orderID.name)
                SetType("error")
                setOpenSnack(true)
                handleWorkOrderExecutionDialogClose();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateExecutionLoading, updateExecutionData, updateExecutionError])





    useImperativeHandle(ref, () => ({
        handleEditWorkOrderExecutionDialogOpen: (data) => {
            handleEditWorkOrderExecutionDialogOpen(data)
        }

    })
    )




    const handleWorkOrderExecutionDialogClose = () => {
        setdate({ value: null, isValid: true })
        setenddate({ value: null, isValid: true })
        setselectedUser({ value: '', isValid: true })
        props.handleDialogClose()
    };

    const handleEditWorkOrderExecutionDialogOpen = (data) => {
        setOrderID({ value: data.prod_order.id, name: data.prod_order.order_id, isValid: true })
        setExecutionID({ value: data.id, isValid: true })
        setmaxdate(new Date(data.prod_order.end_dt))
        setmindate(data.prod_order.start_dt)
        setdate({ value: data.start_dt ? new Date(moment(data.start_dt).format('YYYY-MM-DD HH:mm:ss')) : null, isValid: data.start_dt ? true : false })
        setenddate({ value: data.end_dt ? new Date(moment(data.end_dt).format('YYYY-MM-DD HH:mm:ss')) : null, isValid: data.end_dt ? true : false})
        setselectedUser({ value: data.userByOperatorId.id, name: data.userByOperatorId.name, isValid: true })
        setExecInfo(data.info ? data.info : {})
        setStatus(data.status)
        setDeclineReason(data.decline_reason ? data.decline_reason : '')
        setstdrate(data.prod_order.prod_product.unit)
        settargetedqty(data.prod_order.qty)
        setselectedAsset(data.entity_id)
        setmanufacturedquantity({ value: data.info && data.info.Quantity ? Number(data.info.Quantity) : '', isValid: true })
        setTimeout(() => {
            if (OrderIDRef.current) {
                OrderIDRef.current.value = data.prod_order.order_id;
            }
            if( assetRef.current){
                assetRef.current.value = data.entity.name
            }
            if(targetquantityRef.current){
                targetquantityRef.current.value = data.prod_order.qty
            }
            if( manufacturedquantityRef.current){
                manufacturedquantityRef.current.value = data.info && data.info.Quantity ? Number(data.info.Quantity) : 0
            }
          

        }, 500)




    };


    const handleUser = (event) => {
        setselectedUser({ value: event.target.value, isValid: true });
    }



    const wordorderexecutioncrudoperations = () => {
        if (manufacturedquantityRef.current) {
            if ( date.value === "" ||
            new Date(enddate.value).getTime() < new Date(date.value).getTime() ||
            new Date(date.value).getTime() < new Date(mindate).getTime()) {
                setdate({ value: date.value, isValid: false })
                if (date.value === "") setdateerr(t("Start date can not be empty"))
                else if ((new Date(date.value).getTime() < new Date(mindate).getTime())) setdateerr(t("Select appropriate startdate"))
                else setdateerr(t("Start date can not exceed end date!"))
            } else if (enddate.value === "" || (new Date(enddate.value).getTime() < new Date(date.value).getTime()) ||
                (new Date(enddate.value).getTime() > new Date(maxdate).getTime())) {
                setenddate({ value: enddate.value, isValid: false })
                if (enddate.value === "") setenddateerr(t("End date can not be empty"))
                else if ((new Date(enddate.value).getTime() > new Date(maxdate).getTime())) {
                    setenddateerr("Select appropriate enddate")
                }
                else {
                    setenddateerr(t("Start date can not exceed end date!"))

                }

            } else if (selectedUser.value === "") {
                setselectedUser({ value: "", isValid: false })
            } else if (manufacturedquantityRef.current.value < 0) {
                setmanufacturedquantity({ value: "", isValid: false })
            } else {
                var relatedworkorder = workorderdata.filter(val => val.id === orderID.value)
                if (relatedworkorder.length > 0 && relatedworkorder[0].prod_execs.length > 0) {
                    var starts = []
                    var ends = []
                    // eslint-disable-next-line array-callback-return
                    relatedworkorder[0].prod_execs.map(p => { if(executionID.value !== p.id) starts.push(p.start_dt) })
                    // eslint-disable-next-line array-callback-return
                    relatedworkorder[0].prod_execs.map(p => { if(executionID.value !== p.id) ends.push(p.end_dt) })
                    if (starts.findIndex(s => new Date(s).getTime() >= new Date(moment(date.value).set('seconds', 0).set('milliseconds', 0)).getTime() &&
                        new Date(s).getTime() <= new Date(moment(enddate.value).set('seconds', 0).set('milliseconds', 0)).getTime()) >= 0 ||
                        ends.findIndex(s => new Date(s).getTime() <= new Date(moment(enddate.value).set('seconds', 0).set('milliseconds', 0)).getTime() &&
                            new Date(s).getTime() >= new Date(moment(date.value).set('seconds', 0).set('milliseconds', 0)).getTime()) >= 0) {
                        SetType('warning')
                        SetMessage(t('Executions can not have overlapping timelines.Select appropriate time for the current execution'))
                        setOpenSnack(true)
                    } else {
                        getupdateExecution({
                            id: executionID.value, end_dt: new Date(moment(enddate.value).set('seconds', 0).set('milliseconds', 0)),
                            start_dt: new Date(moment(date.value).set('seconds', 0).set('milliseconds', 0)),
                            info: Object.assign({}, execinfo, { "Quantity": Math.floor(manufacturedquantityRef.current.value) }), operator_id: selectedUser.value, user_id: currUser.id, status: status,
                            decline_reason: decline_reason
                        })
                    }
                }else if (props.executiondata.length > 0) {
                    var running_entity = props.executiondata.findIndex(e =>
                        ((new Date(e.start_dt).getTime() >= new Date(moment(date.value).set('seconds', 0).set('milliseconds', 0)).getTime() &&
                            new Date(e.start_dt).getTime() <= new Date(moment(enddate.value).set('seconds', 0).set('milliseconds', 0)).getTime()) ||
                            (new Date(e.end_dt).getTime() <= new Date(moment(enddate.value).set('seconds', 0).set('milliseconds', 0)).getTime() &&
                                new Date(e.end_dt).getTime() >= new Date(moment(date.value).set('seconds', 0).set('milliseconds', 0)).getTime())) &&
                        e.entity_id === selectedAsset && e.id !==executionID.value)
                    if(running_entity>=0){
                        SetType('warning')
                        SetMessage(t('The asset is already running for the selected duration'))
                        setOpenSnack(true)
                    }else {
                       
                        getupdateExecution({
                            id: executionID.value, end_dt: new Date(moment(enddate.value).set('seconds', 0).set('milliseconds', 0)),
                            start_dt: new Date(moment(date.value).set('seconds', 0).set('milliseconds', 0)),
                            info: Object.assign({}, execinfo, { "Quantity": Math.floor(manufacturedquantityRef.current.value) }), operator_id: selectedUser.value, user_id: currUser.id, status: status,
                            decline_reason: decline_reason
                        })
                    }
                }
                else {
                   
                    getupdateExecution({
                        id: executionID.value, end_dt: new Date(moment(enddate.value).set('seconds', 0).set('milliseconds', 0)),
                        start_dt: new Date(moment(date.value).set('seconds', 0).set('milliseconds', 0)),
                        info: Object.assign({}, execinfo, { "Quantity": Math.floor(manufacturedquantityRef.current.value) }), operator_id: selectedUser.value, user_id: currUser.id, status: status,
                        decline_reason: decline_reason
                    })
                }
            }


        }

    }


   
    return (
        <React.Fragment> 
                <ModalHeaderNDL>
                <TypographyNDL variant="heading-02-s" model value={t('Start Execution')}/>           
                </ModalHeaderNDL>
                <ModalContentNDL>
                <div>
                        <InputFieldNDL
                            label={t('WorkOrder')}
                            inputRef={OrderIDRef}
                            disabled={true}
                        />
                        <InputFieldNDL
                            label={t('Asset')}
                            inputRef={assetRef}
                            disabled={true}
                        />
                        <InputFieldNDL
                            label={t('Targeted Quantity')}
                            inputRef={targetquantityRef}
                            disabled={true}
                        />
                        <InputFieldNDL
                            label={t('Manufactured Quantity')}
                            type={"number"}
                            inputRef={manufacturedquantityRef}
                            disabled={true}


                        />
                        
                        <span className="block mb-2 text-[14px]  leading-[18px] font-medium text-primary-text dark:text-primary-text my-2">{t("Start Date")}</span>
                        <DatePickerNDL
                            id="Date-picker-start"
                            onChange={(e) => {
                                setdate({value:e,isValid: true});
                                }} 
                            startDate={date.value ? new Date(date.value) : date.value}
                            dateFormat="MMM dd yyyy HH:mm:ss"
                            placeholder={t("Enter Start Date")}
                            customRange={false}
                            showTimeSelect={true}  
                            timeFormat="HH:mm:ss" 
                            maxDate={enddate.value ? new Date(enddate.value) : undefined} 
                            minDate={new Date(mindate)}
                                
                        />
                        <span style={{color:'red'}}>{date.isValid ? '' : dateerr}</span> 
                        
                        <span className="block mb-2 text-[14px]  leading-[18px] font-medium text-primary-text dark:text-primary-text my-2">{t("End Date")}</span>
                        <DatePickerNDL
                            id="Date-picker-end"
                            onChange={(e) => {
                                setenddate({value:e,isValid: true});
                                }}  
                            startDate={enddate.value ? new Date(enddate.value) : enddate.value}
                            dateFormat="MMM dd yyyy HH:mm:ss"
                            placeholder={t("Enter End Date")}
                            customRange={false}
                            showTimeSelect={true}  
                            timeFormat="HH:mm:ss" 
                            maxDate={new Date(maxdate)} 
                            minDate={date.value ? new Date(date.value) : undefined}
                                
                        />
                        <span style={{color:'red'}}>{enddate.isValid ? '' : enddateerr}</span>
                           
                        <SelectBox
                            id="operator-id"
                            label={t('Operator')}
                            edit={true}
                            disableCloseOnSelect={true}
                            auto={false}
                            options={operatorsList.map(val => { return { "id": val.user_id, "name": val.userByUserId.name } })}
                            isMArray={true}
                            keyValue={"name"}
                            keyId={"id"}
                            multiple={false}
                            onChange={(e, option) => handleUser(e)}
                            value={selectedUser.value}
                            error={!selectedUser.isValid ? true : false}
                            msg={!selectedUser.isValid ? t("Select the assigned operator") : ""}
                        />

                    </div>
                </ModalContentNDL>
                <ModalFooterNDL> 
                    <Button type="secondary" value={t('Cancel')} onClick={() => handleWorkOrderExecutionDialogClose()} />
                    <Button type="primary" value={t('Update')} onClick={() => wordorderexecutioncrudoperations()} /> 
                </ModalFooterNDL> 
        </React.Fragment>
    );
});
export default EditWorkOrderExecution;

