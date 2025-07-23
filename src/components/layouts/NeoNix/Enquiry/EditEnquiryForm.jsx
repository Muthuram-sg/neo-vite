
import React, { useState, useRef, useEffect } from 'react';
import Grid from 'components/Core/GridNDL';
import InputFieldNDL from "components/Core/InputFieldNDL";
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import Typography from "components/Core/Typography/TypographyNDL";
import HorizontalLine from "components/Core/HorizontalLine/HorizontalLineNDL";
import FileInput from 'components/Core/FileInput/FileInputNDL';
import CustomSwitch from "components/Core/CustomSwitch/CustomSwitchNDL";
import Button from 'components/Core/ButtonNDL';
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import useGetAllCustomerMaster from "../hooks/useGetAllCustomerMaster";
import useGetStatesByCountry from '../hooks/useGetStatesByCountry';
import useGetAllEnquiryPriority from "../hooks/useGetEnquiryPriority";
import useGetAllEnquiryType from "../hooks/useGetEnquiryType";
import useGetAllProductsList from "../hooks/useGetProductsList";
import useGetAllUserList from "../hooks/useGetAllUserList";
import useCreateEnquiry from "../hooks/useCreateEnquiry";
import useUpdateEnquiry from "../hooks/useUpdateEnquiry";
import useGetCitiesByState from "components/layouts/NeoNix/hooks/useGetState.jsx"
import useGetIndustryTypes from 'components/layouts/NeoNix/hooks/useGetIndustryType.jsx';
import useGetCompanyCat from 'components/layouts/NeoNix/hooks/useGetCompanyCat.jsx';
import useGetCompanyTypes from '../hooks/useGetCompanyType';
import useCreateCompanyMaster from "components/layouts/NeoNix/hooks/useCreateCompanyMaster.jsx"
import useGetCountry from "components/layouts/NeoNix/hooks/useGetCountry.jsx"
import useUpdateCompanyMaster from "components/layouts/NeoNix/hooks/useUpdateCompany.jsx"
import { add, assign, head, set } from 'lodash';
import useTheme from "TailwindTheme";
import BredCrumbsNDL from "components/Core/Bredcrumbs/BredCrumbsNDL";
import DummyImage from 'assets/neo_icons/SettingsLine/image_icon.svg?react';
import BlackX from 'assets/neo_icons/SettingsLine/black_x.svg?react';
import Close from 'assets/neo_icons/ChatBot/Close.svg?react';
import Delete from 'assets/neo_icons/Menu/ActionDelete.svg?react';
import { ca, te } from 'date-fns/locale';
import { index } from 'd3';
import { use } from 'i18next';

import { useRecoilState } from 'recoil';
import LoadingScreenNDL from "LoadingScreenNDL"; 
import { userData, selectedPlant, snackToggle, snackMessage, snackType, snackDesc } from 'recoilStore/atoms';
// import useUpdateCompanyMaster from '../hooks/useUpdateCompany';



