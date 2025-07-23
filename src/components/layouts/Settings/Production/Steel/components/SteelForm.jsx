import React, { useState, useEffect } from "react";
import Grid from 'components/Core/GridNDL'
import { useTranslation } from 'react-i18next';
import InputFieldNDL from "components/Core/InputFieldNDL";
import Card from "components/Core/KPICards/KpiCardsNDL";
import HorizontalLine from "components/Core/HorizontalLine/HorizontalLineNDL";
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import { useRecoilState } from "recoil";
import { themeMode,selectedPlant } from "recoilStore/atoms";
import Button from 'components/Core/ButtonNDL'; 
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import useGetSteelAssets from "../hooks/useGetSteelAssets";
import useGetSteelProducts from "../hooks/useGetSteelProducts";
import useGetSteelAssetProductCount from "../hooks/useGetSteelAssetProductCount";
import ListNDL from 'components/Core/DropdownList/ListNDL.jsx';
import Plus from 'assets/plus.svg?react';
import Delete from 'assets/neo_icons/Menu/ActionDelete.svg?react';
import Link from 'components/Core/LinkNDL';
import SwitchCustom from "components/Core/CustomSwitch/CustomSwitchNDL";
/** Drag and Drop */
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DraggableIcon } from "./DraggableIcon"; 

