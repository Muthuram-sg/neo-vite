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
import useDeleteProductExec from "components/layouts/OfflineDAQ/ProductionHooks/DeleteProductExec";
import ModalNDL from "components/Core/ModalNDL";
import ModalHeaderNDL from "components/Core/ModalNDL/ModalHeaderNDL";
import ModalContentNDL from "components/Core/ModalNDL/ModalContentNDL";
import ModalFooterNDL from "components/Core/ModalNDL/ModalFooterNDL";
import TypographyNDL from "components/Core/Typography/TypographyNDL";

const DeleteConfirmDialog = forwardRef((props, ref) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [headPlant] = useRecoilState(selectedPlant);
  const [productExecID, setProductExecID] = useState("");
  const [, SetMessage] = useRecoilState(snackMessage);
  const [, SetType] = useRecoilState(snackType);
  const [, setOpenSnack] = useRecoilState(snackToggle);
  const { t } = useTranslation();

  const {
    DeleteProductExecLoading,
    DeleteProductExecData,
    DeleteProductExecError,
    getDeleteProductExecData,
  } = useDeleteProductExec();

  useImperativeHandle(ref, () => ({
    openProductExecDialog: (value) => {
      setOpenDialog(true);
      setProductExecID(value.id);
    },
  }));

  useEffect(() => {
    if (
      !DeleteProductExecLoading &&
      DeleteProductExecData &&
      !DeleteProductExecError
    ) {
      SetMessage(t("Product Data Deleted"));
      setOpenSnack(true);
      setOpenDialog(false);
      props.offLineTableData(headPlant.id);
    }
    if (
      DeleteProductExecLoading &&
      !DeleteProductExecData &&
      DeleteProductExecError
    ) {
      SetMessage(t("Product Data has failed"));
      setOpenSnack(true);
      SetType("error");
    }
  }, [DeleteProductExecData]);

  const handlDialogClose = () => {
    setOpenDialog(false);
  };
  const removeData = (id) => {
    getDeleteProductExecData(id);
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
          value={`${t(" Do you really want to delete the value from the entry? This action cannot be undone"
          )}`}
         variant='paragraph-s' color='secondary'
        />
      </ModalContentNDL>
      <ModalFooterNDL>
        <Button
          value={t("Cancel")}
          type={"secondary"}
          style={{ marginTop: 10, marginBottom: 10 }}
          onClick={() => {
            handlDialogClose();
          }}
        />
        <Button
          value={t("YesDelete")}
          type="primary"
          danger
          style={{ marginTop: 10, marginBottom: 10, marginRight: 10 }}
          onClick={() => removeData(productExecID)}
        />
      </ModalFooterNDL>
    </ModalNDL>
  );
});
export default DeleteConfirmDialog;
