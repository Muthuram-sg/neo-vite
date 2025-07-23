
import React, { useState, useRef, useEffect,useImperativeHandle ,forwardRef} from 'react';
import Grid from 'components/Core/GridNDL';
import InputFieldNDL from "components/Core/InputFieldNDL";
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import Typography from "components/Core/Typography/TypographyNDL";
import HorizontalLine from "components/Core/HorizontalLine/HorizontalLineNDL";
import Button from 'components/Core/ButtonNDL';
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import Delete from 'assets/neo_icons/trash.svg?react';
import ParagraphText from 'components/Core/Typography/TypographyNDL';
import useGetAllPolicy from "../hooks/useGetAllPolicy";
import DatePickerNDL from 'components/Core/DatepickerNDL';
import useGetEnquiryMaster from '../hooks/useGetAllEnquiryMaster';
import useGetCustomerByID from '../hooks/useGetCustomerByID';
import useGetAllCustomerMaster from '../hooks/useGetAllCustomerMaster';
import useCreateQuotation from '../hooks/useCreateQuotation';
import useGetProduct from '../hooks/useGetProduct';
import { userData } from 'recoilStore/atoms';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import Trash from 'assets/neo_icons/trash.svg?react';
import SixDots from 'assets/neo_icons/Neonix/Drag_6_dots.svg?react';
import CircularProgress from 'components/Core/ProgressIndicators/ProgressIndicatorNDL'


