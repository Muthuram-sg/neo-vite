import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
} from "react";

import { useRecoilState } from "recoil";
import { snackToggle, snackMessage, snackType } from "recoilStore/atoms";

import AddProductContent from "./AddProductContent";
import ModalNDL from "components/Core/ModalNDL";
import ModalHeaderNDL from "components/Core/ModalNDL/ModalHeaderNDL";
import TypographyNDL from "components/Core/Typography/TypographyNDL";

const AddOfflineProduct = forwardRef((props, ref) => {
  const [offlineDialog, setDialog] = useState(false);
  const [, setOpenSnack] = useRecoilState(snackToggle);
  const [, SetMessage] = useRecoilState(snackMessage);
  const [, SetType] = useRecoilState(snackType);

  const [dialoudeMode, setDialogMode] = useState("Add Data");

  const EntityRef = useRef();
  useImperativeHandle(ref, () => ({
    openDialog: (value) => {
      setDialog(true);
      setDialogMode("Add Data");
    },
    openEditDialog: (data) => {
      setDialog(true);
      setDialogMode("Edit Data");
      setTimeout(() => {
        EntityRef.current.openEditDialog(data);
      }, 500);
    },
  }));

  const handleSnackBar = (Type, message) => {
    SetType(Type);
    SetMessage(message);
    setOpenSnack(true);
  };

  const handleCloseDialog = () => setDialog(false);

  return (
    <React.Fragment>
      <ModalNDL open={offlineDialog} onClose={handleCloseDialog}>
        <ModalHeaderNDL>
          <TypographyNDL variant="heading-02-xs" value={dialoudeMode} />
        </ModalHeaderNDL>
        <AddProductContent
          ref={EntityRef}
          handleCloseDialog={handleCloseDialog}
          snackBar={handleSnackBar}
          dialoudeMode={dialoudeMode}
          currentProduct={props.currentProduct}
          productExecVal={props.productExecVal}
          producExecTableData={props.producExecTableData}
          selectRowId={props.selectRowId}
          formEditExec={props.formEditExec}
          offlineProductExecData={props.offlineProductExecData}
        />
      </ModalNDL>
    </React.Fragment>
  );
});
export default AddOfflineProduct;
