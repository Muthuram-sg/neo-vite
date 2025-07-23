import React, { useState, useRef } from "react";
import "components/style/instrument.css";
import EnhancedTable from "components/Table/Table";
import Grid from "components/Core/GridNDL";
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import AddSensor from "./AddCustomer";
import LoadingScreenNDL from "LoadingScreenNDL";


export default function CustomerMaster() {
  const [pageidx, setPageidx] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const AddSensorref = useRef();
  const [bredCrumbName, setbredCrumbName] = useState("Instrument");

  const headCells = [
    { id: "name", label: "S.NO" },
    { id: "type", label: "Operational Code" },
    { id: "type", label: "Operation" },
    { id: "type", label: "Operation Description" },
    { id: "type", label: "Operation Type" },
    { id: "type", label: "Last Update On" },
    { id: "type", label: "Last Update By" },
  ];

  const tabledata = [
    { name: "Instrument 1", type: "Type A" },
    { name: "Instrument 2", type: "Type B" },
  ];

  const realInstrumentListLoading = false;

  const handleAddPolicyClick = () => {
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  const handleEditDialogOpen = (id, value) => {
    setbredCrumbName("Edit Instrument");
    setIsFormOpen(true);
    setTimeout(() => {
      AddSensorref.current?.handleEditDialogOpen(id, value);
    }, 200);
  };

  const refreshTable = () => {
    // Reload logic for table
  };

  return (
    <React.Fragment>
      {realInstrumentListLoading && <LoadingScreenNDL />}

      {/* Main Table View */}
      {!isFormOpen && (
        <Grid
          className="bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark"
          container
          style={{ padding: "16px" }}
        >
          <Grid item xs={12} sm={12}>
            <EnhancedTable
              headCells={headCells}
              data={tabledata}
              buttonpresent={"Add Operation"}
              icon={Plus}
              download={true}
              search={true}
              onClickbutton={handleAddPolicyClick}
              actionenabled={false}
              rawdata={tabledata}
              handleCreateDuplicate={() => {}}
              handleEdit={(id, row) => handleEditDialogOpen(id, row)}
              handleDelete={() => {}}
              enableDelete={true}
              enableEdit={true}
              downloadabledata={tabledata}
              downloadHeadCells={headCells}
              verticalMenu={true}
              groupBy={"type"}
              onPageChange={(p, r) => {
                setPageidx(p);
                setRowsPerPage(r);
              }}
              page={pageidx}
              rowsPerPage={rowsPerPage}
            />
          </Grid>
        </Grid>
      )}

      {/* Form View */}
      {isFormOpen && (
        <AddSensor
          ref={AddSensorref}
          refreshTable={refreshTable}
          handlepageChange={handleFormClose}
        />
      )}
    </React.Fragment>
  );
}
