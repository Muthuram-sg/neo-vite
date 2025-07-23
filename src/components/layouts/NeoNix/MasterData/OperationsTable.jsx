import React, { useState, useRef, useEffect } from "react";
import EnhancedTable from "components/Table/Table";
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import { useRecoilState } from "recoil";
import { snackToggle, snackMessage, snackType, snackDesc, selectedPlant } from "recoilStore/atoms";
import BredCrumbsNDL from "components/Core/Bredcrumbs/BredCrumbsNDL";
import LoadingScreen from "LoadingScreenNDL";
import moment from "moment";
import Button from "components/Core/ButtonNDL";
import useEntity from "components/layouts/NewSettings/Asset/hooks/useEntity.jsx";
import AddOperationsForm from "./AddOperationsForm";
import ModalNDL from "components/Core/ModalNDL";
import useGetOperation from "../hooks/useGetOperation";
import ModalContentNDL from "components/Core/ModalNDL/ModalContentNDL";
import ModalFooterNDL from "components/Core/ModalNDL/ModalFooterNDL";
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import ModalHeaderNDL from "components/Core/ModalNDL/ModalHeaderNDL";
import useDeleteOperations from "../hooks/useDeleteOperations";
import useUpdateOperations from "../hooks/useUpdateOperations";
import useCreateOperations from "../hooks/useCreateOperations";

import useUsersListForLine from "components/layouts/Settings/UserSetting/hooks/useUsersListForLine.jsx"; 
import { set } from "lodash";

