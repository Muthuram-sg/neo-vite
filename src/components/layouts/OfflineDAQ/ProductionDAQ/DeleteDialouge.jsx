import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import Button from "components/Core/ButtonNDL";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import {
  snackToggle,
  snackMessage,
  snackType,
  selectedPlant,
} from "recoilStore/atoms";
import useDeleteProductReport from "components/layouts/OfflineDAQ/ProductionHooks/DeleteProductsFormData";
import ModalNDL from "components/Core/ModalNDL";
import ModalHeaderNDL from "components/Core/ModalNDL/ModalHeaderNDL";
import ModalContentNDL from "components/Core/ModalNDL/ModalContentNDL";
import ModalFooterNDL from "components/Core/ModalNDL/ModalFooterNDL";
import TypographyNDL from "components/Core/Typography/TypographyNDL";

const DeleteConfirmDialog = forwardRef((props, ref) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [headPlant] = useRecoilState(selectedPlant);
  const [productID, setProductID] = useState("");
  const [, SetMessage] = useRecoilState(snackMessage);
  const [, SetType] = useRecoilState(snackType);
  const [, setOpenSnack] = useRecoilState(snackToggle);
  const { t } = useTranslation();

  const {
    DeleteProductDataLoading,
    DeleteProductDataData,
    DeleteProductDataError,
    getDeleteProductData,
  } = useDeleteProductReport();

  useImperativeHandle(ref, () => ({
    openDialog: (value) => {
      setOpenDialog(true);
      setProductID(value.id);
    },
  }));

  useEffect(() => {
    if (
      !DeleteProductDataLoading &&
      DeleteProductDataData &&
      !DeleteProductDataError
    ) {
      SetMessage(t("Production FormData Deleted"));
      setOpenSnack(true);
      setOpenDialog(false);
      props.offLineTableData(headPlant.id);
    }
    if (
      DeleteProductDataLoading &&
      !DeleteProductDataData &&
      DeleteProductDataError
    ) {
      SetMessage(t("Production FormData has failed"));
      setOpenSnack(true);
      SetType("error");
    }
  }, [DeleteProductDataData]);

  const handlDialogClose = () => {
    setOpenDialog(false);
  };
  const removeData = (id) => {
    getDeleteProductData(id);
  };

  return (
    <ModalNDL
      onClose={handlDialogClose}
      maxWidth={"md"}
      aria-labelledby="entity-dialog-title"
      open={openDialog}
    >
      <ModalHeaderNDL>
        <TypographyNDL
          id="entity-dialog-title"
          variant="heading-02-xs"
          model
          value={t("Are you sure want to delete?")}
        />
      </ModalHeaderNDL>
      <ModalContentNDL>
        <TypographyNDL
          value={`${t("Do you really want to delete the form? This action cannot be undone"
          )}`}
          variant='paragraph-s' color='secondary'
        />
      </ModalContentNDL>
      <ModalFooterNDL>
        <Button
          value={t("Cancel")}
          type={"secondary"}
          onClick={() => {
            handlDialogClose();
          }}
        />
        <Button
          value={t("YesDelete")}
          type="primary"
          danger
          onClick={() => removeData(productID)}
        />
      </ModalFooterNDL>
    </ModalNDL>
  );
});
export default DeleteConfirmDialog;
