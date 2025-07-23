import React, { useImperativeHandle, useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import ModalHeaderNDL from "components/Core/ModalNDL/ModalHeaderNDL";
import ModalContentNDL from "components/Core/ModalNDL/ModalContentNDL";
import ModalFooterNDL from "components/Core/ModalNDL/ModalFooterNDL";
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import Button from "components/Core/ButtonNDL";
import InputFieldNDL from "components/Core/InputFieldNDL";
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import {
  selectedPlant,
  userData,
  snackToggle,
  snackMessage,
  snackType,
  oeeAssets,
} from "recoilStore/atoms";
import useProductUnit from "Hooks/useGetProductUnit";
import { useRecoilState } from "recoil";
import useEntityAssetList from "../ProductionHooks/GetOeeBasedAssetList";
import useProductsList from "../ProductionHooks/GetProducts";
import useInsertProductForm from "../ProductionHooks/AddProctsForm";
import useEditProduct from "../ProductionHooks/updateProductForm";

const AddProductionData = React.forwardRef((props, ref) => {
  const { t } = useTranslation();
  const [headPlant] = useRecoilState(selectedPlant);
  const [oeeAssetsArray] = useRecoilState(oeeAssets);
  const [currUser] = useRecoilState(userData);
  const [, SetMessage] = useRecoilState(snackMessage);
  const [, setOpenSnack] = useRecoilState(snackToggle);
  const [assetType, setAssetType] = useState("");
  const [editId, setEditId] = useState("");
  const [frequency, SetFreqency] = useState("");
  const [product, setProduct] = useState("");
  const [unitVal, setUnitVal] = useState("");
  const [unitName, setUnitName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [entityError, setEntityError] = useState(false);
  const [productError, setProductError] = useState(false);
  const [frequencyError, setFrequencyError] = useState(false);
  const [edit, setEdit] = useState(false);
  const formNameRef = useRef(null);
  const frequencyOption = [{ id: 1, name: "Daily" }];
  const {
    EntityAssetListLoading,//NOSONAR
    EntityAssetListData,//NOSONAR
    EntityAsseListError,//NOSONAR
    getEntityAssetList,
  } = useEntityAssetList();
  const { productsLoading, getProductData, productsError, getProducts } =
    useProductsList();

  const {
    InsertProdctFormLoading,
    InsertProductFormData,
    InsertProductFormError,
    getInsertProductForm,
  } = useInsertProductForm();
  const {
    EditProductLoading,
    EditProductData,
    EditProductError,
    getEditProduct,
  } = useEditProduct();
  const {
    ProductUnitsLoading,//NOSONAR
    ProductUnitsData,
    ProductUnitsError,//NOSONAR
    getProductUnit,
  } = useProductUnit();

  useImperativeHandle(ref, () => ({
    handleEditEnitytDialogOpen: (data) => {
      handleEditEnitytDialogOpen(data);
      setEditId(data.id);
    },
  }));

  const handleEditEnitytDialogOpen = (data) => {
    setEdit(true);
    formNameRef.current.value = data.form_name;
    setAssetType(data.asset_id);
    setProduct(data.product_id);
    setUnitVal(
      data.prod_product
        ? data.prod_product.metric_unit
          ? data.prod_product.metric_unit["unit"]
          : ""
        : ""
    );
    SetFreqency(data.frequency);
  };

  useEffect(() => {
    getEntityAssetList(headPlant.id);
    getProducts(headPlant.id);
    getProductUnit();
  }, [headPlant.id]);

  const handleEntityNameChange = (e) => setAssetType(e.target.value);
  const handleFreqChange = (e) => SetFreqency(e.target.value);

  const handleProductChange = (e, getProductData) => {
    const inputValue = e.target.value;
    const filtered = getProductData.filter((x) => x.id === inputValue);
    if (filtered && filtered.length > 0) {
      setUnitVal(
        filtered[0]["expected_energy_unit"]
          ? filtered[0]["expected_energy_unit"]
          : ""
      );

      let unit = [];
      if (filtered[0]["expected_energy_unit"]) {
        unit = ProductUnitsData.filter(
          (x) => x.id === filtered[0]["expected_energy_unit"]
        );
      }
      setUnitName(unit.length > 0 ? unit[0].unit : "");
      setProduct(filtered[0]["id"]);
    } else {
      setUnitVal("");
      setProduct("");
      setUnitName("");
    }
  };

  useEffect(() => {
    if (
      !InsertProdctFormLoading &&
      !InsertProductFormError &&
      InsertProductFormData
    ) {
      if (InsertProductFormData === 1) {
        SetMessage(t("Added a new product "));
        setOpenSnack(true);
        props.handleCloseDialog();
        props.offLineTableData(headPlant.id);
      } else {
        SetMessage(t("Failed to add a product "));
        setOpenSnack(true);
        props.handleCloseDialog();
      }
    }
  }, [InsertProdctFormLoading, InsertProductFormError, InsertProductFormData]);

  useEffect(() => {
    if (!EditProductLoading && !EditProductError && EditProductData) {
      if (EditProductData === 1) {
        SetMessage(t("Updated a Product Name"));
        setOpenSnack(true);
        props.handleCloseDialog();
        props.offLineTableData(headPlant.id);
      } else {
        SetMessage(t("Failed to add a product "));
        setOpenSnack(true);
        props.handleCloseDialog();
      }
    }
  }, [EditProductLoading, EditProductError, EditProductData]);

  const handleSaveForm = () => {
    if (!formNameRef.current.value) {
      setNameError(true);
      return;
    }
    if (!assetType) {
      setEntityError(true);
      return;
    }
    if (!product) {
      setProductError(true);
      return;
    }
    if (!frequency) {
      setFrequencyError(true);
      return;
    }
    if (props.dialoudeMode === "New Form") {
      const body = {
        form_name: formNameRef.current.value,
        asset_id: assetType,
        product_id: product,
        frequency: frequency,
        created_by: currUser.id,
        updated_by: currUser.id,
        line_id: headPlant.id,
        isdelete: false,
      };
      getInsertProductForm(body);
    } else {
      const id = editId;
      const userId = currUser.id;
      const formName = formNameRef.current ? formNameRef.current.value : "";
      getEditProduct(id, userId, formName);
    }
  };

  const handleNameChange = () => {
    if (formNameRef.current.value === "") {
      setNameError(true);
    } else {
      setNameError(false);
    }
  };

  const getbuttonText = () => {
    let btn;
    if (props.dialoudeMode === "New Form") {
      btn = props.dialoudeMode === "New Form" && t("Create");
    } else {
      btn = props.dialoudeMode === "Edit Form" && t("Update");
    }
    return btn;
  };

  return (
    <React.Fragment>
      <ModalHeaderNDL>
        <TypographyNDL variant="heading-02-xs" value={t(props.dialoudeMode)} />
        {/* <TypographyNDL variant="paragraph-xs" color='tertiary'
          value={t(
            "Input and save information for a new product into the application"
          )}
        /> */}
      </ModalHeaderNDL>
      <ModalContentNDL>
        <InputFieldNDL
          label={t("Form Name")}
          inputRef={formNameRef}
          placeholder={t("Production 1")}
          error={!formNameRef.current?.value && nameError ? true : false}
          helperText={
            !formNameRef.current?.value && nameError ? t("Enter Form Name") : ""
          }
          onChange={handleNameChange}
        />
        <div className="mb-3"/>
        <SelectBox
          labelId="entity-type-label"
          label={t("Asset")}
          id="select-asset-type"
          auto={false}
          multiple={false}
          disabled={props.dialoudeMode === "Edit Form" && true}
          options={
            oeeAssetsArray.length > 0
              ? oeeAssetsArray.map((x) => ({
                  id: x.entity.id,
                  name: x.entity.name,
                }))
              : []
          }
          isMArray={true}
          checkbox={false}
          value={assetType}
          onChange={handleEntityNameChange}
          keyValue="name"
          keyId="id"
          error={!assetType && entityError ? true : false}
          msg={t("PlsSelectEntity")}
        />
        <div className="mb-3"/>

        <SelectBox
          labelId="entity-type-label"
          label={t("Product")}
          id="select-product-type"
          auto={false}
          disabled={props.dialoudeMode === "Edit Form" && true}
          multiple={false}
          options={
            !productsLoading &&
            !productsError &&
            getProductData &&
            getProductData.length > 0
              ? getProductData
              : []
          }
          isMArray={true}
          checkbox={false}
          value={product}
          onChange={(e) => handleProductChange(e, getProductData)}
          keyValue="name"
          keyId="id"
          error={!product && productError ? true : false}
          msg={t("PlsSelectEntity")}
        />
        <div className="mb-3"/>

        <InputFieldNDL
          label={t("Unit")}
          placeholder={t("Unit")}
          type='text'
          disabled={true}
          value={edit ? unitVal : unitName}
        />
        <div className="mb-3"/>

        <SelectBox
          labelId="entity-type-label"
          label={t("Frequency")}
          id="select-frequency-type"
          disabled={props.dialoudeMode === "Edit Form" && true}
          auto={false}
          multiple={false}
          options={frequencyOption}
          isMArray={true}
          checkbox={false}
          value={frequency}
          onChange={handleFreqChange}
          keyValue="name"
          keyId="id"
          error={!frequency && frequencyError ? true : false}
          msg={t("PlsSelectEntity")}
        />
        <div className="mb-3"/>

      </ModalContentNDL>
      <ModalFooterNDL>
        <Button
          value={t("Cancel")}
          type={"secondary"}
          onClick={props.handleCloseDialog}
        />
        <Button
          value={getbuttonText()}
          onClick={handleSaveForm}
        />
      </ModalFooterNDL>
    </React.Fragment>
  );
});
export default AddProductionData;
