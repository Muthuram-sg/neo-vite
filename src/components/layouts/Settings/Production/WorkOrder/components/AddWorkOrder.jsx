import React, { useState, useEffect, useRef, useImperativeHandle } from "react";
import Grid from 'components/Core/GridNDL'
import { useTranslation } from 'react-i18next';
import InputFieldNDL from "components/Core/InputFieldNDL";
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import { useRecoilState } from "recoil";
import { selectedPlant, user, snackToggle, snackMessage, snackType } from "recoilStore/atoms";
import Button from 'components/Core/ButtonNDL'; 
import moment from "moment";

import useProducts from "../../Product/hooks/useProducts";
import useAddWorkOrder from "../hooks/useAddWorkOrder";
import useEditWorkOrder from "../hooks/useEditWorkOrder";
import useDeleteWorkOrder from "../hooks/useDeleteWorkOrder";
import useProductUnit from 'Hooks/useGetProductUnit';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import DatePickerNDL from "components/Core/DatepickerNDL";

const AddWorkOrder = React.forwardRef((props, ref) => {

    const { t } = useTranslation();


    const [headPlant] = useRecoilState(selectedPlant);
    const [currUser] = useRecoilState(user)
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [orderiderrmsg, setorderIDErrMsg] = useState('')
    const [, setWorkOrderDialog] = useState(false);
    const[invalidDate,setInvalidDate]=useState("");
    const[dateError,setDateError]=useState(false)
    const [workOrderDialogMode, setWorkOrderDialogMode] = useState("create");
    const [orderID, setOrderID] = useState({ value: "", name: "", isValid: true });
    const [, setquantity] = useState({ value: "", isValid: true })
    const [selectedstdrate,setselectedstdrate]=useState(0)

    const OrderIDRef = useRef();
    const quantityRef = useRef()


    const [date, setdate] = useState({ value: null, isValid: true })
    const [, setdatepopper] = useState(null)
    const [, setdeliverydatepopper] = useState(null)
    const [enddate, setenddate] = useState({ value: null, isValid: true })
    const [deliverydate, setdeliverydate] = useState({ value: null, isValid: true })
    const [selectedProduct, setselectedProduct] = useState('')
    const [workorderexecdurations, setworkorderexecdurations] = useState([])
    const [quantityUnit,setQuantityUnit] = useState(53)

    const { outGPLoading, outGPData, outGPError, getProduct } = useProducts();
    const { AddWorkOrderLoading, AddWorkOrderData, AddWorkOrderError, getAddWorkOrder } = useAddWorkOrder();
    const { EditWorkOrderLoading, EditWorkOrderData, EditWorkOrderError, getEditWorkOrder } = useEditWorkOrder();
    const { DeleteWorkOrderLoading, DeleteWorkOrderData, DeleteWorkOrderError, getDeleteWorkOrder } = useDeleteWorkOrder();
    const { ProductUnitsLoading, ProductUnitsData, ProductUnitsError, getProductUnit } = useProductUnit();

  
    useEffect(()=>{
        getProductUnit();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    useEffect(() => {
        getProduct()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant])


    useEffect(()=>{

        if(enddate && date ){
            
           if(quantityRef.current){
             quantityRef.current.value = Math.floor(((new Date(moment(enddate.value).set('seconds',0).set('milliseconds',0))-new Date(moment(date.value).set('seconds',0).set('milliseconds',0)))/1000/60 ) * (Number(selectedstdrate)/60))
                        }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[enddate,date,selectedstdrate])

    useEffect(() => {
        if (!AddWorkOrderLoading && !AddWorkOrderError && AddWorkOrderData) {
            if (AddWorkOrderData) { 
                SetMessage(t('Added a new workorder ') + orderID.name)
                SetType("success")
                setOpenSnack(true);
                handleWorkOrderDialogClose();
                props.getUpdatedWorkOrderList()
            } else {
                SetMessage(t('Failed to add a new workorder ') + orderID.name)
                SetType("error")
                setOpenSnack(true)
                handleWorkOrderDialogClose();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [AddWorkOrderLoading, AddWorkOrderData, AddWorkOrderError])


    useEffect(() => {
        if (!EditWorkOrderLoading && !EditWorkOrderError && EditWorkOrderData) {
            if (EditWorkOrderData.affected_rows >= 1) {
                SetMessage(t('Updated the workorder ') + orderID.name)
                SetType("success")
                setOpenSnack(true);
                handleWorkOrderDialogClose();
                props.getUpdatedWorkOrderList()
            } else {
                SetMessage(t('Failed to update the workorder ') + orderID.name)
                SetType("error")
                setOpenSnack(true)
                handleWorkOrderDialogClose();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [EditWorkOrderLoading, EditWorkOrderData, EditWorkOrderError])
    useEffect(() => {
        if (!DeleteWorkOrderLoading && !DeleteWorkOrderError && DeleteWorkOrderData) {
            let delArr = []
            // eslint-disable-next-line array-callback-return
            Object.keys(DeleteWorkOrderData).forEach(val => {
                if (DeleteWorkOrderData[val].affected_rows >= 1) {
                  delArr.push("1");
                }
              });
              
            if (delArr.length > 0) {
                handleWorkOrderDialogClose();
                SetMessage(t('Deleted WorkOrder ') + orderID.name)
                SetType("success")
                setOpenSnack(true)
                props.getUpdatedWorkOrderList()
            }else {
                handleWorkOrderDialogClose();
                SetMessage(t('Workorder  ') + orderID.name + t('deletion failed'))
                SetType("warning")
                setOpenSnack(true)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [DeleteWorkOrderLoading, DeleteWorkOrderData, DeleteWorkOrderError])
    useImperativeHandle(ref, () =>
    (
        {
            handleWorkOrderDialog: () => {
                setWorkOrderDialog(true)
                setWorkOrderDialogMode("create")
            },
            handleDeleteDialogOpen: (data) => {

                setWorkOrderDialogMode("delete")
                setOrderID({ value: data.id, name: data.order_id, isValid: true })
                setWorkOrderDialog(true);
            },
            handleEditWorkOrderDialogOpen: (data) => {
                handleEditEnitytDialogOpen(data)
            }
        }
    )
    )



    const handleWorkOrderDialogClose = () => {
        setdate({ value: null, isValid: true })
        setenddate({ value: null, isValid: true })
        setdeliverydate({ value: null, isValid: true })
        setselectedProduct({ value: null, isValid: true })
        setquantity({ value: "", isValid: true })
        setWorkOrderDialog(false);
        props.handleWorkOrderDialogClose()
    };

    const handleEditEnitytDialogOpen = (data) => {
    
        setWorkOrderDialog(true);
        setWorkOrderDialogMode("edit")
        setOrderID({ value: data.id, name: data.order_id, isValid: true })
        setdate({ value: data.start_dt, isValid: true })
        setenddate({ value: data.end_dt, isValid: true })
        setdeliverydate({ value: data.delivery_date, isValid: true })
        setselectedProduct({ value: data.prod_product.id, isValid: true })
        setquantity({ value: data.qty, isValid: true })
        setselectedstdrate(data.prod_product.unit)
        setQuantityUnit(data.quantity_unit)
        if (data.prod_execs.length > 0) {
            setworkorderexecdurations(data.prod_execs.map(val => { return { 'start_dt': val.start_dt, 'end_dt': val.end_dt } }))
        }
        setTimeout(() => {
            OrderIDRef.current.value = data.order_id
            quantityRef.current.value = data.qty
        }, 200)  
    };

    const handleProduct = (event) => {
        var stdrate = outGPData.filter(val=>val.id===event.target.value).length > 0 ? outGPData.filter(val=>val.id===event.target.value)[0] : 0
        setselectedstdrate(stdrate.unit)
        setselectedProduct({ value: event.target.value, isValid: true });
        setQuantityUnit(stdrate.cycle_time_unit)
    }



    const wordordercrudoperations = () => {
    
        if (workOrderDialogMode === "delete" && orderID.value) {
            getDeleteWorkOrder(orderID.value)
        }
        else {
            if (OrderIDRef.current && quantityRef.current) {
                if (OrderIDRef.current.value === "" || (props.workordernames.findIndex(val => val.toLowerCase() === OrderIDRef.current.value.trim().toLowerCase()) >= 0 && workOrderDialogMode === 'create')) {
                    if (OrderIDRef.current.value === "") setorderIDErrMsg(t('Enter a Valid Order ID'))
                    else setorderIDErrMsg(t('Order ID ') + OrderIDRef.current.value + t(' already exists.'))
                    setOrderID({ value: "", name: "", isValid: false })
                } else if (!date.value) {
                    setdate({ value: "", isValid: false })
                } else if (!enddate.value ) {
                    setenddate({ value: "", isValid: false })
                } else if (selectedProduct.value === "") {
                    setselectedProduct({ value: "", isValid: false })
                }
            
                else {
                    if (workOrderDialogMode === "create") {

                        console.log("enter")
                        //orderID,stDate,eddate
              
                        let datas={
                            orderID:OrderIDRef.current.value,
                            stDate:new Date(moment(date.value).set('seconds',0).set('milliseconds',0)),
                            eddate: new Date(moment(enddate.value).set('seconds',0).set('milliseconds',0))
                        }

                        if (datas.stDate >= datas.eddate) {
                            console.log("enter");
                            setDateError(true)
                            setInvalidDate('Start date must be earlier than end date' )
                            return; // 
                
                        }
                        console.log("datas",datas)
                        getAddWorkOrder(datas,
                        new Date(moment(deliverydate.value).set('seconds',0).set('milliseconds',0)), selectedProduct.value, 
                        Math.floor(((new Date(moment(enddate.value).set('seconds',0).set('milliseconds',0))-new Date(moment(date.value).set('seconds',0).set('milliseconds',0)))/1000/60 ) * (Number(selectedstdrate)/60)).toString(), 
                        currUser.id, headPlant.id,quantityUnit)
                    }
                    
                    else if (workOrderDialogMode === "edit") {
                        if (workorderexecdurations.length > 0) {

                            var filteredexecs = workorderexecdurations.filter(val => (date.value > new Date(val.start_dt) || enddate.value < new Date(val.end_dt)) && val.status !== 2)
                            if (filteredexecs.length > 0) {
                                handleWorkOrderDialogClose();
                                SetMessage(t('Failed to update workorder  ') + orderID.name + t(" due to existing execution data."))
                                SetType("warning")
                                setOpenSnack(true)
                            }
                            else {
                                let datas1={
                                    orderID:OrderIDRef.current.value,
                                    stDate:new Date(moment(date.value).set('seconds',0).set('milliseconds',0)),
                                    eddate: new Date(moment(enddate.value).set('seconds',0).set('milliseconds',0))
                                }
                                
                        if (datas1.stDate >= datas1.eddate) {
                            console.log("enter");
                            setDateError(true)
                            setInvalidDate('Start date must be earlier than end date' )
                            return; // 
                
                        }
                                getEditWorkOrder(datas1, 
                                new Date(moment(deliverydate.value).set('seconds',0).set('milliseconds',0)), selectedProduct.value,
                                Math.floor(((new Date(moment(enddate.value).set('seconds',0).set('milliseconds',0))-new Date(moment(date.value).set('seconds',0).set('milliseconds',0)))/1000/60 ) * (Number(selectedstdrate)/60)).toString(), 
                                currUser.id, orderID.value,quantityUnit)
                            }
                        } else {
                            let datas2={
                                orderID:OrderIDRef.current.value,
                                stDate:new Date(moment(date.value).set('seconds',0).set('milliseconds',0)),
                                eddate: new Date(moment(enddate.value).set('seconds',0).set('milliseconds',0))
                            }
                            if (datas2.stDate >= datas2.eddate) {
                                console.log("enter");
                                setDateError(true)
                                setInvalidDate('Start date must be earlier than end date' )
                                return; // 
                    
                            }
                            getEditWorkOrder(datas2,
                            new Date(moment(deliverydate.value).set('seconds',0).set('milliseconds',0)), selectedProduct.value,
                            Math.floor(((new Date(moment(enddate.value).set('seconds',0).set('milliseconds',0))-new Date(moment(date.value).set('seconds',0).set('milliseconds',0)))/1000/60 ) * (Number(selectedstdrate)/60)).toString(), currUser.id, orderID.value,quantityUnit)
                        }
                    }
                }


            }
            else {
                SetMessage(t('Please fill the mandatory fields'))
                SetType("warning")
                setOpenSnack(true);
            }
        }
    }
    const handledateclick = (e) => {
        setdatepopper(e.currentTarget)
    }
    const handledeliverydateclick = (e) => {
        setdeliverydatepopper(e.currentTarget)
    }
    
    const handleCycleUnit = (e)=> setQuantityUnit(e.target.value);

    const handleOrderIDChange = (event) =>{
        if(event.target.value !== "") 
            setOrderID({ value: "", name: event.target.value, isValid: true })
        else
            setOrderID({ value: "", name: "", isValid: false })
    }
    let dialogTitle;

    if (workOrderDialogMode === "create") {
        dialogTitle = t('Add WorkOrder');
    } else if (workOrderDialogMode === "edit") {
        dialogTitle = t('Edit WorkOrder');
    } else {
        dialogTitle = t('Delete WorkOrder');
    }

    return (
        <React.Fragment> 
                <ModalHeaderNDL>
                <TypographyNDL  variant="heading-02-xs" color="primary" model value={dialogTitle}/> 
                {/* {workOrderDialogMode === "create" && (
    <TypographyNDL 
      variant="paragraph-xs" 
      color="tertiary" 
      model 
      value={"Personalize your factory's identity, location, and business hierarchy "} 
    />
  )}              */}
     </ModalHeaderNDL>
                <ModalContentNDL>
                {workOrderDialogMode === "delete" &&
                        <React.Fragment>
                         <TypographyNDL variant="paragraph-s" color="secondary" 
                        value={t("All the work executions associated with the work order  ") + orderID.name + " " + "shall be deleted"} />
                        <TypographyNDL variant="paragraph-s" color="secondary" 
                        value={"Are you sure" + t('NotReversible')} />
                        
                        </React.Fragment>
                    
                    }
                    

                    {
                        workOrderDialogMode === "create" &&

<React.Fragment>
<InputFieldNDL
                            label={t('Workorder ID')}
                            inputRef={OrderIDRef}
                            placeholder={t("Enter Order ID")}
                            error={!orderID.isValid ? true : false}
                            helperText={!orderID.isValid ? orderiderrmsg : ""}
                            onChange={handleOrderIDChange}
                        />
                        <div className="mb-3"  />
</React.Fragment>
                       
                    }
                    {
                        workOrderDialogMode === "edit" &&

<React.Fragment>

                        <InputFieldNDL
                            label={t('Workorder ID')}
                            inputRef={OrderIDRef}
                            disabled={true}
                        />
                        <div className="mb-3"  />
                        </React.Fragment>
                    }
                    {workOrderDialogMode !== "delete" &&
                        <div>
                            <div className="mb-0.5">
                            <TypographyNDL value={"Start Date"} variant={'paragraph-xs'} />

                            </div>
                                     <DatePickerNDL
                                           id="Date-picker"
                                           onChange={(e) => {
                                            setdate({ value: e, isValid: true });
                                            setDateError(false);         // clear error on new input
                                            setInvalidDate("");          // reset message
                                          }}
                                           onClick={handledateclick}
                                           startDate={date.value ? new Date(date.value) : date.value}
                                           dateFormat="MMM dd yyyy HH:mm:ss"
                                           placeholder={t("Enter Start Date")}
                                           customRange={false}
                                           showTimeSelect={true} 
                                           label={t("Start Date")}
                                           timeFormat="HH:mm:ss"
                                           error={!date.isValid || dateError}
                                           helperText={
                                            !date.isValid
                                              ? "Enter start date"
                                              : dateError
                                              ? invalidDate
                                              : null
                                          }
                                           
                                  />
                                  
                            <div className="mb-0.5 mt-3">
                            <TypographyNDL value={"End Date"} variant={'paragraph-xs'} />
                            </div>
                             <DatePickerNDL
                                           id="Date-picker"
                                           onChange={(e) => {
                                            setenddate({value:e,isValid: true});
                                              }} 
                                           onClick={handledateclick}
                                           startDate={enddate.value ? new Date(enddate.value) : enddate.value}
                                           dateFormat="MMM dd yyyy HH:mm:ss"
                                           placeholder={t("Enter End Date")}
                                           customRange={false}
                                           showTimeSelect={true} 
                                           minDate={date.value ? new Date(date.value) : null}
                                          // label={t("Start Date")}
                                           timeFormat="HH:mm:ss"
                                           error={!date.isValid}
                                           helperText={
                                            !date.isValid
                                              ? "Enter end date":null
                                           
                                          }
                                  />
                         
                            <div className="mb-0.5 mt-3">
                            <TypographyNDL value={"Delivery Date"} variant={'paragraph-xs'} />

                             </div>
                             <DatePickerNDL
                                           id="Date-picker"
                                           onChange={(e) => {
                                            setdeliverydate({value:e,isValid: true});
                                              }} 
                                           onClick={handledeliverydateclick}
                                           startDate={deliverydate.value ? new Date(deliverydate.value) : deliverydate.value}
                                           dateFormat="MMM dd yyyy HH:mm:ss"
                                           placeholder={t("Enter Delivery Date")}
                                           minDate={enddate.value?new Date(enddate.value) : null}
                                           customRange={false}
                                           showTimeSelect={true} 
                                           timeFormat="HH:mm:ss"
                                           error={!deliverydate.isValid ? true : false}
                                           helperText={!deliverydate.isValid ? "Enter delivery date" : null}
                                      />
                        <div className="mb-3"  />
                            <SelectBox
                                id="product-id"
                                label={t('Products')}
                                edit={true}
                                disableCloseOnSelect={true}
                                auto={false}
                                options={!outGPLoading && !outGPError && outGPData ? outGPData : []}
                                isMArray={true}
                                keyValue={"name"}
                                keyId={"id"}
                                multiple={false}
                                onChange={(e, option) => handleProduct(e)}
                                value={selectedProduct.value}
                                disabled={workOrderDialogMode === 'edit' ? true:false }

                            />
                        <div className="mb-3"  />

                            <Grid container spacing={3}> 
                                <Grid item lg={8}>
                                <InputFieldNDL
                                    label={t('Quantity')}
                                    type={"number"}
                                    inputRef={quantityRef}
                                    placeholder={t("Enter Quantity")}
                                    disabled={true}
                                   
                                />
                                </Grid>
                                <Grid item lg={4}>
                                <SelectBox
                                    id="moisture-out-unit"
                                    label={"Unit"}
                                    placeholder={"Unit"}
                                    edit={true}
                                    disableCloseOnSelect={true}
                                    auto={false}
                                    options={!ProductUnitsLoading && !ProductUnitsError && ProductUnitsData ? ProductUnitsData : []} 
                                    isMArray={true}
                                    keyValue={"unit"}
                                    keyId={"id"}
                                    multiple={false}
                                    onChange={handleCycleUnit}
                                    value={quantityUnit}
                                />
                                </Grid>
                            </Grid>                            
                        </div>
                    }
                </ModalContentNDL>
                <ModalFooterNDL>
                <Button type="secondary"  value={workOrderDialogMode === "Delete" ? t('NoCancel') : t('Cancel')} onClick={() => handleWorkOrderDialogClose()} />

                {workOrderDialogMode === "delete" && <Button type="primary" danger value={t('YesDelete')} onClick={() => wordordercrudoperations()} />}
                    {workOrderDialogMode !== "delete" && workOrderDialogMode !== "edit" && <Button type="primary"  value={t('Save')} onClick={() => wordordercrudoperations()} loading={AddWorkOrderLoading}/>}
                    {workOrderDialogMode === "edit" && <Button type="primary"  value={t('Update')} onClick={() => wordordercrudoperations()} />}

                </ModalFooterNDL> 
        </React.Fragment>
    );
});
export default AddWorkOrder;

