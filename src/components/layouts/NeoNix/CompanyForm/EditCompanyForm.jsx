
import React, { useState, useRef, useEffect } from 'react';
import Grid from 'components/Core/GridNDL';
import InputFieldNDL from "components/Core/InputFieldNDL";
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import Typography from "components/Core/Typography/TypographyNDL";
import HorizontalLine from "components/Core/HorizontalLine/HorizontalLineNDL";
import FileInput from 'components/Core/FileInput/FileInputNDL';
import CustomSwitch from "components/Core/CustomSwitch/CustomSwitchNDL";
import Button from 'components/Core/ButtonNDL';
import LoadingScreen from "LoadingScreenNDL";
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import useGetAllCustomerMaster from "../hooks/useGetAllCustomerMaster";
import useGetStatesByCountry from '../hooks/useGetStatesByCountry';
import useGetCitiesByState from "components/layouts/NeoNix/hooks/useGetState.jsx"
import useGetIndustryTypes from 'components/layouts/NeoNix/hooks/useGetIndustryType.jsx';
import useGetCompanyCat from 'components/layouts/NeoNix/hooks/useGetCompanyCat.jsx';
import useGetCompanyTypes from '../hooks/useGetCompanyType';
import useCreateCompanyMaster from "components/layouts/NeoNix/hooks/useCreateCompanyMaster.jsx"
import useGetCountry from "components/layouts/NeoNix/hooks/useGetCountry.jsx"
import useUpdateCompanyMaster from "components/layouts/NeoNix/hooks/useUpdateCompany.jsx"
import useGetAllCurrency from "components/layouts/NeoNix/hooks/useGetAllCurrency.jsx";
import useGetAllUserList from "../hooks/useGetAllUserList";
import { add, set, trim } from 'lodash';
import useTheme from "TailwindTheme";
import BredCrumbsNDL from "components/Core/Bredcrumbs/BredCrumbsNDL";
import DummyImage from 'assets/neo_icons/SettingsLine/image_icon.svg?react';
import BlackX from 'assets/neo_icons/SettingsLine/black_x.svg?react';
import Close from 'assets/neo_icons/ChatBot/Close.svg?react';
import Delete from 'assets/neo_icons/Menu/ActionDelete.svg?react';
import { ca, is } from 'date-fns/locale';
import { index } from 'd3';
import { SSF } from 'xlsx';
import { useRecoilState } from 'recoil';
import LoadingScreenNDL from "LoadingScreenNDL"; 
import { userData, selectedPlant, snackToggle, snackMessage, snackType, snackDesc } from 'recoilStore/atoms';

import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import ModalNDL from 'components/Core/ModalNDL';
import configParam from "config"; 
import { t } from 'i18next';
// import useUpdateCompanyMaster from '../hooks/useUpdateCompany';