export default function EditEnquiryForm(props) {

    const theme = useTheme();

    const scrollRef = useRef();


    const  { enquiryPriorityLoading, enquiryPriorityData, enquiryPriorityError, getAllEnquiryPriority } = useGetAllEnquiryPriority();
    const { enquiryTypeLoading, enquiryTypeData, enquiryTypeError, getAllEnquiryType } = useGetAllEnquiryType();
    const { productsLoading, productsData, productsError, getAllProducts } = useGetAllProductsList();
    const { usersLoading, usersData, usersError, getAllUsers } = useGetAllUserList();
    const { createEnquiryLoading, createEnquiryData, createEnquiryError, getCreateEnquiry } = useCreateEnquiry();
    const { updateEnquiryLoading, updateEnquiryData, updateEnquiryError, getUpdateEnquiry } = useUpdateEnquiry();

    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [, SetDesc] = useRecoilState(snackDesc);

    const {countryLoading,
        countryData,
        countryError,
        getCountryList} = useGetCountry();
    const { statesData, getStatesByCountry } = useGetStatesByCountry();
    const [isError, setIsError] = useState(false);
   
    const { allCustomersLoading, allCustomersData, allCustomersError, getAllCustomers } = useGetAllCustomerMaster();
    const { citiesLoading, citiesData, citiesError, getCitiesByState } = useGetCitiesByState();

    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);


     const defaultRow = {
        product: '',
        description: '',
        quantity: '',
        total: '',
      }

     const [rows, setRows] = useState(Array.from({ length: 1 }, () => ({ ...defaultRow })));   

    // const [shippingAddress, setShippingAddress] = useState([{
    //     addressLine1: "",
    //     addressLine2: "",
    //     city: "",
    //     state: "",
    //     country: "",
    //     zipCode: "",
    // }]);
    // const [shippingAddressState, setShippingAddressState] = useState("");

    const [ valueState, setValueState] = useState({
        customer: "",
        primaryContactPerson: "",
        designation: "",
        email: "",
        contactNumber: "",
        companyName: "",
        registrationNumber: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
        priority: "",
        enquiryType: "",
        assignTo: "",
        timeOfPurchase: "",
        requirementDescription: "",
        billingMaterials: [{
            product: "",
            description: "",
            quantity: "",
        }]
    });

    const handleValueChange = (value, key) => {
        console.clear()
        console.log(valueState, value, key, customers)
        // console.log("ERROR STATE", errorState)
        let temp_valueState = { ...valueState };
        temp_valueState[key] = value;
        console.log("TEMP VALUE STATE", temp_valueState)
        setValueState((prevState) => ({ ...prevState, [key]: value }));
    }


    const [errorState, setErrorState] = useState({
        customer: "",
        priority: "",
        enquiryType: "",
        billingMaterials:[{
            product: "",
            quantity: "",
        }]
    });

    const [breadcrumpName, setbreadcrumpName] = useState(props.editData?.header?.enq_id ? props?.preview ? 'View Enquiry' : "Edit Enquiry" : "Add Enquiry");
    const breadcrump = [{ id: 0, name: "Enquiry Info" }, { id: 1, name: breadcrumpName }];


    const updateRow = (index, key, value) => {
        try {
            // console.clear()
            // console.log("UPDATE ROW", index, key, value, valueState.billingMaterials)
            // let temp_billing = valueState.billingMaterials
            // let updatedRows = temp_billing;
            // updatedRows[index][key] = value?.target?.value;
            // setValueState((prevState) => ({
            //     ...prevState,
            //     billingMaterials: updatedRows,
            // }));

            const newValue = value?.target?.value ?? value;

            setValueState((prevState) => {
              const updatedBillingMaterials = prevState.billingMaterials.map((row, i) =>
                i === index ? { ...row, [key]: newValue } : row
              );
          
              return {
                ...prevState,
                billingMaterials: updatedBillingMaterials,
              };
            });
        } catch (error) { 
            console.log("Error in updateRow:", error); 
        }
        
      };


    useEffect(() => {
        if(customers?.length > 0 && props.editData?.header?.cust_code) {
            const selectedCustomer = customers?.filter((x) => x.code === props.editData?.header?.cust_code)[0];

            let temp_billing_materials = props.editData?.items?.map((x, index) => {
                return {
                    ap_code: x.ap_code,
                    product: x.product_code,
                    description: x.item_description,
                    quantity: x.quantity,
                }
            });
            if(props.editData?.items?.length > 0) {
                let temp_billing_materials_error = props.editData?.items?.map((x, index) => {
                    return {
                        product: '',
                        quantity: '',
                    }
                });
                setErrorState({ ...errorState, billingMaterials: temp_billing_materials_error })
            }
            

            setValueState({
                customer: props.editData?.header?.cust_code,
                primaryContactPerson: props.editData?.header?.pri_conct_per,
                designation: props.editData?.header?.designation,
                email: props.editData?.header?.email,
                contactNumber: props.editData?.header?.mobile_no,
                companyName: props.editData?.header?.cust_name,
                companyName: selectedCustomer?.name,
                registrationNumber: selectedCustomer?.reg_no,
                addressLine1: selectedCustomer?.add_1,
                addressLine2: selectedCustomer?.add_2,
                city: selectedCustomer?.citycode,
                state: statesData?.filter((x) => x.name === selectedCustomer?.state)[0]?.code,
                country: countryData?.filter((x) => x.value === selectedCustomer?.country)[0]?.key,
                zipCode: selectedCustomer?.zip_code,
                priority: props.editData?.header?.priority,
                enquiryType: props.editData?.header?.enq_type,
                assignTo: props.editData?.header?.assin_to,
                assignedTo: props.editData?.header?.assin_to,
                timeOfPurchase: props.editData?.header?.time_of_purchase,
                requirementDescription: props.editData?.header?.enquiry_description,
                billingMaterials: temp_billing_materials,
                // billingMaterials: [{
                //     product: "",
                //     description: "",
                //     quantity: "",
                // }]
            })
        }
    },[props.editData, countryData, customers])

    const handleValidation = () => {
        let isValid = true
        if(valueState.customer === '') {
            setIsError(true);
            isValid = false;
            setErrorState((prevState) => ({ ...prevState, customer: 'Customer is required' }));
        }
        if(valueState.priority === "") {
            setIsError(true);
            isValid = false;
            setErrorState((prevState) => ({ ...prevState, priority: 'Priority is required' }));
        } else {
            setIsError(false);
        }
        if(valueState.enquiryType === "") {
            // Handle validation error
            setIsError(true);
            isValid = false;
            setErrorState((prevState) => ({ ...prevState, enquiryType: 'Enquiry Type is required' }));
        } else {
            setIsError(false);
        }
        if(valueState.billingMaterials.length > 0) {
            let temp_billing_error = errorState.billingMaterials
            valueState.billingMaterials.map((x, index) => {
                if(x.product === "") {
                     setIsError(true);
                     isValid = false;
                    temp_billing_error[index].product = "Product is required"
                } else {
                    temp_billing_error[index].product = ""
                }
                if(x.quantity === "") {
                     setIsError(true);
                     isValid = false;
                    temp_billing_error[index].quantity = "Quantity is required"
                } else {    
                    temp_billing_error[index].quantity = ""
                }
            })
            setErrorState((prevState) => ({ ...prevState, billingMaterials: temp_billing_error }));
           
        } else {
            setIsError(true);
            isValid = false;
            setErrorState((prevState) => ({ ...prevState, billingMaterials: [{ product: 'Product is required', quantity: 'Quantity is required' }] }));
        }

        return isValid
    }

    const handleSave = () => {
        try {
            console.clear()
            console.log("SAVED STATE", valueState)

            const isValid = handleValidation();
            if (isValid) {
                let body = {
                    header: {
                        "enq_id": "",
                        "ap_code": "",
                        "cust_code": valueState.customer,
                        "pri_conct_per": valueState.primaryContactPerson,
                        "designation": valueState.designation,
                        "email": valueState.email,
                        "cont_num": valueState.contactNumber,
                        "priority": valueState.priority,
                        "enq_type": valueState.enquiryType,
                        "assin_to": valueState.assignedTo,
                        "status": '',
                        "time_of_purchase": valueState.timeOfPurchase,
                        "description": valueState.requirementDescription,
                        "is_deleted": valueState.isDeleted,
                        "create_dt": "",
                        "enq_date": "",
                        "create_by": "",
                        "modified_dt": "",
                        "modified_by": ""
                    },
                    items: valueState?.billingMaterials?.map((x, index) => {
                        return {
                            "s_no": index + 1,
                            "enq_id": "",
                            "ap_code": "",
                            "product_code": x.product,
                            "description": x.description,
                            "quantity": parseInt(x.quantity),
                            "is_deleted": 0,
                            "create_dt": '',
                            "create_by": '',
                            "modified_dt": '',
                            "modified_by": ''
                        }
                    }),
                }

                console.log("BODY", body)

                if(props.editData?.header?.enq_id) {
                    console.clear()
                    body.header.enq_id = props.editData.header.enq_id
                    body.header.ap_code = props.editData.header.ap_code
                    body.header.status = props.editData.header.status
                    console.log("UPDATE ENQUIRY", body)
                    getUpdateEnquiry(body)
                } else { 
                    getCreateEnquiry(body);
                } 
            } else {
                console.log('ELSE IN SACE', errorState)
            }
        }
        catch (error) {
            console.log("Error in handleSave:", error);
        }
        
    }

    useEffect(() => {
            if(createEnquiryData === 'Created Successfully '){
                setOpenSnack(true)
                SetMessage("New Enquiry Created")
                SetType("success")
                SetDesc("Enquiry has been successfully Added")
                props.onCancel()
                // props.isEditChange()
            }
            if(updateEnquiryData === 'Updated Successfully '){
                setOpenSnack(true)
                SetMessage("Enquiry Updated Successfully")
                SetType("success")
                SetDesc("Enquiry has been successfully Updated")
                props.onCancel()
                // props.isEditChange()
            }
            // console.log(createCompanyData, "createCompanyData")
            // console.log(companyUpdateData, "companyUpdateData")
        }, [createEnquiryData, updateEnquiryData])


    useEffect(() => {
        getAllCustomers()
        getStatesByCountry("IN");
        getCitiesByState("TN");
        // getIndustryTypes();
        // getCompanyTypes();
        // getCompanyCategoryTypes();
        getCountryList();
        getAllEnquiryPriority();
        getAllEnquiryType()
        getAllProducts()
        getAllUsers()
    }, [])

    useEffect(() => {
        console.clear()
        console.log(allCustomersData, "ALL CUSTOMERS DATA")
        if(!allCustomersLoading && allCustomersData && Array.isArray(allCustomersData) && allCustomersData.length > 0 && allCustomersData?.length > 0) {
            setCustomers(allCustomersData?.map((x) => {
                return {
                    code: x.cust_code,
                    name: x.cust_name,
                    designation: x.designation,
                    email_id: x.email_id,
                    mobile_no: x.mobile_no,
                    reg_no: x.reg_no,
                    citycode: x.citycode,
                    country: x.country,
                    state: x.state,
                    primary_cont_person: x.acc_represent,
                    // add_1: x?.address?.split(",")[0],
                    add_1: x?.adrs1,
                    // add_2: x?.address?.split(",")[1],
                    add_2: x?.adrs2,
                    zip_code: x?.address?.split("-")[1],
                }
            }))
        }
    }, [allCustomersData, allCustomersLoading, allCustomersError])

    useEffect(() => {
        if(!productsLoading && productsData && productsData?.length > 0) {
            setProducts(productsData.map((x) => {
                return {
                    ...x,
                    code: x.code,
                    desc: x.description,
                    hsn_no: x.hsn_no
                }
            }))
        }
    }, [productsData, productsLoading, productsError])


    const handleSelectedCustomer = (value) => {

        try {
            const selectedCustomer = customers?.filter((x) => x.code === value)[0];
            console.clear()
            console.log("SELECTED CUSTOMER", selectedCustomer)
            setValueState({
                ...valueState,
                customer: selectedCustomer?.code,
                primaryContactPerson: selectedCustomer?.primary_cont_person,
                designation: selectedCustomer.designation,
                email: selectedCustomer.email_id,
                contactNumber: selectedCustomer.mobile_no,
                companyName: selectedCustomer.name,
                registrationNumber: selectedCustomer.reg_no,
                addressLine1: selectedCustomer.add_1,
                addressLine2: selectedCustomer.add_2,
                city: selectedCustomer.citycode,
                state: statesData?.filter((x) => x.name === selectedCustomer.state)[0]?.code,
                country: countryData?.filter((x) => x.value === selectedCustomer.country)[0]?.key,
                zipCode: selectedCustomer.zip_code,
                billingMaterials: [{
                    product: "",
                    description: "",
                    quantity: "",
                }]
            })
        } catch (error) { 
            console.log("Error in handleSelectedCustomer:", error); 
        }

    }

    const handleDeleteRows = (index) => {
        try{
            let temp_rows = valueState.billingMaterials
            temp_rows.splice(index, 1)
            console.log("TEMP ROWS", valueState.billingMaterials, temp_rows, rows)
            setValueState({ ...valueState, billingMaterials: temp_rows })

            // setRows(Array.from({ length: temp_rows.length }, () => ({ ...defaultRow })))


            // let temp_billing_error = errorState.billingMaterials
            // temp_billing_error.splice(index, 1)
            // setErrorState({ ...errorState, billingMaterials: temp_billing_error })
        }
        catch (error) {
            console.log("Error in handleDeleteRows:", error);
        }
    }




    return (
        <React.Fragment>
            {
                countryLoading && enquiryPriorityLoading && enquiryTypeLoading && productsLoading && usersLoading 
                ? (<><LoadingScreenNDL /></>) 
                : (<>
            { props.isEdit === true && (
                            <div className="flex justify-between items-center h-[48px] py-3.5 px-4 border-b bg-Background-bg-primary dark:bg-Background-bg-primary-dark border-Border-border-50 dark:border-Border-border-dark-50">

                                <BredCrumbsNDL breadcrump={breadcrump} onActive={(i) => {if(i === 0){ props.onCancel() }}} />
                                <div className="flex gap-2">
                                    <Button type="secondary" value="Cancel" onClick={() => props.onCancel()} />
                                    {props?.preview ? <></> : <Button type="primary" value={props.editData?.header?.enq_id ? "Update" : "Save"} onClick={() => {setIsError(false);handleSave()}} />}
                                </div>
                            </div>
                        )}

            <Grid container>
                <Grid xs={1}></Grid>
                <Grid xs={10}>
                    <Typography variant="heading-02-xs"
                        value={"Basic Info"}
                        color={"primary"}
                    />
                    <Typography variant="paragraph-xs"
                        value={"Capture essential details to identify the company and its legal identity"}
                        color={"tertiary"}
                    />

                    <div className="mt-4" />
                    <div className="flex gap-4 mt-4">
                        {
                            props.editData?.header?.enq_id && <div className="w-full">
                                <InputFieldNDL
                                    label={"Enquiry ID"}
                                    placeholder={"Type here"}
                                    disabled={true}
                                    value={props.editData?.header?.enq_id}
                            />
                            </div>
                        }
                        <div className="w-full">
                           
                            <SelectBox
                                id="Customer"
                                labelId="Customer"
                                label="Customer"options={customers || []}
                                value={valueState.customer}
                                onChange={(e) => {
                                    handleSelectedCustomer(e.target.value)
                                }}
                                mandatory={true}
                                keyValue="name"
                                keyId="code"
                                error={errorState.customer !== ''}
                                msg={errorState.customer}
                                disabled={props?.preview ? true : false}

                                auto={false}
                                multiple={false}

                                onFocus={() => {
                                    setErrorState({ ...errorState, customer: '' });
                                }}
                            />
                        {/* </div> */}
                        </div>

                    </div>

                     <div className="flex gap-4 mt-4">
                        <div className="w-full">
                            <InputFieldNDL
                                label={"Primary Contact Person"}
                                placeholder={"Type here"}
                                value={valueState.primaryContactPerson}
                                onChange={(e) => handleValueChange(e.target.value, 'primaryContactPerson')}
                                onFocus={() => {
                                    setErrorState({ ...errorState, primaryContactPerson: '' });
                                }}
                                disabled={props?.preview ? true : false}
                            />
                        </div>
                        <div className="w-full">
                            <InputFieldNDL
                                label={"Designation"}
                                placeholder={"Type here"}
                                disabled={props?.preview ? true : false}
                                value={valueState.designation}
                                onChange={(e) => handleValueChange(e.target.value, 'designation')}
                                onFocus={() => {
                                    setErrorState({ ...errorState, designation: '' });
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 mt-4">
                        <div className="w-full">
                            <InputFieldNDL
                                label={"Email"}
                                placeholder={"Type here"}
                                disabled={props?.preview ? true : false}
                                value={valueState.email}
                                onChange={(e) => handleValueChange(e?.target.value, 'email')}
                                onFocus={() => {
                                    setErrorState({ ...errorState, email: '' });
                                }}
                            />
                        </div>
                        <div className="w-full">
                            <InputFieldNDL
                                label={"Contact Number"}
                                placeholder={"Type here"}
                                value={valueState.contactNumber}
                                onChange={(e) => handleValueChange(e?.target.value, 'contactNumber')}
                                onFocus={() => {
                                    setErrorState({ ...errorState, contactNumber: '' });
                                }}
                                disabled={props?.preview ? true : false}
                            />
                        </div>
                    </div>
                    <div className="mt-4" />
                    <HorizontalLine variant="divider1" />
                    <div className="mt-4" />

                    <Typography variant={"heading-02-xs"} value={"Customer Details"} color={"primary"} />
                    <Typography variant={"paragraph-xs"} value={"Enter organization-level information to align the enquiry with business context."} color={"tertiary"} />

                        <div className="flex gap-4 mt-4">
                            <div className="w-full">
                                <InputFieldNDL
                                    label="Company Name"
                                    placeholder="Type here"
                                    required={true}
                                    disabled={true}
                                    value={valueState.companyName}
                                    onChange={(e) => handleValueChange(e?.target.value, 'companyName')}
                                    onFocus={() => {
                                        setErrorState({ ...errorState, companyName: '' });
                                    }}
                                />
                            </div>

                            <div className="w-full">
                                <InputFieldNDL
                                    label="Registration Number"
                                    placeholder="Type here"
                                     disabled={true}
                                    value={valueState.registrationNumber}
                                    onChange={(e) => handleValueChange(e?.target.value, 'registrationNumber')}
                                    onFocus={() => {
                                        setErrorState({ ...errorState, registrationNumber: '' });
                                    }}
                                />
                            </div>
                        </div>
                    <div className="flex gap-4 mt-4">
                        <div className="w-full">
                            <InputFieldNDL
                                label={"Address Line 1"}
                                disabled={true}
                                placeholder={"Type here"}
                                value={valueState.addressLine1}
                                onChange={(e) => handleValueChange(e?.target.value, 'addressLine1')}
                                onFocus={() => {
                                    setErrorState({ ...errorState, addressLine1: '' });
                                }}
                            />
                        </div>
                        <div className="w-full">
                            <InputFieldNDL
                                label={"Address Line 2"}
                                disabled={true}
                                placeholder={"Type here"}
                                value={valueState.addressLine2}
                                onChange={(e) => handleValueChange(e?.target.value, 'addressLine2')}
                                onFocus={() => {
                                    setErrorState({ ...errorState, addressLine2: '' });
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 mt-4">
                            <div className="w-full">
                                <InputFieldNDL
                                    label={"City"}
                                    disabled={true}
                                    placeholder={"Type here"}
                                    value={valueState.city}
                                    onChange={(e) => handleValueChange(e?.target.value, 'city')}
                                    onFocus={() => {
                                        setErrorState({ ...errorState, city: '' });
                                    }}
                                />
                            </div>

                            <div className="w-full">
                                {/* ___ */}
                                <SelectBox
                                    id='country'
                                    labelId='country'
                                    label="Country"
                                    options={countryData || []}
                                    disabled={true}
                                    value={valueState.country}
                                    onChange={(e) => handleValueChange(e?.target.value, 'country')}
                                    keyValue="value"
                                    keyId="key"
                                    onFocus={() => {
                                        setErrorState({ ...errorState, country: '' });
                                    }}
                                />
                            </div>
                        </div>

                    <div className="flex gap-4 mt-4">
                            <div className="w-full">
                                <SelectBox
                                    id='state'
                                    labelId='state'
                                    label="State"
                                    options={statesData || []}
                                    disabled={true}
                                     value={valueState.state}
                                    onChange={(e) => handleValueChange(e?.target.value, 'state')}
                                    onFocus={() => {
                                        setErrorState({ ...errorState, state: '' });    
                                    }}
                                    keyValue="name"
                                    keyId="code"
                                />
                            </div>

                            <div className="w-full">
                                <InputFieldNDL
                                    label={"ZIP Code"}
                                    disabled={true}
                                    placeholder={"Type here"}
                                    onFocus={() => {
                                        setErrorState({ ...errorState, zipCode: '' });  
                                    }}
                                     value={valueState.zipCode}
                                    onChange={(e) => handleValueChange(e?.target.value, 'zipCode')}
                                />
                            </div>
                        </div>


                    <React.Fragment>
                        <div className="mt-4" />
                        <Typography
                            variant={"heading-02-xs"}
                            value={'Enquiry Details'}
                            color={"primary"}
                        />
                        <Typography
                            variant={"paragraph-xs"}
                            value={'Define the scope of the request including priority, timeline, products, quantity, and expectations.'}
                            color={"tertiary"}
                        />
                        <div className="mt-4" />
                        <div className="mt-4" />
                        

                        <div className="mt-4" />
                        

                        <div className="flex gap-4 mt-4">
                             <div className="w-full">
                                {/* ___ */}
                                <SelectBox
                                    id='priority'
                                    labelId='priority'
                                    label="Priority"
                                    options={enquiryPriorityData || []}
                                    value={valueState.priority}
                                    onChange={(e) => handleValueChange(e?.target.value, 'priority')}
                                    keyValue="desc"
                                    keyId="code"
                                    mandatory={true}
                                    error={errorState?.priority !== ''}
                                    msg={errorState?.priority}
                                    onFocus={() => {
                                        setErrorState({ ...errorState, priority: '' });
                                    }}
                                    disabled={props?.preview ? true : false}
                                />
                            </div>
                            <div className="w-full">
                                <SelectBox
                                    id='enquiryType'
                                    labelId='enquiryType'
                                    label="Enquiry Type"
                                     options={ enquiryTypeData || []}
                                    value={valueState.enquiryType}
                                    onChange={(e) => handleValueChange(e?.target.value, 'enquiryType')}
                                    keyValue="desc"
                                    keyId="code"
                                    mandatory={true}
                                    error={errorState?.enquiryType !== ''}
                                    msg={errorState?.enquiryType}
                                    onFocus={() => {
                                        setErrorState({ ...errorState, enquiryType: '' });
                                    }}
                                    disabled={props?.preview ? true : false}
                                />
                            </div>

                        </div>

                        <div className="flex gap-4 mt-4">
                           <div className="w-full">
                                {/* ___ */}
                                <SelectBox
                                    id='assignedTo'
                                    labelId='assignedTo'
                                    label="AssignTo"
                                     options={usersData || []}
                                    value={valueState.assignedTo}
                                    onChange={(e) => handleValueChange(e?.target.value, 'assignedTo')}
                                    keyValue="value"
                                    keyId="key"
                                    onFocus={() => {
                                        setErrorState({ ...errorState, country: '' });
                                    }}
                                    disabled={props?.preview ? true : false}
                                />
                            </div>

                            <div className="w-full">
                                <InputFieldNDL
                                    label={"Time of Purchase"}
                                    placeholder={"Type here"}
                                    onFocus={() => {
                                        setErrorState({ ...errorState, zipCode: '' });  
                                    }}
                                    value={valueState.timeOfPurchase}
                                    onChange={(e) => handleValueChange(e?.target.value, 'timeOfPurchase')}
                                    disabled={props?.preview ? true : false}
                                />
                            </div>
                        </div>

                        <div className="mt-4" />

                        <InputFieldNDL
                            maxRows={5}
                            multiline={true}
                            label={"Requirement description"}
                            placeholder={"Type here"}
                            value={valueState.requirementDescription}
                            onChange={(e) => handleValueChange(e?.target.value, 'requirementDescription')}
                            onFocus={() => {
                                setErrorState({ ...errorState, requirementDescription: '' });
                            }}
                            disabled={props?.preview ? true : false}
                        />

                        <div className="mt-4" />

                        <Typography
                            variant={"heading-02-xs"}
                            value={'Bill of Materials'}
                            color={"primary"}
                        />
                        <Typography
                            variant={"paragraph-xs"}
                            value={'Enter the scope of the request including, products, quantity.'}
                            color={"tertiary"}
                        />
                        <div className="mt-4" />

                        <div>
                            {/* Table Header */}
                            <div className="mt-4 w-full">
                                <div className="grid grid-cols-5 gap-4 bg-[#F0F0F0] border border-[#E8E8E8]-300 px-4 py-2 text-sm font-semibold text-gray-700">
                                  <div>S.No</div>
                                  <div>Product <span className="text-red-500">*</span></div>
                                  <div>Description</div>
                                  <div>Quantity <span className="text-red-500">*</span></div>
                                  <div></div>
                                </div>

                                {/* Table Rows */}
                                {valueState?.billingMaterials?.map((row, index) => (
                                  <div
                                    key={index}
                                    className="grid grid-cols-5 gap-4 px-4 py-2 text-sm items-center w-full"
                                  >
                                    <div>
                                      <Typography variant="paragraph-xs" value={String(index + 1)} />
                                    </div>
                                
                                    <div>
                                      <SelectBox
                                        id='product'
                                        labelId='product'
                                        placeholder="Select Product"
                                        options={products || []}
                                        value={valueState.billingMaterials?.[index]?.product}
                                        keyValue="matnr"
                                        keyId="code"
                                        error={errorState?.billingMaterials?.[index]?.product !== ''}
                                        msg={errorState?.billingMaterials?.[index]?.product}
                                        onChange={(val) => updateRow(index, 'product', val)}
                                        disabled={props?.preview ? true : false}
                                      />
                                    </div>
                                
                                    <div>
                                      <InputFieldNDL
                                        value={valueState.billingMaterials?.[index]?.description}
                                        onChange={(e) => updateRow(index, 'description', e)}
                                        disabled={props?.preview ? true : false}
                                      />
                                    </div>
                                
                                    <div>
                                      <InputFieldNDL
                                        type="number"
                                        isCounter={false}
                                        NoMinus={true}
                                        noDecimal={true}
                                        error={errorState?.billingMaterials?.[index]?.quantity !== ''}
                                        helperText={errorState?.billingMaterials?.[index]?.quantity}
                                        value={valueState.billingMaterials?.[index]?.quantity}
                                        onChange={(e) => {
                                            console.log(e.target.value)
                                            if(e.target.value >= 0  && e.target.value !== '.') {
                                                updateRow(index, 'quantity', e)
                                            }
                                        }}
                                        disabled={props?.preview ? true : false}
                                      />
                                    </div>
                                
                                        {
                                            valueState?.billingMaterials?.length > 1 && (
                                                <div>
                                                  <Button type="ghost" disabled={props?.preview ? true : false} danger icon={Delete} stroke={theme.colorPalette.genericRed} onClick={() => handleDeleteRows(index)} />
                                                </div>
                                            )
                                        }
                                    
                                  </div>
                                ))}


                            </div>
                            <div className="w-fit pt-2">
                                <Button
                                    id='Add Item'
                                    type={"tertiary"}
                                    icon={Plus}
                                    disabled={props?.preview ? true : false}
                                    value={"Add Item"}
                                    onClick={() => { 
                                        let temp_error = []
                                        temp_error = errorState.billingMaterials
                                        temp_error.push({ product: '', quantity: '' })

                                        let temp_value = [] 
                                        temp_value = valueState.billingMaterials
                                        temp_value.push({ product: '', description: '', quantity: '' })
                                        
                                        // setRows([...rows, { product: '', description: '', quantity: '' }]) 
                                        setErrorState({ ...errorState, billingMaterials: temp_error })
                                        setValueState({ ...valueState, billingMaterials: temp_value })

                                        window.scrollTo(0, document.body.scrollHeight);
                                        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                />
                            </div>
                            <div className="mt-4" />
                           
                        </div>




                    </React.Fragment>

                </Grid>
                <Grid xs={1}></Grid>
            </Grid>
             <div ref={scrollRef} />
            </>)
            }
        </React.Fragment>
    );
};