const AddQuotationForm = forwardRef(( props, ref) => {
    const { isEdit, editData } = props;
    const [selectedValue, setSelectedValue] = useState("");
    const ShippingAddLine1Ref = useRef();
    const ShippingAddLine2Ref = useRef();
    const ShippingCityRef = useRef();
    const ShippingZipRef = useRef();
    const ShippingStateRef = useRef();
    const lastEnquiryIdRef = useRef();
    const ShippingCountryRef = useRef();
    const [isName, setIsName] = useState(false);
    const [draggedRow, setDraggedRow] = useState(null);
    const [rowIdCounter, setRowIdCounter] = useState(1);
    const [selectedAgreementTerms, setSelectedAgreementTerms] = useState("");
    const [selectedPaymentTerms, setSelectedPaymentTerms] = useState("");
    const [selectedWarrantyTerms, setSelectedWarrantyTerms] = useState("");
    const [selectedSupportTerms, setSelectedSupportTerms] = useState("");
    const [selectedCancellationTerms, setSelectedCancellationTerms] = useState("");
    const [selectedRefundTerms, setSelectedRefundTerms] = useState("");
    const [selectedDeliveryTerms, setSelectedDeliveryTerms] = useState("");
    const [selectedReturnTerms, setSelectedReturnTerms] = useState("");
    const [dragOverRow, setDragOverRow] = useState(null);
    const [primaryContactPerson, setPrimaryContactPerson] = useState({ value: "", isValid: true });
    const [designation, setDesignation] = useState({ value: "", isValid: true });
    const [email, setEmail] = useState({ value: "", isValid: true });
    const [contactNumber, setContactNumber] = useState({ value: "", isValid: true });
    const [alternativeContactPerson, setAlternativeContactPerson] = useState({ value: "", isValid: true });
    const [effectiveDate, setEffectiveDate] = useState(null);
    const [quotationDate, setQuotationDate] = useState(new Date());
    const [quotationMinDate, setQuotationMinDate] = useState(new Date());
    const [expiryDate, setExpiryDate] = useState(new Date());
    const [referenceEnquiryMsg, setReferenceEnquiryMsg] = useState('');
    const [expiryDateMsg, setExpiryDateMsg] = useState('');
    const [quotationDateMsg, setQuotationDateMsg] = useState("");
    const [customerId, setCustomerId] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [productOptions, setproductOptions] = useState([]);
     const [addLine1, setAddLine1] = useState({ value: "", isValid: true });
    const [addLine2, setAddLine2] = useState({ value: "", isValid: true });
    const [cityName, setCityName] = useState({ value: "", isValid: true });
    const { allPolicyLoading, allPolicyData, allPolicyError, getAllPolicy } = useGetAllPolicy();
    const [shippingAddLine1, setShippingAddLine1] = useState({ value: "", isValid: true });
    const [shippingAddLine2, setShippingAddLine2] = useState({ value: "", isValid: true });
    const [shippingZip, setShippingZip] = useState({ value: "", isValid: true });
    const [bankAcc, setBankAcc] = useState({ value: '', isValid: true });
    const getEmptyRow = (id) => ({
        id,
        product: "",
        description: "",
        hsnCode: "",
        quantity: "",
        price: "",
        discount: "",
        tax: "",
        total: "",
    });
    const defaultRow = {
        product: '',
        description: '',
        hsnCode: '',
        quantity: '',
        price: '',
        discount: '',
        tax: '',
        total: '',
    };
    const {enquiryData,getAllEnquiryMaster,} = useGetEnquiryMaster();
    const [policyOptionsByType, setpolicyOptionsByType] = useState({});
    const {customerLoading, customerData, customerError, getcustomer} = useGetCustomerByID();
    const {addQuotationLoading,addQuotationData,addQuotationError,getaddQuotation} = useCreateQuotation();
    const {allCustomersData, getAllCustomers} = useGetAllCustomerMaster();
    const {productLoading,productData,productError,getproduct} = useGetProduct();
    const [rows, setRows] = useState([]);
    const [shippingCity, setShippingCity] = useState({ value: "", isValid: true });
    const [addressLine1, setAddressLine1] = useState({ value: "", isValid: true });
    const [addressLine2, setAddressLine2] = useState({ value: "", isValid: true });
    const [sameAdd, setsameAdd] = useState(false);
    const [shippingAddressOptions, setshippingAddressOptions] = useState([]);
    const [selectedshippingAddress, setselectedshippingAddress] = useState("");
    const [city, setCity] = useState({ value: "", isValid: true });
    const [zipCode, setZipCode] = useState({ value: "", isValid: true });
    const [selectedIndustryType, setSelectedIndustryType] = useState("");
    const contPerRef = useRef(null);
    const emailRef = useRef(null);
    const GSTINRef = useRef(null);
    const CurrencyRef = useRef(null);
    const [currUser] = useRecoilState(userData);
    const { t } = useTranslation();
    const addressLine1Ref = useRef(null);
    const addressLine2Ref = useRef(null);
    const cityRef = useRef(null);
    const stateRef = useRef(null);
    const countryRef = useRef(null);
    const zipCodeRef = useRef(null);
    const contactNumberRef = useRef(null);
    const [shippingCharges, setShippingCharges] = useState("0");
        const policyTypeMap = {
        TC: "Terms and Conditions",
        PT: "Payment",
        WT: "Warranty",
        ST: "Support",
        CL: "Cancellation",
        RF: "Refund",
        DL: "Delivery",
        RT: "Return"
        };
    const totalDiscount = parseFloat(rows.reduce((acc, row) => {
        const qty = parseFloat(row.quantity) || 0;
        const price = parseFloat(row.price) || 0;
        const discount = parseFloat(row.discount) || 0;
        return acc + (qty * price * discount / 100);
    }, 0).toFixed(3));

    const taxTotal = parseFloat(rows.reduce((acc, row) => {
        const qty = parseFloat(row.quantity) || 0;
        const price = parseFloat(row.price) || 0;
        const discount = parseFloat(row.discount) || 0;
        const tax = parseFloat(row.tax) || 0;
        const discountedAmount = qty * price * (1 - discount / 100);
        return acc + (discountedAmount * tax / 100);
    }, 0).toFixed(3));
    const shipping = parseFloat(shippingCharges) || 0;

    useEffect(() => {
        getAllEnquiryMaster();
        getAllCustomers()
        getproduct()
        getAllPolicy()
      }, []);

      const enquiryOptions = enquiryData?.map((item) => ({
        id: item.header.enq_id,
        name: item.header.enq_id
      })) || [];

useEffect(() => {
    if (isEdit && editData && productOptions.length > 0) {
        setSelectedValue(editData.header?.ref_enq_id || "");
        setQuotationDate(editData.header?.quo_date ? new Date(editData.header.quo_date) : new Date());
        setExpiryDate(editData.header?.exp_date ? new Date(editData.header.exp_date) : new Date());
        setCustomerId(editData.header?.cust_code || "");
        setCompanyName(editData.customer?.cust_name || "");
        setShippingCharges(editData.header?.ship_charge || "0");
        setselectedshippingAddress(Number(editData.header?.ship_bill_code) || "");

        if (contPerRef.current) contPerRef.current.value = editData.customer?.acc_represent || "";
        if (emailRef.current) emailRef.current.value = editData.customer?.email_id || "";
        if (contactNumberRef.current) contactNumberRef.current.value = editData.customer?.mobile_no || "";
        if (GSTINRef.current) GSTINRef.current.value = editData.customer?.gst_no || "";
        if (CurrencyRef.current) CurrencyRef.current.value = editData.customer?.pre_currency || "Indianrupees";

        if (addressLine1Ref.current) addressLine1Ref.current.value = editData.customer?.adrs1 || "";
        if (addressLine2Ref.current) addressLine2Ref.current.value = editData.customer?.adrs2 || "";
        if (cityRef.current) cityRef.current.value = editData.customer?.city || "";
        if (stateRef.current) stateRef.current.value = editData.customer?.state || "";
        if (zipCodeRef.current) zipCodeRef.current.value = editData.customer?.postcode || "";
        if (countryRef.current) countryRef.current.value = editData.customer?.country || "";

        const items = Array.isArray(editData.items) ? editData.items : [];
        const filledRows = items.map((item, idx) => ({
            id: idx + 1,
            product: item.prod_code || "",
            description: item.description || "",
            hsnCode: item.hsn_code || "",
            quantity: item.quantity || "",
            price: item.price || "",
            discount: item.discount || "",
            tax: item.tax || "",
            total: item.total || "",
        }));

      const totalRows = Math.max(5, filledRows.length);
        const paddedRows = [
            ...filledRows,
            ...Array.from({ length: totalRows - filledRows.length }, (_, idx) =>
                getEmptyRow(filledRows.length + idx + 1)
            ),
        ];
        setRows(paddedRows);
        setRowIdCounter(totalRows + 1);

        // Set policy terms
        if (
            isEdit &&
            editData &&
            Array.isArray(editData.policy) &&
            Object.keys(policyOptionsByType).length > 0
        ) {
            const policyTypeMap = {
                TC: "Terms and Conditions",
                PT: "Payment",
                WT: "Warranty",
                ST: "Support",
                CL: "Cancellation",
                RF: "Refund",
                DL: "Delivery",
                RT: "Return"
            };
            getcustomer(customerId);
            editData.policy.forEach((policy) => {
                const code = Number(policy.policy_code);
                const fullType = policyTypeMap[policy.policy_type];

                if (!fullType || !policyOptionsByType[fullType]) return;

                const matched = policyOptionsByType[fullType].find(opt => opt.id === code);
                if (!matched) return;

                switch (policy.policy_type) {
                    case "TC":
                        setSelectedAgreementTerms(code);
                        break;
                    case "PT":
                        setSelectedPaymentTerms(code);
                        break;
                    case "WT":
                        setSelectedWarrantyTerms(code);
                        break;
                    case "ST":
                        setSelectedSupportTerms(code);
                        break;
                    case "CL":
                        setSelectedCancellationTerms(code);
                        break;
                    case "RF":
                        setSelectedRefundTerms(code);
                        break;
                    case "DL":
                        setSelectedDeliveryTerms(code);
                        break;
                    case "RT":
                        setSelectedReturnTerms(code);
                        break;
                    default:
                        break;
                }
            });
        }
    }
}, [isEdit, editData, policyOptionsByType, productOptions,customerId]);

useEffect(() => {
    if (!productLoading && productData && !productError) {
        const options = productData?.map(product => ({
            id: product.matnr,
            name: product.matnr,
            hsn_no: product.hsn_no,
            description: product.description,
            code: product.code,
        })) || [];
        setproductOptions(options);

    if (isEdit && editData) {
        const items = Array.isArray(editData.items) ? editData.items : [];
        const filledRows = items.map((item, idx) => ({
            id: idx + 1,
            product: item.prod_code || "",
            description: item.description || "",
            hsnCode: item.hsn_code || "",
            quantity: item.quantity || "",
            price: item.price || "",
            discount: item.discount || "",
            tax: item.tax || "",
            total: item.total || "",
        }));
        const totalRows = Math.max(5, filledRows.length);
        const paddedRows = [
            ...filledRows,
            ...Array.from({ length: totalRows - filledRows.length }, (_, idx) =>
                getEmptyRow(filledRows.length + idx + 1)
            ),
        ];
        setRows(paddedRows);
        setRowIdCounter(totalRows + 1);
    }
    }
}, [productLoading, productData, productError, isEdit, editData]);

    useEffect(() => {
        if (
            selectedValue &&
            enquiryData &&
            enquiryData.length > 0
        ) {

            const matchedEnquiry = enquiryData.find(item => item.header.enq_id === selectedValue);
            getcustomer(matchedEnquiry?.header?.cust_code);
            const items = matchedEnquiry?.items || [];
            const filledRows = items.map((item, idx) => {
                const prod = productOptions.find(p => p.code === item.product_code);
                return {
                    id: idx + 1,
                    product: prod ? prod.id : item.product_code,
                    description: item.item_description || prod?.description || "",
                    quantity: item.quantity || "",
                    hsnCode: prod?.hsn_no || "",
                    price: "",
                    discount: "",
                    tax: "",
                    total: "",
                };
            });

            const totalRows = Math.max(5, filledRows.length);
            const paddedRows = [
                ...filledRows,
                ...Array.from({ length: totalRows - filledRows.length }, (_, idx) =>
                    getEmptyRow(filledRows.length + idx + 1)
                ),
            ];
            setRows(paddedRows);
            setRowIdCounter(totalRows + 1);
            setCustomerId(matchedEnquiry?.header?.cust_code)
            setCompanyName(matchedEnquiry?.header?.cust_name || "");
            if (emailRef.current) emailRef.current.value = matchedEnquiry?.header?.email || "";
            if (contactNumberRef.current) contactNumberRef.current.value = matchedEnquiry?.header?.cont_num || "";
            if (contPerRef.current) contPerRef.current.value = matchedEnquiry?.header?.acc_represent || "";
            if (GSTINRef.current) GSTINRef.current.value = matchedEnquiry?.header?.gst_no || "";
            if (CurrencyRef.current) CurrencyRef.current.value = matchedEnquiry?.header?.pre_currency || "Indianrupees";
            setQuotationMinDate(new Date(matchedEnquiry?.header.header_create_dt));
        }
    }, [selectedValue, enquiryData, productOptions]);

  useEffect(() => {
    if (
        customerData &&
        Array.isArray(customerData) &&
        customerData.length > 0
    ) {
        const cust = customerData[0];
 
        // Set customer header details
        setCustomerId(cust.cust_code || "");
        setCompanyName(cust.cust_name || "");
        if (contPerRef.current) contPerRef.current.value = cust.acc_represent || "";
        if (emailRef.current) emailRef.current.value = cust.email_id || "";
        if (contactNumberRef.current) contactNumberRef.current.value = cust.mobile_no || "";
        if (GSTINRef.current) GSTINRef.current.value = cust.gst_no || "";
        if (CurrencyRef.current) CurrencyRef.current.value = cust.pre_currency || "Indianrupees";
        if (addressLine1Ref.current) addressLine1Ref.current.value = cust.adrs1 || "";
        if (addressLine2Ref.current) addressLine2Ref.current.value = cust.adrs2 || "";
        if (cityRef.current) cityRef.current.value = cust.city || "";
        if (stateRef.current) stateRef.current.value = cust.state || "";
        if (zipCodeRef.current) zipCodeRef.current.value = cust.postcode || "";
        if (countryRef.current) countryRef.current.value = cust.country || "";
 
        // Set shipping address options
        if (Array.isArray(cust.ship) && cust.ship.length > 0) {
            const shippingAddressOptions = cust.ship.map((ship, idx) => ({
                id: ship.id,
                name: `Shipping Address ${idx + 1}`,
            }));
            setshippingAddressOptions(shippingAddressOptions);
 
            // Set first shipping address fields
            const ship = cust.ship[0];
            if (ShippingAddLine1Ref.current) ShippingAddLine1Ref.current.value = ship.address || "";
            if (ShippingAddLine2Ref.current) ShippingAddLine2Ref.current.value = ""; // You may want to split address if needed
            if (ShippingCityRef.current) ShippingCityRef.current.value = ship.citycode || "";
            if (ShippingStateRef.current) ShippingStateRef.current.value = ship.state || "";
            if (ShippingZipRef.current) ShippingZipRef.current.value = ship.postcode || "";
            if (ShippingCountryRef.current) ShippingCountryRef.current.value = ship.country || "";
            // Set selected shipping address
            setselectedshippingAddress(ship.id);
        }
 
        // Set policies
        if (Array.isArray(cust.policies)) {
            cust.policies.forEach(policy => {
                switch (policy.policy_code) {
                    case "Payment":
                        setSelectedPaymentTerms(policy.policy_type);
                        break;
                    case "Refund":
                        setSelectedRefundTerms(policy.policy_type);
                        break;
                    case "Terms and Conditions":
                        setSelectedAgreementTerms(policy.policy_type);
                        break;
                    case "Warranty":
                        setSelectedWarrantyTerms(policy.policy_type);
                        break;
                    case "Support":
                        setSelectedSupportTerms(policy.policy_type);
                        break;
                    case "Cancellation":
                        setSelectedCancellationTerms(policy.policy_type);
                        break;
                    case "Delivery":
                        setSelectedDeliveryTerms(policy.policy_type);
                        break;
                    case "Return":
                        setSelectedReturnTerms(policy.policy_type);
                        break;
                    default:
                        break;
                }
            });
        }
    }
}, [customerData]);

   useEffect(() => {
        if (
            !customerLoading &&
            customerData &&
            Array.isArray(customerData) &&
            customerData.length > 0 &&
            Array.isArray(customerData[0].ship)
        ) {
            const shippingAddressOptions = customerData[0].ship.map((ship, idx) => ({
                id: ship.id,
                name: `Shipping Address ${idx + 1}`,
            }));
            setshippingAddressOptions(shippingAddressOptions);

            let selectedId = "";
            if (isEdit && editData && editData.header?.ship_bill_code) {
                selectedId = editData.header.ship_bill_code;
            } else if (shippingAddressOptions.length > 0) {
                selectedId = shippingAddressOptions[0].id;
            }
            setselectedshippingAddress(Number(selectedId));
        }
    }, [customerLoading, customerData, customerError, isEdit, editData]);

    useEffect(() => {
    if (!allPolicyLoading && allPolicyData && !allPolicyError) {
      const filteredPolicies = allPolicyData.map(({ policy_id, policy_type, policy_name }) => ({
        policy_id,
        policy_type,
        policy_name,
      }));
      setpolicyOptionsByType(transformPoliciesByType(filteredPolicies))
    }
  }, [allPolicyLoading, allPolicyData, allPolicyError]);

  useEffect(() => {
        if (!isEdit && (!selectedValue || !enquiryData || enquiryData.length === 0)) {
            const paddedRows = Array.from({ length: 5 }, (_, idx) => getEmptyRow(idx + 1));
            setRows(paddedRows);
            setRowIdCounter(6);
        }
    }, [isEdit, selectedValue, enquiryData]);

    const transformPoliciesByType = (data) => {
    const grouped = {};

    data.forEach((policy) => {
      const option = {
        id: policy.policy_id,
        name: policy.policy_name,
      };

      if (!grouped[policy.policy_type]) {
        grouped[policy.policy_type] = [];
      }

      grouped[policy.policy_type].push(option);
    });

    return grouped;
  };

    const calculateLineTotal = (row) => {
        const qty = parseFloat(row.quantity) || 0;
        const price = parseFloat(row.price) || 0;
        const discount = parseFloat(row.discount) || 0;
        const tax = parseFloat(row.tax) || 0;
        if (!qty && !price && !discount && !tax) return 0;

        const lineTotal = qty * price * (1 - discount / 100) * (1 + tax / 100);
        return parseFloat(lineTotal.toFixed(3));
    };

    const subtotal = parseFloat(rows.reduce((acc, row) => acc + calculateLineTotal(row), 0).toFixed(3));

    const grandTotal = parseFloat((subtotal + shipping).toFixed(3));
    const handleDragStart = (index) => setDraggedRow(index);
        const handleDragEnter = (index) => setDragOverRow(index);
        const handleDragEnd = () => {
            if (draggedRow === null || dragOverRow === null || draggedRow === dragOverRow) {
                setDraggedRow(null);
                setDragOverRow(null);
                return;
            }
            const updatedRows = [...rows];
            const [removed] = updatedRows.splice(draggedRow, 1);
            updatedRows.splice(dragOverRow, 0, removed);
            setRows(prevRows => {
                const updatedRows = [...prevRows];
                const [removed] = updatedRows.splice(draggedRow, 1);
                updatedRows.splice(dragOverRow, 0, removed);
                return updatedRows;
            });
            setDraggedRow(null);
            setDragOverRow(null);
        };

    const ActionTakenBy =()=>{
           return currUser.name
    }

    const updateRow = (id, key, value) => {
        setRows(prevRows => prevRows.map(row => {
            if (row.id !== id) return row;
            const updatedRow = { ...row };

            const formatDecimal = (val) => {
                if (val === "") return "";
                const num = val.replace(/[^0-9.]/g, "");
                const parts = num.split(".");
                if (parts.length > 2) return parts[0] + "." + parts[1];
                if (parts[1]?.length > 3) parts[1] = parts[1].slice(0, 3);
                return parts.length === 2 ? parts[0] + "." + parts[1] : parts[0];
            };

            if (key === "price") {
                let val = value;
                if (/^\d*\.?\d*$/.test(val)) {
                    val = formatDecimal(val);
                    updatedRow[key] = val;
                } else {
                    return row;
                }
            } else if (key === "discount" || key === "tax") {
                let val = formatDecimal(value);
                if (val && (parseFloat(val) < 0 || parseFloat(val) > 100)) val = "";
                updatedRow[key] = val;
            } else if (key === "quantity") {
                let val = formatDecimal(value);
                if (val && parseFloat(val) < 0) val = "";
                updatedRow[key] = val;
            } else if (key === "product") {
                if (prevRows.some(r => r.product === value && r.id !== id)) {
                    return row;
                }
                updatedRow[key] = value;
                const prod = productOptions.find(p => String(p.id) === String(value));
                updatedRow.hsnCode = prod?.hsn_no || "";
            } else {
                updatedRow[key] = value;
            }

            updatedRow.total = calculateLineTotal(updatedRow).toFixed(2);
            return updatedRow;
        }));
    };

    useEffect(() => {
        if (sameAdd) {
            ShippingAddLine1Ref.current.value = addressLine1Ref.current.value
            ShippingAddLine2Ref.current.value = addressLine2Ref.current.value
            ShippingCityRef.current.value = cityRef.current.value
            ShippingZipRef.current.value = zipCodeRef.current.value
        } else {
            ShippingAddLine1Ref.current.value = ""
            ShippingAddLine2Ref.current.value = ""
            ShippingCityRef.current.value = ""
            ShippingZipRef.current.value = ""
        }
    }, [sameAdd, addLine1, addLine2, cityName, zipCode])

    const handleAddressLine1Change = (e) => {
        const value = e.target.value;
        const isValid = value.trim() !== "";
        setAddressLine1({ value, isValid });
    };

    const handleAddressLine2Change = (e) => {
        const value = e.target.value;
        const isValid = value.trim() !== "";
        setAddressLine2({ value, isValid });
    };

    const handleCityChange = (e) => {
        const value = e.target.value;
        const isValid = /^[a-zA-Z\s]+$/.test(value) && value.length <= 50;
        setCity({ value, isValid });
    };

    const handleZipCodeChange = (e) => {
        const input = e.target.value;

        if (/^\d*$/.test(input)) {
            const isValid = input.length >= 4 && input.length <= 10;
            setZipCode({ value: input, isValid });
        }
    };

    const handleDeleteRow = (idToDelete) => {
        setRows(prevRows => prevRows.filter(row => row.id !== idToDelete));
    };

    const handleChange = (e) => {
        setSelectedValue(e.target.value);
    };

    const handleShippingChange = (e) => {
        const selectedId = e.target.value;
        setselectedshippingAddress(selectedId);

        const shipArr = customerData?.[0]?.ship || [];
        const selectedShip = shipArr.find(ship => String(ship.id) === String(selectedId));
            ShippingAddLine1Ref.current.value = selectedShip.address || "";
            ShippingAddLine2Ref.current.value = selectedShip.address2 || "";
            ShippingCityRef.current.value = selectedShip.citycode || "";
            ShippingStateRef.current.value = selectedShip.state || "";
            ShippingZipRef.current.value = selectedShip.postcode || "";
            ShippingCountryRef.current.value = selectedShip.country || "";
    };
            
    const handleAddRow = () => {
        setRows(prevRows => [
            ...prevRows,
            {
                id: rowIdCounter, 
                product: "",
                description: "",
                hsnCode: "",
                quantity: "",
                price: "",
                discount: "",
                tax: "",
                total: "",
            },
        ]);
        setRowIdCounter(prev => prev + 1);
    };

  useImperativeHandle(ref, () => ({
        getFormData: () => {
            const header = {
                quo_id: isEdit && editData && editData.header?.quo_id ? editData.header.quo_id : "",
                ref_enq_id: selectedValue,
                ap_code: "",
                quo_date: quotationDate ? quotationDate.toISOString() : "",
                exp_date: expiryDate ? expiryDate.toISOString() : "",
                pre_by: "",
                cust_code: customerId,
                ship_bill_code: selectedshippingAddress,
                subtotal,
                tot_disc: totalDiscount,
                tot_tax: taxTotal,
                ship_charge: shipping,
                grand_total: grandTotal,
                is_deleted: false,
                create_dt: new Date().toISOString(),
                create_by: "",
                modified_dt: new Date().toISOString(),
                modified_by: "",
            };
            const items = rows
                .filter(row => row.product !== null && row.product !== undefined && row.product !== "")
                .map(row => ({
                    quo_id: "",
                    ap_code: "",
                    ref_enq_id: selectedValue,
                    cust_code: customerId,
                    ship_bill_code: selectedshippingAddress,
                    prod_code: row.product,
                    description: row.description,
                    hsn_code: row.hsnCode,
                    quantity: Number(row.quantity) || 0,
                    price: Number(row.price) || 0,
                    discount: Number(row.discount) || 0,
                    tax: Number(row.tax) || 0,
                    total: calculateLineTotal(row),
                    is_deleted: false,
                    create_dt: new Date().toISOString(),
                    create_by: "",
                    modified_dt: new Date().toISOString(),
                    modified_by: "",
                }));
            const policy = [
                selectedAgreementTerms && { policy_type: "TC", policy_code: selectedAgreementTerms },
                selectedPaymentTerms && { policy_type: "PT", policy_code: selectedPaymentTerms },
                selectedWarrantyTerms && { policy_type: "WT", policy_code: selectedWarrantyTerms },
                selectedSupportTerms && { policy_type: "ST", policy_code: selectedSupportTerms },
                selectedCancellationTerms && { policy_type: "CL", policy_code: selectedCancellationTerms },
                selectedRefundTerms && { policy_type: "RF", policy_code: selectedRefundTerms },
                selectedDeliveryTerms && { policy_type: "DL", policy_code: selectedDeliveryTerms },
                selectedReturnTerms && { policy_type: "RT", policy_code: selectedReturnTerms },
            ].filter(Boolean).map(pol => ({
                quo_id: "",
                ap_code: "",
                cust_code: customerId,
                ...pol,
                created_by: "",
                created_date: new Date().toISOString(),
                modified_by: "",
                modified_date: new Date().toISOString(),
            }));
            return { header, items, policy };
        }
    }));

    return (
        <React.Fragment>
            <Grid container>

                <Grid item xs={12}>
                    <Typography variant="heading-02-xs"
                        value={"Quotation Information"}
                        color={"primary"}
                    />
                    <Typography variant="paragraph-xs"
                        value={"Capture key contact details for communication and coordination."}
                        color={"tertiary"}
                    />

                    <div className="mt-4" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 w-full">
                        <div>
                            <SelectBox
                                labelId="Industry-type-label"
                                label="Reference Enquiry"
                                id="Business-type-id"
                                auto={false}
                                multiple={false}
                                options={enquiryOptions}
                                isMArray={true}
                                checkbox={false}
                                value={selectedValue}
                                onChange={handleChange}
                                keyValue="name"                
                                keyId="id"                     
                                error={!!referenceEnquiryMsg}
                                msg={referenceEnquiryMsg}
                            />
                        </div>
                        <div></div>
                        <div>
                            <ParagraphText value="Quotation Date" variant="paragraph-xs" />
                            <DatePickerNDL

                                id="start-date-picker"
                                onChange={e => {
                                    setQuotationDate(e);
                                    setExpiryDate(e);
                                }}
                                startDate={quotationDate}
                                dateFormat="dd-MM-yyyy"
                                minDate={quotationMinDate}
                            />
                        </div>

                        <div>
                            <ParagraphText value="Expiry Date" variant="paragraph-xs" />
                            <DatePickerNDL
                                id="end-date-picker"
                                onChange={(e) => setExpiryDate(e)}
                                startDate={expiryDate}
                                dateFormat="dd-MM-yyyy"
                                 minDate={quotationDate}
                            />
                        </div>

                        <div>
                           <InputFieldNDL
                            id="ins-freq-val"
                            label={t("Prepared By")}
                            value={ActionTakenBy()} 
                            required={true}
                            placeholder={t('Prepared By')}
                            disabled={true}
                            error={isName}
                        /> 
                        </div>
                    </div>

                    <div className="mt-4" />
                    <HorizontalLine variant="divider1" />
                    <div className="mt-4" />

                    <Typography variant={"heading-02-xs"} value={"Customer Details"} color={"primary"} />
                    <Typography variant={"paragraph-xs"} value={"Enter organization-level information to align the enquiry with business context."} color={"tertiary"} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <InputFieldNDL
                                label={"Customer ID"}
                                placeholder={"Type Customer ID"}
                                value={customerId}
                                error={false}
                                disabled={true}
                            />
                        </div>
                        <div></div>

                        <div>
                            <InputFieldNDL
                                label={"Customer Name"}
                                placeholder={"Type name"}
                                disabled={true}
                                value={companyName}
                            />
                        </div>

                        <div>
                            <InputFieldNDL
                                label={"Contact Person"}
                                 disabled={true}
                                inputRef={contPerRef}
                                placeholder={"Type here"}
                            />
                        </div>

                        <div>
                            <InputFieldNDL
                                label={"Email"}
                                 disabled={true}
                                inputRef={emailRef}
                                placeholder={"Type here"}
                            />
                        </div>

                        <div>
                            <InputFieldNDL
                                label={"Contact Number"}
                                inputRef={contactNumberRef}
                                placeholder={"Type here"}
                                disabled={true}
                            />
                        </div>

                        <div>
                            <InputFieldNDL
                                label={"GSTIN / Tax ID"}
                                inputRef={GSTINRef}
                                placeholder={"Type here"}
                                disabled={true}
                            />
                        </div>

                        <div>
                             <InputFieldNDL
                                label={"Currency"}
                                inputRef={CurrencyRef}
                                placeholder={"Type here"}
                                disabled={true}
                            />
                        </div>
                    </div>



                    <div className="mt-4" />
                    <HorizontalLine variant="divider1" />
                    <div className="mt-4" />

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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <InputFieldNDL
                                label={"Address Line 1"}
                                inputRef={addressLine1Ref}
                                placeholder={"Type here"}
                                value={addressLine1.value}
                                error={!addressLine1.isValid}
                                helperText={
                                    !addressLine1.isValid && addressLine1.value === ""
                                        ? "Address Line 1 is required"
                                        : ""
                                }
                                onChange={handleAddressLine1Change}
                                 disabled={true}
                            />

                            <InputFieldNDL
                                label={"Address Line 2"}
                                inputRef={addressLine2Ref}
                                placeholder={"Type here"}
                                value={addressLine2.value}
                                error={!addressLine2.isValid}
                                helperText={
                                    !addressLine2.isValid && addressLine2.value === ""
                                        ? "Address Line 2 is required"
                                        : ""
                                }
                                onChange={handleAddressLine2Change}
                                 disabled={true}
                            />

                            <InputFieldNDL
                                label={"City"}
                                inputRef={cityRef}
                                placeholder={"Type here"}
                                value={city.value}
                                error={!city.isValid}
                                helperText={
                                    !city.isValid && city.value === ""
                                        ? "City is required"
                                        : !city.isValid
                                            ? "Only alphabets and spaces allowed"
                                            : ""
                                }
                                onChange={handleCityChange}
                                disabled={true}
                            />

                           
                            <InputFieldNDL
                                label={"State"}
                                inputRef={stateRef}
                                placeholder={"Type here"}
                                disabled={true}
                            />

                            <InputFieldNDL
                                label={"ZIP Code"}
                                inputRef={zipCodeRef}
                                placeholder={"Type here"}
                                value={zipCode.value}
                                error={!zipCode.isValid}
                                helperText={
                                    !zipCode.isValid && zipCode.value === ""
                                        ? "ZIP Code is required"
                                        : !zipCode.isValid
                                            ? "Enter a valid ZIP Code (only numbers)"
                                            : ""
                                }
                                onChange={handleZipCodeChange}
                                 disabled={true}
                            />

                             <InputFieldNDL
                                label={"Country"}
                                inputRef={countryRef}
                                placeholder={"Type here"}
                                disabled={true}
                            />

                            <SelectBox
                                labelId="Industry-type-label"
                                label="Shipping Address"
                                id="Business-type-id"
                                auto={false}
                                multiple={false}
                                options={shippingAddressOptions}
                                isMArray={true}
                                checkbox={false}
                                value={selectedshippingAddress}
                                onChange={handleShippingChange}
                                keyValue="name"
                                keyId="id"
                                error={false}
                                msg=""
                            />

                            <div />

                            <InputFieldNDL
                                label={"Address Line 1"}
                                inputRef={ShippingAddLine1Ref}
                                placeholder={"Type here"}
                                disabled={true}
                            />

                            <InputFieldNDL
                                label={"Address Line 2"}
                                inputRef={ShippingAddLine2Ref}
                                placeholder={"Type here"}
                                disabled={true}
                            />

                            <InputFieldNDL
                                label={"City"}
                                inputRef={ShippingCityRef}
                                placeholder={"Type here"}
                                disabled={true}
                            />

                            <InputFieldNDL
                                label={"State"}
                                inputRef={ShippingStateRef}
                                placeholder={"Type here"}
                                disabled={true}
                            />

                            <InputFieldNDL
                                label={"ZIP Code"}
                                inputRef={ShippingZipRef}
                                placeholder={"Type here"}
                                disabled={true}
                            />

                             <InputFieldNDL
                                label={"Country"}
                                inputRef={ShippingCountryRef}
                                placeholder={"Type here"}
                                disabled={true}
                            />
                        </div>


                        <div className="mt-4" />
                        <HorizontalLine variant="divider1" />
                        <div className="mt-4" />
                        <Typography variant="heading-02-xs"
                            value={"Bill of Materials"}
                            color={"primary"}
                        />
                        <Typography variant="paragraph-xs"
                            value={"Enter organization-level information to align the enquiry with business context."}
                            color={"tertiary"}
                        />
                        <div className="mt-4 w-full">
                            <div className="mt-4 w-full">
                        <div className="grid grid-cols-12 gap-4 bg-[#F0F0F0] px-4 py-2 text-sm font-semibold text-gray-700">
                        <div></div>
                        <div>S.No</div>
                        <div>Product</div>
                        <div>Description</div>
                        <div>Quantity</div>
                        <div>HSN Code</div>
                        <div>Price</div>
                        <div>Discount (%)</div>
                        <div>Tax (%)</div>
                        <div>Total</div>
                        <div></div>
                    </div>
                   {rows.map((row, index) => (
                    <div
                        key={row.id}
                        className={`grid grid-cols-12 gap-4 px-4 py-2 text-sm items-center w-full
                            ${dragOverRow === row.id ? 'bg-blue-100' : ''}
                        `}
                        draggable
                        onDragStart={() => handleDragStart(row.id)}
                        onDragEnter={() => draggedRow !== null && handleDragEnter(row.id)}
                        onDragEnd={handleDragEnd}
                        onDragOver={e => e.preventDefault()}
                        style={{ cursor: 'move' }}
                    >
                        <div className="flex items-center justify-center cursor-move">
                            <SixDots />
                        </div>
                        <div className="flex items-center justify-center">
                            <Typography variant="paragraph-xs" value={String(index + 1)} />
                        </div>
                        <div>
                            <SelectBox
                                labelId="Industry-type-label"
                                id="Business-type-id"
                                placeholder={t("Select Product")}
                                auto={false}
                                multiple={false}
                                isMArray={true}
                                checkbox={false}
                                keyValue="name"
                                keyId="id"
                                error={false}
                                msg={""}
                                options={productOptions.map(opt => ({
                                    ...opt,
                                    disabled: rows.some((r, idx) => r.product === opt.id && r.id !== row.id)
                                }))}
                                value={row.product}
                                onChange={e => updateRow(row.id, 'product', e.target.value)}
                            />
                        </div>
                        <div>
                            <InputFieldNDL
                                value={row.description}
                                onChange={e => updateRow(row.id, 'description', e.target.value)}
                            />
                        </div>
                        <div>
                            <InputFieldNDL
                                value={row.quantity}
                                onChange={e => updateRow(row.id, 'quantity', e.target.value)}
                            />
                        </div>
                        <div>
                            <InputFieldNDL
                                value={row.hsnCode}
                                onChange={e => updateRow(row.id, 'hsnCode', e.target.value)}
                            />
                        </div>
                        <div>
                            <InputFieldNDL
                                value={row.price}
                                onChange={e => updateRow(row.id, 'price', e.target.value)}
                            />
                        </div>
                        <div>
                            <InputFieldNDL
                                value={row.discount}
                                onChange={e => updateRow(row.id, 'discount', e.target.value)}
                            />
                        </div>
                        <div>
                            <InputFieldNDL
                                value={row.tax}
                                onChange={e => updateRow(row.id, 'tax', e.target.value)}
                            />
                        </div>
                        <div>
                            <InputFieldNDL value={calculateLineTotal(row).toFixed(2)} readOnly className="w-full" />
                        </div>
                        <div className="flex items-center justify-center">
                            {rows.length > 1 && (
                                <button
                                    onClick={() => handleDeleteRow(row.id)}
                                    className="text-red-500 hover:scale-105 transition-transform"
                                >
                                    <Trash className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                                <div className="w-full flex flex-col items-end pt-4">
                                    <Button
                                        id="add-item"
                                        type="tertiary"
                                        icon={Plus}
                                        value="Add Item"
                                        onClick={handleAddRow}
                                    />

                                    <div className="flex flex-col gap-4 pt-4 w-fit">
                                        {[
                                            { label: 'Subtotal', value: subtotal, readOnly: true },
                                            { label: 'Total Discount', value: totalDiscount, readOnly: true },
                                            { label: 'Tax Total', value: taxTotal, readOnly: true },
                                            { label: 'Shipping Charges', value: shippingCharges, readOnly: false },
                                            { label: 'Grand Total', value: grandTotal, readOnly: true },
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between gap-4">
                                                <Typography variant="label-01-s" value={item.label} className="w-[140px]" />
                                                <InputFieldNDL
                                                    value={item.value}
                                                    onChange={
                                                        item.readOnly ? undefined : (e) => setShippingCharges(e.target.value)
                                                    }
                                                    readOnly={item.readOnly}
                                                    className="w-[220px]"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>



                            </div>
                        </div>



                        <div className="mt-4" />
                        <HorizontalLine variant="divider1" />
                        <div className="mt-4" />

                        <Typography
                            variant="heading-02-xs"
                            value="Terms and Conditions"
                            color="primary"
                        />{allPolicyLoading && <CircularProgress size={20} color="primary" />}
                        <Typography
                            variant="paragraph-xs"
                            value="Agree to standard business policies and terms for transactions."
                            color="tertiary"
                        />
                         <div className="mt-4" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                             {policyOptionsByType["Terms and Conditions"] && (
                                <SelectBox
                                labelId="Agreement-terms-label"
                                label="Agreement Terms"
                                id="Agreement-terms-id"
                                auto={false}
                                multiple={false}
                                options={policyOptionsByType["Terms and Conditions"] || []}
                                isMArray={true}
                                checkbox={false}
                                value={selectedAgreementTerms}
                                onChange={(e) => setSelectedAgreementTerms(e.target.value)}
                                keyValue="name"
                                keyId="id"
                                error={false}
                                msg=""
                                />
                                 )}

                                {policyOptionsByType["Payment"] && (
                                <SelectBox
                                labelId="Payment-terms-label"
                                label="Payment Terms"
                                id="Payment-terms-id"
                                auto={false}
                                multiple={false}
                                options={policyOptionsByType["Payment"] || []}
                                isMArray={true}
                                checkbox={false}
                                value={selectedPaymentTerms}
                                onChange={(e) => setSelectedPaymentTerms(e.target.value)}
                                keyValue="name"
                                keyId="id"
                                error={false}
                                msg=""
                                />
                                 )}

                                {policyOptionsByType["Warranty"] && (
                                <SelectBox
                                labelId="Industry-type-label"
                                label="warranty Terms"
                                id="Business-type-id"
                                auto={false}
                                multiple={false}
                                options={policyOptionsByType["Warranty"] || []}
                                isMArray={true}
                                checkbox={false}
                                value={selectedWarrantyTerms}
                                onChange={(e) => setSelectedWarrantyTerms(e.target.value)}
                                keyValue="name"
                                keyId="id"
                                error={false}
                                msg={""}
                                />
                                 )}

                                {policyOptionsByType["Support"] && (
                                <SelectBox
                                labelId="Industry-type-label"
                                label="Support Terms"
                                id="Business-type-id"
                                auto={false}
                                multiple={false}
                                options={policyOptionsByType["Support"] || []}
                                isMArray={true}
                                checkbox={false}
                                value={selectedSupportTerms}
                                onChange={(e) => setSelectedSupportTerms(e.target.value)}
                                keyValue="name"
                                keyId="id"
                                error={false}
                                msg={""}
                                />
                                  )}

                                {policyOptionsByType["Cancellation"] && (
                                <SelectBox
                                labelId="Industry-type-label"
                                label="Cancellation Terms"
                                id="Business-type-id"
                                auto={false}
                                multiple={false}
                                options={policyOptionsByType["Cancellation"] || []}
                                isMArray={true}
                                checkbox={false}
                                value={selectedCancellationTerms}
                                onChange={(e) => setSelectedCancellationTerms(e.target.value)}
                                keyValue="name"
                                keyId="id"
                                error={false}
                                msg={""}
                                />
                                 )}

                                {policyOptionsByType["Refund"] && (
                                <SelectBox
                                labelId="Industry-type-label"
                                label="Refund Terms"
                                id="Business-type-id"
                                auto={false}
                                multiple={false}
                                options={policyOptionsByType["Refund"] || []}
                                isMArray={true}
                                checkbox={false}
                                value={selectedRefundTerms}
                                onChange={(e) => setSelectedRefundTerms(e.target.value)}
                                keyValue="name"
                                keyId="id"
                                error={false}
                                msg={""}
                                />
                                )}

                                {policyOptionsByType["Delivery"] && (
                                <SelectBox
                                labelId="Industry-type-label"
                                label="Delivery Terms"
                                id="Business-type-id"
                                auto={false}
                                multiple={false}
                                options={policyOptionsByType["Delivery"] || []}
                                isMArray={true}
                                checkbox={false}
                                value={selectedDeliveryTerms}
                                onChange={(e) => setSelectedDeliveryTerms(e.target.value)}
                                keyValue="name"
                                keyId="id"
                                error={false}
                                msg={""}
                                />
                                   )}

                                {policyOptionsByType["Return"] && (
                                <SelectBox
                                labelId="Industry-type-label"
                                label="Return Terms"
                                id="Business-type-id"
                                auto={false}
                                multiple={false}
                                options={policyOptionsByType["Return"] || []}
                                isMArray={true}
                                checkbox={false}
                                value={selectedReturnTerms}
                                onChange={(e) => setSelectedReturnTerms(e.target.value)}
                                keyValue="name"
                                keyId="id"
                                error={false}
                                msg={""}
                                />
                                )}
                            </div>
                    </React.Fragment>
                </Grid>

            </Grid>
        </React.Fragment>
    );
});
export default AddQuotationForm;