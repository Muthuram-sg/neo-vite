import React, { useState, useRef, useEffect } from "react";
import EnhancedTable from "components/Table/Table";
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import BredCrumbsNDL from "components/Core/Bredcrumbs/BredCrumbsNDL";
import LoadingScreen from "LoadingScreenNDL";
import Button from "components/Core/ButtonNDL";
import useEntity from "components/layouts/NewSettings/Asset/hooks/useEntity.jsx";
import useGetVendorMaster from "components/layouts/NeoNix/hooks/useGetAllVendorMaster.jsx";
import AddVendorForm from "./AddVendorForm";
import moment from "moment";

export default function VendorTable({ setShowTabs }) {
    const [page, setPage] = useState("Vendor");
    const [breadcrumpName, setbreadcrumpName] = useState("Vendor");
    const [isEdit, setisEdit] = useState(false);
    const [tableData, setTableData] = useState([]);
    const EntityRef = useRef();

    const { EntityLoading } = useEntity();
    const {
        vendorLoading,
        vendorData,
        vendorError,
        getVendorMaster
    } = useGetVendorMaster();

    useEffect(() => {
        getVendorMaster(); // Initial fetch
    }, []);

    useEffect(() => {
        if (!vendorLoading && vendorData && !vendorError) {
            setTableData(vendorData);
            processVendorData();
        }
    }, [vendorLoading, vendorData, vendorError]);

    const processVendorData = () => {
        let formattedData = [];
        if (vendorData && vendorData.length > 0) {
            console.log("sfdhsd", vendorData)
            formattedData = vendorData.map((val, index) => [
                index + 1,
                val.id || "-",
                val.vendorName || "-",
                val.company_name || "-",
                val.company_type_desc || "-",
                val.mdy_dt ? moment(val.mdy_dt  ).format("YYYY-MM-DD HH:mm:ss") : "-",
                val.mdy_by || "-"
            ]);
        }
        setTableData(formattedData);
    };

    const headCells = [
        { id: "sno", numeric: false, disablePadding: true, label: "S.NO" },
        { id: "Vendor Id", numeric: false, disablePadding: false, label: "Vendor ID" },
        { id: "Vendor", numeric: false, disablePadding: false, label: "Vendor" },
        { id: "company", numeric: false, disablePadding: false, label: "Company" },
        { id: "Business Type", numeric: false, disablePadding: false, label: "Business Type" },
        { id: "lastUpdatedOn", numeric: false, disablePadding: false, label: "Last Updated On" },
        { id: "lastUpdatedBy", numeric: false, disablePadding: false, label: "Last Updated By" },
    ];

    const handleCreateOrder = () => {
        setPage("from");
        setbreadcrumpName("New Vendor");
        setisEdit(false);
        setShowTabs(false);
      //  EntityRef.current.handleEntityDialog();
    };

    const breadcrump = [
        { id: 0, name: "Vendor" },
        { id: 1, name: breadcrumpName }
    ];

    const handleActiveIndex = (index) => {
        if (index === 0) {
            setPage("Vendor");
            setisEdit(false);
            setShowTabs(true);
        }
    };

    const handleSavecustomer = () => {
        EntityRef.current.handleTriggerSave();
    };

    return (
        <React.Fragment>
            {(EntityLoading || vendorLoading) && <LoadingScreen />}

            {page !== "Vendor" && (
                <div className="flex justify-between items-center h-[48px] py-3.5 px-4 border-b bg-Background-bg-primary dark:bg-Background-bg-primary-dark border-Border-border-50 dark:border-Border-border-dark-50">
                    <BredCrumbsNDL breadcrump={breadcrump} onActive={handleActiveIndex} />

                    <div className="flex gap-2">
                        <Button
                            type="secondary"
                            value="Cancel"
                            onClick={() => {
                                setPage("Vendor");
                                setShowTabs(true);
                            }}
                        />
                        <Button
                            type="primary"
                            value={isEdit ? "Update" : "Save"}
                            onClick={handleSavecustomer}
                        />
                    </div>
                </div>
            )}

            <div className="bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark p-4 h-[93vh] overflow-y-auto">
                {page === "Vendor" ? (
                    <EnhancedTable
                        headCells={headCells}
                        data={tableData}
                        buttonpresent="Add Vendor"
                        download={true}
                        search={true}
                        onClickbutton={handleCreateOrder}
                        actionenabled={true}
                        rawdata={vendorData || []}
                        handleEdit={(id, value) => alert("Edit clicked")}
                        handleDelete={(id, value) => alert("Delete clicked")}
                        enableDelete={true}
                        enableEdit={true}
                        Buttonicon={Plus}
                        verticalMenu={true}
                        groupBy={"customers_settings"}
                    />
                ) : (
                    <AddVendorForm
                        ref={EntityRef}
                        onValidationFailed={() => alert("Validation failed")}
                        onSuccess={() => {
                            setPage("Vendor");
                            getVendorMaster(); // Refresh list
                        }}
                    />
                )}
            </div>
        </React.Fragment>
    );
}
