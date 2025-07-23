import React, { useState, useEffect } from "react";
import EnhancedTable from "components/Table/Table";
import ModalNDL from "components/Core/ModalNDL";
import Button from "components/Core/ButtonNDL";
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import { useRecoilState } from "recoil";
import { selectedPlant, snackToggle, snackMessage, snackType, snackDesc } from "recoilStore/atoms";
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import AddProductForm from "./AddProductForm";
import useGetProduct from "./hooks/useGetProduct";
import useDeleteProduct from "./hooks/useDeleteProduct";
import useGetDropDownOptions from "../Assets/hooks/useGetDropDownoptions";
import useGetComponents from "../Components/hooks/useGetComponents";
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import { useTranslation } from 'react-i18next';

const ProductTable = () => {
    const [tableData, setTableData] = useState([]);
    const [OverallData, setOverallData] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState("create");
    const [updateValue, setUpdateValue] = useState([]);
    const [SelectedDeleteValue, setSelectedDeleteValue] = useState({});
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [, SetDesc] = useRecoilState(snackDesc);
    const [headPlant] = useRecoilState(selectedPlant);
    const { getProductLoading, getProductData, getProductError, getProduct } = useGetProduct();
    const { deleteProductLoading, deleteProductData, deleteProductError, deleteProduct } = useDeleteProduct();
    const [operationOptions, setOperationOptions] = useState([]);
    const [ComponentMasterOption, setComponentMasterOption] = useState([]);
    const { dropDownOptionsLoading, dropDownOptionsData, dropDownOptionsError, getDropDownOptions } = useGetDropDownOptions();
    const { getComponentsLoading, getComponentsData, getComponentsError, getComponents } = useGetComponents();
    const headCells = [
        { id: "S.No", numeric: false, disablePadding: true, label: "S.No" },
        { id: "product_id", numeric: false, disablePadding: true, label: "Product ID" },
        { id: "product_name", numeric: false, disablePadding: false, label: "Product Name" },
        { id: "product_type", numeric: false, disablePadding: false, label: "Product Type" },
        { id: "description", numeric: false, disablePadding: false, label: "Description" },
    ];
    const { t } = useTranslation();
    const productTypeOptions = {
        D: "Discrete Product",
        A: "Assembled Product"
    }

    useEffect(() => {
        if (!getProductLoading && getProductData && !getProductError) {
            // console.log(getProductData,"getProductData")
            const formattedData = getProductData.map((item, index) => {
                return [
                    index + 1 ,
                    item.code ? item.code : "-",
                    item.matnr ? item.matnr : "-",
                    item.prd_category 
                        ? productTypeOptions[item.prd_category] || "-"
                        : "-",
                    item.description ? item.description : "-",
                ]

            })
            setOverallData(getProductData)
            setTableData(formattedData);
        } else if (getProductError) {
            console.error("Error fetching product data:", getProductError);
        }
    }, [getProductLoading, getProductData, getProductError]);


    useEffect(() => {
        getProduct()
        getDropDownOptions("OperationMaster/GetOperationMaster")
        getComponents()
    }, [headPlant]);

     useEffect(() => {
    
            if(dropDownOptionsData && !dropDownOptionsLoading && !dropDownOptionsError){
                if(dropDownOptionsData.GetOperationMaster && Array.isArray(dropDownOptionsData.GetOperationMaster)){
                    setOperationOptions( dropDownOptionsData.GetOperationMaster.filter(x=>x.op_id && x.stepno ) || []);
                }
    
            }
        },[dropDownOptionsData, dropDownOptionsLoading, dropDownOptionsError])

        useEffect(() => {
               if(!getComponentsLoading &&  getComponentsData && !getComponentsError){
                   if(getComponentsData && Array.isArray(getComponentsData)){
                       let formattedData =getComponentsData.map(x => ({
                        ...x.header,
                        items: x.items?.length > 0 ? x.items : null
                    }));
                       setComponentMasterOption(formattedData);
                   }
       
               }
       
           },[getComponentsLoading, getComponentsData, getComponentsError]);
       
        useEffect(() => {
        if (!deleteProductLoading && deleteProductData && !deleteProductError) {
            if (deleteProductData === "Deleted Successfully ") {
                setOpenSnack(true);
                SetMessage("Product Deleted");
                SetType("info");
                SetDesc("The Product has been successfully deleted.");
                handleDialogClose()
                getProduct();
            }else if(deleteProductData === "The product is linked to a quotation or enquiry. Remove the mapping to proceed with deletion" ){
                setOpenSnack(true);
                SetMessage("The product is linked to a quotation or enquiry");
                SetType("error");
                handleDialogClose()
                SetDesc("Remove the mapping to proceed with deletion.");
            }
            else{
                setOpenSnack(true);
                SetMessage("Product Deletion Failed");
                SetType("error");
                handleDialogClose()
                SetDesc("Failed to delete the product. Please try again.");
            }
        }
        },[deleteProductLoading, deleteProductData, deleteProductError])

    const handleNewProduct = () => {
        setDialogMode("create");
        setUpdateValue([]);
        setOpenDialog(true);
    };

    const handleEditProduct = (id, value) => {
        setDialogMode("edit");
        setUpdateValue(value);
        setOpenDialog(true);
    };

    

    const handleDialogClose = (isChange) => {
        setOpenDialog(false);
        if(isChange){
            getProduct();
        }
    };

    const handleDeleteProduct = (id, value) => {
        setDialogMode("delete");
        setOpenDialog(true);
        setSelectedDeleteValue(value);
    }


    const handlDeleteClose = () => {
        
        handleDialogClose()
    }
    // console.log("ComponentMasterOption", ComponentMasterOption);
   

    return (
        <React.Fragment>
            <div className="bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark p-4 h-[93vh] overflow-y-auto">
                <EnhancedTable
                    headCells={headCells}
                    data={tableData}
                    buttonpresent="Add Product"
                    download={true}
                    search={true}
                    onClickbutton={handleNewProduct}
                    actionenabled={true}
                    rawdata={OverallData}
                    handleEdit={handleEditProduct}
                    handleDelete={handleDeleteProduct}
                    enableEdit={true}
                    enableDelete={true}
                    Buttonicon={Plus}
                    verticalMenu={true}
                    groupBy={"policy"}
                />
            </div>

            {/* Add/Edit Modal */}
            <ModalNDL open={openDialog} onClose={handleDialogClose} size="md">
                    {/* Replace placeholder with AddProductForm */}
                    {
                        dialogMode === 'delete' ? 
                        <React.Fragment>
                           <ModalHeaderNDL>
                                              <TypographyNDL id="entity-dialog-title" variant="heading-02-xs" model value={"Delete Policy"} />
                                          </ModalHeaderNDL>
                                          <ModalContentNDL>
                                              <TypographyNDL value={`${t('Do you really want to delete the')} ${SelectedDeleteValue && SelectedDeleteValue.prd_name  ? SelectedDeleteValue.prd_name  :  ""} ? All the associated items with this policy will be affected. This action cannot be undone.`} variant='paragraph-s' color='secondary' />
                                          </ModalContentNDL>
                                          <ModalFooterNDL>
                                              <Button value={t('Cancel')} type='secondary'  onClick={() => { handlDeleteClose() }} />
                                              <Button value={t('Delete')} type="primary" danger style={{ marginLeft: 8 }} onClick={() => (deleteProduct({code: SelectedDeleteValue.code}))}/>
                                          </ModalFooterNDL>
                        </React.Fragment>
                        
                        :
                        <AddProductForm
                        Operationoptions={operationOptions}
                        ComponentMasterOption={ComponentMasterOption}
                        editData={updateValue}
                            onCancel={handleDialogClose}
                            dialogMode={dialogMode}
                            OverallData={OverallData}
                        />
                    }
                   
                {/* Removed ModalFooterNDL as buttons are now handled in AddProductForm */}
            </ModalNDL>

        </React.Fragment>
    );
};

export default ProductTable;