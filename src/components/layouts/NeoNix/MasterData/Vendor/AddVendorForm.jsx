
import React, { useState, useRef,useEffect } from 'react';
import Grid from 'components/Core/GridNDL';
import InputFieldNDL from "components/Core/InputFieldNDL";
import SelectBox from "components/Core/DropdownList/DropdownListNDL"
import Typography from "components/Core/Typography/TypographyNDL";
import HorizontalLine from "components/Core/HorizontalLine/HorizontalLineNDL";
import CustomSwitch from "components/Core/CustomSwitch/CustomSwitchNDL";
import useTheme from 'TailwindTheme';
import { useRecoilState } from 'recoil';
import { themeMode } from 'recoilStore/atoms';
import FileInput from 'components/Core/FileInput/FileInputNDL';
import ShippingAddressManager from '../ShippingAddressManager';
import Button from 'components/Core/ButtonNDL';
import Plus from 'assets/neo_icons/Menu/plus.svg?react';








export default function AddVendorForm() {
    const EntityNameRef = useRef();
    const ShippingAddressLine2Ref = useRef();
    const [selectedValue, setSelectedValue] = useState("");
    const [shippingAddressLine1, setShippingAddressLine1] = useState({ value: "", isValid: true });
    const [sameAdd, setsameAdd] = useState(false);
    const [addressLine2, setAddressLine2] = useState({ value: "", isValid: true });
    const [previews, setPreviews] = useState([]);
    const [shippingAddressLine2, setShippingAddressLine2] = useState({ value: "", isValid: true });
    const ShippingAddLine2Ref = useRef();
    const [isFileSizeError, setisFileSizeError] = useState({ type: null, value: false })
    const [entityName, setEntityName] = useState({ value: "", isValid: true });
    const [docType, setdocType] = useState(null)
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [addLine1, setAddLine1] = useState({ value: "", isValid: true });
    const [addLine2, setAddLine2] = useState({ value: "", isValid: true });
    const [cityName, setCityName] = useState({ value: "", isValid: true });
    const [shippingAddLine1, setShippingAddLine1] = useState({ value: "", isValid: true });
    const [addressData, setAddressData] = useState([]);
    const [files, setFiles] = useState({ file1: null, file2: [], file3: { sop: [], warranty: [], user_manuals: [], others: [] } });

    const [isDuplicateError, setIsDuplicateError] = useState(false);
    const [shippingAddLine2, setShippingAddLine2] = useState({ value: "", isValid: true });
     const [shippingAddresses, setShippingAddresses] = useState([
        {
          addressLine1: { value: "", isValid: true },
          addressLine2: { value: "", isValid: true },
          city: { value: "", isValid: true },
          zipCode: { value: "", isValid: true },
          country: "",
          state: "",
          isSameAsBilling: false,
        },
    
      ]);

    const theme = useTheme()
    const gstNumberRef = useRef(null);
    const ShippingAddressLine1Ref = useRef();
    const ShippingZipRef = useRef();
    const addressLine1Ref = useRef(null);
    const addressLine2Ref = useRef(null);
    const ShippingCityRef = useRef();
    const zipCodeRef = useRef(null);
    const ShippingAddLine1Ref = useRef();
    const cityRef = useRef(null);
    const tinRef = useRef(null);
    const panRef = useRef(null);
    const bankRef = useRef(null);
    const ifscRef = useRef(null);
    const signatoryRef = useRef(null);
    const paymentTermsRef = useRef(null); // NEW: Payment Terms

    const [curTheme] = useRecoilState(themeMode)
    const [gstNumber, setGSTNumber] = useState({ value: "", isValid: true });
    const [zipCode, setZipCode] = useState({ value: "", isValid: true });
    const [tin, setTIN] = useState({ value: "", isValid: true });
    const [pan, setPAN] = useState({ value: "", isValid: true });
    const [addressLine1, setAddressLine1] = useState({ value: "", isValid: true });
    const [shippingCity, setShippingCity] = useState({ value: "", isValid: true });
    const [addresses, setAddresses] = useState([]);
    const [shippingZip, setShippingZip] = useState({ value: "", isValid: true });
    const [bankAcc, setBankAcc] = useState({ value: "", isValid: true });
    const [ifsc, setIFSC] = useState({ value: "", isValid: true });
    const [city, setCity] = useState({ value: "", isValid: true });
    const [signatory, setSignatory] = useState({ value: "", isValid: true });
    const [paymentTerms, setPaymentTerms] = useState({ value: "", isValid: true }); // NEW

    const borderStyle = curTheme === 'dark' ? '2px dashed #2a2a2a' : '2px dashed #e8e8e8';
    const classes = {
        root: {
            "& .MuiInputBase-root": {
                fontSize: 16,
                lineHeight: "24px",
                backgroundColor: theme.palette.background.default,
                color: theme.palette.secondaryText.main
            },
            "& .MuiOutlinedInput-notchedOutline": {
                border: 0
            },
            "& .MuiGrid-item": {
                padding: 4
            },
        },
        imageField: {
            border: borderStyle,
            borderRadius: '6px',
            textAlign: 'center',
            padding: '16px'
        }
    }
    const [policyList, setPolicyList] = useState([
        { terms: '', returnPolicy: '' }
    ]);
    
    const handleAddressLine2Change = (e) => {
        const value = e.target.value;
        const isValid = value.trim() !== "";
        setAddressLine2({ value, isValid });
      };
    
    const handleAddressLine1Change = (e) => {
        const value = e.target.value;
        const isValid = value.trim() !== "";
        setAddressLine1({ value, isValid });
      };

    const handleShippingZipChange  = (event) => {
        const value = event.target.value;
        const { isValid, message } = validateCompanyName(value);
    
        setShippingZip({ value, isValid, message });
    }; 

    const handleshippingCityChange = (event) => {
        const value = event.target.value;
        const { isValid, message } = validateCompanyName(value);
      
        setShippingCity({ value, isValid, message });
      }; 

      const handleCityChange = (e) => {
        const value = e.target.value;
        const isValid = /^[a-zA-Z\s]+$/.test(value) && value.length <= 50;
        setCity({ value, isValid });
      };

      const handleZipCodeChange = (e) => {
        const input = e.target.value;
    
        // Only allow digits (0-9) while typing
        if (/^\d*$/.test(input)) {
          const isValid = input.length >= 4 && input.length <= 10;
          setZipCode({ value: input, isValid });
        }
      };

      const handleShippingAddressLine1Change = (event) => {
  const value = event.target.value;
  const { isValid, message } = validateCompanyName(value);

  setShippingAddressLine1({ value, isValid, message });
}; 

    const handleShippingAddLine2Change = (event) => {
        const value = event.target.value;
        const { isValid, message } = validateCompanyName(value);
      
        setShippingAddLine2({ value, isValid, message });
      }; 
      
     
    const handleAddShippingAddress = () => {
        setAddresses((prev) => [...prev, { id: prev.length + 1 }]);
      };

      const handleShippingAddressLine2Change = (event) => {
        const value = event.target.value;
        const { isValid, message } = validateCompanyName(value);
      
        setShippingAddressLine2({ value, isValid, message });
      }; 

    const handleAddPolicy = () => {
        setPolicyList([...policyList, { terms: '', returnPolicy: '' }]);
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
    const handleshippingAddLine1Change = (event) => {
        const value = event.target.value;
        const { isValid, message } = validateCompanyName(value);
      
        setShippingAddLine1({ value, isValid, message });
      }; 

    const handleSameAdd = (e) => {
           setsameAdd(!sameAdd)
         }
   
           useEffect(()=>{
                if(sameAdd){
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
              },[sameAdd, addLine1, addLine2, cityName,zipCode ])
          


    const handleSelectChange = (index, type, value) => {
        const updated = [...policyList];
        updated[index][type] = value;
        setPolicyList(updated);
    };

    // Defining a list of industry options for the "Business Type" dropdown
    const industryOptions = [
        { id: 1, name: "Technology" },
        { id: 2, name: "Healthcare" },
        { id: 3, name: "Finance" },
        { id: 4, name: "Education" },
        { id: 5, name: "Retail" }
    ];

    const handleAddressChange = (data) => {
        setAddressData(data); // You can store or submit this as needed
        console.log("Updated Addresses:", data);
    };
    const handleGSTNumberChange = (e) => {
        const value = e.target.value;
        setGSTNumber({
            value,
            isValid: /^[a-zA-Z0-9]{1,15}$/.test(value),
        });
    };

    const handleTINChange = (e) => {
        const value = e.target.value;
        setTIN({
            value,
            isValid: /^[a-zA-Z0-9]+$/.test(value),
        });
    };

    const handlePANChange = (e) => {
        const value = e.target.value;
        setPAN({
            value,
            isValid: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value),
        });
    };

    const handleBankChange = (e) => {
        const value = e.target.value;
        setBankAcc({
            value,
            isValid: /^[0-9]{8,20}$/.test(value),
        });
    };

    const handleIFSCChange = (e) => {
        const value = e.target.value;
        setIFSC({
            value,
            isValid: /^[A-Z]{4}0[A-Z0-9]{6}$/.test(value),
        });
    };


    const handleSignatoryChange = (e) => {
        const value = e.target.value;
        setSignatory({
            value,
            isValid: /^[a-zA-Z0-9\s]*$/.test(value),
        });
    };

    const handlePaymentTermsChange = (value) => {
        setPaymentTerms({
            value,
            isValid: value !== "",
        });
    };

    const handleFileChange = (e, file) => {
        const selectedFiles = e.target.files;
        const previewSelectedFile = Array.from(e.target.files);
        // Create preview URLs for each file

        let fileArr = [];

        for (const file of selectedFiles) {
            if (file.size > 10485760) {
                fileArr.push(file.size);
            }
        }

        if (fileArr.length > 0) {
            setisFileSizeError({ type: file, value: true });
            return;
        } else {
            setisFileSizeError({ type: null, value: false });
        }

        const modifiedFiles = Array.from(selectedFiles).map(file => {
            const originalFileName = file.name;
            const lastDotIndex = originalFileName.lastIndexOf('.');
            const namePart = lastDotIndex === -1 ? originalFileName : originalFileName.substring(0, lastDotIndex);
            const extension = originalFileName.substring(lastDotIndex);
            const newFileName = namePart + "~" + docType + extension;
            return new File([file], newFileName, { type: file.type });
        });
        const duplicateFiles = modifiedFiles.filter(file => uploadedFiles.includes(file.name));

        if (duplicateFiles.length > 0) {
            setIsDuplicateError(true);
            return;
        } else {
            setIsDuplicateError(false);
        }

        if (file === 'file1') {
            setFiles({
                ...files,
                [file]: selectedFiles[0],
            });
        } else if (file === 'file2') {
            const previewUrls = [...files.file2, ...previewSelectedFile].map((file) => URL.createObjectURL(file));
            setPreviews(previewUrls);
            setFiles({
                ...files,
                file2: [...files.file2, ...selectedFiles],
            });
        } else if (file === 'file3') {
            setFiles(prevFiles => ({
                ...prevFiles,
                file3: {
                    ...prevFiles.file3,
                    [docType]: [...prevFiles.file3[docType], ...modifiedFiles],
                },
            }));
        }
        setUploadedFiles(prevFiles => [...prevFiles, ...modifiedFiles.map(file => file.name)]);
    };



    // Function to handle changes in the selected value of the dropdown
    const handleChange = (e) => {
        // Updates the selected value state with the value from the dropdown
        setSelectedValue(e.target.value);
    };

    // Function to handle changes in the entity name (for vendor/company names)
    const handleEntityNameChange = (event) => {
        if (event.target.value !== "")
            setEntityName({ value: event.target.value, isValid: true })
        else
            setEntityName({ value: "", isValid: false })
    }

    // JSX return statement for the component's rendering
    return (
        <React.Fragment>
            <Grid container>
                {/* Empty grid section for layout */}
                <Grid xs={2}></Grid>
                <Grid xs={8}>
                    {/* Displaying a heading for the section */}
                    <Typography variant="heading-02-xs"
                        value={"Basic Info"}
                        color={"primary"}
                    />
                    {/* Displaying a subheading for additional explanation */}
                    <Typography variant="paragraph-xs"
                        value={"Capture essential details to identify the vendor and their business."}
                        color={"tertiary"}
                    />

                    {/* Space for layout */}
                    <div className="flex gap-4 mt-4">
                        <div className="w-full">
                            <InputFieldNDL
                                label={"Primary Contact Person"}
                                inputRef={EntityNameRef}
                                placeholder={"Type here"}
                                error={!entityName.isValid}
                                helperText={
                                    !entityName.isValid && entityName.value.toString() === ""
                                        ? "TypeEntityName"
                                        : ""
                                }
                                onChange={handleEntityNameChange}
                            />
                        </div>

                        <div className="w-full">
                            <InputFieldNDL
                                label={"Designation"}
                                inputRef={EntityNameRef}
                                placeholder={"Type here"}
                                error={!entityName.isValid}
                                helperText={
                                    !entityName.isValid && entityName.value.toString() === ""
                                        ? "TypeEntityName"
                                        : ""
                                }
                                onChange={handleEntityNameChange}
                            />
                        </div>
                    </div>

                    {/* Email and Contact Number fields */}
                    <div className="flex gap-4 mt-4">
                        <div className="w-full">
                            <SelectBox
                                labelId="Industry-type-label"
                                label="State"
                                id="Industry-type-id"
                                auto={false}
                                multiple={false}
                                options={[]}
                                isMArray={true}
                                checkbox={false}
                                value={selectedValue} // Selected value
                                onChange={handleChange} // Function to handle change event
                                keyValue="name"
                                keyId="id"
                                error={false}
                                msg="" // Error message
                            />
                        </div>

                        <div className="w-full">
                            <SelectBox
                                labelId="Industry-type-label"
                                label="State"
                                id="Industry-type-id"
                                auto={false}
                                multiple={false}
                                options={[]}
                                isMArray={true}
                                checkbox={false}
                                value={selectedValue} // Selected value
                                onChange={handleChange} // Function to handle change event
                                keyValue="name"
                                keyId="id"
                                error={false}
                                msg="" // Error message
                            />
                        </div>
                    </div>

                    {/* Alternative Contact Person and their Contact Number fields */}
                    {/* Alternative Contact Person and their Contact Number fields */}
                    <div className="flex gap-4 mt-4">
                        <div className="w-full">
                            <SelectBox
                                labelId="Industry-type-label"
                                label="State"
                                id="Industry-type-id"
                                auto={false}
                                multiple={false}
                                options={[]}
                                isMArray={true}
                                checkbox={false}
                                value={selectedValue}
                                onChange={handleChange}
                                keyValue="name"
                                keyId="id"
                                error={false}
                                msg=""
                            />
                        </div>

                        {/* Add an empty div to maintain layout */}
                        <div className="w-full"></div>
                    </div>


                    <div className="mt-4" />

                    {/* Layout divider */}
                    <div className="mt-4" />
                    <HorizontalLine variant='divider1' />
                    <div className="mt-4" />

                    {/* Contact Information heading */}
                    <Typography
                        variant={"heading-02-xs"}
                        value={'Contact Information'}
                        color={"primary"}
                    />
                    {/* Contact information subheading */}
                    <Typography
                        variant={"paragraph-xs"}
                        value={'Provide contact details for communication and correspondence.'}
                        color={"tertiary"}
                    />

                    {/* Contact Person and Designation fields */}
                    <div className="flex gap-4 mt-4">
                        <div className="w-full">
                            <InputFieldNDL
                                label={"Primary Contact Person"}
                                inputRef={EntityNameRef}
                                placeholder={"Type here"}
                                error={!entityName.isValid}
                                helperText={
                                    !entityName.isValid && entityName.value.toString() === ""
                                        ? "TypeEntityName"
                                        : ""
                                }
                                onChange={handleEntityNameChange}
                            />
                        </div>

                        <div className="w-full">
                            <InputFieldNDL
                                label={"Designation"}
                                inputRef={EntityNameRef}
                                placeholder={"Type here"}
                                error={!entityName.isValid}
                                helperText={
                                    !entityName.isValid && entityName.value.toString() === ""
                                        ? "TypeEntityName"
                                        : ""
                                }
                                onChange={handleEntityNameChange}
                            />
                        </div>
                    </div>

                    {/* Email and Contact Number fields */}
                    <div className="flex gap-4 mt-4">
                        <div className="w-full">
                            <InputFieldNDL
                                label={"Email"}
                                inputRef={EntityNameRef}
                                placeholder={"Type here"}
                                error={!entityName.isValid}
                                helperText={
                                    !entityName.isValid && entityName.value.toString() === ""
                                        ? "TypeEntityName"
                                        : ""
                                }
                                onChange={handleEntityNameChange}
                            />
                        </div>

                        <div className="w-full">
                            <InputFieldNDL
                                label={"Contact Number"}
                                inputRef={EntityNameRef}
                                placeholder={"Type here"}
                                error={!entityName.isValid}
                                helperText={
                                    !entityName.isValid && entityName.value.toString() === ""
                                        ? "TypeEntityName"
                                        : ""
                                }
                                onChange={handleEntityNameChange}
                            />
                        </div>
                    </div>

                    {/* Alternative Contact Person and their Contact Number fields */}
                    <div className="flex gap-4 mt-4">
                        <div className="w-full">
                            <InputFieldNDL
                                label={"Alternative Contact Person"}
                                inputRef={EntityNameRef}
                                placeholder={"Type here"}
                                error={!entityName.isValid}
                                helperText={
                                    !entityName.isValid && entityName.value.toString() === ""
                                        ? "TypeEntityName"
                                        : ""
                                }
                                onChange={handleEntityNameChange}
                            />
                        </div>

                        <div className="w-full">
                            <InputFieldNDL
                                label={"Contact Number"}
                                inputRef={EntityNameRef}
                                placeholder={"Type here"}
                                error={!entityName.isValid} // Shows error if invalid
                                helperText={ // Displays error message if input is empty
                                    !entityName.isValid && entityName.value.toString() === ""
                                        ? "TypeEntityName"
                                        : ""
                                }
                                onChange={handleEntityNameChange} // Calls handleEntityNameChange on input change
                            />
                        </div>
                    </div>

                    <div className="mt-4" />

                    {/* Heading for Address Details */}
                    <Typography
                        variant={"heading-02-xs"}
                        value={'Address Details'}
                        color={"primary"}
                    />

                    {/* Description for Address Details */}
                    <Typography
                        variant={"paragraph-xs"}
                        value={'Record the billing and office addresses for invoicing and official communication.'}
                        color={"tertiary"}
                    />
                    {/* Margin */}
                    <div className="mt-4" />

                    {/* Grid Layout for Address Input Fields */}

                  <div className="mt-4" />
                    {/* Input field for company name */}
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
                    />
        
                    <div className="mt-4" />
                    {/* Input field for company name */}
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
                    />
        
        
                    {/* City and ZIP Fields */}
                    <div className="flex gap-4 mt-4">
                      <div className="w-full">
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
                        />
        
                      </div>
        
                      <div className="w-full">
                        <SelectBox
                          label="Country"
                          options={[]} // Add your country options here
                          value={selectedValue}
                          onChange={handleChange}
                          error={false}
                          msg=""
                        />
                      </div>
                    </div>
        
                    {/* State and Country Select Fields */}
                    <div className="flex gap-4 mt-4">
                      <div className="w-full">
                        <SelectBox
                          label="State"
                          options={[]} // Add your state options here
                          value={selectedValue}
                          onChange={handleChange}
                          error={false}
                          msg=""
                        />
                      </div>
        
                      <div className="w-full">
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
                                              inputRef={ShippingAddLine1Ref}
                                              placeholder={"Type here"}
                                              error={!shippingAddLine1.isValid}
                                              helperText={!shippingAddLine1.isValid && shippingAddLine1.value.toString() === "" ? "Type Address Line 1" : ""}
                                              onChange={handleshippingAddLine1Change}
                                          />
                  
                                          <div className="mt-4" />
                                          <InputFieldNDL
                                              label={"Address Line 2"}
                                              inputRef={ShippingAddLine2Ref}
                                              placeholder={"Type here"}
                                              error={!shippingAddLine2.isValid}
                                              helperText={!shippingAddLine2.isValid && shippingAddLine2.value.toString() === "" ? "Type Address Line 2" : ""}
                                              onChange={handleShippingAddLine2Change}
                                          />
                  
                                          <div className="flex gap-4 mt-4">
                                              <div className="w-full">
                                                  <InputFieldNDL
                                                      label={"City"}
                                                      inputRef={ShippingCityRef}
                                                      placeholder={"Type here"}
                                                      error={!shippingCity.isValid}
                                                      helperText={
                                                          !shippingCity.isValid && shippingCity.value.toString() === ""
                                                              ? "Type City"
                                                              : ""
                                                      }
                                                      onChange={handleshippingCityChange}
                                                  />
                                              </div>
                  
                                              <div className="w-full">
                                                  <SelectBox
                                                      label="Country"
                                                      options={[]}
                                                      value={selectedValue}
                                                      onChange={handleChange}
                                                      error={false}
                                                      msg=""
                                                  />
                                              </div>
                                          </div>
                  
                                          <div className="flex gap-4 mt-4">
                                              <div className="w-full">
                                                  <SelectBox
                                                      label="State"
                                                      options={[]}
                                                      value={selectedValue}
                                                      onChange={handleChange}
                                                      error={false}
                                                      msg=""
                                                  />
                                              </div>
                  
                                              <div className="w-full">
                                                  <InputFieldNDL
                                                      label={"ZIP Code"}
                                                      inputRef={ShippingZipRef}
                                                      placeholder={"Type here"}
                                                      error={!shippingZip.isValid}
                                                      helperText={
                                                          !shippingZip.isValid && shippingZip.value.toString() === ""
                                                              ? "Type ZIP Code"
                                                              : ""
                                                      }
                                                      onChange={handleShippingZipChange}
                                                  />
                                              </div>
                                          </div>
                                      
                                          <div>
                                              {addresses.map((address, index) => (
                                                  <div key={address.id} className="mb-6 rounded-lg">
                                                  <div className="mt-4" />
                                                  <Typography
                                                      variant={"label-o1-s"}
                                                      value={`Shipping Address ${index + 2}`} 
                                                      color={"primary"}
                                                  />
                  
                                                  <div className="mt-4" />
                                                  <InputFieldNDL
                                                      label={"Address Line 1"}
                                                      inputRef={ShippingAddressLine1Ref}
                                                      placeholder={"Type here"}
                                                      error={!shippingAddressLine1.isValid}
                                                      helperText={!shippingAddressLine1.isValid && shippingAddressLine1.value.toString() === "" ? "Type Shipping Address Line 1" : ""}
                                                      onChange={handleShippingAddressLine1Change}
                                                  />
                  
                                                  <div className="mt-4" />
                                                  <InputFieldNDL
                                                      label={"Address Line 2"}
                                                      inputRef={ShippingAddressLine2Ref}
                                                      placeholder={"Type here"}
                                                      error={!shippingAddressLine2.isValid}
                                                      helperText={!shippingAddressLine2.isValid && shippingAddressLine2.value.toString() === "" ? "Type Shipping Address Line 2" : ""}
                                                      onChange={handleShippingAddressLine2Change}
                                                  />
                  
                                                  <div className="flex gap-4 mt-4">
                                                      <div className="w-full">
                                                      <InputFieldNDL
                                                          label={"City"}
                                                          inputRef={EntityNameRef}
                                                          placeholder={"Type here"}
                                                          error={!entityName.isValid}
                                                          helperText={!entityName.isValid && entityName.value.toString() === "" ? "TypeEntityName" : ""}
                                                          onChange={handleEntityNameChange}
                                                      />
                                                      </div>
                  
                                                      <div className="w-full">
                                                      <SelectBox
                                                          label="Country"
                                                          options={[]}
                                                          value={selectedValue}
                                                          onChange={handleChange}
                                                          error={false}
                                                          msg=""
                                                      />
                                                      </div>
                                                  </div>
                  
                                                  <div className="flex gap-4 mt-4">
                                                      <div className="w-full flex flex-col gap-2">
                                                      <SelectBox
                                                          label="State"
                                                          options={[]}
                                                          value={selectedValue}
                                                          onChange={handleChange}
                                                          error={false}
                                                          msg=""
                                                      />
                                                      </div>
                  
                                                      <div className="w-full">
                                                      <InputFieldNDL
                                                          label={"ZIP Code"}
                                                          inputRef={EntityNameRef}
                                                          placeholder={"Type here"}
                                                          error={!entityName.isValid}
                                                          helperText={!entityName.isValid && entityName.value.toString() === "" ? "TypeEntityName" : ""}
                                                          onChange={handleEntityNameChange}
                                                      />
                                                      </div>
                                                  </div>
                                                  </div>
                                              ))}
                  
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
                                          
        
        
        
        
        



                    {/* Margin Top */}
                    <div className="mt-4" />

                    {/* Heading for Financial Details */}
                    <Typography
                        variant={"heading-02-xs"}
                        value={'Financial Details'}
                        color={"primary"}
                    />

                    {/* Description for Financial Details */}
                    <Typography
                        variant={"paragraph-xs"}
                        value={'Record the financial information for billing and tax purposes.'}
                        color={"tertiary"}
                    />

                    {/* Flex Layout for GST, TIN, Account Number, and IFSC Code */}
                    <div className="flex gap-4 mt-4">
                        <div className="w-full">
                            <InputFieldNDL
                                label="GST Number"
                                inputRef={gstNumberRef}
                                placeholder="Type here"
                                value={gstNumber.value}
                                error={!gstNumber.isValid}
                                helperText={
                                    !gstNumber.isValid ? "Only alphanumeric, max 15 characters" : ""
                                }
                                onChange={handleGSTNumberChange}
                            />

                        </div>

                        <div className="w-full">
                            <div className="w-full">
                                <FileInput
                                    accept="image/*"
                                    multiple={false}
                                    onChange={(e) => handleFileChange(e, 'file1', 'Certificate of Incorporation')}
                                    onClose={(val, index, e) => val.type ? console.log(index, e) : console.log(index, val)}
                                />
                                <div className="mt-0.5" />
                                <Typography color='tertiary' variant="paragraph-xs" value={'Max 10mb JPG or PNG'} />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4 mt-4">
                        <div className="w-full">
                            <InputFieldNDL
                                label="Tax Identification Number (TIN) *"
                                inputRef={tinRef}
                                placeholder="Type here"
                                value={tin.value}
                                error={!tin.isValid}
                                helperText={!tin.isValid ? "Only alphanumeric allowed" : ""}
                                onChange={handleTINChange}
                            />
                        </div>

                        <div className="w-full">
                            <div className="w-full">
                                <FileInput
                                    accept="image/*"
                                    multiple={false}
                                    onChange={(e) => handleFileChange(e, 'file1', 'Certificate of Incorporation')}
                                    onClose={(val, index, e) => val.type ? console.log(index, e) : console.log(index, val)}
                                />
                                <div className="mt-0.5" />
                                <Typography color='tertiary' variant="paragraph-xs" value={'Max 10mb JPG or PNG'} />
                            </div>
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
                                helperText={!pan.isValid ? "Format: ABCDE1234F" : ""}
                                onChange={handlePANChange}
                            />
                        </div>

                        <div className="w-full">
                            <FileInput
                                accept="image/*"
                                multiple={false}
                                onChange={(e) => handleFileChange(e, 'file1', 'Certificate of Incorporation')}
                                onClose={(val, index, e) => val.type ? console.log(index, e) : console.log(index, val)}
                            />
                            <div className="mt-0.5" />
                            <Typography color='tertiary' variant="paragraph-xs" value={'Max 10mb JPG or PNG'} />
                        </div>
                    </div>

                    {/* Bank and Currency Fields */}
                    <div className="flex gap-4 mt-4">
                        <div className="w-full">
                            <InputFieldNDL
                                label="Bank Account Number"
                                inputRef={bankRef}
                                placeholder="Type here"
                                value={bankAcc.value}
                                error={!bankAcc.isValid}
                                helperText={!bankAcc.isValid ? "8 to 20 digits only" : ""}
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
                                helperText={!ifsc.isValid ? "11-character IFSC (e.g., HDFC0001234)" : ""}
                                onChange={handleIFSCChange}
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 mt-4">
                        {/* Preferred Currency */}
                        <div className="w-full">
                            <InputFieldNDL
                                label="Preferred Currency"
                                inputRef={EntityNameRef}
                                placeholder="Type here"
                                error={!entityName.isValid}
                                helperText={
                                    !entityName.isValid && entityName.value.toString() === ""
                                        ? "TypeEntityName"
                                        : ""
                                }
                                onChange={handleEntityNameChange}
                            />

                            {/* Authorized Signatory SelectBox under Preferred Currency */}
                            <div className="mt-4">
                                <SelectBox
                                    label="Authorized Signatory"
                                    placeholder="Select"
                                    options={[]} // you need to define this array
                                    value={signatory.value}
                                    inputRef={signatoryRef}
                                    onChange={handleSignatoryChange}
                                    error={!signatory.isValid}
                                    helperText={!signatory.isValid ? "Only alphanumeric characters" : ""}
                                />
                            </div>
                        </div>

                        {/* Payment Terms SelectBox (replaces old Authorized Signatory input) */}
                        <div className="w-full">
                            <SelectBox
                                label="Payment Terms"
                                placeholder="Select"
                                options={[]} // you need to define this array
                                value={paymentTerms.value}
                                inputRef={paymentTermsRef}
                                onChange={[]}
                                error={!paymentTerms.isValid}
                                helperText={!paymentTerms.isValid ? "Please select a valid option" : ""}
                            />
                        </div>
                    </div>

                    {/* Margin Top */}
                    <div className="mt-4" />

                    {/* Heading for Terms and Conditions */}
                    <Typography
                        variant={"heading-02-xs"}
                        value={'Policies'}
                        color={"primary"}
                    />

                    {/* Description for Terms and Conditions */}
                    <Typography
                        variant={"paragraph-xs"}
                        value={'Agree to standard business policies and terms for transactions.'}
                        color={"tertiary"}
                    />



{policyList.map((policy, index) => (
  <div key={index} className="w-full mb-6">
    <div className="w-1/2 mt-4">
      <SelectBox
        labelId={`Terms-${index}`}
        label="Terms and Condition"
        id={`Terms-${index}`}
        auto={false}
        multiple={false}
        options={[]} // Add your opti
        isMArray={true}
        checkbox={false}
        value={policy.terms}
        onChange={(val) => handleSelectChange(index, 'terms', val)}
        keyValue="name"
        keyId="id"
        error={false}
        msg=""
      />
    </div>

    <div className="w-1/2 mt-4">
      <SelectBox
        labelId={`Return-${index}`}
        label="Return Policy"
        id={`Return-${index}`}
        auto={false}
        multiple={false}
        options={[]} // Add your options
        isMArray={true}
        checkbox={false}
        value={policy.returnPolicy}
        onChange={(val) => handleSelectChange(index, 'returnPolicy', val)}
        keyValue="name"
        keyId="id"
        error={false}
        msg=""
      />
    </div>
  </div>
))}


            <div className="w-fit pt-2">
                <Button
                    id="Add Policy"
                    type="tertiary"
                    icon={Plus}
                    value="Add Policy"
                    onClick={handleAddPolicy}
                />
            </div>


                    {/* Margin */}
                    <div className='mb-4' />

                    {/* Grid for Additional Notes */}
                    <Grid container spacing={4}>
                        <Grid item lg={6} sm={6}>
                            {/* Additional Notes Input Field */}
                            <InputFieldNDL
                                id="ins-freq-val"
                                label={'Additional Notes'}
                                onBlur={{}}
                                inputRef={[]}
                                multiline={true}
                                maxRows={2}
                                onChange={{}}
                                placeholder={'typeDescription'}
                                error={[]}
                                helperText={[]}
                            />
                        </Grid>
                    </Grid>

                    {/* Margin */}
                    <div className="mt-4" />





                </Grid>

            </Grid>
        </React.Fragment>
    );
};
