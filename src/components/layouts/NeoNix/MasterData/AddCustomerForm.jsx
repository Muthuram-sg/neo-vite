import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import Grid from 'components/Core/GridNDL';
import InputFieldNDL from "components/Core/InputFieldNDL";
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import Typography from "components/Core/Typography/TypographyNDL";
import HorizontalLine from "components/Core/HorizontalLine/HorizontalLineNDL";
import FileInput from 'components/Core/FileInput/FileInputNDL';
import Button from 'components/Core/ButtonNDL';
import { useRecoilState } from "recoil";
import CustomSwitch from "components/Core/CustomSwitch/CustomSwitchNDL";
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import Delete from 'assets/neo_icons/Menu/ActionDelete.svg?react';
import { selectedPlant } from "recoilStore/atoms";
import ShippingAddressManager from './ShippingAddressManager';
import useGetCompanyTypes from "../hooks/useGetCompanyType";
import useGetCompanyCat from "../hooks/useGetCompanyCat";
import useGetIndustryType from "../hooks/useGetIndustryType";
import useTheme from "TailwindTheme";
import useGetCountry from "../hooks/useGetCountry";
import useGetAllPolicy from "../hooks/useGetAllPolicy";
import useGetStatesByCountry from '../hooks/useGetStatesByCountry';
import useUsersListForLine from 'components/layouts/Settings/UserSetting/hooks/useUsersListForLine';
import useGetAllCustomer from "components/layouts/NeoNix/hooks/useGetUserList.jsx"
import useGetAllCurrency from "../hooks/useGetAllCurrency";
import ParagraphText from 'components/Core/Typography/TypographyNDL';
import DummyImage from 'assets/neo_icons/SettingsLine/image_icon.svg?react';
import BlackX from 'assets/neo_icons/SettingsLine/black_x.svg?react';
import CircularProgress from 'components/Core/ProgressIndicators/ProgressIndicatorNDL'

