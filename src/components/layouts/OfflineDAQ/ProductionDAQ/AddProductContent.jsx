import React, {
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from "react";
import ProgressIndicator from "components/Core/ProgressIndicators/ProgressIndicatorNDL";
import { useTranslation } from "react-i18next";
import InputFieldNDL from "components/Core/InputFieldNDL";
import Button from "components/Core/ButtonNDL";
import moment from "moment";
import { selectedPlant, userData } from "recoilStore/atoms";
import { useRecoilState } from "recoil";
import DatePickerNDL from "components/Core/DatepickerNDL";
import ParagraphText from "components/Core/Typography/TypographyNDL";
import ModalContentNDL from "components/Core/ModalNDL/ModalContentNDL";
import ModalFooterNDL from "components/Core/ModalNDL/ModalFooterNDL";
import LoadingScreenNDL from "LoadingScreenNDL";
import AddWorkExecution from "../ProductionHooks/AddWorkExecution";
import UpdateProductExec from "../ProductionHooks/UpdateProductExec";
import useEditProductSpeciExec from "../ProductionHooks/UpdateProductExecForm";
const AddProductionData = React.forwardRef((props, ref) => {
  const { t } = useTranslation();
  const fieldsRef = useRef(null);
  const [, setEditId] = useState("");
  const [headPlant] = useRecoilState(selectedPlant);
  const [dateVal, setDateVal] = useState(new Date());
  const [currUser] = useRecoilState(userData);
  const [editData, setEditData] = useState([]);
  const [error, setError] = useState(false);
  const { AddWorkExcLoading, AddWorkExcData, AddWorkExcError, addWorkExcData } =
    AddWorkExecution();
  const {
    EditProductExecLoading,
    EditProductExecData,
    EditProductExecError,
    getEditProductExec,
  } = UpdateProductExec();
  
  const {
    EditProductSpecExecLoading,
    EditProductSpecError,
    EditProductSpecData,
    getEditProductSpecExec,
  } = useEditProductSpeciExec();

  useImperativeHandle(ref, () => ({
    openEditDialog: (data) => {
      openEditDialog(data);
      setEditData(data);
      setEditId(data.id);
    },
  }));

  const openEditDialog = (data) => {
    setTimeout(() => {
      fieldsRef.current.value = data.info ? data.info.Value : "";
      setDateVal(data.info ? data.info.shitfdate : "");
    }, 200);
  };


  useEffect(() => {
    if (!AddWorkExcLoading && !AddWorkExcError && AddWorkExcData) {
      props.snackBar("success", t("Offline data Added"));
      props.handleCloseDialog();
    }

    if (!AddWorkExcLoading && AddWorkExcError && !AddWorkExcData) {
      props.snackBar("error", t("Offline data update failed"));
      props.handleCloseDialog();
    }
  }, [AddWorkExcData, AddWorkExcLoading]);

  useEffect(() => {
    if (
      !EditProductExecLoading &&
      !EditProductExecError &&
      EditProductExecData
    ) {
      props.snackBar("success", t("Offline data Updated"));
      props.handleCloseDialog();
      props.producExecTableData(headPlant.id);
  
    }
    if (
      !EditProductExecLoading &&
      EditProductExecError &&
      !EditProductExecData
    ) {
      props.snackBar("error", t("Offline data update failed"));
      props.handleCloseDialog();
    }
  }, [EditProductExecData, EditProductExecLoading]);

  useEffect(() => {
    if (
      !EditProductSpecExecLoading &&
      !EditProductSpecError &&
      EditProductSpecData
    ) {
      props.snackBar("success", t("Offline data Value Updated"));
      props.handleCloseDialog();
      props.producExecTableData(headPlant.id);
    }
    if (
      !EditProductSpecExecLoading &&
      EditProductSpecError &&
      !EditProductSpecData
    ) {
      props.snackBar("error", t("Offline data Value update failed"));
      props.handleCloseDialog();
    }
  }, [EditProductSpecData, EditProductSpecExecLoading]);

  const addProductExcut = () => {
    const filterData = props.offlineProductExecData.filter(
      (x) =>
        moment(x.info.shitfdate).format("YYYY-MM-DD") ===
        moment(dateVal).format("YYYY-MM-DD")
    );
    if (filterData.length > 0) {
      const id = filterData[0].id;
      editProductSpecExec(id, filterData[0]);
    } else {
      if (fieldsRef.current.value === "") {
        setError(true);
      } else {
        let startTime = moment(dateVal)
          .startOf("day")
          .format("YYYY-MM-DD HH:mm:ss");
        let endTime = moment(dateVal)
          .endOf("day")
          .format("YYYY-MM-DD HH:mm:ss");
        let queryData = {
          start_dt: startTime,
          end_dt: endTime,
          crea_by: currUser.sgid,
          updated_by: currUser.sgid,
          plant_code: headPlant.id,
          unit: props.currentProduct
            ? props.currentProduct.prod_product
              ? props.currentProduct.prod_product["unit"]
              : ""
            : "",
          production_line_code: "",
          product_id: props.currentProduct.prod_product.product_id,
          id: "",
          entity_id: props.currentProduct.asset_id,
          Product_desc: props.currentProduct
            ? props.currentProduct.prod_product["name"]
            : "",
          order_id:
            "WO_" +
            (props.currentProduct
              ? props.currentProduct.prod_product["name"]
              : ""),
          form_id: props.currentProduct ? props.currentProduct.id : "",
          info: {
            Start_dt: startTime,
            End_dt: endTime,
            Event: "Production",
            Reasons: "NA",
            ReasonId: "0",
            Value: fieldsRef.current ? fieldsRef.current.value : "",
            Shift: "C",
            shitfdate: moment(dateVal).format("YYYY-MM-DD"),
            Family: "Thickness",
          },
        };
        addWorkExcData({ data: queryData });
      }
    }
  };

  const editProductExec = () => {
    const id = editData.id;
    let info = {
      ...editData.info,
      Value: fieldsRef.current ? fieldsRef.current.value : "",
      shitfdate: moment(dateVal).format("YYYY-MM-DD"),
      End_dt: moment(dateVal).endOf("day").format("YYYY-MM-DD HH:mm:ss"),
      start_dt: moment(dateVal).startOf("day").format("YYYY-MM-DD HH:mm:ss"),
    };
    getEditProductExec(id, info);
  };

  const editProductSpecExec = (id, filterData) => {
    let info = {
      ...filterData.info,
      Value: fieldsRef.current ? fieldsRef.current.value : "",
      shitfdate: moment(dateVal).format("YYYY-MM-DD"),
      End_dt: moment(dateVal).endOf("day").format("YYYY-MM-DD HH:mm:ss"),
      start_dt: moment(dateVal).startOf("day").format("YYYY-MM-DD HH:mm:ss"),
    };
    getEditProductSpecExec(id, info);
  };

  const renderButtons = () => {
    if (props.dialoudeMode === "Add Data") {
      return (
        <Button
          type="primary"
          value={t("Save")}
          onClick={addProductExcut}
        />
      );
    } else {
      return (
        <Button
          type="primary"
          value={t("Save")}
          onClick={editProductExec}
        />
      );
    }
  };

  const handleNameChange = () => {
    if (fieldsRef.current.value === "") {
      setError(true);
    } else {
      setError(false);
    }
  };

  return (
    <React.Fragment>
      <ModalContentNDL>
        <InputFieldNDL
          label={t("Value ")}
          type="number"
          placeholder={t("Enter ")}
          inputRef={fieldsRef}
          error={!fieldsRef.current?.value && error ? true : false}
          helperText={
            !fieldsRef.current?.value && error ? t("Enter Product Value") : ""
          }
          onChange={handleNameChange}
        />
    <div className="mb-3"/>
        <React.Fragment>
          <ParagraphText value={t("Date")} variant='paragraph-xs' ></ParagraphText>
          <DatePickerNDL
            id="Date-picker"
            onChange={(dates) => {
              setDateVal(moment(dates).format("YYYY-MM-DDTHH:mm:ss"));
            }}
            startDate={new Date(dateVal)}
            dateFormat={"dd/MM/yyyy"}
            timeFormat="HH:mm:ss"
            showTimeSelect
            maxDate={new Date()}
            disabled={props.formEditExec ? true : false}
          />
        </React.Fragment>
        <div className="mb-3" />
        <ParagraphText value={"Note: Continuing will override the data in the selected range if it was previously added."}  variant={'paragraph-s'} color="danger" />
      </ModalContentNDL>
      {props.AddMetricLoading && (
        <ModalFooterNDL style={{ justifyContent: "center" }}>
          <ProgressIndicator />
        </ModalFooterNDL>
      )}

      <ModalFooterNDL>
        {props.insertLoading || props.editLoading ? (
          <LoadingScreenNDL style={{ width: "100%" }} />
        ) : (
          <React.Fragment>
            <Button
              type="secondary"
              
              value={t("Cancel")}
              onClick={() => props.handleCloseDialog()}
            />
            {renderButtons()}
          </React.Fragment>
        )}
      </ModalFooterNDL>
    </React.Fragment>
  );
});
export default AddProductionData;