export default function EditCompanyForm(props) {

    const [, setOpenSnack] = useRecoilState(snackToggle);
        const [, SetMessage] = useRecoilState(snackMessage);
        const [, SetType] = useRecoilState(snackType);
        const [, SetDesc] = useRecoilState(snackDesc);

    const [selectedValue, setSelectedValue] = useState("");
    const EntityNameRef = useRef();
    const theme = useTheme();
    const DesignationRef = useRef();
    const EmailRef = useRef();
    const ContactNumberRef = useRef();
    const AlternativeContactPersonRef = useRef();
    const AlternativeContactRef = useRef();
    const AddLine1Ref = useRef();
    const AddLine2Ref = useRef();
    const CityRef = useRef();
    const ZipCodeRef = useRef();
    const GSTNumberRef = useRef();
    const TINnumRef = useRef();
    const CompanyPANRef = useRef();
    const BankAccountRef = useRef();
    const IFSCRef = useRef();
    const PrimaryContRef = useRef();
    const RegNumRef = useRef();
    const [entityName, setEntityName] = useState({ value: "", isValid: true });
    const [selectedCountry, setSelectedCountry] = useState("IN");
    const [designatin, setdesignation] = useState({ value: "", isValid: true });
    const [email, setEmail] = useState({ value: "", isValid: true });
    const [contactNum, setContactNum] = useState({ value: "", isValid: true });
    const [altContPerson, setAltContPerson] = useState({ value: "", isValid: true });
    const [altCont, setAltCont] = useState({ value: "", isValid: true });
    const [primaryCont, setPrimaryCont] = useState({ value: "", isValid: true });
    const [addLine1, setAddLine1] = useState({ value: "", isValid: true });
    const [addLine2, setAddLine2] = useState({ value: "", isValid: true });

    const [loading, setLoading] = useState(false);
    const {
        companyTypeLoading,
        companyTypeData,
        companyTypeError,
        getCompanyTypes,
    } = useGetCompanyTypes();
    const {
        industryLoading,
        industryData,
        industryError,
        getIndustryTypes
    } = useGetIndustryTypes();
    const {
        companyCateLoading,
        companyCateData,
        companyCateError,
        getCompanyCategoryTypes
    } = useGetCompanyCat();
    const {
        createCompanyLoading,
        createCompanyData,
        createCompanyError,
        getCreateCompany
    } = useCreateCompanyMaster();

    const { 
        companyUpdateLoading,
        companyUpdateData,
        companyUpdateError,
        updateCompany
     } = useUpdateCompanyMaster()

    const {countryLoading,
        countryData,
        countryError,
        getCountryList} = useGetCountry();
    const { statesData, getStatesByCountry } = useGetStatesByCountry();

    const [stateOptions, setStateOptions] = useState({ 
        billing: [], 
        shipping: { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [] } 
    });
    const [stateKey, setStateKey] = useState("billing");
    const [stateIndex, setStateIndex] = useState(1);
    const [isError, setIsError] = useState(false);
    const [cityName, setCityName] = useState({ value: "", isValid: true });
    const [zipCode, setZipCode] = useState({ value: "", isValid: true });
    const [RegNum, setRegNum] = useState({ value: "", isValid: true });
    const [isFileSizeError, setisFileSizeError] = useState({ type: null, value: false })
    const [addresses, setAddresses] = useState( props?.company?.reg_no ? props?.company?.ship.length <= 1 ? [] :props?.company?.ship?.map((x, index) => { return { id: index}})?.slice(0, -1) : []);
    const [gstNumber, setGstNumber] = useState({ value: "", isValid: true });
    const [TINnum, setTINnum] = useState({ value: "", isValid: true });
    const [companyPAN, setCompanyPAN] = useState({ value: "", isValid: true });
    const [BankAccount, setBankAccount] = useState({ value: "", isValid: true });
    const [IFSCCode, setIFSCCode] = useState({ value: "", isValid: true });

    const [Currency, setCurrency] = useState('');
    const [Signatue, setSignatue] = useState('');
     const [open, setOpen] = useState(false);
    
    const [shippingAddressLine1, setShippingAddressLine1] = useState({ value: "", isValid: true });
    const [shippingAddressLine2, setShippingAddressLine2] = useState({ value: "", isValid: true });
    const [shippingAddLine1, setShippingAddLine1] = useState({ value: "", isValid: true });
    const [shippingAddLine2, setShippingAddLine2] = useState({ value: "", isValid: true });
    const [shippingCity, setShippingCity] = useState({ value: "", isValid: true });
    const [shippingZip, setShippingZip] = useState({ value: "", isValid: true });
    const [docType, setdocType] = useState(null)
    const [sameAdd, setsameAdd] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isDuplicateError, setIsDuplicateError] = useState(false);
    const [previews, setPreviews] = useState([]);
    const [selectedCompanyType, setSelectedCompanyType] = useState("");
    const [selectedCompanyCategory, setSelectedCompanyCategory] = useState("");
    const [selectedIndustryType, setSelectedIndustryType] = useState("");
    const [files, setFiles] = useState({ file1: null, file2: [], file3: { sop: [], warranty: [], user_manuals: [], others: [] } });
    const { allCustomersLoading, allCustomersData, allCustomersError, getAllCustomers } = useGetAllCustomerMaster();
    const { citiesLoading, citiesData, citiesError, getCitiesByState } = useGetCitiesByState();
    const { allCurrencyLoading, allCurrencyData, allCurrencyError, getAllCurrency } = useGetAllCurrency()
     const { usersLoading, usersData, usersError, getAllUsers } = useGetAllUserList();

    const [billingAddressCountry, setBillingAddressCountry] = useState("");
    const [billingAddressState, setBillingAddressState] = useState("");

    const [companyLogo, setCompanyLogo] = useState("");
    const [GSTDoc, setGSTDoc] = useState("");
    const [TINDoc, setTINDoc] = useState("");
    const [PANDoc, setPANDoc] = useState("");

    const [shippingAddress, setShippingAddress] = useState([{
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
    }]);
    // const [shippingAddressState, setShippingAddressState] = useState("");

    const [errorState, setErrorState] = useState({
        companyName: '',
        registrationNumber: '',

        CompanyLogo: '',
        GSTDoc: '',
        TINDoc: '',
        PANDoc: '',

        primaryContactPerson: '',
        designation: '',
        email: '',
        contactNumber: '',
        alternativeContactPerson: '',
        alternativeContactNumber: '',

        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',

        shipping: [{
            addLine1: '',
            addLine2: '',
            city: '',
            state: '',
            country: '',
            zipCode: '',
        },
    ],

        gstNumber: '',
        tinNumber: '',
        companyPAN: '',
        bankAccount: '',
        ifscCode: '',
        currency: '',
        signature: '',
    });

    const [secondAddress, setSecondAddress] = useState(true)


    useEffect(() => {
        if(shippingAddress[0]?.addressLine1 !== "" && shippingAddress[0]?.city !== "" && shippingAddress[0]?.state !== "" && shippingAddress[0]?.country !== "" && shippingAddress[0]?.zipCode !== "") {
            setSecondAddress(false);
        } else {
            // alert("ELSE")
            setSecondAddress(true);
        }
    }, [shippingAddress])

    useEffect(() => {
        if(stateKey === 'billing') {
            setStateOptions({
                ...stateOptions,
                billing: statesData?.map((x) => ({ code: x.code, name: x.name }))
            });
        } if(stateKey === 'shipping') {
            setStateOptions({
                ...stateOptions,
                shipping: {
                    ...stateOptions?.shipping,
                    [stateIndex]: statesData?.map((x) => ({ code: x.code, name: x.name }))
                }
            });
        }   
    }, [statesData]);


    const [breadcrumpName, setbreadcrumpName] = useState(props?.company?.length === 0 ? "Add Info" : "Edit Info");
    const breadcrump = [{ id: 0, name: "Company Info" }, { id: 1, name: breadcrumpName }];



    // The industries available for selection
    const industryOptions = [
        { id: 1, name: "Technology" },
        { id: 2, name: "Healthcare" },
        { id: 3, name: "Finance" },
        { id: 4, name: "Education" },
        { id: 5, name: "Retail" }
    ];

    const handleCompanyTypeChange = (e) => setSelectedCompanyType(e.target.value);
    const handleCompanyCategoryChange = (e) => setSelectedCompanyCategory(e.target.value);
    const handleIndustryTypeChange = (e) => setSelectedIndustryType(e.target.value);



    const industryTypeOptions = [
        { id: 1, name: 'Public Limited' },
        { id: 2, name: 'Private Limited' },
        { id: 3, name: 'Partnership' },
        { id: 4, name: 'Proprietorship' },
        { id: 5, name: 'Government Undertaking' },
    ];


    const getProperKey = (key) => {
        switch (key) {
            case 'addressLine1':
                return 'shipping_add1';
            case 'addressLine2':
                return 'shipping_add2';
            case 'city':
                return 'shipping_city';
            case 'state':
                return 'shipping_state_name';
            case 'country':
                return 'shipping_country_name';
            case 'zipCode':
                return 'shipping_zip_code';
            default:
                return '';
        }
    }

    const  base64ToFile = (base64Data, fileName) => {
        // Surround this function with try catch block
        try {
            const extension = fileName.split('.').pop().toLowerCase();

            // Basic map of common extensions to MIME types
            const mimeTypes = {
                png: 'image/png',
                jpg: 'image/jpeg',
                jpeg: 'image/jpeg',
                gif: 'image/gif',
                svg: 'image/svg+xml',
                pdf: 'application/pdf',
                txt: 'text/plain',
                json: 'application/json',
                webp: 'image/webp',
            };
        
            const mimeType = mimeTypes[extension] || 'application/octet-stream';
        
            const byteString = atob(base64Data);
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
        
            for (let i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
            }
        
            return new File([ab], fileName, { type: mimeType });
        } catch(e) {
            console.log("ERROR", e)
        }
    }

    function cleanFileName(name) {
        try{
            const base = name.replace(/\.[^/.]+$/, ''); // Remove extension
            const extension = name.split('.').pop();

            // Match repeating substrings
            const match = base.match(/(.+?)\1+/);
            let cleaned = match ? match[1] : base;

            // Check for trailing numbers after deduplication
            const trailingNumbers = base.slice(cleaned.length);
            cleaned += trailingNumbers;

            return `${cleaned}.${extension}`;
        } catch(e) {
            console.log("ERROR", e)
        }
      
    }

    useEffect(() => {
        try { 
            if(props?.company?.reg_no) {

                props?.company?.ship?.map(async (xx, index) => {
                    // console.log("SHIPPING ADDRESS", xx,)
                    let countryCode = countryData?.filter((x) => x.value === xx.shipping_country_name)?.[0]?.key
                    if(countryCode){
                        const url = `/neonix-api/api/CustomerMaster/StatesByCountry?countryCode=${countryCode}`;
                        await configParam.RUN_REST_API(url, "", "", "", "Get")
                        .then((res) => { 
                            // console.log("RESPONSE______", res?.response) 
                            setStateOptions((prevState) => ({
                                ...prevState,
                                shipping: {
                                    ...prevState.shipping,
                                    [index + 1]: res?.response?.map((x) => ({ code: x.code, name: x.name }))
                                }
                            }))
                        })
                    }
                })

                EntityNameRef.current.value = props?.company?.company_name;
                RegNumRef.current.value = props?.company?.reg_no;
                setSelectedCompanyType(companyTypeData?.filter((x) => x.name === props?.company?.company_type_desc)[0]?.code);
                setSelectedCompanyCategory(companyCateData?.filter((x) => x.name === props?.company?.company_cate_desc)[0]?.code);
                setSelectedIndustryType(industryData?.filter((x) => x.name === props?.company?.industry_type_desc)[0]?.code);
                PrimaryContRef.current.value = props?.company?.primary_cont_person;
                DesignationRef.current.value = props?.company?.designation;
                EmailRef.current.value = props?.company?.email;
                ContactNumberRef.current.value = props?.company?.contact_num;
                AlternativeContactPersonRef.current.value = props?.company?.alter_cont_person;
                AlternativeContactRef.current.value = props?.company?.alter_cont_num;
                AddLine1Ref.current.value = props?.company?.company_address_1;
                AddLine2Ref.current.value = props?.company?.company_address_2;
                CityRef.current.value = props?.company?.city;
                setBillingAddressState(props?.company?.billing_state_name ? statesData?.filter((x) => x.name === props?.company?.billing_state_name)[0]?.code : statesData?.filter((x) => x.name === billingAddressState)[0]?.code);
                setBillingAddressCountry(props?.company?.billing_country_name ? countryData?.filter((x) => x.value === props?.company?.billing_country_name)[0]?.key : countryData?.filter((x) => x.value === billingAddressCountry)[0]?.key);
                ZipCodeRef.current.value = props?.company?.zip_code;
                GSTNumberRef.current.value = props?.company?.gsT_num;
                TINnumRef.current.value = props?.company?.tiN_num;
                CompanyPANRef.current.value = props?.company?.paN_num;
                BankAccountRef.current.value = props?.company?.bnk_acc_no;
                IFSCRef.current.value = props?.company?.ifsC_code;
                // CurrencyRef.current.value = props?.company?.pre_currency;
                // SignatueRef.current.value = props?.company?.auth_sign;
                setCurrency(props?.company?.pre_currency)
                setSignatue(usersData?.filter((x) => x.value === props?.company?.auth_sign)?.[0]?.key)
                setsameAdd(props?.company?.is_ship_same_add);

                let temp_companylogo = null;
                if(props?.company?.logofileBase64 !== null && props?.company?.logofileBase64 !== undefined && props?.company?.logofileBase64 !== "") {
                    temp_companylogo = base64ToFile(props?.company?.logofileBase64, cleanFileName(props?.company?.logofilepath));
                }
                let temp_gstfile = null;
                if(props?.company?.gstfileBase64 !== null && props?.company?.gstfileBase64 !== undefined && props?.company?.gstfileBase64 !== "") {
                    temp_gstfile = base64ToFile(props?.company?.gstfileBase64, cleanFileName(props?.company?.gstfilepath));
                }
                let temp_tinfile = null;
                if(props?.company?.tinfileBase64 !== null && props?.company?.tinfileBase64 !== undefined && props?.company?.tinfileBase64 !== "") {
                    temp_tinfile = base64ToFile(props?.company?.tinfileBase64, cleanFileName(props?.company?.tinfilepath));
                }
                let temp_panfile = null;
                if(props?.company?.panfileBase64 !== null && props?.company?.panfileBase64 !== undefined && props?.company?.panfileBase64 !== "") {
                    temp_panfile = base64ToFile(props?.company?.panfileBase64, cleanFileName(props?.company?.panfilepath));
                }
                setFiles({
                    CompanyLogo: temp_companylogo,
                    GSTDoc: temp_gstfile,
                    TINDoc: temp_tinfile,
                    PANDoc: temp_panfile
                })
                console.log(errorState, "ERROR STATE")
                let temp_errorState = []
                let shipping_address = props?.company?.ship?.map((xx, index) => {
                    console.log(xx, stateOptions?.shipping?.[index+1]?.filter((x) => x.name ===  xx?.shipping_state_name))
                    temp_errorState.push({
                        addLine1: '',
                        addLine2: '',
                        city: '',
                        state: '',
                        country: '',
                        zipCode: '',
                    })
                    return {
                        addressLine1: xx?.shipping_add1 || shippingAddress[index]?.addressLine1,
                        addressLine2: xx?.shipping_add2 || shippingAddress[index]?.addressLine2,
                        city: xx?.shipping_city || shippingAddress[index]?.city,
                        state: stateOptions?.shipping?.[index+1]?.filter((x) => x.name ===  xx?.shipping_state_name)[0]?.code || shippingAddress[index]?.state,
                        country: countryData?.filter((x) => x.value === xx?.shipping_country_name)[0]?.key || shippingAddress[index]?.country,
                        zipCode: xx?.shipping_zip_code || shippingAddress[index]?.zipCode,
                    }
                })
                setShippingAddress(shipping_address)
                setErrorState((prevState) => ({
                    ...prevState,
                    shipping: temp_errorState
                }))
            }
         }
        catch (e) { console.log("ERROR", e) }
        
    },[props.company, companyTypeData, companyCateData, industryData, statesData, countryData, usersData, allCurrencyData])

    const handleValidation = () => {

        try {
            
       
        
        setLoading(true)
        let isValid = true;

        // Company Name Validation
        const trimmedValue = EntityNameRef?.current.value?.trim();
        const regex = /^[A-Za-z0-9\-_. ]+$/;
        let entity_message = ""; 

        if (trimmedValue === "" || trimmedValue === null || trimmedValue === undefined) {
            entity_message = "Company name cannot be empty or just spaces";
            setIsError(true)
            isValid = false;
        } else if (EntityNameRef?.current.value.length > 50) {
            entity_message = "Maximum 50 characters allowed"; 
            setIsError(true)
            isValid = false;
        } else if (!regex.test(EntityNameRef?.current.value)) {
            entity_message = "Only letters, numbers, and -, _, . are allowed";
            setIsError(true)
            isValid = false;
        } else if (EntityNameRef?.current.value !== trimmedValue) {
            entity_message = "No leading or trailing spaces allowed";
            setIsError(true)
            isValid = false;
        }
        

        // Registration Number Validation
        const isAlphanumeric = /^[A-Za-z0-9]*$/.test(RegNumRef?.current.value);
        let registrationNumberMessage = "";
        if (!isAlphanumeric) {
            setIsError(true)
            isValid = false;
            registrationNumberMessage = 'Only alphanumeric characters are allowed';
        }
        if (RegNumRef?.current.value?.trim() === "" || RegNumRef?.current.value?.trim() === null || RegNumRef?.current.value?.trim() === undefined) {
            setIsError(true)
            isValid = false;
            registrationNumberMessage = 'Registration number cannot be empty';
        }


        // Primary Contact Person Validation
        const rawValue = PrimaryContRef.current.value;
        const trimmedPrimaryContactValue = rawValue?.trim();
        const trimmed_regex = /^[A-Za-z \ ]+$/;
        let primaryContactPersonMessage = "";

        if (trimmedPrimaryContactValue === "" || trimmedPrimaryContactValue === null || trimmedPrimaryContactValue === undefined) {
            setIsError(true)
            isValid = false;
            primaryContactPersonMessage = "Primary contact name cannot be empty or just spaces";
        } else if (rawValue.length > 50) {
            setIsError(true)
            isValid = false;
            primaryContactPersonMessage = "Maximum 50 characters allowed";
        } else if (!trimmed_regex.test(rawValue)) {
            setIsError(true)
            isValid = false;
            primaryContactPersonMessage = "Only letters are allowed";
        } else if (rawValue !== trimmedPrimaryContactValue) {
            setIsError(true)
            isValid = false;
            primaryContactPersonMessage = "No leading or trailing spaces allowed";
        }
        

        // Designation Validation
        const DesignationawValue = DesignationRef.current.value;

        const DesignationTrimmedValue = DesignationawValue?.trim();
        const Designationregex = /^[A-Za-z \ ]+$/;
        let Designationmessage = "";
                                
        if (DesignationTrimmedValue === "" ) {
            Designationmessage = "";
        } else if (DesignationawValue.length > 50) {
            setIsError(true)
            isValid = false;
            Designationmessage = "Maximum 50 characters allowed";
        } else if (!Designationregex.test(DesignationawValue)) {
            setIsError(true)
            isValid = false;
            Designationmessage = "Designation should only contain letters";
        } else if (DesignationawValue !== DesignationTrimmedValue) {
            setIsError(true)
            isValid = false;
            Designationmessage = "No leading or trailing spaces allowed";
        }

        const rawEmailValue = EmailRef.current.value;

        // a function to validate
         const trimmedEmailValue = rawEmailValue?.trim();
         const Emailregex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
         let email_message = "";
                                 
         if (trimmedEmailValue === "" || trimmedEmailValue === null || trimmedEmailValue === undefined) {
            setIsError(true)
            isValid = false;
             email_message = "Email ID is required";
         } else if (!Emailregex.test(rawEmailValue)) {
            setIsError(true)
            isValid = false;
             email_message = "Email ID is not valid";
         }
        //  setErrorState({ ...errorState, email: message });

        const rawContactValue = ContactNumberRef.current.value;

        // a function to validate
        const trimmedContactValue = rawContactValue?.trim();
        const Contactregex = /^[0-9\ ]+$/;;
        let contact_message = "";
                                
        if (trimmedContactValue === "" || trimmedContactValue === null || trimmedContactValue === undefined) {
            // message = "Email ID is required";
            setIsError(true)
            isValid = false;
            contact_message = "Contact number is required";
        } else if (!Contactregex.test(rawContactValue)) {
            setIsError(true)
            isValid = false;
            contact_message = "Enter a valid contact number";
        }

        const rawAlternateNameValue = AlternativeContactPersonRef.current.value;
        const trimmedAlternateNameValue = rawAlternateNameValue?.trim();
        const AlternateNameregex = /^[A-Za-z \ ]+$/;
        let alternatename_message = "";
                                
        if (trimmedAlternateNameValue === "") {
            alternatename_message = "";
        } else if (rawAlternateNameValue.length > 50) {
            setIsError(true)
            isValid = false;
            alternatename_message = "Maximum 50 characters allowed";
        } else if (!AlternateNameregex.test(rawAlternateNameValue)) {
            setIsError(true)
            isValid = false;
            alternatename_message = "Only letters are allowed";
        } else if (rawAlternateNameValue !== trimmedAlternateNameValue) {
            setIsError(true)
            isValid = false;
            alternatename_message = "No leading or trailing spaces allowed";
        }


        const rawAlternateContactValue = AlternativeContactRef.current.value;
        // a function to validate
        const trimmedAlternateContactValue = rawAlternateContactValue?.trim();
        const alternate_contact_regex = /^[0-9\ ]+$/;;
        let alternate_contact_message = "";
                                
        if (trimmedAlternateContactValue === "") {
            // message = "Email ID is required";
            // console.log();setIsError(true)
            // alternate_contact_message = "Contact number is required";
        } else if (!alternate_contact_regex.test(rawAlternateContactValue)) {
            setIsError(true)
            isValid = false;
            alternate_contact_message = "Enter a valid contact number";
        }

        const rawBillingAddress1Value = AddLine1Ref.current.value;
        const trimmedBillingAddress1Value = rawBillingAddress1Value?.trim();
        // const regex = /^[0-9\ ]+$/;;
        let billing_address_1_message = "";
                                
        if (trimmedBillingAddress1Value === "" || trimmedBillingAddress1Value === null || trimmedBillingAddress1Value === undefined) {
            // message = "Email ID is required";
            setIsError(true)
            isValid = false;
            billing_address_1_message = "Address Line 1 is required";
        }

        const rawCityValue = CityRef.current.value;
        const trimmedCityValue = rawCityValue?.trim();
        // const regex = /^[0-9\ ]+$/;;
        let city_message = "";
        if (trimmedCityValue === "" || trimmedCityValue === null || trimmedCityValue === undefined) {
            setIsError(true)
            isValid = false;
            city_message = "City is required";
        }


        const rawCountryValue = billingAddressCountry;
        const trimmedCountryValue = rawCountryValue?.trim();
        // const regex = /^[0-9\ ]+$/;;
        let country_message = "";
        if (trimmedCountryValue === "" || trimmedCountryValue === null || trimmedCountryValue === undefined) {
            setIsError(true)
            country_message = "Country is required";
        }

        const rawStateValue = billingAddressState;
        const trimmedStateValue = rawStateValue?.trim();
        // const regex = /^[0-9\ ]+$/;;
        let state_message = "";
        if (trimmedStateValue === "" || trimmedStateValue === null || trimmedStateValue === undefined) {
            setIsError(true)
            isValid = false;
            state_message = "State is required";
        }

        const rawZipCodeValue = ZipCodeRef.current.value;
        const trimmedZipCodeValue = rawZipCodeValue?.trim();
        let zip_code_message = "";
        if (trimmedZipCodeValue === "" || trimmedZipCodeValue === null || trimmedZipCodeValue === undefined) {
            setIsError(true)
            isValid = false;
            zip_code_message = "Zip code is required";
        }

       let shipping_message =  []

        shippingAddress.map((x, index)  => {
            shipping_message.push({
                addLine1: '',
                addLine2: '',
                city: '',
                state: '',
                country: '',
                zipCode: '',
            })
        })

        // console.clear()
        // console.log(shippingAddress, "SHIPPING ADDRESS", shipping_message)
        shippingAddress.map((x, index) => {
            // if(index === 1 || secondAddress === false){ alert ('hi') } 
            console.log(index,)
            const rawshippingAddress1Value = shippingAddress[index]?.addressLine1;
            const trimmedShippingAddress1Value = rawshippingAddress1Value?.trim();
            if (trimmedShippingAddress1Value === "" || trimmedShippingAddress1Value === null || trimmedShippingAddress1Value === undefined) {
                // message = "Email ID is required";
                setIsError(true)
                isValid = false;
                shipping_message[index].addLine1 = `Shipping Address Line 1 is required`;
            }

            const rawshipingCityValue = shippingAddress?.[index]?.city;
            const trimmedShipCityValue = rawshipingCityValue?.trim();
            // const regex = /^[0-9\ ]+$/;;
            let city_message = "";
            if (trimmedShipCityValue === "" || trimmedShipCityValue === null || trimmedShipCityValue === undefined) {
                setIsError(true)
                isValid = false;
                shipping_message[index].city = "City is required";
            }


            const rawShipCountryValue = shippingAddress?.[index]?.country;
            const trimmedShipCountryValue = rawShipCountryValue?.trim();
            // const regex = /^[0-9\ ]+$/;;
            let country_message = "";
            if (trimmedShipCountryValue === "" || trimmedShipCountryValue === null || trimmedShipCountryValue === undefined) {
                setIsError(true)
                isValid = false;
                shipping_message[index].country = "Country is required";
            }


            const rawShipStateValue = shippingAddress?.[index]?.state;
            const trimmedShipStateValue = rawShipStateValue?.trim();
            if (trimmedShipStateValue === "" || trimmedShipStateValue === null || trimmedShipStateValue === undefined) {
                setIsError(true)
                isValid = false;
                shipping_message[index].state = "State is required";
            }


            const rawShipZipCodeValue = shippingAddress?.[index]?.zipCode;
            const trimmedShipZipCodeValue = rawShipZipCodeValue?.trim();
            if (trimmedShipZipCodeValue === "" || trimmedShipZipCodeValue === null || trimmedShipZipCodeValue === undefined) {
                setIsError(true)
                isValid = false;
                shipping_message[index].zipCode = "Zip code is required";
            }
        })

        console.log(shipping_message, "SHIPPING MESSAGE")

        const isGSTAlphanumeric = /^[A-Za-z0-9]*$/.test(GSTNumberRef.current.value);
        let gst_message = "";
        if (!isGSTAlphanumeric) {
            setIsError(true)
            isValid = false;
            gst_message = 'Only alphanumeric characters are allowed';
        }

        const isTINAlphanumeric = /^[A-Za-z0-9]*$/.test(TINnumRef.current.value);
        let tin_message = "";
        if (!isTINAlphanumeric) {
            setIsError(true)
            isValid = false;
            tin_message = 'Only alphanumeric characters are allowed';
        }

        const isPANAlphanumeric = /^[A-Za-z0-9]*$/.test(CompanyPANRef.current.value);
        let pan_message = "";
        if (!isPANAlphanumeric) {
            setIsError(true)
            isValid = false;
            pan_message = 'Only alphanumeric characters are allowed';
        }

        const isBankAlphanumeric = /^[A-Za-z0-9]*$/.test(BankAccountRef.current.value);
        let bank_message = "";
        if (!isBankAlphanumeric) {
            setIsError(true)
            isValid = false;
            bank_message = 'Only alphanumeric characters are allowed';
        }

        const isIFSCAlphanumeric = /^[A-Za-z0-9]*$/.test(IFSCRef.current.value);
        let ifsc_message = "";
        if (!isIFSCAlphanumeric) {
            setIsError(true)
            isValid = false;
            ifsc_message = 'Only alphanumeric characters are allowed';
        }

        const rawCurrencyValue = Currency;
        const trimmedCurrencyValue = rawCurrencyValue?.trim();
        // const regex = /^[0-9\ ]+$/;;
        let currency_message = "";
        if (trimmedCurrencyValue === "") {
            // currency_message = "Currency is required";
        }

        // console.clear()
        // console.log(Signatue, "SIGNATURE")
        const rawSignatureValue = Signatue;
        const trimmedSignatureValue = rawSignatureValue?.trim();
        // const regex = /^[0-9\ ]+$/;;
        let sign_message = "";
        if (Signatue === "" || Signatue === null || Signatue === undefined) {
            setIsError(true)
            isValid = false;
            sign_message = "Signature is required";
        }


        console.log(shipping_message, "SHIPPING MESSAGE FINAL")
        setErrorState({
            ...errorState,
            companyName: entity_message,
            registrationNumber: registrationNumberMessage,
            primaryContactPerson: primaryContactPersonMessage,
            designation: Designationmessage,
            email: email_message,
            contactNumber: contact_message,
            alternativeContactPerson: alternatename_message,
            alternativeContactNumber: alternate_contact_message,
            addressLine1: billing_address_1_message,
            addressLine2: '',
            city: city_message,
            state: state_message,
            country : country_message,
            zipCode: zip_code_message,

            shipping: shipping_message,

            gstNumber: gst_message,
            tinNumber: tin_message,
            companyPAN: pan_message,
            bankAccount: bank_message,
            ifscCode: ifsc_message,
            currency: currency_message,
            signature: sign_message,
        });

        return isValid

         } catch (error) {
            console.error("Error in handleValidation:", error);
            
        }

        


    }

    const handleSave = () => {
        try {
            // console.clear()
            const isValid = handleValidation();
            if (isValid) {
                // console.log("INSIDE___")
                // console.log(errorState, "ERROR_SAVE")
                const formData = new FormData();
                formData.append("bill.company_name", EntityNameRef?.current.value);
                formData.append("bill.reg_no", RegNumRef?.current.value);
                formData.append("bill.company_type", selectedCompanyType);
                formData.append("bill.company_cate", selectedCompanyCategory);
                formData.append("bill.industry_type", selectedIndustryType);
                formData.append("bill.primary_cont_person", PrimaryContRef?.current.value);
                formData.append("bill.designation", DesignationRef?.current.value);
                formData.append("bill.email", EmailRef?.current.value);
                formData.append("bill.contact_num", ContactNumberRef?.current.value);
                formData.append("bill.alter_cont_person", AlternativeContactPersonRef?.current.value);
                formData.append("bill.alter_cont_num", AlternativeContactRef?.current.value);
                formData.append("bill.add1", AddLine1Ref?.current.value);
                formData.append("bill.add2", AddLine2Ref?.current.value);
                formData.append("bill.city", CityRef?.current.value);
                formData.append("bill.state", billingAddressState);
                formData.append("bill.country", billingAddressCountry);
                formData.append("bill.zip_code", ZipCodeRef?.current.value);
                shippingAddress?.map((x, index) => {
                    Object.keys(x).forEach((key) => {
                        formData.append(`ship[${index}].${getProperKey(key)}`, x[key]);
                    })
                    formData.append(`ship[${index}].ap_code`, "");
                })
                // formData.append("shippingAddress", JSON.stringify(shippingAddress));
                formData.append("bill.GST_num", GSTNumberRef?.current.value);
                formData.append("bill.TIN_num", TINnumRef?.current.value);
                formData.append("bill.PAN_num", CompanyPANRef?.current.value);
                formData.append("bill.bnk_acc_no", BankAccountRef?.current.value);
                formData.append("bill.IFSC_code", IFSCRef?.current.value);
                // formData.append("bill.pre_currency", CurrencyRef?.current.value);
                // formData.append("bill.auth_sign", SignatueRef?.current.value);
                formData.append("bill.pre_currency", Currency);
                formData.append("bill.auth_sign", Signatue);
                formData.append("bill.logo", files.CompanyLogo);
                formData.append("bill.gstfile", files.GSTDoc);
                formData.append("bill.tinfile", files.TINDoc);
                formData.append("bill.panfile", files.PANDoc);
                formData.append("bill.is_ship_same_add", sameAdd === false ? 0 : 1 );

                // --------------------------
                formData.append("bill.id", "1");
                formData.append("bill.gstfilepath", "");
                formData.append("bill.is_deleted", "0");
                formData.append("bill.bnk_acc_name", "");
                formData.append("bill.crt_dt", "");
                formData.append("bill.logofilepath", "");
                formData.append("bill.tinfilepath", "");
                formData.append("bill.mdy_dt", "");
                formData.append("bill.ap_code", "");
                formData.append("bill.panfilepath", "");
                formData.append("bill.crt_by", "");
                formData.append("bill.mdy_by", "");

                // console.log("Form Data:", formData);

                if(props.company?.reg_no){
                    // edit
                    updateCompany(formData)
                } else {
                    getCreateCompany(formData)
                }
            } else {
                console.log("INSIDE___", errorState)
                console.log("ELSE IN SAVE")
            }
        }
        catch (error) {
            console.log("Error in handleSave:", error);
        }
        
    }

    useEffect(() => {
        if(createCompanyData === 'Created Successfully '){
            // alert("INSIDE___")
                setOpenSnack(true)
                SetMessage("Company Info added")
                SetType("success")
                SetDesc("Company Info has been successfully added")
            props.isEditChange()
        }
        if(companyUpdateData === 'Updated Successfully '){
            // alert("INSIDE___")
             setOpenSnack(true)
                SetMessage("Company Info Updated")
                SetType("success")
                SetDesc("Company Info has been successfully updated")
            props.isEditChange()
            
        }
        // console.log(createCompanyData, "createCompanyData")
        // console.log(companyUpdateData, "companyUpdateData")
    }, [createCompanyData, companyUpdateData])

    useEffect(() => {
        // getAllCustomers()
        
        getCitiesByState("TN");
        getIndustryTypes();
        getCompanyTypes();
        getCompanyCategoryTypes();
        getCountryList();
        getAllCurrency()
        getAllUsers();
    }, [])

    useEffect(() => {
        getStatesByCountry(billingAddressCountry);
    }, [billingAddressCountry])

    const handleEntityNameChange = (event) => {
        const value = event.target.value;
        setEntityName({ value, isValid: true, message: '' });
    };

    const handlePrimaryContChange = (event) => {
        const value = event.target.value;
        setPrimaryCont({ value, isValid: true, message: '' });
    };

    const handleDesignatinChange = (event) => {
        const value = event.target.value;
        setdesignation({ value, isValid: true, message: '' });
    };

    const handleEmailChange = (event) => {
        const value = event.target.value;
        setEmail({ value, isValid: true, message: '' });
    };

    const handleContactNumberChange = (event) => {
        const value = event.target.value;
        setContactNum({ value, isValid: true, message: '' });
    };

    const handleAlternativeContactPersonChange = (event) => {
        const value = event.target.value;
        setAltContPerson({ value, isValid: true, message: '' });
    };

    const handleAlternativeContactChange = (event) => {
        const value = event.target.value;
        setAltCont({ value, isValid: true, message: '' });
    };
    
    const handleRegistrationNumberChange = (event) => {
        const rawValue = event.target.value;


        setRegNum({
            value: rawValue,
            isValid: true,
            message: "",
        });
    };

    const handleAddLine1Change = (event) => {
        const value = event.target.value;
        setAddLine1({ value, isValid: true, message: '' });
    };

    const handleAddLine2Change = (event) => {
        const value = event.target.value;
        setAddLine2({ value, isValid: true, message: '' });
    };

    const handleCityNameChange = (event) => {
        const value = event.target.value;
        setCityName({ value, isValid: true, message: '' });
    };

    const handleZipCodeChange = (event) => {
        const value = event.target.value;
        setZipCode({ value, isValid: true, message: '' });
    };

    const handleshippingAddLine1Change = (event) => {
        const value = event.target.value;
        setShippingAddLine1({ value, isValid: true, message: '' });
    };

    const handleShippingAddLine2Change = (event) => {
        const value = event.target.value;
        setShippingAddLine2({ value, isValid: true, message: '' });
    };

    const handleshippingCityChange = (event) => {
        const value = event.target.value;
        setShippingCity({ value, isValid: true, message: '' });
    };

    const handleShippingAddressLine1Change = (event) => {
        const value = event.target.value;
        setShippingAddressLine1({ value, isValid: true, message: '' });
    };

    const handleShippingAddressLine2Change = (event) => {
        const value = event.target.value;
        setShippingAddressLine2({ value, isValid: true, message: '' });
    };



    const handleShippingZipChange = (event) => {
        const value = event.target.value;
        setShippingZip({ value, isValid: true, message: '' });
    };

    const handleGstNumberChange = (event) => {
        const value = event.target.value;
        setGstNumber({ value, isValid: true, message: '' });
    };

    const handleTINnumberChange = (event) => {
        const value = event.target.value;
        setTINnum({ value, isValid: true, message: '' });
    };

    const handleCompanyPANChange = (event) => {
        const value = event.target.value;
        setCompanyPAN({ value, isValid: true, message: '' });
    };

    const handleBankAccountChange = (event) => {
        const value = event.target.value;
        setBankAccount({ value, isValid: true, message: '' });
    };

    const handleIFSCCodeChange = (event) => {
        const value = event.target.value;
        setIFSCCode({ value, isValid: true, message: '' });
    };

    const handleCurrencyChange = (event) => {
        const value = event.target.value;
        setCurrency(value);
    };

    const handleSignatueChange = (event) => {
        const value = event.target.value;
        setSignatue(value);
    };


    const handleSameAdd = (e) => {
        setsameAdd(!sameAdd)
    }

    useEffect(() => {
        if (sameAdd) {
            setShippingAddress([{
                addressLine1: AddLine1Ref?.current?.value,
                addressLine2: AddLine2Ref?.current?.value,
                city: CityRef?.current?.value,
                state: billingAddressState,
                country: billingAddressCountry,
                zipCode: ZipCodeRef?.current?.value,
            }])
            setSecondAddress(true)
        } 
    }, [sameAdd, addLine1, addLine2, cityName, zipCode, billingAddressState, billingAddressCountry])

    const handleAddShippingAddress = () => {
        
        try {
            setSecondAddress(true)
            setShippingAddress([ ...shippingAddress, {
                addressLine1: "",
                addressLine2: "",
                city: "",
                state: "",
                country: "",
                zipCode: "",
            }])
            setErrorState({ 
                ...errorState, 
                shipping: [ 
                    ...errorState.shipping, {
                        addLine1: '',
                        addLine2: '',
                        city: '',
                        state: '',
                        country: '',
                        zipCode: '',
                        msg: '',
                    }
                ] 
            });
            setAddresses((prev) => [...prev, { id: prev.length + 1 }]);
        } catch (e) { console.log("ERROR", e) }
        // let shipError = errorState
        
    };

    // Transform your data before passing it to SelectBox
    // const stateOptions = (statesData || []).map((item) => ({
    //     label: item.stateName,
    //     value: item.stateCode
    // }));

    const handleRemoveAssetImage = (key) =>{
       setFiles({ ...files, [key]: ''})
    }


    // Function to handle selection from dropdown
    const handleChange = (e, name, key ='', index = 0) => {
        console.clear()
        console.log("Selected Value:", e.target.value, name, key, index);
        switch (name) {
            case 'country':
                setBillingAddressCountry(e.target.value);
                getStatesByCountry(e.target.value);
                setStateKey('billing')
                break;
            case 'state':
                getCitiesByState(e.target.value);
                setBillingAddressState(e.target.value);
                break;
            case 'shipping':
                setStateKey('shipping')
                if(key === 'country') {  
                    getStatesByCountry(e.target.value) 
                }
                let new_shippingAddress = [...shippingAddress];
                console.log(key, index, e.target.value, new_shippingAddress)
                if(new_shippingAddress[index] === undefined) {
                    new_shippingAddress[index] = {
                        addressLine1: "",
                        addressLine2: "",
                        city: "",
                        state: "",
                        country: "",
                        zipCode: "",
                    };
                    new_shippingAddress[index][key] = e.target.value;
                    setShippingAddress(new_shippingAddress);
                } else {
                    new_shippingAddress[index][key] = e.target.value;
                    setShippingAddress(new_shippingAddress);
                }
                break;
            default:
                break;
        }
    };

    // useEffect(() => {

    //     if(shippingAddress[0]?.addressLine1 === AddLine1Ref.current.value && shippingAddress[0]?.addressLine2 === AddLine2Ref.current.value && shippingAddress[0]?.city === CityRef.current.value && shippingAddress[0]?.zipCode === ZipCodeRef.current.value && shippingAddress[0]?.state === billingAddressState && shippingAddress[0]?.country === billingAddressCountry) {
    //         setsameAdd(false);
    //     } else {
    //         setsameAdd(true);
    //     }

    // }, [shippingAddress, AddLine1Ref, AddLine2Ref, CityRef, ZipCodeRef, billingAddressState, billingAddressCountry])

    const handleFileChange = (e, file_name) => {
        try {
            const selectedFiles = e.target.files;
            const previewSelectedFile = Array.from(e.target.files);
            // Create preview URLs for each file

            let fileArr = [];
            
            for (const file of selectedFiles) {
                if (file.size < 10485760) {
                    fileArr.push(file.size);
                    console.log(file.type)
                    if(file_name === 'CompanyLogo' && (file.type !== "image/png" && file.type !== "image/svg+xml")) {
                        setErrorState({ ...errorState, CompanyLogo: "File type should be PNG/SVG" });
                    }
                    else if(file_name === 'GSTDoc' && (file.type !== "application/pdf" && file.type !== "image/png" && file.type !== "image/jpeg" && file.type !== "image/jpg")) {
                        setErrorState({ ...errorState, GSTDoc: "File type should be PDF/PNG/JPG" });
                    }
                    else if(file_name === 'TINDoc' && (file.type !== "application/pdf" && file.type !== "image/png" && file.type !== "image/jpeg" && file.type !== "image/jpg")) {
                        setErrorState({ ...errorState, TINDoc: "File type should be PDF/PNG/JPG" });
                    }
                    else if(file_name === 'PANDoc' && (file.type !== "application/pdf" && file.type !== "image/png" && file.type !== "image/jpeg" && file.type !== "image/jpg")) {
                        setErrorState({ ...errorState, PANDoc: "File type should be PDF/PNG/JPG" });
                    } else {
                         setFiles({
                            ...files,
                            [file_name]: selectedFiles[0],
                        });
                        setErrorState({ ...errorState, [file_name]: "" });
                    }
                } else {
                    setOpenSnack(true)
                    SetMessage("File Size Exceeded")
                    SetType("warning")
                    SetDesc("File size should be less than 10MB")
                    setErrorState({ ...errorState, [file_name]: "File size should be less than 10MB" });
                
                }
            }
        } catch (e) { console.log("ERROR", e) }
        
    };

    const handleRemoveAddress = (index) => {
        try {
            // TO remove data
            console.clear()
            console.log(index)
            console.log(shippingAddress, "SHIPPING ADDRESS")
            let new_shippingAddress = [...shippingAddress];
            new_shippingAddress.splice(index+1, 1);
            setShippingAddress(new_shippingAddress);


            // to remove field
            console.log(addresses, "ADDRESSES")
            let temp_addresses = [...addresses]
            temp_addresses.splice(index, 1);
            setAddresses(temp_addresses);

            console.log("errorState", errorState)


        } catch (e) { console.log("ERROR", e) }
        
    }




    return (
        <React.Fragment>
            { props.isEdit === true && (
                            <div className="flex justify-between items-center h-[48px] py-3.5 px-4 border-b bg-Background-bg-primary dark:bg-Background-bg-primary-dark border-Border-border-50 dark:border-Border-border-dark-50">

                                <BredCrumbsNDL breadcrump={breadcrump} onActive={(i) => {if(i === 0){ props.onCancel() }}} />
                                <div className="flex gap-2">
                                    <Button type="secondary" value="Cancel" onClick={() => setOpen(true)} />
                                    <Button type="primary" value={props?.company?.length === 0 ? "Save" : "Update"} onClick={() => {setIsError(false);handleSave()}} />
                                </div>
                            </div>
                        )}

            {
                (industryLoading && companyTypeLoading && companyCateLoading && countryLoading && (createCompanyLoading || companyUpdateLoading)) && <LoadingScreen />
            }

            <Grid container>
                <Grid xs={2}>
                    {/* Sidebar or left column could go here */}
                </Grid>
                <Grid xs={8}>
                    <Typography variant="heading-02-xs"
                        value={"Basic Info"}
                        color={"primary"}
                    />
                    <Typography variant="paragraph-xs"
                        value={"Capture essential details to identify the company and its legal identity."}
                        color={"tertiary"}
                    />

                    <div className="mt-4" />
                    <div className="flex gap-4 mt-4">
                        <div className="w-full">
                            <InputFieldNDL
                                label="Company Name"
                                inputRef={EntityNameRef}
                                placeholder="Type here"
                                mandatory={true}
                                error={errorState.companyName !== ''}
                                helperText={errorState.companyName}
                                // onChange={handleEntityNameChange}
                                onChange={(e) => {setErrorState((prevState) => ({
                                        ...prevState,
                                        companyName: ''
                                    }));  handleEntityNameChange(e);  
                                }}
                            />
                        </div>

                        <div className="w-full">
                            <InputFieldNDL
                                label="Registration Number"
                                inputRef={RegNumRef}
                                placeholder="Type here"
                                value={RegNum.value}
                                 mandatory={true}
                                 disabled={props?.company?.length !== 0}
                                error={errorState.registrationNumber !== ''}
                                helperText={errorState.registrationNumber}
                                // onChange={handleRegistrationNumberChange}
                                onChange={(e) => {setErrorState((prevState) => ({ ...prevState, registrationNumber: '' })); handleRegistrationNumberChange(e)}}
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 mt-4">
                        <div className="w-full">
                            <SelectBox
                                id="companyType"
                                labelId="companyType"
                                label="Company Type"
                                options={companyTypeData || []}
                                value={selectedCompanyType}
                                onChange={handleCompanyTypeChange}
                                keyValue="name"
                                keyId="code"
                                error={false}
                                msg={""}

                                auto={true}
                                multiple={false}
                            />
                        </div>

                        {/* Input field for contact number */}
                        <div className="w-full">
                            <SelectBox
                                id="companyCategory"
                                labelId="companyCategory"
                                label="Company Category"
                                options={(companyCateData && companyCateData.length > 0) ? companyCateData : []}
                                value={selectedCompanyCategory}
                                onChange={handleCompanyCategoryChange}
                                keyId="code"
                                keyValue="name"
                                error={false}
                                msg=""

                                auto={true}
                                multiple={false}
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 mt-4">
                        {/* Input field for alternative contact person */}
                        <div className="w-full">
                            <SelectBox
                                id="industryType"
                                labelId="industryType"
                                label="Industry Type"
                                options={industryData || []}
                                value={selectedIndustryType}
                                onChange={handleIndustryTypeChange}
                                keyValue="name"
                                keyId="code"
                                error={false}
                                msg=""
                                auto={true}
                                multiple={false}
                            />
                        </div>

                        <div className="w-full">
                        {
                            (files.CompanyLogo !== '' && files.CompanyLogo !== null && files.CompanyLogo !== undefined) ? (<>
                               <React.Fragment>
                            <Typography variant="paragraph-xs">Company Logo</Typography>
                            <Grid item xs={12}>
                                <div className="flex justify-between items-center">
                                <div className="flex gap-2 items-center">
                                    <DummyImage />
                                    <Typography value={props.company?.logofilepath || files.CompanyLogo.name} variant="lable-01-s" />
                                </div>
                                <BlackX onClick={() => handleRemoveAssetImage('CompanyLogo')} />
                                </div>
                            </Grid>
                            </React.Fragment>
                            </>) : (<>
                            
                                <FileInput
                                    accept="image/*"
                                    label="Company Logo"
                                    multiple={false}
                                    error={errorState.CompanyLogo !== ''}
                                    onChange={(e) => handleFileChange(e, 'CompanyLogo')}
                                    onClose={(val, index, e) => val.type ? console.log(index, e) : console.log(index, val)}
                                />
                                <div className="mt-0.5" />
                                <Typography color={errorState.CompanyLogo ? 'danger' : 'tertiary'} variant="paragraph-xs" value={errorState.CompanyLogo || 'Max 10mb SVG or PNG'} />
                            </>)
                        }
                            
                        </div>
                    </div>
                    <div className="mt-4" />
                    <HorizontalLine variant="divider1" />
                    <div className="mt-4" />

                    <Typography variant={"heading-02-xs"} value={"Contact Information"} color={"primary"} />
                    <Typography variant={"paragraph-xs"} value={"Provide contact details for communication and correspondence."} color={"tertiary"} />

                    <div className="flex gap-4 mt-4">
                        <div className="w-full">
                            <InputFieldNDL
                                label={"Primary Contact Person"}
                                inputRef={PrimaryContRef}
                                placeholder={"Type here"}
                                 mandatory={true}
                                error={errorState.primaryContactPerson !== ''}
                                helperText={errorState.primaryContactPerson}
                                onChange={(e) => {handlePrimaryContChange(e); setErrorState((prevState) => ({ ...prevState, primaryContactPerson: '' }));}}
                                // onFocus={() => {
                                //     setErrorState({ ...errorState, primaryContactPerson: '' });
                                // }}
                            />
                        </div>
                        <div className="w-full">
                            <InputFieldNDL
                                label={"Designation"}
                                inputRef={DesignationRef}
                                placeholder={"Type here"}
                                error={errorState.designation !== ''}
                                helperText={errorState.designation}
                                onChange={(e) => {handleDesignatinChange(e); setErrorState((prevState) => ({ ...prevState, designation: '' }));}}
                                // onFocus={() => {
                                //     setErrorState({ ...errorState, designation: '' });
                                // }}
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 mt-4">
                        <div className="w-full">
                            <InputFieldNDL
                                label={"Email"}
                                inputRef={EmailRef}
                                placeholder={"Type here"}
                                 mandatory={true}
                                error={errorState.email !== ''}
                                helperText={errorState.email}
                                onChange={(e) => {handleEmailChange(e); setErrorState((prevState) => ({ ...prevState, email: '' }));}}
                                // onFocus={() => {
                                //     setErrorState({ ...errorState, email: '' });
                                // }}
                            />
                        </div>
                        <div className="w-full">
                            <InputFieldNDL
                                label={"Contact Number"}
                                inputRef={ContactNumberRef}
                                placeholder={"Type here"}
                                 mandatory={true}
                                onChange={(e) => {handleContactNumberChange(e); setErrorState((prevState) => ({ ...prevState, contactNumber: '' }));}}
                                error={errorState.contactNumber !== ''}
                                helperText={errorState.contactNumber}
                                // onFocus={() => {
                                //     setErrorState({ ...errorState, contactNumber: '' });
                                // }} 
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 mt-4">
                        <div className="w-full">
                            <InputFieldNDL
                                label={"Alternative Contact Person"}
                                inputRef={AlternativeContactPersonRef}
                                placeholder={"Type here"}
                                error={errorState.alternativeContactPerson !== ''}
                                helperText={errorState.alternativeContactPerson}
                                onChange={(e) => {handleAlternativeContactPersonChange(e); setErrorState((prevState) => ({ ...prevState, alternativeContactPerson: '' }));}}
                                // onFocus={() => {
                                //     setErrorState({ ...errorState, alternativeContactPerson: '' });
                                // }}
                            />
                        </div>

                        <div className="w-full">
                            <InputFieldNDL
                                label={"Alternative Contact Number"}
                                inputRef={AlternativeContactRef}
                                placeholder={"Type here"}
                                onChange={(e) => {handleAlternativeContactChange(e); setErrorState((prevState) => ({ ...prevState, alternativeContactNumber: '' }));}}
                                error={errorState.alternativeContactNumber !== ''}
                                helperText={errorState.alternativeContactNumber}
                                // onFocus={() => {
                                //     setErrorState({ ...errorState, alternativeContactNumber: '' });
                                // }}
                            />
                        </div>
                    </div>


                    <React.Fragment>
                        <div className="mt-4" />
                        <Typography
                            variant={"heading-02-xs"}
                            value={'Address Details'}
                            color={"primary"}
                        />
                        <Typography
                            variant={"paragraph-xs"}
                            value={'Enter organization-level information to align the enquiry with business context.'}
                            color={"tertiary"}
                        />
                        <div className="mt-4" />

                        <Typography
                            variant={"label-01-s"}
                            value={'Billing Address'}
                            color={"primary"}
                        />
                        <div className="mt-4" />
                        <InputFieldNDL
                            label={"Address Line 1"}
                            inputRef={AddLine1Ref}
                             mandatory={true}
                            placeholder={"Type here"}
                            onChange={(e) => {handleAddLine1Change(e); setErrorState((prevState) => ({ ...prevState, addressLine1: '' }));}}
                            error={errorState.addressLine1 !== ''}
                            helperText={errorState.addressLine1}
                            // onFocus={() => {
                            //     setErrorState({ ...errorState, addressLine1: '' });
                            // }}
                        />

                        <div className="mt-4" />
                        <InputFieldNDL
                            label={"Address Line 2"}
                            inputRef={AddLine2Ref}
                            placeholder={"Type here"}
                            error={errorState.addressLine2 !== ''}
                            helperText={errorState.addressLine2}
                            // onFocus={() => {
                            //     setErrorState({ ...errorState, addressLine2: '' });
                            // }}
                            onChange={(e) => {handleAddLine2Change(e); setErrorState((prevState) => ({ ...prevState, addressLine2: '' }));}}
                        />

                        <div className="flex gap-4 mt-4">
                            <div className="w-full">
                                <InputFieldNDL
                                    label={"City"}
                                    inputRef={CityRef}
                                    placeholder={"Type here"}
                                     mandatory={true}
                                    onChange={(e) => {handleCityNameChange(e); setErrorState((prevState) => ({ ...prevState, city: '' }));}}
                                    error={errorState?.city !== ''}
                                    helperText={errorState?.city}
                                    // onFocus={() => {
                                    //     setErrorState({ ...errorState, city: '' });
                                    // }}
                                />
                            </div>

                            <div className="w-full">
                                {/* ___ */}
                                <SelectBox
                                    id='country'
                                    labelId='country'
                                    label="Country"
                                    options={countryData || []}
                                    value={billingAddressCountry}
                                    onChange={(e) => {handleChange(e, 'country'); setErrorState((prevState) => ({ ...prevState, country: '' }));}}
                                     mandatory={true}
                                    keyValue="value"
                                    keyId="key"
                                    error={errorState?.country !== ''}
                                    msg={errorState?.country}
                                    // onFocus={() => {
                                    //     setErrorState({ ...errorState, country: '' });
                                    // }}
                                    auto={true}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 mt-4">
                            <div className="w-full">
                                <SelectBox
                                    id='state'
                                    labelId='state'
                                    label="State"
                                    // options={statesData || []}
                                    options = {stateOptions.billing || []}
                                    value={billingAddressState}
                                    onChange={(e) => {handleChange(e, 'state'); setErrorState((prevState) => ({ ...prevState, state: '' }));}}
                                     mandatory={true}
                                    error={errorState?.state !== ''}
                                    msg={errorState?.state}
                                    // onFocus={() => {
                                    //     setErrorState({ ...errorState, state: '' });    
                                    // }}
                                    keyValue="name"
                                    keyId="code"
                                    auto={true}
                                />
                            </div>

                            <div className="w-full">
                                <InputFieldNDL
                                    label={"ZIP Code"}
                                    inputRef={ZipCodeRef}
                                     mandatory={true}
                                    placeholder={"Type here"}
                                    error={errorState?.zipCode !== ''}
                                    helperText={errorState?.zipCode}
                                    // onFocus={() => {
                                    //     setErrorState({ ...errorState, zipCode: '' });  
                                    // }}
                                    onChange={(e) => {handleZipCodeChange(e); setErrorState((prevState) => ({ ...prevState, zipCode: '' }));}}
                                />
                            </div>
                        </div>

                        <div className="mt-4" />
                        <Typography
                            variant={"label-01-s"}
                            value={'Shipping Address 1'}
                            color={"primary"}
                        />
                        <Grid item xs={3} sm={3} >
                            <CustomSwitch
                                id={'SameAdd'}
                                switch={false}
                                checked={sameAdd}
                                onChange={handleSameAdd}
                                primaryLabel={'Shipping Address Same a Billing Address'}
                            />
                        </Grid>

                        <div className="mt-4" />
                        <InputFieldNDL
                            label={"Address Line 1"}
                             mandatory={true}
                            value={shippingAddress?.[0]?.addressLine1}
                            placeholder={"Type here"}
                            error={errorState?.shipping?.[0]?.addLine1 !== ''}
                            helperText={errorState?.shipping?.[0]?.addLine1}
                            // onFocus={() => {
                            //     setErrorState({ ...errorState, shipping: [...errorState.shipping, { ...errorState.shipping?.[0], addLine1: '' }] });  
                            // }}
                            onChange={(e) => {handleshippingAddLine1Change(e); handleChange(e, 'shipping', 'addressLine1', 0); setErrorState((prevState) => ({ ...prevState, shipping: [ ...prevState.shipping, { ...prevState.shipping?.[0], addLine1: '' }] }));}}
                        />

                        <div className="mt-4" />
                        <InputFieldNDL
                            label={"Address Line 2"}
                            value={shippingAddress?.[0]?.addressLine2}
                            
                            placeholder={"Type here"}
                            error={!shippingAddLine2.isValid}
                            helperText={!shippingAddLine2.isValid && shippingAddLine2.value.toString() === "" ? "Type Address Line 2" : ""}
                            onChange={(e) => {handleShippingAddLine2Change(e); handleChange(e, 'shipping', 'addressLine2', 0)}}
                        />

                        <div className="flex gap-4 mt-4">
                            <div className="w-full">
                                <InputFieldNDL
                                    label={"City"}
                                    value={shippingAddress?.[0]?.city}
                                    placeholder={"Type here"}
                                     mandatory={true}
                                    error={errorState?.shipping?.[0]?.city !== ''}
                                    helperText={errorState?.shipping?.[0]?.city}
                                    // onFocus={() => {
                                    //     setErrorState({ ...errorState, shipping: [...errorState.shipping, { ...errorState.shipping?.[0], city: '' }] });
                                    // }}
                                    onChange={(e) => {handleshippingCityChange(e); handleChange(e, 'shipping', 'city', 0); setErrorState((prevState) => ({ ...prevState, shipping: [ ...prevState.shipping, { ...prevState.shipping?.[0], city: '' }] }));}}
                                />
                            </div>

                            <div className="w-full">
                                <SelectBox
                                    id='country'
                                    labelId='country'
                                    label="Country"
                                    options={countryData || []}
                                    value={shippingAddress?.[0]?.country}
                                     mandatory={true}
                                    onChange={(e) => {setStateIndex(1);handleChange(e, 'shipping', 'country', 0); setErrorState((prevState) => ({ ...prevState, shipping: [ ...prevState.shipping, { ...prevState.shipping?.[0], country: '' }] }));}}
                                    error={errorState?.shipping?.[0]?.country !== ''}
                                    msg={errorState?.shipping?.[0]?.country}
                                    // onFocus={() => {
                                    //     setErrorState({ ...errorState, shipping: [...errorState.shipping, { ...errorState.shipping?.[0], country: '' }] });
                                    // }}
                                     keyValue="value"
                                    keyId="key"
                                    auto={true}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 mt-4">
                            <div className="w-full">
                                <SelectBox
                                    id='state'
                                    labelId='state'
                                    label="State"
                                     mandatory={true}
                                    // options={statesData || []}
                                    options = {stateOptions.shipping?.[1] || []}
                                    value={shippingAddress?.[0]?.state}
                                    onChange={(e) => {handleChange(e, 'shipping', 'state', 0); setErrorState((prevState) => ({ ...prevState, shipping: [ ...prevState.shipping, { ...prevState.shipping?.[0], state: '' }] }));}}
                                    error={errorState?.shipping?.[0]?.state !== ''}
                                    msg={errorState?.shipping?.[0]?.state}
                                    // onFocus={() => {
                                    //     setErrorState({ ...errorState, shipping: [...errorState.shipping, { ...errorState.shipping?.[0], state: '' }] });
                                    // }}
                                    keyValue="name"
                                    keyId="code"
                                    auto={true}
                                />
                            </div>

                            <div className="w-full">
                                <InputFieldNDL
                                    label={"ZIP Code"}
                                     mandatory={true}
                                    value={shippingAddress?.[0]?.zipCode}
                                    placeholder={"Type here"}
                                    error={errorState?.shipping?.[0]?.zipCode !== ''}
                                    helperText={errorState?.shipping?.[0]?.zipCode}
                                    // onFocus={() => {
                                    //     setErrorState({ ...errorState, shipping: [...errorState.shipping, { ...errorState.shipping?.[0], zipCode: '' }] });
                                    // }}
                                    
                                    onChange={(e) => {handleShippingZipChange(e); handleChange(e, 'shipping', 'zipCode', 0); setErrorState((prevState) => ({ ...prevState, shipping: [ ...prevState.shipping, { ...prevState.shipping?.[0], zipCode: '' }] }));}}
                                />
                            </div>
                        </div>

                        <div>
                            {
                                console.log(errorState, "ERROR STATE")
                            }
                            {addresses.map((address, index) => (
                                <div key={address.id} className="mb-6 rounded-lg">
                                    <div className="mt-4" />
                                    <>
                                    <div className="flex gap-4 mt-4">
                                        <div className="w-[10rem] content-center">
                                            <Typography
                                                variant={"label-o1-s w-50"}
                                                value={`Shipping Address ${index + 2}`}
                                                color={"primary"}
                                            />
                                        </div>
                                        <div className="w-full">
                                            <Button type="ghost" danger icon={Delete} stroke={theme.colorPalette.genericRed} onClick={() => handleRemoveAddress(index)} />
                                        </div>
                                    </div>
                                    
                                    
                                    </>
                                    <div className="mt-4" />
                                    <InputFieldNDL
                                        label={"Address Line 1"}
                                        value={shippingAddress?.[index+1]?.addressLine1}
                                        placeholder={"Type here"}
                                         mandatory={true}
                                        // disabled={index === 0 ? (index === 0 && secondAddress) : false}
                                        error={ errorState?.shipping?.[index+1]?.addLine1 !== ''}
                                        helperText={errorState?.shipping?.[index+1]?.addLine1}
                                        // onFocus={() => {
                                        //     setErrorState({ ...errorState, shipping: [...errorState.shipping, { ...errorState.shipping[index+1], addLine1: '' }] });  
                                        // }}
                                        onChange={(e) => {handleShippingAddressLine1Change(e); handleChange(e, 'shipping', 'addressLine1', index+1); setErrorState((prevState) => ({ ...prevState, shipping: [ ...prevState.shipping, { ...prevState.shipping[index+1], addLine1: '' }] }));}}
                                    />

                                    <div className="mt-4" />
                                    <InputFieldNDL
                                        label={"Address Line 2"}
                                        value={shippingAddress?.[index+1]?.addressLine2}
                                        placeholder={"Type here"}
                                        // disabled={index === 0 ? (index === 0 && secondAddress) : false}
                                        error={!shippingAddressLine2.isValid}
                                        helperText={!shippingAddressLine2.isValid && shippingAddressLine2.value.toString() === "" ? "Type Shipping Address Line 2" : ""}
                                        onChange={(e) => {handleShippingAddressLine2Change(e); handleChange(e, 'shipping', 'addressLine2', index+1)}}
                                    />

                                    <div className="flex gap-4 mt-4">
                                        <div className="w-full">
                                            <InputFieldNDL
                                                label={"City"}
                                                 mandatory={true}
                                                value={shippingAddress?.[index+1]?.city}
                                                // disabled={index === 0 ? (index === 0 && secondAddress) : false}
                                                placeholder={"Type here"}
                                                error={errorState?.shipping?.[index+1]?.city !== ''}
                                                helperText={errorState?.shipping?.[index+1]?.city}
                                                // onFocus={() => {
                                                //     setErrorState({ ...errorState, shipping: [...errorState.shipping, { ...errorState.shipping[index+1], city: '' }] });  
                                                // }}
                                                onChange={(e) => {handleEntityNameChange(e); handleChange(e, 'shipping', 'city', index+1); setErrorState({ ...errorState, shipping: [...errorState.shipping, { ...errorState.shipping[index+1], city: '' }] });}}
                                            />
                                        </div>

                                        <div className="w-full">
                                            <SelectBox
                                                id='country'
                                                labelId='country'
                                                label="Country"
                                                 mandatory={true}
                                                options={countryData || []}
                                                // disabled={index === 0 ? (index === 0 && secondAddress) : false}
                                                value={shippingAddress?.[index+1]?.country}
                                                onChange={(e) => {setStateIndex(index+2); handleChange(e, 'shipping', 'country', index+1); setErrorState({ ...errorState, shipping: [...errorState.shipping, { ...errorState.shipping[index+1], country: '' }] });}}
                                                error={errorState?.shipping?.[index+1]?.country !== ''}
                                                msg={errorState?.shipping?.[index+1]?.country}
                                                // onFocus={() => {
                                                //     setErrorState({ ...errorState, shipping: [...errorState.shipping, { ...errorState.shipping[index+1], country: '' }] });  
                                                // }}
                                                 keyValue="value"
                                                keyId="key"
                                                auto={true}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-4 mt-4">
                                        <div className="w-full flex flex-col gap-2">
                                            <SelectBox
                                                id='state'
                                                labelId='state'
                                                label="State"
                                                 mandatory={true}
                                                // options={statesData || []}
                                                options = {stateOptions.shipping?.[index+2] || []}
                                                // disabled={index === 0 ? (index === 0 && secondAddress) : false}
                                                value={shippingAddress?.[index+1]?.state}
                                                onChange={(e) => {handleChange(e, 'shipping', 'state', index+1); setErrorState({ ...errorState, shipping: [...errorState.shipping, { ...errorState.shipping[index+1], state: '' }] });}}
                                                error={errorState?.shipping?.[index+1]?.state !== ''}
                                                msg={errorState?.shipping?.[index+1]?.state}
                                                // onFocus={() => {
                                                //     setErrorState({ ...errorState, shipping: [...errorState.shipping, { ...errorState.shipping[index+1], state: '' }] });
                                                // }}
                                                keyValue="name"
                                                keyId="code"
                                                auto={true}
                                            />
                                        </div>

                                        <div className="w-full">
                                            <InputFieldNDL
                                                label={"ZIP Code"}
                                                 mandatory={true}
                                                value={shippingAddress?.[index+1]?.zipCode}
                                                placeholder={"Type here"}
                                                // disabled={index === 0 ? (index === 0 && secondAddress) : false}
                                                error={ errorState?.shipping?.[index+1]?.zipCode !== ''}
                                                helperText={errorState?.shipping?.[index+1]?.zipCode}
                                                // onFocus={() => {
                                                //     setErrorState({ ...errorState, shipping: [ ...errorState.shipping, { ...errorState.shipping[index+1], zipCode: '' }] });
                                                // }}
                                                onChange={(e) => {handleEntityNameChange(e); handleChange(e, 'shipping', 'zipCode', index+1); setErrorState({ ...errorState, shipping: [...errorState.shipping, { ...errorState.shipping[index+1], zipCode: '' }] });}}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="w-fit pt-2">
                                <Button
                                    id='Add Shipping Address'
                                    type={"tertiary"}
                                    disabled={addresses.length > 6}
                                    icon={Plus}
                                    value={"Add Shipping Address"}
                                    onClick={handleAddShippingAddress}
                                />
                            </div>
                        </div>

                        <div className="mt-4 mb-4" >
                            <Typography
                                variant={"heading-02-xs"}
                                value={'Financial Details'}
                                color={"primary"}
                            />
                            <Typography
                                variant={"paragraph-xs"}
                                value={'Store financial and tax information for compliance and transactions.'}
                                color={"tertiary"}
                            />
                            <div className="flex gap-4 mt-4">
                                <div className="w-full">
                                    <InputFieldNDL
                                        label={"GST Number"}
                                        inputRef={GSTNumberRef}
                                        placeholder={"Type here"}
                                        error={errorState?.gstNumber !== ''}
                                        helperText={errorState?.gstNumber}
                                        // onFocus={() => {
                                        //     setErrorState({ ...errorState, gstNumber: '' });
                                        // }}
                                        onChange={(e) => {handleGstNumberChange(e); setErrorState((prevState) => ({ ...prevState, gstNumber: '' }));}}
                                    />
                                </div>

                                <div className="w-full">
                                    <div className="w-full">
                                        {
                                            (files.GSTDoc !== '' && files.GSTDoc !== null && files.GSTDoc !== undefined) ? (<>
                                                   <React.Fragment>
                                                        <Typography variant="paragraph-xs">GST Document</Typography>
                                                        <Grid item xs={12}>
                                                            <div className="flex justify-between items-center">
                                                            <div className="flex gap-2 items-center">
                                                                <DummyImage />
                                                                <Typography value={props.company?.gstfilepath || files.GSTDoc?.name} variant="lable-01-s" />
                                                            </div>
                                                            <BlackX onClick={() => handleRemoveAssetImage('GSTDoc')} />
                                                            </div>
                                                        </Grid>
                                                    </React.Fragment>
                                                </>) : (<>
                                                    <FileInput
                                                        accept="image/*"
                                                        label={"GST Document"}
                                                        multiple={false}
                                                        error={errorState.GSTDoc !== ''}
                                                        onChange={(e) => handleFileChange(e, 'GSTDoc')}
                                                        onClose={(val, index, e) => val.type ? console.log(index, e) : console.log(index, val)}
                                                    />
                                                    <div className="mt-0.5" />
                                                    <Typography color='tertiary' variant="paragraph-xs" value={'Max 10mb JPG or PNG'} />
                                                </>)
                                        }
                                        
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4 mt-4">
                                <div className="w-full">
                                    <InputFieldNDL
                                        label={"Tax Identification Number (TIN)"}
                                        inputRef={TINnumRef}
                                        placeholder={"Type here"}
                                        error={errorState?.tinNumber !== ''}
                                        helperText={errorState?.tinNumber}
                                        // onFocus={() => {
                                        //     setErrorState({ ...errorState, tinNumber: '' });
                                        // }}
                                        onChange={(e) => {handleTINnumberChange(e); setErrorState((prevState) => ({ ...prevState, tinNumber: '' }));}}
                                    />
                                </div>

                                <div className="w-full">
                                    <div className="w-full">
                                        {(files.TINDoc !== '' && files.TINDoc !== null && files.TINDoc !== undefined) ? (<>
                                                   <React.Fragment>
                                                        <Typography variant="paragraph-xs">TIN Document</Typography>
                                                        <Grid item xs={12}>
                                                            <div className="flex justify-between items-center">
                                                            <div className="flex gap-2 items-center">
                                                                <DummyImage />
                                                                <Typography value={props.company?.tinfilepath  || files.TINDoc?.name} variant="lable-01-s" />
                                                            </div>
                                                            <BlackX onClick={() => handleRemoveAssetImage('TINDoc')} />
                                                            </div>
                                                        </Grid>
                                                    </React.Fragment>
                                                </>) : (<>
                                        <FileInput
                                            label={"TIN Document"}
                                            accept="image/*"
                                            multiple={false}
                                            error={errorState.TINDoc !== ''}
                                            onChange={(e) => handleFileChange(e, 'TINDoc')}
                                            onClose={(val, index, e) => val.type ? console.log(index, e) : console.log(index, val)}
                                        />
                                        <div className="mt-0.5" />
                                        <Typography color='tertiary' variant="paragraph-xs" value={'Max 10mb JPG or PNG'} />
                                        </>)}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-4">
                                <div className="w-full">
                                    <InputFieldNDL
                                        label={"Company PAN"}
                                        inputRef={CompanyPANRef}
                                        placeholder={"Type here"}
                                        error={errorState?.companyPAN !== ''}
                                        helperText={errorState?.companyPAN}
                                        // onFocus={() => {
                                        //     setErrorState({ ...errorState, companyPAN: '' });
                                        // }}
                                        onChange={(e) => {handleCompanyPANChange(e); setErrorState((prevState) => ({ ...prevState, companyPAN: '' }));}}
                                    />
                                </div>

                                <div className="w-full">
                                    {(files.PANDoc !== '' && files.PANDoc !== null && files.PANDoc !== undefined) ? (<>
                                                   <React.Fragment>
                                                        <Typography variant="paragraph-xs">PAN Document</Typography>
                                                        <Grid item xs={12}>
                                                            <div className="flex justify-between items-center">
                                                            <div className="flex gap-2 items-center">
                                                                <DummyImage />
                                                                <Typography value={props.company?.panfilepath  || files.PANDoc?.name} variant="lable-01-s" />
                                                            </div>
                                                            <BlackX onClick={() => handleRemoveAssetImage('PANDoc')} />
                                                            </div>
                                                        </Grid>
                                                    </React.Fragment>
                                                </>) : (<>
                                    <FileInput
                                        accept="image/*"
                                        label={"PAN Document"}
                                        multiple={false}
                                        error={errorState.PANDoc !== ''}
                                        onChange={(e) => handleFileChange(e, 'PANDoc')}
                                        onClose={(val, index, e) => val.type ? console.log(index, e) : console.log(index, val)}
                                    />
                                    <div className="mt-0.5" />
                                    <Typography color='tertiary' variant="paragraph-xs" value={'Max 10mb JPG or PNG'} />
                                    </>)}
                                </div>
                            </div>

                            <div className="flex gap-4 mt-4">
                                <div className="w-full">
                                    <InputFieldNDL
                                        label={"Bank Account Number"}
                                        inputRef={BankAccountRef}
                                        placeholder={"Type here"}
                                        error={errorState?.bankAccount !== ''}
                                        helperText={errorState?.bankAccount}
                                        // onFocus={() => {
                                        //     setErrorState({ ...errorState, bankAccount: '' });
                                        // }}
                                        onChange={(e) => {handleBankAccountChange(e); setErrorState((prevState) => ({ ...prevState, bankAccount: '' }));}}
                                    />
                                </div>

                                <div className="w-full">
                                    <InputFieldNDL
                                        label={"IFSC Code"}
                                        inputRef={IFSCRef}
                                        placeholder={"Type here"}
                                         error={errorState?.ifscCode !== ''}
                                        helperText={errorState?.ifscCode}
                                        // onFocus={() => {
                                        //     setErrorState({ ...errorState, ifscCode: '' });
                                        // }}
                                        onChange={(e) => {handleIFSCCodeChange(e); setErrorState((prevState) => ({ ...prevState, ifscCode: '' }));}}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 mt-4">
                                <div className="w-full">
                                    {/* allCurrencyData */}
                                    {/* <InputFieldNDL
                                        label={"Preferred Currency"}
                                        inputRef={CurrencyRef}
                                         mandatory={true}
                                        placeholder={"Type here"}
                                        error={errorState?.currency !== ''}
                                        helperText={errorState?.currency}
                                        onFocus={() => {
                                            setErrorState({ ...errorState, currency: '' });
                                        }}
                                        onChange={handleCurrencyChange}
                                    /> */}
                                    <SelectBox
                                        id='currency'
                                        labelId='currency'
                                        label="Preferred Currency"
                                        //  mandatory={true}
                                        options={allCurrencyData || []}
                                        value={Currency}
                                        // onChange={(e) => handleChange(e, 'shipping', 'state', index+1)}
                                        onChange={(e) => {handleCurrencyChange(e); setErrorState((prevState) => ({ ...prevState, currency: '' }));}}
                                        error={errorState?.currency !== ''}
                                        helperText={errorState?.currency}
                                        // onFocus={() => {
                                        //     setErrorState({ ...errorState, currency: '' });
                                        // }}
                                        keyValue="value"
                                        keyId="key"
                                        auto={true}
                                    />
                                </div>

                                <div className="w-full">
                                    {/* <InputFieldNDL
                                        label={"Authorized Signatory"}
                                        inputRef={SignatueRef}
                                         mandatory={true}
                                        placeholder={"Type here"}
                                        error={errorState?.signature !== ''}
                                        helperText={errorState?.signature}
                                        onFocus={() => {
                                            setErrorState({ ...errorState, signature: '' });
                                        }}
                                        onChange={handleSignatueChange}
                                    /> */}
                                    <SelectBox
                                        id='signature'
                                        labelId='signature'
                                        label={"Authorized Signatory"}
                                         mandatory={true}
                                        options={usersData || []}
                                        value={Signatue}
                                        // onChange={(e) => handleChange(e, 'shipping', 'state', index+1)}
                                        onChange={(e) => {handleSignatueChange(e); setErrorState((prevState) => ({ ...prevState, signature: '' }));}}
                                        error={errorState.signature !== ''}
                                        msg={errorState.signature}
                                        // onFocus={() => {
                                        //     setErrorState({ ...errorState, signature: '' });
                                        // }}
                                        keyValue="value"
                                        keyId="key"
                                        auto={true}
                                    />
                                </div>
                            </div>
                        </div>




                    </React.Fragment>




                </Grid>

            </Grid>

            <ModalNDL onClose={() => {console.clear()}} maxWidth={"xs"} open={open}>
                <ModalHeaderNDL>
                    <Typography value={"Confirmation Required"} variant='heading-02-xs' />
                </ModalHeaderNDL>
                <ModalContentNDL >
                    <Typography value={"You have unsaved changes in this enquiry form. Leaving now will discard all unsaved information. Save your changes before exiting to avoid losing progress."} variant='body-01' />
                </ModalContentNDL>
                <ModalFooterNDL>
                    <div className="flex justify-end gap-1">
                        <Button type="secondary" variant="secondary" onClick={() => setOpen(false)} value="Close" />
                        <Button variant="warning" onClick={() =>  { props.onCancel(); setOpen(false) }} value='Exit'/>
                    </div>
                </ModalFooterNDL>
            </ModalNDL>
        </React.Fragment>
    );
};