const AddCustomerForm = forwardRef((props, ref) => {
  const [selectedValue, setSelectedValue] = useState("");
  const theme = useTheme();
  const customerNameRef = useRef(null);
  const ShippingAddLine1Ref = useRef();
  const ShippingAddLine2Ref = useRef();
  const ShippingCityRef = useRef();
  const ShippingZipRef = useRef();
  const registrationNumberRef = useRef(null);
  const [companyTypeMsg, setCompanyTypeMsg] = useState("");
  const [companyCategoryMsg, setCompanyCategoryMsg] = useState("");
  const [selectedAgreementTerms, setSelectedAgreementTerms] = useState("");
  const [selectedPaymentTerms, setSelectedPaymentTerms] = useState("");
  const [selectedWarrantyTerms, setSelectedWarrantyTerms] = useState("");
  const [selectedSupportTerms, setSelectedSupportTerms] = useState("");
  const [selectedCancellationTerms, setSelectedCancellationTerms] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRefundTerms, setSelectedRefundTerms] = useState("");
  const [selectedDeliveryTerms, setSelectedDeliveryTerms] = useState("");
  const [selectedReturnTerms, setSelectedReturnTerms] = useState("");
  const [billingCountry, setBillingCountry] = useState("");
  const [billingState, setBillingState] = useState("");
  const [billingCountryMsg, setBillingCountryMsg] = useState("");
  const [billingStateMsg, setBillingStateMsg] = useState("");
  const [shippingCountryMsg, setShippingCountryMsg] = useState("");
  const [shippingStateMsg, setShippingStateMsg] = useState("");
  const { statesData, getStatesByCountry } = useGetStatesByCountry();
  const { UsersListForLineLoading, UsersListForLineData, UsersListForLineError, getUsersListForLine } = useUsersListForLine();
  const [registrationNumber, setRegistrationNumber] = useState({ value: "", isValid: true });
  const [customerName, setCustomerName] = useState({ value: "", isValid: true });
  const [primaryContactPerson, setPrimaryContactPerson] = useState({ value: "", isValid: true });
  const [designation, setDesignation] = useState({ value: "", isValid: true });
  const [email, setEmail] = useState({ value: "", isValid: true });
  const [contactNumber, setContactNumber] = useState({ value: "", isValid: true });
  const [alternativeContactPerson, setAlternativeContactPerson] = useState({ value: "", isValid: true });
  const { allPolicyLoading, allPolicyData, allPolicyError, getAllPolicy } = useGetAllPolicy();
  const [gstNumber, setGstNumber] = useState({ value: "", isValid: true });
  const [alternativeContactNumber, setAlternativeContactNumber] = useState({ value: "", isValid: true });
  const [tin, setTin] = useState({ value: '', isValid: true });
  const [pan, setPan] = useState({ value: '', isValid: true });
  const [shippingAddLine1, setShippingAddLine1] = useState({ value: "", isValid: true });
  const [shippingAddLine2, setShippingAddLine2] = useState({ value: "", isValid: true });
  const [shippingZip, setShippingZip] = useState({ value: "", isValid: true });
  const [bankAcc, setBankAcc] = useState({ value: '', isValid: true });
  const [ifsc, setIfsc] = useState({ value: '', isValid: true });
  const [signatory, setSignatory] = useState({ value: '', isValid: true });
  const [currency, setCurrency] = useState({ value: '', isValid: true });
  const [addNotes, setAddNotes] = useState({ value: '', isValid: true });
  const { companyTypeData, getCompanyTypes } = useGetCompanyTypes();
  const { companyCateData, getCompanyCategoryTypes } = useGetCompanyCat()
  const { industryData, getIndustryTypes } = useGetIndustryType()
  const [selectedGSTFile, setSelectedGSTFile] = useState(null);
  const [selectedTinFile, setSelectedTinFile] = useState(null);
  const [selectedPanFile, setSelectedPanFile] = useState(null);
  const [isUsingExistingGSTFile, setIsUsingExistingGSTFile] = useState(!!props.editData?.gstfilepath);
  const [isUsingExistingTinFile, setIsUsingExistingTinFile] = useState(!!props.editData?.tinfilepath);
  const [isUsingExistingPanFile, setIsUsingExistingPanFile] = useState(!!props.editData?.panfilepath);
  const [gstFileError, setGstFileError] = useState({ hasError: false, message: "" });
  const [tinFileError, setTinFileError] = useState({ hasError: false, message: "" });
  const [panFileError, setPanFileError] = useState({ hasError: false, message: "" });
  const { countryData, getCountryList } = useGetCountry()
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [signatoryOptions, setSignatoryOptions] = useState([]);
  const [shippingCity, setShippingCity] = useState({ value: "", isValid: true });
  const [addressLine1, setAddressLine1] = useState({ value: "", isValid: true });
  const [addressLine2, setAddressLine2] = useState({ value: "", isValid: true });
  const [sameAdd, setsameAdd] = useState(false);
  const [headPlant] = useRecoilState(selectedPlant)
  const [policyOptionsByType, setpolicyOptionsByType] = useState([]);
  const [city, setCity] = useState({ value: "", isValid: true });
  const [zipCode, setZipCode] = useState({ value: "", isValid: true });
  const [selectedIndustryType, setSelectedIndustryType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const designationRef = useRef(null);
  const emailRef = useRef(null);
  const alternativeContactPersonRef = useRef(null);
  const alternativeContactNumberRef = useRef(null);
  const tinRef = useRef(null);
  const panRef = useRef(null);
  const bankRef = useRef(null);
  const ifscRef = useRef(null);
  const addNotesRef = useRef(null);
  const addressLine1Ref = useRef(null);
  const gstNumberRef = useRef(null);
  const addressLine2Ref = useRef(null);
  const cityRef = useRef(null);
  const zipCodeRef = useRef(null);
  const contactNumberRef = useRef(null);
  const {allCurrencyData,getAllCurrency} = useGetAllCurrency();
  const {allCustomerData,getAllCustomer} = useGetAllCustomer(); 
  const [fileErrors, setFileErrors] = useState({
    gst: { hasError: false, message: "" },
    tin: { hasError: false, message: "" },
    pan: { hasError: false, message: "" },
  });

  useEffect(() => {
    getCompanyTypes()
    getCompanyCategoryTypes()
    getIndustryTypes()
    getCountryList()
    getAllPolicy()
    getStatesByCountry("IN");
    getAllCurrency();
    getAllCustomer(); // call on mount
    getUsersListForLine(headPlant.id)
  }, [headPlant])
    
  const handleChange = (e, name, key = '', index = 0) => {
      const value = e.target.value;
      switch (name) {
          case 'country':
              setBillingCountry(value);
              setBillingCountryMsg(""); 
              getStatesByCountry(value);
              setBillingState(""); 
              break;
          case 'state':
              setBillingState(value);
              setBillingStateMsg(""); 
              break;
          case 'shipping':
              let newShippingAddresses = [...shippingAddresses];
              if (!newShippingAddresses[index]) {
                  newShippingAddresses[index] = {
                      addressLine1: "",
                      addressLine2: "",
                      city: "",
                      state: "",
                      country: "",
                      zipCode: "",
                      isValid: {
                          addressLine1: true,
                          city: true,
                          zipCode: true,
                      }
                  };
              }
              newShippingAddresses[index][key] = value;

              if (key === "country") {
                  setShippingCountryMsg("");
                  getStatesByCountry(value);
                  newShippingAddresses[index].state = ""; 
              }
              if (key === "state") {
                  setShippingStateMsg("");
              }

              setShippingAddresses(newShippingAddresses);
              break;
          default:
              break;
      }
  };

  const handleFileChangeWithKey = (e, key, setFileFn, setIsExistingFn, label) => {
    const file = e.target.files[0];
    const maxSize = 10 * 1024 * 1024;

    if (file && file.size > maxSize) {
      setFileErrors((prev) => ({
        ...prev,
        [key]: {
          hasError: true,
          message: `${label} file exceeds 10MB limit`,
        },
      }));
      setFileFn(null);
    } else {
      setFileErrors((prev) => ({
        ...prev,
        [key]: {
          hasError: false,
          message: "",
        },
      }));
      setFileFn(file);
      setIsExistingFn(false);
    }
  };

  useEffect(() => {
  if (
    props.editData &&
    shippingAddresses.length > 0 &&
    addressLine1.value &&
    city.value &&
    billingCountry &&
    billingState
  ) {
    const billing = {
      addressLine1: addressLine1.value,
      addressLine2: addressLine2.value,
      city: city.value,
      zipCode: zipCode.value,
      country: billingCountry,
      state: billingState,
    };
    const shipping = shippingAddresses[0] || {};
    const isSame =
      billing.addressLine1 === (shipping.addressLine1 || "") &&
      billing.addressLine2 === (shipping.addressLine2 || "") &&
      billing.city === (shipping.city || "") &&
      billing.zipCode === (shipping.zipCode || "") &&
      billing.country === (shipping.country || "") &&
      billing.state === (shipping.state || "");

    if (isSame && !sameAdd) {
      setsameAdd(true);
    }
    if (!isSame && sameAdd) {
      setsameAdd(false);
    }
  }
}, [props.editData,addressLine1.value,addressLine2.value,city.value,zipCode.value,billingCountry,billingState,shippingAddresses]);

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
    if (!UsersListForLineLoading && UsersListForLineData && !UsersListForLineError) {
      const formattedOptions = UsersListForLineData.map((user) => ({
        id: user.userByUserId.id,
        name: user.userByUserId.name
      }));
      setSignatoryOptions(formattedOptions);
    }
  }, [UsersListForLineLoading, UsersListForLineData, UsersListForLineError]);

  const handleRemoveAddress = (index) => {
  let temp_addresses = [...shippingAddresses];
  temp_addresses.splice(index, 1);
  setShippingAddresses(temp_addresses);
  };

  const handleTINChange = (e) => {
    const value = e.target.value;
    const isValid = /^[a-zA-Z0-9]*$/.test(value);
    setTin({ value, isValid });
  };

  const handlePANChange = (e) => {
    const value = e.target.value;
    const isValid = /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value);
    setPan({ value, isValid });
  };

  const handleBankChange = (e) => {
    const value = e.target.value;
    const isValid = /^[0-9]{8,20}$/.test(value);
    setBankAcc({ value, isValid });
  };

  const handleIFSCChange = (e) => {
    const value = e.target.value.toUpperCase();
    const isValid = /^[A-Z]{4}0[A-Z0-9]{6}$/.test(value);
    setIfsc({ value, isValid });
  };

  const handleSignatoryChange = (e) => {
    const value = e.target.value;
    const isValid = /^[a-zA-Z0-9\s]*$/.test(value);
    setSignatory({ value, isValid });
  };

  const handleAddNotesChange = (e) => {
    const value = e.target.value;
    const isValid = /^[a-zA-Z0-9\s]*$/.test(value);
    setAddNotes({ value, isValid });
  };

  const handleSameAdd = (e) => {
    setsameAdd(!sameAdd)
  }

  const isShippingSameAsBilling = () => {
  const billing = {
    addressLine1: addressLine1.value,
    addressLine2: addressLine2.value,
    city: city.value,
    zipCode: zipCode.value,
    country: billingCountry,
    state: billingState,
  };
  const shipping = shippingAddresses[0] || {};
  return (
    billing.addressLine1 === (shipping.addressLine1 || "") &&
    billing.addressLine2 === (shipping.addressLine2 || "") &&
    billing.city === (shipping.city || "") &&
    billing.zipCode === (shipping.zipCode || "") &&
    billing.country === (shipping.country || "") &&
    billing.state === (shipping.state || "")
  );
};

useEffect(() => {
  if (sameAdd) {
    setShippingStateMsg("");
    setShippingCountryMsg("");
    setShippingAddresses((prev) => {
      const updated = [...prev];
      updated[0] = {
        addressLine1: addressLine1.value,
        addressLine2: addressLine2.value,
        city: city.value,
        zipCode: zipCode.value,
        country: billingCountry,
        state: billingState,
        isValid: {
          addressLine1: !!addressLine1.value,
          city: !!city.value,
          zipCode: !!zipCode.value,
        },
      };
      return updated;
    });
  }
}, [sameAdd, addressLine1.value, addressLine2.value, city.value, zipCode.value, billingCountry, billingState]);

useEffect(() => {
  if (sameAdd && !isShippingSameAsBilling()) {
    setsameAdd(false);
  }
}, [shippingAddresses[0]?.addressLine1, shippingAddresses[0]?.addressLine2, shippingAddresses[0]?.city, shippingAddresses[0]?.zipCode, shippingAddresses[0]?.country, shippingAddresses[0]?.state]);

