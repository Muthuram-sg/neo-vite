/* eslint-disable array-callback-return */
import React, { useState, useEffect, useRef, useImperativeHandle } from "react"; 
import { useTranslation } from 'react-i18next';
import InputFieldNDL from "components/Core/InputFieldNDL";
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import { useRecoilState } from "recoil";
import { selectedPlant, user, userLine, snackToggle, snackMessage, snackType } from "recoilStore/atoms";
import Button from 'components/Core/ButtonNDL';
import DatePickerNDL from "components/Core/DatepickerNDL";
import moment from "moment";
import useEntity from "components/layouts/Settings/Entity/hooks/useEntity";
import useAddWorkOrderExecution from "../hooks/useAddWorkOrderExecution";
import usegetOrderList from "../../Execution/hooks/useExecutionOrderList";
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL";


const AddWorkOrderExecution = React.forwardRef((props, ref) => {

    const { t } = useTranslation();

    const [headPlant] = useRecoilState(selectedPlant);
    const [currUser] = useRecoilState(user)
    const [operatorsList] = useRecoilState(userLine);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [, setWorkOrderExecutionDialog] = useState(false);
    const [orderID, setOrderID] = useState({ value: "", name: "", isValid: true });
    const [orderIDRef,setOrderIDRef] = useState('')
    const [productRef,setProductRef] = useState('')

    // const OrderIDRef = useRef();
    // const productRef = useRef();


    const [date, setdate] = useState({ value: null, isValid: true })
    const [enddate, setenddate] = useState({ value: null, isValid: true })
    const [, setdeliverydate] = useState({ value: '', isValid: true })
    const [selectedAsset, setselectedAsset] = useState({ value: '', isValid: true })
    // const [selectedUser, setselectedUser] = useState({ value: '', isValid: true })

    const [maxdate, setmaxdate] = useState('')
    const [mindate, setmindate] = useState('')

    const [executiondata, setexecutiondata] = useState([])

    const { AddWorkOrderExecutionLoading, AddWorkOrderExecutionData, AddWorkOrderExecutionError, getAddWorkOrderExecution } = useAddWorkOrderExecution();
    const { outOLLoading, outOLData, outOLError, getOrderList } = usegetOrderList();

    const { EntityLoading, EntityData, EntityError, getEntity } = useEntity()
   
   

    useEffect(() => {
        getEntity(headPlant.id)
        getOrderList()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant.id])



    useEffect(() => {
        if (!AddWorkOrderExecutionLoading && !AddWorkOrderExecutionError && AddWorkOrderExecutionData) {

            if (AddWorkOrderExecutionData) {
                SetMessage(t('Added a new workorder execution for workorder ') + orderID.name)
                SetType("success")
                setOpenSnack(true);
                props.getUpdatedWorkOrderList()
                handleWorkOrderExecutionDialogClose();
            } else {
                SetMessage(t('Failed to add a new workorder execution for workorder ') + orderID.name)
                SetType("error")
                setOpenSnack(true)
                handleWorkOrderExecutionDialogClose();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [AddWorkOrderExecutionLoading, AddWorkOrderExecutionData, AddWorkOrderExecutionError])





    useImperativeHandle(ref, () => ({
        handleWorkOrderExecutionDialog: (data) => {
            console.log(data,"datadata")
            handleWorkOrderExecutionDialogOpen(data)
        }

    })
    )

    useEffect(() => {
        if (!outOLLoading && !outOLError && outOLData) {
            setexecutiondata(outOLData)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [outOLLoading, outOLData, outOLError])



    const handleWorkOrderExecutionDialogClose = () => {
        setdate({ value: null, isValid: true })
        setenddate({ value: null, isValid: true })
        setdeliverydate({ value: null, isValid: true })
        setselectedAsset({ value: '', isValid: true })
        // setselectedUser({ value: '', isValid: true })
        setWorkOrderExecutionDialog(false);
        props.handleWorkOrderExecutionDialogClose()
    };

    const handleWorkOrderExecutionDialogOpen = (data) => {
       
        setWorkOrderExecutionDialog(true);
        setOrderID({ value: data.id, name: data.order_id, isValid: true })
        setmaxdate(data.end_dt)
        let stDate = data.start_dt
        if(data.prod_execs.length>0){
            let prodexe = [...data.prod_execs]
            prodexe.sort((a, b) => new Date(b.start_dt) - new Date(a.start_dt));
            // console.log(prodexe,"prodexe",prodexe[0].end_dt)
            stDate = new Date(moment(prodexe[0].end_dt).add(1,'second').format('YYYY-MM-DDTHH:mm:ss'))
        }
        // console.log(data,"handleWorkOrderExecutionDialogOpen",stDate,data.prod_execs)
        setmindate(stDate)
        setdate({ value: stDate, isValid: true })
        setenddate({ value: data.end_dt ? data.end_dt : null, isValid: true })
        setdeliverydate({ value: data.delivery_date, isValid: true })

      
            console.log(data,{ value: data.id, name: data.order_id, isValid: true },"data")
            setOrderIDRef(data.order_id)
            setProductRef(data.prod_product.name)
            // if (OrderIDRef.current) {
            //     OrderIDRef.current.value = data.order_id;
            //  }
            //  if (productRef.current) {
            //     productRef.current.value = data.prod_product.name;
            //  }

       
       
    };
    console.log(orderID,maxdate,mindate,date,enddate,"val")
    const handleAsset = (event) => {
        setselectedAsset({ value: event.target.value, isValid: true });
    }
    const handleUser = (event) => {
        // setselectedUser({ value: event.target.value, isValid: true });
    }



    const wordordercrudoperations = () => {
        if (orderIDRef) {
            if (orderIDRef=== "") {
                setOrderID({ value: "", name: "", isValid: false })
            } else if (date.value === "" || (new Date(date.value).getTime() < new Date(mindate).getTime()) ||
                (new Date(date.value).getTime() > new Date(enddate.value).getTime())
            ) {
                setdate({ value: date.value, isValid: false })
            } else if (enddate.value === "" ||
                (new Date(enddate.value).getTime() < new Date(date.value).getTime())
            ) {
                setenddate({ value: enddate.value, isValid: false })
            }
            // else if (deliverydate.value === "") {
            //     setdeliverydate({ value: "", isValid: false })
            // }
            else if (selectedAsset.value === "") {
                setselectedAsset({ value: "", isValid: false })
            }
            // else if (selectedUser.value === "") {

            //     setselectedUser({ value: "", isValid: false })
            // }
            else {
                var relatedworkorder = props.workorderlist.filter(val => val.id === orderID.value)
                if (relatedworkorder.length > 0 && relatedworkorder[0].prod_execs.length > 0) {
                    var starts = []
                    var ends = []

                    relatedworkorder[0].prod_execs.map(p => { starts.push(p.start_dt) })
                    relatedworkorder[0].prod_execs.map(p => { ends.push(p.end_dt) })
                    if (starts.findIndex(s => new Date(s).getTime() >= new Date(moment(date.value).set('seconds', 0).set('milliseconds', 0)).getTime() &&
                        new Date(s).getTime() <= new Date(moment(enddate.value).set('seconds', 0).set('milliseconds', 0)).getTime()) >= 0 ||
                        ends.findIndex(s => new Date(s).getTime() <= new Date(moment(enddate.value).set('seconds', 0).set('milliseconds', 0)).getTime() &&
                            new Date(s).getTime() >= new Date(moment(date.value).set('seconds', 0).set('milliseconds', 0)).getTime()) >= 0) {
                        SetType('warning')
                        SetMessage(t('Executions can not have overlapping timelines.Select appropriate time for the current execution'))
                        setOpenSnack(true)
                    } else {
                       
                        let datas={
                            orderID:orderID.value,
                            stDate:new Date(moment(date.value).set('second', 0).set('milliseconds', 0))
                        }
                        getAddWorkOrderExecution(datas, new Date(moment(enddate.value).set('second', 0).set('milliseconds', 0)), selectedAsset.value, currUser.id, currUser.id, headPlant.id, 1)
                    }
                } else if (executiondata.length > 0) {
                    var running_entity = executiondata.findIndex(e =>
                        ((new Date(e.start_dt).getTime() >= new Date(moment(date.value).set('seconds', 0).set('milliseconds', 0)).getTime() &&
                            new Date(e.start_dt).getTime() <= new Date(moment(enddate.value).set('seconds', 0).set('milliseconds', 0)).getTime()) ||
                            (new Date(e.end_dt).getTime() <= new Date(moment(enddate.value).set('seconds', 0).set('milliseconds', 0)).getTime() &&
                                new Date(e.end_dt).getTime() >= new Date(moment(date.value).set('seconds', 0).set('milliseconds', 0)).getTime())) &&
                        e.entity_id === selectedAsset.value)
                    if(running_entity>=0){
                        SetType('warning')
                        SetMessage(t('The asset is already running for the selected duration'))
                        setOpenSnack(true)
                    }else {
                        let datas1={
                            orderID:orderID.value,
                            stDate:new Date(moment(date.value).set('second', 0).set('milliseconds', 0))
                        }
                        getAddWorkOrderExecution(datas1, new Date(moment(enddate.value).set('second', 0).set('milliseconds', 0)), selectedAsset.value, currUser.id, currUser.id, headPlant.id, 1)
                    }
                }
                else {
                    let datas2={
                        orderID:orderID.value,
                        stDate:new Date(moment(date.value).set('second', 0).set('milliseconds', 0))
                    }
                    getAddWorkOrderExecution(datas2, new Date(moment(enddate.value).set('second', 0).set('milliseconds', 0)), selectedAsset.value, currUser.id, currUser.id, headPlant.id, 1)
                }

            }


        }

    }


   
    return (
        <React.Fragment>  
                <ModalHeaderNDL>
                <TypographyNDL variant="heading-02-xs" model value={t('StartExecution')}/>           
                </ModalHeaderNDL>
                <ModalContentNDL>
                <div>
                        <InputFieldNDL
                            label={t('WorkOrder')}
                            //inputRef={OrderIDRef}
                            disabled={true}
                            value={orderIDRef}
                        />
                        <div className="mb-3" />

                        <InputFieldNDL
                            label={t('Products')}
                            //inputRef={productRef}
                            disabled={true}
                            value={productRef}

                        />
                        <div className="mb-3" />

                <TypographyNDL variant="pargraph-xs"  value={t("Start Date")}/>  
                <div className="mb-0.5" />

                        <DatePickerNDL
                              id="custom-range"
                              onChange={(dates) => { 
                                setdate({ value: dates, isValid: true })
                              }} 
                              startDate={new Date(date.value)} 
                              placeholder={t("Enter Start Date")} 
                              dateFormat={'MMM dd yyyy HH:mm:ss'}
                              timeFormat="HH:mm:ss" 
                              showTimeSelect={true} 
                              maxDate={enddate.value ? new Date(enddate.value) : undefined}
                              minDate={mindate ? new Date(mindate) : null}
                        />
                        {
                            !date.isValid ?
                            <React.Fragment>
<div className="mb-0.5" />
<TypographyNDL variant="pargraph-xs" color='danger'  value={!date.isValid ? t("Select appropriate startdate") : ""}/>  
                            </React.Fragment>
                                     
                            :
                            <></>

                        }
                        <div className="mb-3" />
              

                <TypographyNDL variant="pargraph-xs"  value={t("End Date")}/>           
                        
                <div className="mb-0.5" />
                       
                        <DatePickerNDL
                              id="custom-range-End"
                              onChange={(dates) => { 
                                setenddate({ value: dates, isValid: true })
                              }} 
                              startDate={enddate.value ? new Date(enddate.value): new Date()} 
                              placeholder={t("Enter End Date")} 
                              dateFormat={'MMM dd yyyy HH:mm:ss'}
                              timeFormat="HH:mm:ss" 
                              showTimeSelect={true} 
                            //   maxDate={maxdate ? new Date(maxdate) : null}
                              minDate={date.value ? new Date(date.value) : undefined}
                        />
                        {
                            !enddate.isValid && 
                            <div className="mt-0.5">
                            <TypographyNDL variant="pargraph-xs" color='danger'  value={!enddate.isValid ? t("Select appropriate enddate") : ""} />
                            </div>
                        }
                         
                        {/* <InputFieldNDL
                            value={deliverydate.value ? moment(deliverydate.value).format("MMM DD YYYY") : ""}
                            size="small"
                            onClick={handledeliverydateclick}
                            style={{ caretColor: "transparent" }}
                            label={"Delivery Date"}
                            placeholder={"Enter Delivery Date"}
                        />
                        <Popover id={"Date-Compare-Waterfall"} open={Boolean(deliverydatepopper)} anchorEl={deliverydatepopper} transition
                            onClose={deliverydatepopperclose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}

                        >
                            <Starttime getProps={{ selectedstarttime: (e) => { setdeliverydate({ value: e, isValid: true }); } }}  minDate={enddate.value ? enddate.value : undefined} custom />
                        </Popover> */}
                        <div className="mb-3" />

                        <SelectBox
                            id="asset-id"
                            label={t('Asset')} 
                            edit={true}
                            disableCloseOnSelect={true}
                            auto={false}
                            options={!EntityLoading && !EntityError && EntityData ? EntityData : []}
                            isMArray={true}
                            keyValue={"name"}
                            keyId={"id"}
                            multiple={false}
                            onChange={(e, option) => handleAsset(e)}
                            value={selectedAsset.value}
                            error={!selectedAsset.isValid ? true : false}
                            msg={!selectedAsset.isValid ? t("Select an Asset") : ""}
                        />
                        {/* <SelectBox
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
                        /> */}
                        <div className="mb-3" />
                    </div>
                </ModalContentNDL>
                <ModalFooterNDL>
                
                    <Button type="secondary"  value={t('Cancel')} onClick={() => handleWorkOrderExecutionDialogClose()} />
                    <Button type="primary"  value={t('Start')} onClick={() => wordordercrudoperations()} />
                </ModalFooterNDL> 
        </React.Fragment>
    );
});
export default AddWorkOrderExecution;