const SteelForm = React.forwardRef((props, ref) => {
    const { t } = useTranslation();
    const [headPlant] = useRecoilState(selectedPlant);
    const [curTheme] = useRecoilState(themeMode);
    const CustomTextField = InputFieldNDL;
    const [selectedAsset, setSelectedAsset] = useState({ value: "", isValid: true });
    const [selectedProduct, setSelectedProduct] = useState({ value: "", isValid: true });
    const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
    const [isEdit, setEditData] = useState(false);
    
    //Dynamic Form Fields
    let formFieldJSON = {
        "FieldName": "",
        "FieldType": "",
        "FieldOptions":  [],
        "isValid": true,
        "isAutoPopulate": false
    }
    const [dynamicForm, setDynamicform] = useState({value:[],isValid:true});
 
    //Hooks
    const { SteelAssetListLoading, SteelAssetListData, SteelAssetListError, getSteelAssetList } = useGetSteelAssets();
    const {  SteelProductLoading, SteelProductData, SteelProductError,getSteelProduct } = useGetSteelProducts();
    const {  SteelAssetProductCount, getSteelAssetProductCount } = useGetSteelAssetProductCount();

    const handleAsset = (event) => {
        setSelectedAsset({ value: event.target.value, isValid: true });
        getSteelAssetProductCount(event.target.value,selectedProduct.value);
        setConfigValues();
    }

    const handleProduct = (event) => {
        setSelectedProduct({ value: event.target.value, isValid: true });
        getSteelAssetProductCount(selectedAsset.value,event.target.value);
        setConfigValues();
    }



    const reasonOption=[
        {id:'Dropdown',name:t('Dropdown')},
        {id:'TextInput',name:t('Text Input')},
        {id:'NumberInput',name:t('Number Input')},
        
    ]
    const menuItemClick = (value) => {
        let fieldJSON = formFieldJSON;
        fieldJSON.FieldType = value;
        if(value === "Dropdown")
            fieldJSON.FieldOptions = [
                "",
                ""
            ];
        var fields = dynamicForm.value;
        fields.push(fieldJSON);
        setDynamicform({value:fields,isValid:true});
     
        setNotificationAnchorEl(null)
    }
     
    const handleClick = (event) => {
        setNotificationAnchorEl(event.currentTarget);
    };

    const handleAddOption = (index) => {
        let fields = dynamicForm.value;
        fields[index].FieldOptions.push("");
        setDynamicform({value:fields,isValid:true});
        setConfigValues();
        props.validateFormFields(true);
    }

    const handleDeleteOption = (fIndex,oIndex) => {
        let fields = dynamicForm.value;
        fields[fIndex].FieldOptions.splice(oIndex,1);
        setDynamicform({value:fields,isValid:true});
        setConfigValues();
        props.validateFormFields(false);
    }

    const handleDeleteField = (index) => {
        let fields = dynamicForm.value;
        fields.splice(index,1);
        setDynamicform({value:fields,isValid:true});
        setConfigValues();
        props.validateFormFields(false);
    }

    function validateFieldNames(name,index){//Validate unique Field name
        let setelement = dynamicForm.value;
        const found = setelement.filter(el => String(el.FieldName) === String(name));
        return found.length > 1;
        
    }

    const handleFieldNameChange = (e,index) => {
        let fields = dynamicForm.value;
        fields[index].FieldName = e.target.value;
        let isRepeat = validateFieldNames(e.target.value,index)
        props.validateFormFields(isRepeat);
        if(isRepeat)
            fields[index].isValid = false;
        else
            fields[index].isValid = true;
        if(e.target.value !== ""){
            if(isRepeat)
                setDynamicform({value:fields,isValid:false});
            else
                setDynamicform({value:fields,isValid:true});
        }
        else
            setDynamicform({value:fields,isValid:false});
        setConfigValues();
    }

    const handleFieldOptionChange = (e,index,oIndex) => {
        let fields = dynamicForm.value;
        fields[index].FieldOptions[oIndex] = e.target.value;
        if(e.target.value !== "")
            setDynamicform({value:fields,isValid:true});
        else
            setDynamicform({value:fields,isValid:false});
        setConfigValues();
        props.validateFormFields(false);
    }

    const setConfigValues = () => {
        if(isEdit){
            let dataUpdated = props.data;
            dataUpdated.entity_id = selectedAsset.value;
            dataUpdated.steel_product_id = selectedProduct.value;
            dataUpdated.form_layout = JSON.stringify(dynamicForm.value);
            props.editSteelAssetCofig(dataUpdated);
        }
        else{
            props.addSteelAssetCofig({
                "entity_id": selectedAsset.value,
                "product_id": selectedProduct.value,
                "form_layout": JSON.stringify(dynamicForm.value)
            });
        }
    }

    function handleCheck(e, index) {
        let fields = dynamicForm.value;
        fields[index].isAutoPopulate = e.target.checked;
        setDynamicform({value:fields,isValid:dynamicForm.isValid});
        setConfigValues();
        props.validateFormFields(false);
    }

    useEffect(() => {
        getSteelAssetList(headPlant.id)
        getSteelProduct()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant])

    useEffect(() => {
        if(Object.keys(props.data).length > 0){
            var data = JSON.parse(props.data.form_layout);
            var updatedData = [];
            data.forEach((elt,index) => {
                let isRepeat = validateFieldNames(elt.FieldName,index)
                if(isRepeat){
                    elt.isValid = false;
                    props.validateFormFields(isRepeat);
                }
                else
                    elt.isValid = true
                updatedData.push(elt)
            });
            setDynamicform({value:updatedData, isValid:true});
            props.editSteelAssetCofig(props.data);
         
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.data])


    useEffect(() => {
        if(props.editForm !== undefined)
            setEditData(props.editForm);
        if(props.editForm){
            setSelectedAsset({ value: props.data.entity_id, isValid: true });
            setSelectedProduct({ value: props.data.steel_product_id, isValid: true })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.editForm])


    
    // let optionsForSelectBox;

    //     if (!SteelAssetListLoading && !SteelAssetListError && SteelAssetListData) {
    //         optionsForSelectBox = SteelAssetListData;
    //     } else {
    //         optionsForSelectBox = [];
    //     }
    let errorValue;

        if (SteelAssetProductCount > 0) {
            errorValue = true;
        } else {
            errorValue = false;
        }   
        let msg;

        if (SteelAssetProductCount > 0) {
            msg = "Form for this Asset & Product combo already exists!";
        } else {
            msg = "false";  
        }   

    let disabled;
       if(SteelAssetProductCount){
        disabled=true;
       }    
       else{
        disabled=false;
       }

       function optionsForProduct(){
            if (!SteelProductLoading && !SteelProductError && SteelProductData) {
                return SteelProductData
            }else{
                return []
            }
       }

        //    Drag & Drop
        const moveCard = (dragIndex, hoverIndex) => {
            // console.log(dragIndex, hoverIndex)
            let fromIndex = dragIndex;
            let toIndex = hoverIndex;

            let arr = dynamicForm.value;
            let isValid = dynamicForm.isValid;
            const element = arr.splice(fromIndex, 1)[0];
            arr.splice(toIndex, 0, element);
            // console.log(arr);
            setDynamicform({value:arr,isValid:isValid});
            setConfigValues();
            props.validateFormFields(false);
        }

    return (
        
        <div className="py-4 bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark">
            <Grid container>
                <Grid item lg={3} sm={3}>
                </Grid>
                <Grid item lg={6} sm={6} style={{height: "100%", width: "100%" }}>
                    <Card>
                        <div style={{paddingBottom: "16px"}} >
                            <TypographyNDL  variant="heading-02-s" value={t('Data Entry Form')}/>           
                        </div>
                        {Object.keys(props.data).length > 0 && !isEdit ? 
                            <div>
                                <div>
                                    <TypographyNDL style={{paddingBottom:"10px"}} variant="label-02-s" value={t('Asset')}/>
                                    <TypographyNDL  style={{color:"#525252", paddingBottom:"10px"}} variant="lable-01-s" value={t(props.data.entity.name)}/>
                                    <HorizontalLine variant="divider1" style={{margin:"15px 0 15px"}} />
                                </div>
                                <div>
                                    <TypographyNDL style={{paddingBottom:"10px"}} variant="label-02-s" value={t('product')}/>
                                    <TypographyNDL  style={{color:"#525252",paddingBottom:"10px"}} variant="lable-01-s" value={t(props.data.steel_product.name)}/>
                                    <HorizontalLine variant="divider1" style={{margin:"15px 0 15px"}} />
                                </div>
                            </div>
                            :
                            <div>
                                <SelectBox
                                    id="asset-id"
                                    label={t('Asset')}
                                    edit={true}
                                    disableCloseOnSelect={true}
                                    auto={false}
                                    options={!SteelAssetListLoading &&  SteelAssetListData &&  !SteelAssetListError && SteelAssetListData.length > 0 ? SteelAssetListData : []}
                                    isMArray={true}
                                    keyValue={"name"}
                                    keyId={"id"}
                                    multiple={false}
                                    onChange={(e, option) => handleAsset(e)}
                                    value={selectedAsset.value}
                                />
                                <SelectBox
                                    id="product-id"
                                    label={t('Products')}
                                    edit={true}
                                    disableCloseOnSelect={true}
                                    auto={false}
                                    options={optionsForProduct()}
                                    isMArray={true}
                                    keyValue={"name"}
                                    keyId={"id"}
                                    multiple={false}
                                    onChange={(e, option) => handleProduct(e)}
                                    value={selectedProduct.value}
                                    error={errorValue}
                                    msg = {msg}
                                />    
                                <div className="py-4">
                                    <HorizontalLine variant="divider1" />
                                </div>
                            </div>
                        }
                        {Object.keys(props.data).length > 0 && !isEdit ?  
                            dynamicForm.value.map((field,fIndex) => (
                             <div>
                                 <div style={{paddingBottom: "16px"}} >
                                    <TypographyNDL  variant="label-02-s" style={{paddingBottom:"10px"}} value={t(field.FieldName)}/>
                                    {field.FieldType === "Dropdown" ?
                                        field.FieldOptions.map((option,oIndex) => (
                                            <TypographyNDL style={{color:"#525252",paddingBottom:"10px"}} variant="lable-01-s" value={t(option)}/>
                                        ))
                                        :
                                        <TypographyNDL style={{ color: curTheme === 'light' ? "#363636B8" : "#8F8F8F",paddingBottom:"10px" }} variant="lable-01-s" value={t('Type here')}/>
                                    }
                                    <HorizontalLine variant="divider1" style={{margin:"15px 0 15px"}} />
                                </div>
                             </div>
                            ))
                            :
                            <DndProvider backend={HTML5Backend}>
                                <div>
                                {
                                    dynamicForm.value.length > 0 && 
                                    dynamicForm.value.map((field,fIndex) => (
                                    <div style={{marginTop:"20px"}}>
                                        <Grid container>
                                            <Grid item xs={12} style={{textAlign:"center"}}>
                                                <DraggableIcon 
                                                    key={fIndex+1}
                                                    index={fIndex}
                                                    id={fIndex+1}
                                                    moveCard={moveCard}
                                                />
                                            </Grid>
                                            <Grid item xs={11}>
                                                <InputFieldNDL
                                                    label={t('Field Name')}
                                                    placeholder={t("Enter Field Name")}
                                                    style={{width: '90%'}}
                                                    error={!field.isValid}
                                                    helperText={!field.isValid && "Please change the field name "}
                                                    onChange={(e) => handleFieldNameChange(e, fIndex)}
                                                    value={field.FieldName}
                                                />
                                            </Grid>
                                            <Grid item xs={1} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <Button type="ghost" danger icon={Delete} stroke={"#FF0D00"} style={{ marginTop: "15px" }} onClick={() => handleDeleteField(fIndex)} />
                                            </Grid>
                                            {field.FieldType !== "Dropdown" && 
                                                <Grid item xs={12}>
                                                    <SwitchCustom 
                                                        switch={false}
                                                        checked={field.isAutoPopulate}
                                                        onChange={(e) => handleCheck(e, fIndex)}
                                                        primaryLabel={'Autocomplete using previous entry'}
                                                    />
                                                </Grid>
                                            }
                                        </Grid>
                                        {field.FieldType === "Dropdown" &&
                                            <>
                                                {field.FieldOptions.map((option,oIndex) => (
                                                    <Grid container>
                                                        <Grid item xs={8}>
                                                            <CustomTextField
                                                                placeholder={t("Option "+(oIndex+1))}
                                                                style={{margin: "12px 0 12px",width: '90%'}}
                                                                size="small"
                                                                variant="outlined"
                                                                onChange={(e) => handleFieldOptionChange(e, fIndex, oIndex)}
                                                                value={option}
                                                            />
                                                        </Grid>
                                                        {field.FieldOptions.length !== 1 && 
                                                            <Grid item xs={1} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                                <Button type="ghost" danger icon={Delete} stroke={"#FF0D00"} style={{ marginTop: "15px" }} onClick={() => handleDeleteOption(fIndex,oIndex)} />
                                                            </Grid>}
                                                    </Grid>
                                                ))}
                                                <Grid container>
                                                    <Grid item xs={12}>
                                                        <Link text="Add Option +" onClick={() => handleAddOption(fIndex)}/> <br/>
                                                    </Grid>
                                                </Grid>
                                            </>
                                        }
                                        {field.FieldType !== "Dropdown" &&
                                            <div>
                                                <CustomTextField
                                                    disabled = {true}
                                                    placeholder={t("Enter here")}
                                                    style={{margin: "12px 0 12px",width: '60%'}}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </div>
                                        }
                                        <div className="py-4">
                                            <HorizontalLine variant="divider1" />
                                        </div>
                                    </div>
                                    ))
                                }
                                </div>
                            </DndProvider>
                        }
                        
                        {dynamicForm.value.length === 0 && 
                            <div style={{ textAlign: "center" }}>
                                {/* <Infoicon /> */}
                                <TypographyNDL style={{ color: curTheme === 'light' ? "#363636B8" : "#8F8F8F" }}> {t('Create and Customize the form, This will appear in the Production Dashboard')}</TypographyNDL>
                            </div>
                        }

                        {Object.keys(props.data).length > 0 && !isEdit ? <></>  :
                            <div className="flex justify-end p-3">
                                <Button type="tertiary"  value={t("Add Field")}
                                    onClick={handleClick}
                                    disabled = {disabled}
                                    icon={Plus} />
                                <ListNDL
                                    options={reasonOption}
                                    Open={notificationAnchorEl}
                                    optionChange={menuItemClick}
                                    keyValue={"name"}
                                    keyId={"id"}
                                    id={"popper-reason-add"}
                                    onclose={() => { setNotificationAnchorEl(null) }}
                                    anchorEl={notificationAnchorEl}
                                    // width="140px"
                                />
                            </div>
                        }
                    </Card>
                </Grid>
                <Grid item lg={3} sm={3}>
                </Grid>
            </Grid>
        </div>

    );
});


export default SteelForm;