const checkMandatoryFields = () => {
  let hasError = false;

  if (!customerName.value.trim()) {
    setCustomerName((prev) => ({ ...prev, isValid: false }));
    hasError = true;
  }

  if (!registrationNumber.value.trim()) {
    setRegistrationNumber((prev) => ({ ...prev, isValid: false }));
    hasError = true;
  }

  if (!primaryContactPerson.value.trim()) {
    setPrimaryContactPerson((prev) => ({ ...prev, isValid: false }));
    hasError = true;
  }

  if (!designation.value.trim()) {
    setDesignation((prev) => ({ ...prev, isValid: false }));
    hasError = true;
  }

  if (!email.value.trim()) {
    setEmail((prev) => ({ ...prev, isValid: false }));
    hasError = true;
  }

  if (!contactNumber.value.trim()) {
    setContactNumber((prev) => ({ ...prev, isValid: false }));
    hasError = true;
  }

  if (!addressLine1.value.trim()) {
    setAddressLine1((prev) => ({ ...prev, isValid: false }));
    hasError = true;
  }

  if (!city.value.trim()) {
    setCity((prev) => ({ ...prev, isValid: false }));
    hasError = true;
  }

  if (!billingCountry) {
    setBillingCountryMsg("Select country");
    hasError = true;
  }
  if (!billingState) {
    setBillingStateMsg("Select state");
    hasError = true;
  }

  if (!zipCode.value.trim()) {
    setZipCode((prev) => ({ ...prev, isValid: false }));
    hasError = true;
  }

  if (!shippingAddresses[0]?.addressLine1) {
    setShippingAddresses((prev) => {
      const updated = [...prev];
      if (!updated[0]) updated[0] = {};
      updated[0].isValid = { ...(updated[0].isValid || {}), addressLine1: false };
      return updated;
    });
    hasError = true;
  }

  if (!shippingAddresses[0]?.city) {
    setShippingAddresses((prev) => {
      const updated = [...prev];
      if (!updated[0]) updated[0] = {};
      updated[0].isValid = { ...(updated[0].isValid || {}), city: false };
      return updated;
    });
    hasError = true;
  }

  if (!shippingAddresses[0]?.country) {
    setShippingCountryMsg("Select country");
    hasError = true;
  }
  if (!shippingAddresses[0]?.state) {
    setShippingStateMsg("Select state");
    hasError = true;
  }

  if (!shippingAddresses[0]?.zipCode) {
    setShippingAddresses((prev) => {
      const updated = [...prev];
      if (!updated[0]) updated[0] = {};
      updated[0].isValid = { ...(updated[0].isValid || {}), zipCode: false };
      return updated;
    });
    hasError = true;
  }

  if (!signatory) {
    hasError = true;
  }

  if (!currency) {
    hasError = true;
  }

  return !hasError;
};

const handleSave = () => {
  if (isSubmitting) return null;

  setIsSubmitting(true);

  const formPayload = new FormData();
  formPayload.append("bill.id", props.editData?.id || 0);
  formPayload.append("bill.cust_name", customerName?.value || "");
  formPayload.append("bill.reg_no", registrationNumber?.value || "");
  formPayload.append("bill.designation", designation?.value || "");
  formPayload.append("bill.email_id", email?.value || "");
  formPayload.append("bill.mobile_no", contactNumber?.value || "");
  formPayload.append("bill.adn_cont_person", alternativeContactPerson?.value || "");
  formPayload.append("bill.adn_mobile_no", alternativeContactNumber?.value || "");
  formPayload.append("bill.adrs1", addressLine1?.value || "");
  formPayload.append("bill.adrs2", addressLine2?.value || "");
  formPayload.append("bill.citycode", city?.value || "");
  formPayload.append("bill.acc_represent", primaryContactPerson?.value || "");
  formPayload.append("bill.postcode", zipCode?.value || "");
  formPayload.append("bill.category", selectedCategory || "");
  formPayload.append("bill.industype", selectedIndustryType || "");
  formPayload.append("bill.acc_no", bankAcc?.value || "");
  formPayload.append("bill.ifsc_code", ifsc?.value || "");
  formPayload.append("bill.gst_no", gstNumber?.value || "");
  formPayload.append("bill.tin_no", tin?.value || "");
  formPayload.append("bill.pan_no", pan?.value || "");
  formPayload.append("bill.adn_notes", addNotes?.value || "");
  formPayload.append("bill.cust_code", props.editData?.cust_code || "");
  formPayload.append("bill.sector", selectedValue || "");
  formPayload.append("bill.countrycode", billingCountry || "");
  formPayload.append("bill.statecode", billingState || "");
  formPayload.append("bill.pre_currency", currency && currency.length > 0 ? currency : null);
  formPayload.append("bill.signatory", signatory && signatory.length > 0 ? signatory : null);
  formPayload.append("bill.adrs3", shippingAddLine1?.value || "");
  formPayload.append("bill.adrs4", shippingAddLine2?.value || "");
  formPayload.append("bill.citycode", shippingCity?.value || "");
  formPayload.append("bill.postcode", shippingZip?.value || "");
 
  const policyTerms = [
    { key: selectedReturnTerms, value: "Return" },
    { key: selectedRefundTerms, value: "Refund" },
    { key: selectedDeliveryTerms, value: "Delivery" },
    { key: selectedCancellationTerms, value: "Cancellation" },
    { key: selectedSupportTerms, value: "Support" },
    { key: selectedWarrantyTerms, value: "Warranty" },
    { key: selectedPaymentTerms, value: "Payment" },
    { key: selectedAgreementTerms, value: "Terms and Conditions" },
  ];

  const filteredTerms = policyTerms.filter(
    term => term.key !== "" && term.key !== null && term.key !== undefined
  );

  if (filteredTerms.length > 0) {
    filteredTerms.forEach((term, index) => {
      formPayload.append(`policy[${index}].key`, term.key);
      formPayload.append(`policy[${index}].value`, term.value);
    });
  } else {
    formPayload.append("policy", JSON.stringify({}));
  }
const allShippingAddresses = (shippingAddresses || []).map(addr => ({
  shipping_add1: addr.addressLine1 || "",
  shipping_add2: addr.addressLine2 || "",
  shipping_city: addr.city || "",
  shipping_state_name: addr.state || "",
  shipping_country_name: addr.country || "",
  shipping_zip_code: addr.zipCode || "",
}));
allShippingAddresses.forEach((address, idx) => {
  formPayload.append(`ship[${idx}].cust_code`, props.editData?.cust_code || "");
  formPayload.append(`ship[${idx}].adrs1`, address.shipping_add1);
  formPayload.append(`ship[${idx}].adrs2`, address.shipping_add2);
  formPayload.append(`ship[${idx}].citycode`, address.shipping_city);
  formPayload.append(`ship[${idx}].statecode`, address.shipping_state_name);
  formPayload.append(`ship[${idx}].countrycode`, address.shipping_country_name);
  formPayload.append(`ship[${idx}].postcode`, address.shipping_zip_code);
});

    if (props.editData && Object.keys(props.editData).length) {
        formPayload.append("bill.id", props.editData?.id || "");
         formPayload.append("bill.cust_code", props.editData?.cust_code || "");
    }

  if (!isUsingExistingGSTFile && selectedGSTFile) {
    formPayload.append("bill.gstfile", selectedGSTFile);
  } else if (isUsingExistingGSTFile && props.editData?.gstfilepath) {
    formPayload.append("bill.GstDocumentFilePath", props.editData.gstfilepath);
  }

  if (!isUsingExistingTinFile && selectedTinFile) {
    formPayload.append("bill.tinfile", selectedTinFile);
  } else if (isUsingExistingTinFile && props.editData?.tinfilepath) {
    formPayload.append("bill.TinDocumentFilePath", props.editData.tinfilepath);
  }

  if (!isUsingExistingPanFile && selectedPanFile) {
    formPayload.append("bill.panfile", selectedPanFile);
  } else if (isUsingExistingPanFile && props.editData?.panfilepath) {
    formPayload.append("bill.PanDocumentFilePath", props.editData.panfilepath);
  }
  setTimeout(() => setIsSubmitting(false), 2000);

  return formPayload;
};