export default function CompanyTable({ setShowTabs }) {
  const [page, setPage] = useState("Operations");
  const [, setOpenSnack] = useRecoilState(snackToggle);
  const [, SetMessage] = useRecoilState(snackMessage);
  const [, SetType] = useRecoilState(snackType);
  const [, SetDesc] = useRecoilState(snackDesc);
  const [headPlant] = useRecoilState(selectedPlant);

  const [breadcrumpName, setbreadcrumpName] = useState("Operations");
  const [isEdit, setisEdit] = useState(false);
  const EntityRef = useRef();
  const { EntityLoading } = useEntity();
  const [open, setOpen] = useState(false);
  const [ToolDialog, setToolDialog] = useState(false);
  const [existingOpIds, setExistingOpIds] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [dialogMode, setDialogMode] = useState("");
  const [updateValue, setUpdateValue] = useState([]);
  const { OperationLoading, OperationData, OperationError, getOperation } =
    useGetOperation();
    const { UsersListForLineLoading, UsersListForLineData, UsersListForLineError, getUsersListForLine } = useUsersListForLine();
  const {
    deleteOperationsLoading,
    deleteOperationsData,
    deleteOperationsError,
    getDeleteOperations,
  } = useDeleteOperations();
  const {
    updateOperationsLoading,
    updateOperationsData,
    updateOperationsError,
    getUpdateOperations,
  } = useUpdateOperations();
  const [isdelete, setIsDelete] = useState(false);
  const [selectedDelete, setSelectedDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  const headCells = [
    { id: "sno", numeric: false, disablePadding: true, label: "S.NO" },
    {
      id: "op_id",
      numeric: false,
      disablePadding: true,
      label: "Operation Code",
    },
    { id: "stepno", numeric: false, disablePadding: true, label: "Operation" },
    {
      id: "description",
      numeric: false,
      disablePadding: true,
      label: "Operation Description",
    },
    {
      id: "modified_dt",
      numeric: false,
      disablePadding: true,
      label: "Last Update on",
    },
    {
      id: "modified_by",
      numeric: false,
      disablePadding: true,
      label: "Last Update By",
    },
  ];

  useEffect(() => {
    // console.clear();
    // console.log("deleteOperationsData", deleteOperationsData);
    if (deleteOperationsData === 'Deleted Successfully ') {
      setOpenSnack(true);
      SetMessage("Operation Deleted");
      SetType("success");
      SetDesc("The operation has been successfully deleted.");
    } else if(deleteOperationsData?.response === 'The Operation is linked with Product'){
      setOpenSnack(true);
      SetMessage("Operation Not Deleted");
      SetType("error");
      SetDesc("The operation is linked with a product and cannot be deleted.");
    }
    handleDeleteClose();

  }, [deleteOperationsData, deleteOperationsLoading, deleteOperationsError]);

  useEffect(() => {
    setLoading(true)
    getOperation();
    getUsersListForLine(headPlant.id)
  }, [headPlant]);

  useEffect(() => {
    if (!OperationLoading && OperationData && !OperationError) {
      setTableData(OperationData);
      processOperationData();
    }
  }, [OperationLoading, OperationData, OperationError]);

  const processOperationData = () => {
    let temptabledata = [];
    let temp_id = []
    if (OperationData && OperationData.length > 0) {
      // console.clear()
      temptabledata = OperationData.map((val, index) => {
        const matchedUser = ((val.modified_by !== null && val.modified_by !== '' && val.modified_by !== undefined)  || (val.create_by !== null && val.create_by !== "" && val.create_by !== undefined)) 
        ? UsersListForLineData && UsersListForLineData.length > 0 && UsersListForLineData.find(
          (user) => user?.userByUserId?.sgid === (val.modified_by !== null ? val.modified_by : val.create_by)
        )?.userByUserId?.name : '-';
        // console.log(matchedUser, "UsersListForLineData");
        temp_id.push(val.op_id);
        return [
          index + 1,
          val.op_id,
          val.stepno,
          val?.description || '-',
          val.modified_dt
            ? moment(val.modified_dt + "Z").format("DD/MM/YYYY HH:mm:ss")
            : moment(val.create_dt + "Z").format("DD/MM/YYYY HH:mm:ss"),
            matchedUser
          // val.modified_by,
        ];
      });
    }

    setExistingOpIds(temp_id)
    setTableData(temptabledata);
    setLoading(false);
  };

  const handleNewTool = () => {
    setToolDialog(true);
    setUpdateValue([]);
    setDialogMode("create");
  };

  const handleModalClose = () => {
    setToolDialog(false);
    getOperation();
  };

  const handleDeleteOperations = (id, value) => {
    // console.log("Delete Operation", id, value);
    setSelectedDelete(value); // value is the operation row data
    setIsDelete(true);
  };

  const handleDeleteModelClose = () => {
    setIsDelete(false);
    setSelectedDelete(null);
  };

  const handleDeleteClose = () => {
    setIsDelete(false);
    setSelectedDelete(null);
    getOperation();
    // setOpenSnack(true);
    // SetMessage("Operation Deleted");
    // SetType("info");
    // SetDesc("The operation has been successfully deleted.");
  };

  const handleUpdateOperations = (id, value) => {
    setUpdateValue(value);
    setToolDialog(true);
  };

  return (
    <React.Fragment>
      {(loading) && <LoadingScreen />}

      <div className="bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark p-4 h-[93vh] overflow-y-auto">
        <EnhancedTable
          headCells={headCells}
          data={tableData}
          buttonpresent="Add Operations"
          download={true}
          search={true}
          onClickbutton={handleNewTool}
          actionenabled={true}
          rawdata={OperationData}
          handleEdit={(id, value) => handleUpdateOperations(id, value)}
          handleDelete={(id, value) => handleDeleteOperations(id, value)}
          enableDelete={true}
          enableEdit={true}
          Buttonicon={Plus}
          verticalMenu={true}
          groupBy={"neonix_operation"}
        />
      </div>

      <ModalNDL
        onClose={handleDeleteClose}
        maxWidth={"md"}
        aria-labelledby="delete-operation-title"
        open={isdelete}
      >
        <ModalHeaderNDL>
          <TypographyNDL
            id="delete-operation-title"
            variant="heading-02-xs"
            value={"Delete Operation"}
          />
        </ModalHeaderNDL>
        <ModalContentNDL>
          <TypographyNDL
            value={`Do you really want to delete the operation "${selectedDelete?.op_id}"? All the associated items with this operations will be affected. This action cannot be undone..`}
            variant="paragraph-s"
            color="secondary"
          />
        </ModalContentNDL>
        <ModalFooterNDL>
          <Button
            value="Cancel"
            type="secondary"
            onClick={handleDeleteModelClose}
          />
          <Button
            value="Delete"
            type="primary"
            danger
            style={{ marginLeft: 8 }}
            onClick={() => {
              getDeleteOperations(selectedDelete.op_id.toString());
              // handleDeleteClose();
            }}
          />
        </ModalFooterNDL>
      </ModalNDL>

      {ToolDialog && (
        <ModalNDL open={ToolDialog} onClose={handleModalClose} size="md">
          <AddOperationsForm
            ref={EntityRef}
            editData={updateValue}
            ToolDialog={ToolDialog}
            dialogMode={dialogMode}
            existingOperationIds={existingOpIds}
            onValidationFailed={() => alert("Validation failed")}
            onSuccess={() => {
              handleModalClose();
            }}
            onClose={handleModalClose}
          />
        </ModalNDL>
      )}
    </React.Fragment>
  );
}
