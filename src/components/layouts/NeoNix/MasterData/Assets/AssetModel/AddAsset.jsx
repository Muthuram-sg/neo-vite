import React,{useState,useEffect,useRef,forwardRef,useImperativeHandle} from "react";
import ModelHeaderNDL from "components/Core/ModalNDL/ModalHeaderNDL";
import ModelContentNDL from "components/Core/ModalNDL/ModalContentNDL";
import ModelFooterNDL from "components/Core/ModalNDL/ModalFooterNDL";
import TypographyNDL from "components/Core/Typography/TypographyNDL"; 
import InputFieldNDL from "components/Core/InputFieldNDL";
import {useTranslation} from "react-i18next";
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import Button from "components/Core/ButtonNDL";

import useGetDropDownOptions from "../hooks/useGetDropDownoptions";
import useCreateAssets from "../hooks/useCreateAssets";
import useUpdateAsset from "../hooks/useUpdateAsset";
import { useRecoilState } from "recoil";
import { selectedPlant, snackToggle, snackMessage, snackType, snackDesc  } from "recoilStore/atoms";
import { use } from "i18next";





 const  AddAsset=forwardRef((props,ref)=>{
    const assetIdRef = useRef()
    const assetNameRef = useRef()
    const AssetMakeRef = useRef()
    const AddetModelRef = useRef()
    const assetDescriptionRef = useRef()
    const [assetCategory, setAssetCategory] = useState('')
    const [assetType, setAssetType] = useState('')
    const [validAssetName, setValidAssetName] = useState({isValid: true, value: '', error: ''});
    const [validAssetId, setValidAssetId] = useState({isValid: true, value: '', error: ''});
    const [isvalidModel, setIsValidModel] = useState({isValid: true, value: ''});
    const [isValidMake, setIsValidMake] = useState({isValid: true, value: ''});

    const [, setOpenSnack] = useRecoilState(snackToggle);
        const [, SetMessage] = useRecoilState(snackMessage);
        const [, SetType] = useRecoilState(snackType);
        const [, SetDesc] = useRecoilState(snackDesc);

    const [errorState, setErrorState] = useState({
        assetCategory: '',
        assetType: ''
    });

    const [AssertDropdown, setAssertDropdown] = useState({category: [], type: []});
    const { dropDownOptionsLoading, dropDownOptionsData, dropDownOptionsError, getDropDownOptions} = useGetDropDownOptions();
    const { createAssetsLoading, createAssetsData, createAssetsError, createAssets } = useCreateAssets();
    const { updateAssetLoading, updateAssetData, updateAssetError, updateAsset } = useUpdateAsset();
    const [headPlant] = useRecoilState(selectedPlant);

    const {t} = useTranslation();



    // useImperativeHandle((ref),() => ({
       
    //     editAssetValue: (value) => {
    //         alert("Edit Asset Value")
    //         // console.clear()
    //         console.log("Edit Value", value)
    //         handleSetEditValue(value)
    //     }
    // }))
    useImperativeHandle((ref),()=>({
         
        editAssetValue: (value) => {
            console.log("Edit Value", value)
        }
    }))

    useEffect(() => {
            
            // getDropDownOptions('AssetMaster/GetValueType')
            getDropDownOptions('AssetMaster/GetAssetCate')
        },[headPlant])
    
    useEffect(() => {
        if(assetCategory !== ''){ 
            getDropDownOptions(`AssetMaster/GetAssetType` ,{'assetcate': assetCategory})
        }
    }, [assetCategory])
    
        useEffect(() => {
    
            if(dropDownOptionsData && !dropDownOptionsLoading && !dropDownOptionsError){
                if(dropDownOptionsData.GetAssetType && Array.isArray(dropDownOptionsData.GetAssetType)){
                    setAssertDropdown(prevState => ({
                        ...prevState,
                        assetType: dropDownOptionsData.GetAssetType || []
                    }));
                }
                if(dropDownOptionsData.GetAssetCate  && Array.isArray(dropDownOptionsData.GetAssetCate )){
                    setAssertDropdown(prevState => ({
                        ...prevState,
                        category: dropDownOptionsData.GetAssetCate  || []
                    }));
                }
                if(dropDownOptionsData.GetValueType && Array.isArray(dropDownOptionsData.GetValueType)){
                    setAssertDropdown(prevState => ({
                        ...prevState,
                        valueType: dropDownOptionsData.GetValueType || []
                    }));
                }
    
            }
        },[dropDownOptionsData, dropDownOptionsLoading, dropDownOptionsError])
    
        useEffect(() => {
        // console.log(AssertDropdown,'AssertDropdown')
        },[AssertDropdown]);



const handleSetEditValue = (value) => {
    console.log("Set Edit Value", value)
    if(Object.keys(value).length > 0){
        setTimeout(() => {
            assetIdRef.current.value = value.assetId
            assetNameRef.current.value = value.assetName
            AssetMakeRef.current.value = value.make
            assetDescriptionRef.current.value = value.description
        },500)
        
        setAssetCategory(value.assetCategory)
        setAssetType(value.assetType)

    }
 
}


const handleSelectAssetCategory = (e) => {
    setAssetCategory(e.target.value)
}

const handleSelectAssetType = (e) => {
    setAssetType(e.target.value)
}

const handleAssetIdChange = (e) => {
    const value = e.target.value;

    const isValid =
      /^[a-zA-Z0-9 ]*$/.test(value) && value.trim() !== "" && value.trim() === value
      && value.length <= 50

    setValidAssetId({
      value,
      isValid,
    });
}


const handleAssetNameChange = (e) => {
    const value = e.target.value;

    const isValid =
      /^[a-zA-Z0-9 ]*$/.test(value)  && value.trim() !== "" && value.trim() === value
      && value.length <= 50;

    setValidAssetName({
      value,
      isValid,
    });
}

const validateAsset = (AssetDetils,field) => {
    console.clear()
    console.log(props?.availableAssetId?.includes(AssetDetils.value), "Asset Detils Value")
        if (AssetDetils.value.trim() === "" || !/^[a-zA-Z0-9 ]+$/.test(AssetDetils.value)) {
            return `Enter a valid ${field} containing alphanumeric`;
        }else if (AssetDetils.value !== AssetDetils.value.trim()) {
            return `${field} must contain only letters and numbers`;
        } else if (AssetDetils.value.length > 50) {
            return ` ${field} must be less than 50 characters`;
        } else if ( field === 'Asset ID' && props?.availableAssetId?.includes(AssetDetils.value) ) {
            return `${field} already exists`;
        }
    return "";

}


const validateWithLimitedChars = (AssetDetail, field) => {
    if (AssetDetail.value.trim() === "" || !/^[a-zA-Z0-9\-/. ]+$/.test(AssetDetail.value)) {
        return `Enter a valid ${field} containing alphanumeric`;
    } else if (AssetDetail.value !== AssetDetail.value.trim()) {
        return `${field} must contain only letters and numbers`;
    } else if (AssetDetail.value.length > 50) {
        return `${field} must be less than 50 characters`;
    }
    return "";

}

const AssetTypeOption = [
    { id: "cnc_machine", name: "CNC Machine" },
    { id: "vmc", name: "VMC" },
    { id: "lathe_machine", name: "Lathe Machine" },
    { id: "milling_machine", name: "Milling Machine" },
    { id: "drilling_machine", name: "Drilling Machine" },
    { id: "grinding_machine", name: "Grinding Machine" },
    { id: "injection_molding_machine", name: "Injection Molding Machine" },
    { id: "hydraulic_press", name: "Hydraulic Press" },
    { id: "compressor_unit", name: "Compressor Unit" },
    { id: "conveyor", name: "Conveyor" }
];

const AssetTypeDetails = {
    CNC: [
        { key: "turning", value: "Turning" },
        { key: "facing", value: "Facing" },
        { key: "boring", value: "Boring" },
        { key: "drilling", value: "Drilling" },
        { key: "thread_cutting", value: "Thread Cutting" }
    ],
    VMC: [
        { key: "milling", value: "Milling" },
        { key: "slotting", value: "Slotting" },
        { key: "surface_finishing", value: "Surface Finishing" }
    ],
    LM: [
        { key: "manual_lathe", value: "Manual Lathe" },
        { key: "cnc_lathe", value: "CNC Lathe" },
        { key: "turret_lathe", value: "Turret Lathe" }
    ],
    milling_machine: [
        { key: "vertical", value: "Vertical" },
        { key: "horizontal", value: "Horizontal" },
        { key: "universal", value: "Universal" },
        { key: "planer", value: "Planer" }
    ],
    drilling_machine: [
        { key: "pillar_drill", value: "Pillar Drill" },
        { key: "radial_drill", value: "Radial Drill" },
        { key: "bench_drill", value: "Bench Drill" }
    ],
    grinding_machine: [
        { key: "surface", value: "Surface" },
        { key: "cylindrical", value: "Cylindrical" },
        { key: "centerless", value: "Centerless" },
        { key: "tool_cutter", value: "Tool & Cutter" }
    ],
    injection_molding_machine: [
        { key: "horizontal_injection", value: "Horizontal Injection" },
        { key: "vertical_injection", value: "Vertical Injection" }
    ],
    hydraulic_press: [
        { key: "c_frame", value: "C-Frame" },
        { key: "h_frame", value: "H-Frame" },
        { key: "four_column_press", value: "Four Column Press" }
    ],
    compressor_unit: [
        { key: "screw_type", value: "Screw Type" },
        { key: "reciprocating", value: "Reciprocating" },
        { key: "centrifugal", value: "Centrifugal" }
    ],
    conveyor: [
        { key: "belt_conveyor", value: "Belt Conveyor" },
        { key: "roller_conveyor", value: "Roller Conveyor" },
        { key: "chain_conveyor", value: "Chain Conveyor" }
    ]
};


useEffect(() => {
    // console.clear()
    // console.log(AssertDropdown, props.editData.asset_cate, AssertDropdown?.category?.filter(item => item.value === props.editData.asset_cate),'AssertDropdown?.assetType?.filter(item => item.key === props.editData.asset_type)')
    //  getDropDownOptions(`AssetMaster/GetAssetType` ,{'assetcate': assetCategory})
    if (!assetType && props.editData?.asset_id !== undefined && props.editData?.asset_id !== null && props.editData?.asset_id !== "") {
        assetIdRef.current.value = props.editData.asset_id;
        assetNameRef.current.value = props.editData.asset_name;
        setAssetType(AssertDropdown?.assetType?.filter(item => item.value === props.editData.asset_type)[0]?.key);
        setAssetCategory(AssertDropdown?.category?.filter(item => item.value === props.editData.asset_cate)[0]?.key);
        AssetMakeRef.current.value = props.editData.make;
        AddetModelRef.current.value = props.editData.model;
        assetDescriptionRef.current.value = props.editData.asset_desc;
    }
}, [props.editData, AssertDropdown]);


const validateValues = (assetId, assetName, assetCategory, assetType) => {
    if(!assetId || assetId.trim() === "") {
        console.error("Asset ID is required.");
        return false;
    }
    return true;
}

const validateData = (assetId, assetName, make, model) => {
    let isValid = true
    console.clear()
    console.log(props.availableAssetId, "Available Asset Ids")
    console.log(assetId, "Asset Id")
    if (!assetId || assetId.trim() === "" || (!props?.editData && props.availableAssetId.includes(assetId))) {
        setValidAssetId({ ...validAssetId, isValid: false });
        isValid = false;
    }
    if (!assetName || assetName.trim() === "" || assetName.trim() !== assetName) {
        setValidAssetName({ ...validAssetName, isValid: false });
        isValid = false;
    }
    if(make !== '' && !/^[a-zA-Z0-9\-/. ]+$/.test(make)) {
        setIsValidMake({ ...isValidMake, isValid: false });
        isValid = false;
    }
    if(model !== '' && !/^[a-zA-Z0-9\-/. ]+$/.test(model)) {
        setIsValidModel({ ...isvalidModel, isValid: false });
        isValid = false;
    }
    if (!assetCategory) {
        console.error("Asset Category is required.");
        setErrorState((prevState) => ({
            ...prevState,
            assetCategory: 'Please select asset category'
        }));
        isValid = false;
    }

    if (!assetType) {
        console.error("Asset Type is required.");
        setErrorState((prevState) => ({
            ...prevState,
            assetType: 'Please select asset type'
        }));
        isValid = false;
    }
    return isValid;
}



const handleSubmit = () => {
    const assetId = assetIdRef.current?.value?.trim() || "";
    const assetName = assetNameRef.current?.value?.trim() || "";
    const make = AssetMakeRef.current?.value?.trim() || "";
    const model = AddetModelRef.current?.value?.trim() || "";
    const description = assetDescriptionRef.current?.value?.trim() || "";

    // if (assetId === "" || assetId === null || assetId === undefined) {
    //     setValidAssetId({ ...validAssetId, isValid: false });
    //     return false;
    // }
    // if(assetName === "" || assetName === null || assetName === undefined){
    //     setValidAssetName({ ...validAssetName, isValid: false });
    //     return false;
    // }
    // if (!assetCategory) {
    //     console.error("Asset Category is required.");
    //     setErrorState((prevState) => ({
    //         ...prevState,
    //         assetCategory: 'Please select asset category'
    //     }));
    //     return false;
    // }

    // if (!assetType) {
    //     console.error("Asset Type is required.");
    //     setErrorState((prevState) => ({
    //         ...prevState,
    //         assetType: 'Please select asset type'
    //     }));
    //     return false;
    // }

    let isValid = validateData(assetId, assetName, make, model);
    if (isValid) {


    const assetData = {
        asset_id: assetId,
        asset_name: assetName,
        make: make,
        model: model,
        asset_desc: description,
        asset_cate: assetCategory,
        asset_type: assetType,
        ap_code: '',
        "is_deleted": false,
        "is_params_save": true,
    };

    if (props.dialogMode === 'create') {
        // Call API to create new asset
        console.log("Creating new asset:", assetData);
        createAssets({ header: assetData, assetItems: []})
    } else {
        // Call API to update existing asset
        console.log("Updating existing asset:", assetData);
        updateAsset({ header: assetData, assetItems: [] })
    }
    props.handleDialogClose();
}
}

 useEffect(() => {
            // con/sole.clear()
            console.log("Create Asset Data", createAssetsData)
            if(createAssetsData === 'Created Successfully '){
                console.log("Asset created successfully:", createAssetsData);
                setOpenSnack(true)
                SetMessage("New Asset Created")
                SetType("success")
                SetDesc("Asset has been successfully created")
            } 
            
            console.log("Update Asset Data", updateAssetData)
            if(updateAssetData === 'Updated Successfully '){
                console.log("Asset updated successfully:", updateAssetData);
                setOpenSnack(true)
                SetMessage("Asset Updated")
                SetType("success")
                SetDesc("Asset has been successfully updated")
         }
}, [createAssetsData, updateAssetData]);



const handleMakeChange = (e) => {
    const value = e.target.value;

    const isValid =
      /^[a-zA-Z0-9\-/. ]+$/.test(value)
      && value.length <= 50;

    setIsValidMake({
      value,
      isValid,
    });
}

const handleModelChange = (e) => {
    const value = e.target.value;

    const isValid =
      /^[a-zA-Z0-9\-/. ]+$/.test(value)
      && value.length <= 50;

    setIsValidModel({
      value,
      isValid,
    });
}
    return(
        <React.Fragment>
            <ModelHeaderNDL>
                 <TypographyNDL  variant="heading-02-xs" color="primary" model value={"Add Asset"}/>
                </ModelHeaderNDL>
                <ModelContentNDL>
                    <div className="mb-3">
                    <InputFieldNDL
                        id={"asset-id"}
                        label={t("Asset ID")}
                        placeholder={t("Asset ID")}
                        inputRef={assetIdRef}
                        mandatory={true}
                        error={validAssetId && !validAssetId.isValid}
                        helperText={validateAsset(validAssetId,"Asset ID")}
                        onChange={handleAssetIdChange}
                        disabled={props.dialogMode === 'edit' }

                    />
                    </div>
                    <div className="mb-3">
                    <InputFieldNDL
                        id={"asset-Name"}
                        label={t("Asset Name")}
                        placeholder={t("Asset Name")}
                        inputRef={assetNameRef}
                        mandatory={true}
                        error={validAssetName && !validAssetName.isValid}
                        helperText={validateAsset(validAssetName,"Asset Name")}
                        onChange={handleAssetNameChange}
                    />
                    </div>
                    <div className="mb-3">
                    <SelectBox
                    id="AssetCategory"
                    label={t("Asset Category")}
                    // isSearch={true}
                    mandatory={true}
                    placeholder={t("Select asset Category")}
                    options={AssertDropdown?.category || []}
                    keyValue={"value"}
                    keyId={"key"}
                    multiple={false}
                    error={errorState.assetCategory !== ''}
                    msg={'Please select asset category'}
                    onChange={handleSelectAssetCategory}
                    // onChange={(e) => setValueState((prevState) => ({ ...prevState, assetCategory: e.target.value }))} 
                    value={assetCategory}
                />
                    </div>
                    <div className="mb-3">
                    <SelectBox
                    id="AssetType"
                    label={t("Asset Type")}
                    mandatory={true}
                    placeholder={t("Select Asset Type")}
                    options={AssertDropdown?.assetType || []}
                    keyValue={"value"}
                    keyId={"key"}
                    multiple={false}
                    error={errorState.assetType !== ''}
                    msg={'Please select asset type'}
                    onChange={handleSelectAssetType}
                    value={assetType}
                />
                    </div>
                    <div className="mb-3">
                    <InputFieldNDL
                        id={"make"}
                        label={t("Make")}
                        placeholder={t("Type Make")}
                        inputRef={AssetMakeRef}
                        error={isValidMake && !isValidMake.isValid}
                        onChange={handleMakeChange}
                        helperText={validateWithLimitedChars(isValidMake, "Make")}
                    />
                    </div>
                    <div className="mb-3">
                    <InputFieldNDL
                        id={"Model"}
                        label={t("Model")}
                        placeholder={t("Type Model")}
                        inputRef={AddetModelRef}
                        error={isvalidModel && !isvalidModel.isValid}
                        helperText={validateWithLimitedChars(isvalidModel, "Model")}
                        onChange={handleModelChange}
                    />
                    </div>
                    <div className="mb-3">
                    <InputFieldNDL
                        id={"Description"}
                        label={t("Description")}
                        placeholder={t("Type Description")}
                        inputRef={assetDescriptionRef}
                    />
                    </div>
                </ModelContentNDL>
                <ModelFooterNDL>
                       <Button value={t('Cancel')} type='secondary'  onClick={() => {props.handleDialogClose()}} />
                       <Button value={props.dialogMode === 'create' ?   "Save"    : "Update"} type="primary"  style={{ marginLeft: 8 }} onClick={() => {handleSubmit()}}/>
                </ModelFooterNDL>
        
        </React.Fragment>
    )
})


export default AddAsset;