useImperativeHandle(ref, () => ({
  handleTriggerSave: (cb) => {
    if (checkMandatoryFields()) {
      const formData = handleSave();
      if (formData) {
        cb?.(true, formData);
        props.onSuccess?.();
      }
    } else {
      cb?.(false, null);
      props.onValidationFailed?.();
    }
  }
}));

  useEffect(() => {
    if (props.editData && Object.keys(props.editData).length && props.edit) {
      const data = props.editData;
      const getTrimmed = (val) => (val ? val.trim() : "");
      props.editData.policies.forEach(({ policy_code, policy_type }) => {
      const typeId = parseInt(policy_type);
      switch (policy_code) {
              case "Return":
                setSelectedReturnTerms(typeId);
                break;
              case "Refund":
                setSelectedRefundTerms(typeId);
                break;
              case "Delivery":
                setSelectedDeliveryTerms(typeId);
                break;
              case "Cancellation":
                setSelectedCancellationTerms(typeId);
                break;
              case "Support":
                setSelectedSupportTerms(typeId);
                break;
              case "Warranty":
                setSelectedWarrantyTerms(typeId);
                break;
              case "Payment":
                setSelectedPaymentTerms(typeId);
                break;
              case "Terms and Conditions":
                setSelectedAgreementTerms(typeId);
                break;
              default:
                break;
            }
          })
      setCustomerName({ value: getTrimmed(data.cust_name), isValid: true });
      setEmail({ value: getTrimmed(data.email_id), isValid: true });
      setContactNumber({ value: getTrimmed(data.mobile_no?.toString()), isValid: true });
      setAlternativeContactPerson({ value: getTrimmed(data.adn_cont_person), isValid: true });
      setAlternativeContactNumber({ value: getTrimmed(data.adn_mobile_no), isValid: true });
      setRegistrationNumber({ value: getTrimmed(data.reg_no), isValid: true });
      setAddNotes({ value: getTrimmed(data.adn_notes), isValid: true });
      setDesignation({ value: getTrimmed(data.designation), isValid: true });
      setBankAcc({ value: getTrimmed(data.acc_no), isValid: true });
      setIfsc({ value: getTrimmed(data.ifsc_code), isValid: true });
      setPan({ value: getTrimmed(data.pan_no), isValid: true });
      setGstNumber({ value: getTrimmed(data.gst_no), isValid: true });
      setTin({ value: getTrimmed(data.tin_no), isValid: true });
      setPrimaryContactPerson({ value: getTrimmed(data.acc_represent), isValid: true });
      


       if (companyTypeData && companyTypeData.length > 0) {
        const matchedSector = companyTypeData.find(item => item.name === data.sector_type);
        if (matchedSector) {
          setSelectedValue(matchedSector.code);
        }
      }
        if (companyCateData && companyCateData.length > 0) {
        const matchedSector = companyCateData.find(item => item.name === data.category_type);
        if (matchedSector) {
          setSelectedCategory(matchedSector.code);
        }
      }

      if (industryData && industryData.length > 0) {
        const matchedSector = industryData.find(item => item.name === data.industriel_type);
        if (matchedSector) {
          setSelectedIndustryType(matchedSector.code);
        }
      }
      
        if (allCurrencyData && allCurrencyData.length > 0) {
          const matchedSector = allCurrencyData.find(item => item.value === data.pre_currency);
          if (matchedSector) {
            setCurrency(matchedSector.key);
          }
        }

        if (allCustomerData && allCustomerData.length > 0) {
            const matchedSector = allCustomerData.find(item => item.value === data.signatory);
            if (matchedSector) {
              setSignatory(matchedSector.key);
            }
          }

      if (data.address) {
        const parts = data.address.split(",");
        let line1 = data.adrs1 ||"";
        let line2 = data.adrs2 || "";
        let stateName = data.state || "";
        let countryName = data.country || "";
        let zipCodeValue = data.postcode || "";

        if (parts.length === 4) {
          // [line1, line2, stateName] = parts.map(p => p?.trim() || "");
          const countryZip = parts[3]?.trim() || "";
          if (countryZip.includes(" - ")) {
            [countryName, zipCodeValue] = countryZip.split(" - ").map(s => s.trim());
          } else {
            countryName = countryZip;
          }
        } else if (parts.length === 3) {
          // [line1, stateName] = parts.map(p => p?.trim() || "");
          const countryZip = parts[2]?.trim() || "";
          if (countryZip.includes(" - ")) {
            [countryName, zipCodeValue] = countryZip.split(" - ").map(s => s.trim());
          } else {
            countryName = countryZip;
          }
          line2 = "";
        }

        setAddressLine1({ value: line1, isValid: true });
        setAddressLine2({ value: line2, isValid: true });
        setZipCode({ value: zipCodeValue, isValid: true });
        setCity({ value: props.editData.citycode, isValid: true });

        let countryCode = "";
        if (countryData && countryData.length > 0 && countryName) {
          const foundCountry = countryData.find(
            (c) => c.value.trim().toLowerCase() === countryName.trim().toLowerCase()
          );
          countryCode = foundCountry ? foundCountry.key : "";
        }
        setBillingCountry(countryCode);

        let stateCode = "";
        if (statesData && statesData.length > 0 && stateName) {
          const foundState = statesData.find(
            (s) => s.name.trim().toLowerCase() === stateName.trim().toLowerCase()
          );
          stateCode = foundState ? foundState.code : "";
        }
        setBillingState(stateCode);
      }
      let shipping_address = Array.isArray(props?.editData?.ship)
        ? props.editData.ship
        .sort((a, b) => a.id - b.id)
        .map((xx) => {
            let addressLine1 = xx.adrs1 || "";
            let addressLine2 = xx.adrs2 || "";
            let state = xx.state || "";
            let country = xx.country ?? "";
            let zipCode = xx.postcode ?? "";
            let city = xx.citycode ?? "";

            if (xx.address) {
              const parts = xx.address.split(",");
              addressLine1 = xx.adrs1 || parts[0]?.trim() || "";
              addressLine2 = xx.adrs2 || parts[1]?.trim() || "";

              const last = parts[parts.length - 1]?.trim();
              if (last?.includes(" - ")) {
                const [countryPart, zipPart] = last.split(" - ");
                country = xx.country || countryPart.trim();
                zipCode = xx.postcode || zipPart.trim();
              } else {
                country = last || country;
              }
            }

            if (countryData && country) {
              const matchedCountry = countryData.find(
                (c) => c.value.toLowerCase() === country.toLowerCase()
              );
              country = matchedCountry?.key || country;
            }
            if (statesData && xx.state) {
              const matchedState = statesData.find(
                (s) => s.name.toLowerCase() === xx.state.toLowerCase()
              );
              state = matchedState?.code || state;
            }

            return {
              addressLine1,
              addressLine2,
              city,
              state,
              country,
              zipCode,
              isValid: {
                addressLine1: true,
                city: true,
                zipCode: true,
              },
            };
          })
        : [];

        setShippingAddresses(shipping_address);
    }
  }, [props.editData, companyTypeData, companyCateData, industryData, allCurrencyData, allCustomerData,policyOptionsByType]);

  const handleShippingAddressChange = (index, field, value) => {
    const updated = [...shippingAddresses];
    if (!updated[index]) {
      updated[index] = {
        addressLine1: "",
        addressLine2: "",
        city: "",
        zipCode: "",
        country: "",
        state: "",
        isValid: {
          addressLine1: true,
          city: true,
          zipCode: true,
        }
      };
    }
    
    updated[index][field] = value;
    
    if (field === "zipCode") {
      updated[index].isValid.zipCode = /^\d{5,6}$/.test(value);
    }
    if (field === "addressLine1") {
      updated[index].isValid.addressLine1 = value.trim() !== "";
    }
    if (field === "city") {
      updated[index].isValid.city = value.trim() !== "";
    }
    
    setShippingAddresses(updated);
  };

  const handleGSTNumberChange = (e) => {
    const inputValue = e.target.value;
    const isValidGST = /^[a-zA-Z0-9]{0,15}$/.test(inputValue);

    setGstNumber({
      value: inputValue,
      isValid: isValidGST,
    });
  };


  const handleAddShippingAddress = () => {
    setShippingAddresses(prev => {
      if (prev.length >= 8) return prev; 
      return [
        ...prev,
        {
          addressLine1: "",
          addressLine2: "",
          city: "",
          zipCode: "",
          country: "",
          state: "",
          isValid: {
            addressLine1: true,
            city: true,
            zipCode: true,
          }
        }
      ];
    });
  };

  const transformPoliciesByType = (data) => {
    try {
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
    } catch (error) { console.error("Error in transformPoliciesByType:", error); } 
  };


  const handleShippingChange = (index, field, subField, value) => {
    try {
  setShippingAddresses((prev) => {
    const updated = [...prev];

    if (!updated[index]) {
      updated[index] = {};
    }

    if (field === "isSameAsBilling") {
      updated[index][field] = value;

      if (value === true) {
        updated[index] = {
          ...updated[index],
          addressLine1: { ...addressLine1 } || {},
          addressLine2: { ...addressLine2 } || {},
          city: { ...city } || {},
          zipCode: { ...zipCode } || {},
          country: "",
          state: "",
          isSameAsBilling: true,
        };
      }
    } else {
      if (subField) {
        if (!updated[index][field]) updated[index][field] = {};
        updated[index][field][subField] = value;
      } else {
        updated[index][field] = value;
      }
    }

    return updated;
  });
  } catch (error) { console.log("ERROR", error) }
};  

  const handleAlternativeContactPersonChange = (e) => {
    const value = e.target.value;

    const isValid =
      /^[a-zA-Z\s]*$/.test(value) &&
      value.length <= 50;

    setAlternativeContactPerson({
      value,
      isValid
    }); 
  };


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


  const handleAlternativeContactNumberChange = (e) => {
    const input = e.target.value;

    if (/^\d*$/.test(input)) {
      setAlternativeContactNumber({
        value: input,
        isValid: input.length >= 10 && input.length <= 15,
      });
    }
  };

  const handleCustomerNameChange = (e) => {
    const value = e.target.value;
    const trimmedValue = value.trim();
    const isValid =
      value.length <= 50 &&
      /^[a-zA-Z0-9\-_. ]+$/.test(value) &&
      value === trimmedValue;

    setCustomerName({
      value,
      isValid,
    });
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


  const handleContactNumberChange = (e) => {
    const input = e.target.value;

    if (/^\d*$/.test(input)) {
      setContactNumber({
        value: input,
        isValid: input.length >= 10 && input.length <= 15,
      });
    }
  };


  const handleDesignationChange = (e) => {
    const value = e.target.value;

    const isValid =
      /^[a-zA-Z\s]*$/.test(value) &&
      value.length <= 50;

    setDesignation({
      value,
      isValid
    });
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;

    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    setEmail({
      value,
      isValid
    });
  };


  const handlePrimaryContactPersonChange = (e) => {
    const value = e.target.value;

    const isValid =
      /^[a-zA-Z\s]*$/.test(value) &&
      value.length <= 50;

    setPrimaryContactPerson({
      value,
      isValid
    });
  };


  const handleRegistrationNumberChange = (e) => {
    const value = e.target.value;

    const isValid =
      /^[a-zA-Z0-9]*$/.test(value) && value.length <= 20;

    setRegistrationNumber({
      value,
      isValid,
    });
  };

  const handleShippingZipChange = (event) => {
    const value = event.target.value;
    const { isValid, message } = validateCompanyName(value);

    setShippingZip({ value, isValid, message });
  };

  const handleshippingCityChange = (event) => {
    const value = event.target.value;
    const { isValid, message } = validateCompanyName(value);

    setShippingCity({ value, isValid, message });
  };
  const handleShippingAddLine2Change = (event) => {
    const value = event.target.value;
    const { isValid, message } = validateCompanyName(value);

    setShippingAddLine2({ value, isValid, message });
  };

  const handleshippingAddLine1Change = (event) => {
    const value = event.target.value;
    const { isValid, message } = validateCompanyName(value);

    setShippingAddLine1({ value, isValid, message });
  };

  const validateCompanyName = (value) => {
    const trimmedValue = value.trim();
    const regex = /^[A-Za-z0-9\-_. ]+$/;
    let message = "";

    if (trimmedValue === "") {
      message = "Company name cannot be empty or just spaces";
    } else if (value.length > 50) {
      message = "Maximum 50 characters allowed";
    } else if (!regex.test(value)) {
      message = "Only letters, numbers, and -, _, . are allowed";
    } else if (value !== trimmedValue) {
      message = "No leading or trailing spaces allowed";
    }

    return {
      isValid: message === "",
      message,
    };
  };

  const handleIndustryTypeChange = (e) => {
    setSelectedIndustryType(e.target.value);
  };

  return (
    <React.Fragment>
      <Grid container>
        <Grid xs={2}>
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
                label={"Customer Name"}
                inputRef={customerNameRef}
                mandatory
                placeholder={"Type here"}
                value={customerName.value}
                error={!customerName.isValid}
                helperText={
                  !customerName.isValid
                    ? customerName.value.trim() === ""
                      ? "Customer name cannot be empty or just spaces"
                      : customerName.value.length > 50
                        ? "Maximum 50 characters allowed"
                        : !/^[a-zA-Z0-9\-_. ]+$/.test(customerName.value)
                          ? "Only letters, numbers, -, _, . and spaces allowed"
                          : customerName.value !== customerName.value.trim()
                            ? "No leading or trailing spaces allowed"
                            : ""
                    : ""
                }
                onChange={handleCustomerNameChange}
              />

            </div>

            <div className="w-full">
              <InputFieldNDL
                mandatory
                label={"Registration Number"}
                inputRef={registrationNumberRef}
                placeholder={"Type here"}
                value={registrationNumber.value}
                error={!registrationNumber.isValid}
                helperText={
                  !registrationNumber.isValid
                    ? registrationNumber.value === ""
                      ? "Registration Number is required"
                      : !/^[a-zA-Z0-9]*$/.test(registrationNumber.value)
                        ? "Enter a valid registration number"
                        : registrationNumber.value.length > 20
                          ? "Max 20 characters allowed"
                          : ""
                    : ""
                }
                onChange={handleRegistrationNumberChange}
              />

            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <div className="w-full">
              <SelectBox
                labelId="Industry-type-label"
                label="Company Type"
                id="Business-type-id"
                auto={false}
                multiple={false}
                options={companyTypeData && companyTypeData.length > 0 ? companyTypeData : []}
                isMArray={true}
                checkbox={false}
                value={selectedValue}
                onChange={(e) => setSelectedValue(e.target.value)}
                keyValue="name"
                keyId="code"
                // error={!!companyTypeMsg}
                // msg={companyTypeMsg}
              />
            </div>

            <div className="w-full">
              <SelectBox
                labelId="Industry-type-label"
                label="Company Category"
                id="Business-type-id"
                auto={false}
                multiple={false}
                options={companyCateData && companyCateData.length > 0 ? companyCateData : []}
                isMArray={true}
                checkbox={false}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                keyValue="name"
                keyId="code"
                error={!!companyCategoryMsg}
                msg={companyCategoryMsg}
              />
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <div className="w-full">
              <SelectBox
                labelId="Industry-type-label"
                label="Industry Type"
                id="Business-type-id"
                auto={false}
                multiple={false}
                options={industryData && industryData.length > 0 ? industryData : []}
                isMArray={true}
                checkbox={false}
                value={selectedIndustryType}
                onChange={handleIndustryTypeChange}
                keyValue="name"
                keyId="code"
                error={false}
                msg={"Select industry"}
              />
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
                mandatory
                label={"Primary Contact Person"}
                placeholder={"Type name"}
                value={primaryContactPerson.value}
                error={!primaryContactPerson.isValid}
                helperText={
                  !primaryContactPerson.isValid
                    ? primaryContactPerson.value === ""
                      ? "Name should only include letters"
                      : !/^[a-zA-Z\s]*$/.test(primaryContactPerson.value)
                        ? "Name should only include letters"
                        : primaryContactPerson.value.length > 50
                          ? "Name should only include letters"
                          : ""
                    : ""
                }
                onChange={handlePrimaryContactPersonChange}
              />

            </div>

            <div className="w-full">
              <InputFieldNDL
                mandatory
                label={"Designation"}
                inputRef={designationRef}
                placeholder={"Type here"}
                value={designation.value}
                error={!designation.isValid}
                helperText={
                  !designation.isValid
                    ? designation.value === ""
                      ? "Designation should only contain letters"
                      : !/^[a-zA-Z\s]*$/.test(designation.value)
                        ? "Designation should only contain letters"
                        : designation.value.length > 50
                          ? "Designation should only contain letters"
                          : ""
                    : ""
                }
                onChange={handleDesignationChange}
              />

            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <div className="w-full">
              <InputFieldNDL
                label={"Email"}
                mandatory
                inputRef={emailRef}
                placeholder={"Type here"}
                value={email.value}
                error={!email.isValid}
                helperText={
                  !email.isValid
                    ? email.value === ""
                      ? "	Enter a valid email address"
                      : "	Enter a valid email address"
                    : ""
                }
                onChange={handleEmailChange}
              />

            </div>

            <div className="w-full">
              <InputFieldNDL
                label={"Contact Number"}
                mandatory
                inputRef={contactNumberRef}
                placeholder={"Type here"}
                value={contactNumber.value}
                error={!contactNumber.isValid}
                helperText={
                  !contactNumber.isValid
                    ? contactNumber.value === ""
                      ? "Enter a valid phone number"
                      : "Enter a valid phone number"
                    : ""
                }
                onChange={handleContactNumberChange}
              />

            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <div className="w-full">
              <InputFieldNDL
                label={"Alternative Contact Person"}
                inputRef={alternativeContactPersonRef}
                placeholder={"Type here"}
                value={alternativeContactPerson.value}
                error={!alternativeContactPerson.isValid}
                 helperText={
                  !alternativeContactPerson.isValid
                    ? alternativeContactPerson.value === ""
                      ? "Name should only include letters"
                      : !/^[a-zA-Z\s]*$/.test(alternativeContactPerson.value)
                        ? "Name should only include letters"
                        : alternativeContactPerson.value.length > 50
                          ? "Name should only include letters"
                          : ""
                    : ""
                }
                onChange={handleAlternativeContactPersonChange}
              />
            </div>

            <div className="w-full">
              <InputFieldNDL
                label={" Contact Number"}
                inputRef={alternativeContactNumberRef}
                placeholder={"Type here"}
                value={alternativeContactNumber.value}
                error={!alternativeContactNumber.isValid}
                helperText={
                  !alternativeContactNumber.isValid
                    ? alternativeContactNumber.value === ""
                      ? "Enter a valid phone number"
                      : "Enter a valid phone number"
                    : ""
                }
                onChange={handleAlternativeContactNumberChange}
              />
            </div>
          </div>


          <React.Fragment>
            <div className="mt-4" />
            <div>
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
                inputRef={addressLine1Ref}
                mandatory={true}
                placeholder={"Type here"}
                value={addressLine1.value}
                error={!addressLine1.isValid}
                helperText={!addressLine1.isValid && addressLine1.value === "" ? "Enter address" : ""}
                onChange={handleAddressLine1Change}
              />
              <div className="mt-4" />
              <InputFieldNDL
                label={"Address Line 2"}
                inputRef={addressLine2Ref}
                placeholder={"Type here"}
                value={addressLine2.value}
                error={!addressLine2.isValid}
                helperText={!addressLine2.isValid && addressLine2.value === "" ? "Address Line 2 is required" : ""}
                onChange={handleAddressLine2Change}
              />
              <div className="flex gap-4 mt-4">
                <div className="w-full">
                  <InputFieldNDL
                    label={"City"}
                    inputRef={cityRef}
                    placeholder={"Type here"}
                    mandatory={true}
                    value={city.value}
                    error={!city.isValid}
                    helperText={!city.isValid && city.value === "" ? "Enter city" : ""}
                    onChange={handleCityChange}
                  />

                </div>
                <div className="w-full">
                  <SelectBox
                    id='country'
                    labelId='country'
                    label="Country"
                    options={countryData || []}
                    value={billingCountry}
                      onChange={e => handleChange(e, 'country')}
                    mandatory={true}
                    keyValue="value"
                    keyId="key"
                    error={!!billingCountryMsg}
                    msg={billingCountryMsg}
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
                    value={billingState}
                     onChange={e => handleChange(e, 'state')}
                    mandatory={true}
                    error={!!billingStateMsg}
                    msg={billingStateMsg}
                    keyValue="name"
                    keyId="code"
                  />
                </div>
                <div className="w-full">
                  <InputFieldNDL
                    label={"ZIP Code"}
                    inputRef={zipCodeRef}
                    mandatory={true}
                    placeholder={"Type here"}
                    value={zipCode.value}
                    error={!zipCode.isValid}
                    helperText={
                      !zipCode.isValid && zipCode.value === ""
                        ? "ZIP code must be 5 or 6 digits"
                        : !zipCode.isValid
                          ? "ZIP code must be 5 or 6 digits"
                          : ""
                    }
                    onChange={handleZipCodeChange}
                    // onFocus={...}
                  />
                </div>
              </div>

              {/* Shipping Address 1 */}
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
                  placeholder={"Type here"}
                  value={shippingAddresses[0]?.addressLine1 || ""}
                  error={shippingAddresses[0] && !shippingAddresses[0].isValid.addressLine1}
                  helperText={shippingAddresses[0] && !shippingAddresses[0].isValid.addressLine1 ? "Type Address Line 1" : ""}
                  onChange={(e) => {
                    handleShippingAddressChange(0, "addressLine1", e.target.value);
                    if (sameAdd) setsameAdd(false);
                  }}
                />
              <div className="mt-4" />
             <InputFieldNDL
                label={"Address Line 2"}
                placeholder={"Type here"}
                value={shippingAddresses[0]?.addressLine2 || ""}
                onChange={(e) => {
                  handleShippingAddressChange(0, "addressLine2", e.target.value);
                  if (sameAdd) setsameAdd(false);
                }}
              />
              <div className="flex gap-4 mt-4">
                <div className="w-full">
                    <InputFieldNDL
                      label={"City"}
                      placeholder={"Type here"}
                      mandatory={true}
                      value={shippingAddresses[0]?.city || ""}
                      error={shippingAddresses[0] && !shippingAddresses[0].isValid.city}
                      helperText={
                        shippingAddresses[0] && !shippingAddresses[0].isValid.city
                          ? "Enter City"
                          : ""
                      }
                      onChange={(e) => {
                        handleShippingAddressChange(0, "city", e.target.value);
                        if (sameAdd) setsameAdd(false);
                      }}
                    />
                </div>
                <div className="w-full">
                 <SelectBox
                      id='country'
                      labelId='country'
                      label="Country"
                      options={countryData || []}
                      value={shippingAddresses[0]?.country || ""}
                      onChange={e => handleChange(e, 'shipping', 'country', 0)}
                      mandatory={true}
                      keyValue="value"
                      keyId="key"
                      error={!!shippingCountryMsg}
                      msg={shippingCountryMsg}
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
                    value={shippingAddresses[0]?.state || ""}
                      onChange={e => handleChange(e, 'shipping', 'state', 0)}
                    mandatory={true}
                    keyValue="name"
                    keyId="code"
                    error={!!shippingStateMsg}
                    msg={shippingStateMsg}
                  />
                </div>
                <div className="w-full">
                  <InputFieldNDL
                    label={"ZIP Code"}
                    mandatory={true}
                    placeholder={"Type here"}
                    value={shippingAddresses[0]?.zipCode || ""}
                    error={shippingAddresses[0] && !shippingAddresses[0].isValid.zipCode}
                    helperText={
                      shippingAddresses[0] && !shippingAddresses[0].isValid.zipCode
                        ? "ZIP code must be 5 or 6 digits"
                        : ""
                    }
                    onChange={(e) => {
                      handleShippingAddressChange(0, "zipCode", e.target.value);
                      if (sameAdd) setsameAdd(false);
                    }}
                  />
                </div>
              </div>

              {/* Additional Shipping Addresses */}
              <div>
                {shippingAddresses.slice(1).map((address, index) => {
                  const safeAddress = {
                    addressLine1: "",
                    addressLine2: "",
                    city: "",
                    zipCode: "",
                    country: "",
                    state: "",
                    isValid: {
                      addressLine1: true,
                      city: true,
                      zipCode: true,
                    },
                    ...address,
                  };
                  const displayIndex = index + 2;
                  return (
                    <div key={index + 1} className="mb-6 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Typography
                          variant="label-01-s"
                          value={`Shipping Address ${displayIndex}`}
                          color="primary"
                        />
                        <Button
                          type="ghost"
                          danger
                          icon={Delete}
                          stroke={theme.colorPalette.genericRed}
                          onClick={() => handleRemoveAddress(index + 1)}
                        />
                      </div>
                      <div className="mt-4" />
                       <InputFieldNDL
                          label={"Address Line 1"}
                          placeholder={"Type here"}
                          value={safeAddress.addressLine1}
                          error={!safeAddress.isValid.addressLine1}
                          helperText={!safeAddress.isValid.addressLine1 ? "Enter address" : ""}
                          onChange={(e) =>
                            handleShippingAddressChange(index + 1, "addressLine1", e.target.value)
                          }
                        />
                      <div className="mt-4" />
                      <InputFieldNDL
                        label={"Address Line 2"}
                        placeholder={"Type here"}
                        value={safeAddress.addressLine2}
                        onChange={(e) =>
                          handleShippingAddressChange(index + 1, "addressLine2", e.target.value)
                        }
                      />
                      <div className="flex gap-4 mt-4">
                        <div className="w-full">
                          <InputFieldNDL
                            label={"City"}
                            placeholder={"Type here"}
                            value={safeAddress.city}
                            error={!safeAddress.isValid.city}
                            helperText={!safeAddress.isValid.city ? "Enter city" : ""}
                            onChange={(e) =>
                              handleShippingAddressChange(index + 1, "city", e.target.value)
                            }
                          />
                        </div>
                        <div className="w-full">
                          <SelectBox
                            id='country'
                            labelId='country'
                            label="Country"
                            options={countryData || []}
                            value={safeAddress.country}
                            onChange={(e) =>
                              handleShippingAddressChange(index + 1, "country", e.target.value)
                            }
                            keyValue="value"
                            keyId="key"
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
                            value={safeAddress.state}
                            onChange={(e) =>
                              handleShippingAddressChange(index + 1, "state", e.target.value)
                            }
                            keyValue="name"
                            keyId="code"
                          />
                        </div>
                        <div className="w-full">
                          <InputFieldNDL
                            label={"ZIP Code"}
                            placeholder={"Type here"}
                            value={safeAddress.zipCode}
                            error={!safeAddress.isValid.zipCode}
                            helperText={
                              !safeAddress.isValid.zipCode
                                ? "ZIP code must be 5 or 6 digits"
                                : ""
                            }
                            onChange={(e) =>
                              handleShippingAddressChange(index + 1, "zipCode", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="w-fit pt-2">
              <Button
                  id='Add Shipping Address'
                  type={"tertiary"}
                  icon={Plus}
                  value={"Add Shipping Address"}
                  onClick={handleAddShippingAddress}
                />
                </div>
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
                    label="GST Number"
                    inputRef={gstNumberRef}
                    placeholder="Type here"
                    value={gstNumber.value}
                    error={!gstNumber.isValid}
                    helperText={
                      !gstNumber.isValid ? "Invalid GST number format" : "Enter a valid 15-character GST number (e.g., 22AAAAA0000A1Z5)"
                    }
                    onChange={handleGSTNumberChange}
                  />
                </div>
                <div className="w-full">
                  {props.editData && props.editData.gstfilepath && isUsingExistingGSTFile ? (
                    <div className="w-full">
                      <ParagraphText variant="paragraph-xs">GST File<span style={{ color: 'red' }}>*</span></ParagraphText>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                          <DummyImage />
                          <Typography value={props.editData.gstfilepath} variant="lable-01-s" />
                        </div>
                        <div className="flex gap-2">
                          <BlackX onClick={() => {
                            setSelectedGSTFile(null);
                            setIsUsingExistingGSTFile(false);
                          }} />
                        </div>
                      </div>
                      {gstFileError.hasError && (
                        <Typography
                          variant="helper-text-xs"
                          style={{ color: 'red', marginTop: '4px' }}
                        >
                          {gstFileError.message}
                        </Typography>
                      )}
                    </div>
                  ) : (
                    <div className="w-full">
                    <FileInput
                      accept=".jpeg,image/jpeg,.pdf,image/*"
                      multiple={false}
                      label={"GST Document"}
                      onChange={(e) =>
                        handleFileChangeWithKey(e, "gst", setSelectedGSTFile, setIsUsingExistingGSTFile, "GST")
                      }
                      error={fileErrors.gst.hasError}
                      helperText={fileErrors.gst.hasError ? fileErrors.gst.message : "Max 10mb PDF or JPG or PNG"}
                    />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-4 mt-4">
                <div className="w-full">
                  <InputFieldNDL
                    label="Tax Identification Number (TIN)"
                    inputRef={tinRef}
                    placeholder="Type here"
                    value={tin.value}
                    error={!tin.isValid}
                    helperText={!tin.isValid ? "TIN must be numeric" : "Enter your Tax Identification Number (TIN) – numeric only"}
                    onChange={handleTINChange}
                  />
                </div>
                <div className="w-full">
                  {props.editData && props.editData.tinfilepath && isUsingExistingTinFile ? (
                    <div className="w-full">
                      <ParagraphText variant="paragraph-xs">TIN File<span style={{ color: 'red' }}>*</span></ParagraphText>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                          <DummyImage />
                          <Typography value={props.editData.tinfilepath} variant="lable-01-s" />
                        </div>
                        <div className="flex gap-2">
                          <BlackX onClick={() => {
                            setSelectedTinFile(null);
                            setIsUsingExistingTinFile(false);
                          }} />
                        </div>
                      </div>
                      {tinFileError.hasError && (
                        <Typography
                          variant="helper-text-xs"
                          style={{ color: 'red', marginTop: '4px' }}
                        >
                          {tinFileError.message}
                        </Typography>
                      )}
                    </div>
                  ) : (
                    <div className="w-full">
                   <FileInput
                         accept=".jpeg,image/jpeg,.pdf,image/*"
                        multiple={false}
                        label={"TIN Document"}
                        onChange={(e) =>
                          handleFileChangeWithKey(e, "tin", setSelectedTinFile, setIsUsingExistingTinFile, "TIN")
                        }
                        error={fileErrors.tin.hasError}
                        helperText={fileErrors.tin.hasError ? fileErrors.tin.message : "Max 10mb PDF or JPG or PNG"}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <div className="w-full">
                  <InputFieldNDL
                    label="Company PAN"
                    inputRef={panRef}
                    placeholder="Type here"
                    value={pan.value}
                    error={!pan.isValid}
                    helperText={!pan.isValid ? "Invalid PAN format" : "Enter a valid 10-character PAN (e.g., AAAAA1234A)"}
                    onChange={handlePANChange}
                  />
                </div>
                <div className="w-full">
                  {props.editData && props.editData.panfilepath && isUsingExistingPanFile ? (
                    <div className="w-full">
                      <ParagraphText variant="paragraph-xs">PAN File<span style={{ color: 'red' }}>*</span></ParagraphText>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                          <DummyImage />
                          <Typography value={props.editData.panfilepath} variant="lable-01-s" />
                        </div>
                        <div className="flex gap-2">
                          <BlackX onClick={() => {
                            setSelectedPanFile(null);
                            setIsUsingExistingPanFile(false);
                          }} />
                        </div>
                      </div>
                      {panFileError.hasError && (
                        <Typography
                          variant="helper-text-xs"
                          style={{ color: 'red', marginTop: '4px' }}
                        >
                          {panFileError.message}
                        </Typography>
                      )}
                    </div>
                  ) : (
                    <div className="w-full">
                   <FileInput
                         accept=".jpeg,image/jpeg,.pdf,image/*"
                        multiple={false}
                        label={"PAN Document"}
                        onChange={(e) =>
                          handleFileChangeWithKey(e, "pan", setSelectedPanFile, setIsUsingExistingPanFile, "PAN")
                        }
                        error={fileErrors.pan.hasError}
                        helperText={fileErrors.pan.hasError ? fileErrors.pan.message : "Max 10mb PDF or JPG or PNG"}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <div className="w-full">
                  <InputFieldNDL
                    label="Bank Account Number"
                    inputRef={bankRef}
                    placeholder="Type here"
                    value={bankAcc.value}
                    error={!bankAcc.isValid}
                    helperText={!bankAcc.isValid ? "Invalid bank account number" : "Enter a valid account number (e.g., 1234567890123456)"}
                    onChange={handleBankChange}
                  />
                </div>
                <div className="w-full">
                  <InputFieldNDL
                    label="IFSC Code"
                    inputRef={ifscRef}
                    placeholder="HDFC0001234"
                    value={ifsc.value}
                    error={!ifsc.isValid}
                    helperText={!ifsc.isValid ? "Invalid IFSC code" : "Enter a valid 11-character IFSC code (e.g., SBIN0001234)"}
                    onChange={handleIFSCChange}
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <div className="w-full">
                  <SelectBox
                    labelId="Preferred_Currency-label"
                    label="Preferred Currency"
                    id="Preferred_Currency-id"
                    auto={false}
                    multiple={false}
                    options={allCurrencyData && allCurrencyData.length > 0 ? allCurrencyData : []}
                    isMArray={true}
                    checkbox={false}
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    keyValue="value"
                    keyId="key"
                    error={!currency}
                    msg="Select currency"
                  />
                </div>
                <div className="w-full">
                  <SelectBox
                    labelId="Authorized-Signatory-label"
                    label="Authorized Signatory"
                    id="Authorized-Signatory-id"
                    mandatory
                    auto={false}
                    multiple={false}
                    options={allCustomerData && allCustomerData.length > 0 ? allCustomerData : []}
                    isMArray={true}
                    checkbox={false}
                    value={signatory}
                    onChange={(e) => setSignatory(e.target.value)}
                    keyValue="value"
                    keyId="key"
                    error={!signatory}
                    msg="Select signatory"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4" />

            <Typography variant="heading-02-xs"
              value={"Terms and Condition"}
              color={"primary"}
            /> {allPolicyLoading && <CircularProgress size={20} color="primary" />}
            <Typography variant="paragraph-xs"
              value={"Agree to standard business policies and terms for transactions."}
              color={"tertiary"}
            />

            <div className="mt-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {policyOptionsByType["Terms and Conditions"] && (
                <SelectBox
                  label="Agreement Terms"
                  id="agreement-terms-id"
                  auto={false}
                  multiple={false}
                  options={policyOptionsByType["Terms and Conditions"]}
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
                  label="Payment Terms"
                  id="payment-terms-id"
                  auto={false}
                  multiple={false}
                  options={policyOptionsByType["Payment"]}
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
                  label="Warranty Terms"
                  id="warranty-terms-id"
                  auto={false}
                  multiple={false}
                  options={policyOptionsByType["Warranty"]}
                  isMArray={true}
                  checkbox={false}
                  value={selectedWarrantyTerms}
                  onChange={(e) => setSelectedWarrantyTerms(e.target.value)}
                  keyValue="name"
                  keyId="id"
                  error={false}
                  msg=""
                />
              )}

              {policyOptionsByType["Support"] && (
                <SelectBox
                  label="Support Terms"
                  id="support-terms-id"
                  auto={false}
                  multiple={false}
                  options={policyOptionsByType["Support"]}
                  isMArray={true}
                  checkbox={false}
                  value={selectedSupportTerms}
                  onChange={(e) => setSelectedSupportTerms(e.target.value)}
                  keyValue="name"
                  keyId="id"
                  error={false}
                  msg=""
                />
              )}

              {policyOptionsByType["Cancellation"] && (
                <SelectBox
                  label="Cancellation Terms"
                  id="cancellation-terms-id"
                  auto={false}
                  multiple={false}
                  options={policyOptionsByType["Cancellation"]}
                  isMArray={true}
                  checkbox={false}
                  value={selectedCancellationTerms}
                  onChange={(e) => setSelectedCancellationTerms(e.target.value)}
                  keyValue="name"
                  keyId="id"
                  error={false}
                  msg=""
                />
              )}

              {policyOptionsByType["Refund"] && (
                <SelectBox
                  label="Refund Terms"
                  id="refund-terms-id"
                  auto={false}
                  multiple={false}
                  options={policyOptionsByType["Refund"]}
                  isMArray={true}
                  checkbox={false}
                  value={selectedRefundTerms}
                  onChange={(e) => setSelectedRefundTerms(e.target.value)}
                  keyValue="name"
                  keyId="id"
                  error={false}
                  msg=""
                />
              )}

              {policyOptionsByType["Delivery"] && (
                <SelectBox
                  label="Delivery Terms"
                  id="delivery-terms-id"
                  auto={false}
                  multiple={false}
                  options={policyOptionsByType["Delivery"]}
                  isMArray={true}
                  checkbox={false}
                  value={selectedDeliveryTerms}
                  onChange={(e) => setSelectedDeliveryTerms(e.target.value)}
                  keyValue="name"
                  keyId="id"
                  error={false}
                  msg=""
                />
              )}

              {policyOptionsByType["Return"] && (
                <SelectBox
                  label="Return Terms"
                  id="return-terms-id"
                  auto={false}
                  multiple={false}
                  options={policyOptionsByType["Return"]}
                  isMArray={true}
                  checkbox={false}
                  value={selectedReturnTerms}
                  onChange={(e) => setSelectedReturnTerms(e.target.value)}
                  keyValue="name"
                  keyId="id"
                  error={false}
                  msg=""
                />
              )}
            </div>              

            <div className="flex gap-4 mt-4">
              <div className="w-full">
                <InputFieldNDL
                  label="Additional Notes"
                  inputRef={addNotesRef}
                  placeholder="Type here"
                  value={addNotes.value}
                  error={!addNotes.isValid}
                  helperText={!addNotes.isValid ? "Only alphanumeric characters" : ""}
                  onChange={handleAddNotesChange}
                />
              </div>


            </div>




          </React.Fragment>




        </Grid>

      </Grid>
    </React.Fragment>
  );
});

export default AddCustomerForm;
