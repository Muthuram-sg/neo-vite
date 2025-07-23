import React, { useState, useEffect } from "react";
import {useParams} from "react-router-dom"
import Grid from 'components/Core/GridNDL'
import moment from 'moment';
import { useRecoilState } from "recoil";
import { selectedPlant, userData, snackToggle, snackMessage, snackType, ProductList } from "recoilStore/atoms";
import EnhancedTable from "components/Table/Table";
import Addproduct from "./components/ProductModal";
import useProduct from "./hooks/useProducts";
import useAddproducts from "./hooks/useAddproducts";
import useDelproducts from "./hooks/useDelproducts";
import useEditproducts from "./hooks/useEditproducts";
import { useAuth } from "components/Context";
import { useTranslation } from 'react-i18next';
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import TypographyNDL from "components/Core/Typography/TypographyNDL";



export default function Product() {
    const { t } = useTranslation();
    const { HF } = useAuth();
    let {moduleName,subModule1} = useParams()
    const [currUser] = useRecoilState(userData);
    const [headPlant] = useRecoilState(selectedPlant);
    const [productDialog, setProductDialog] = useState(false);
    const [productID, setProductID] = useState('');
    const [, setProducts] = useRecoilState(ProductList)
    const [, setName] = useState('');
    const [, setUnit] = useState('');
    const [,setExpectedEnergy] = useState('')
    const [dialogMode, setDialogMode] = useState('');
    const [, setWOID] = useState(0);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [tabledata, setTableData] = useState([])
    const [editValue, setEditValue] = useState('')
    const { outGPLoading, outGPData, outGPError, getProduct } = useProduct();
    const { addproductswithoutIDLoading, addproductswithoutIDData, addproductswithoutIDError, getaddproductswithoutID } = useAddproducts()
    const { delproductswithoutIDLoading, delproductswithoutIDData, delproductswithoutIDError, getadelproductswithoutID } = useDelproducts()
    const { editproductswithoutIDLoading, editproductswithoutIDData, editproductswithoutIDError, geteditproductswithoutID } = useEditproducts()
    useEffect(() => {
        if(headPlant.id){
            getProduct();
            if(moduleName === "products" && subModule1 === "new"){
                setEditValue('')
                setProductDialog(true)
                setDialogMode("create")
            }
        }
        
    }, [headPlant,moduleName,subModule1]) // eslint-disable-line react-hooks/exhaustive-deps    
    useEffect(() => {

        processedrows()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [outGPData])
  //  console.log(moduleName,subModule1,"MD")
    const headCells = [
        {
            id: 'sno',
            label: 'S.No',
            disablePadding: false,
            width: 100,
        },
        {
            id: 'productId',
            numeric: false,
            disablePadding: true,
            label: t('Product ID'),
            width: 100,
        },
        {
            id: 'name',
            numeric: false,
            disablePadding: false,
            label: t('Name'),
            width: 100,
        },
        {
            id: 'standard_rate',
            numeric: false,
            disablePadding: false,
            label: t('Standard Rate (Parts/Hour)'),
            width: 230
        },
        {
            id: 'created_by',
            numeric: false,
            disablePadding: false,
            label:t( 'Added by'),
            width: 110
        },
        {
            id: 'created_at',
            numeric: false,
            disablePadding: false,
            label: t('Added on'),
            width: 110
        },
        {
            id: 'updated_at',
            numeric: false,
            disablePadding: false,
            label: t('Last modified on'),
            width: 150
        },
        {
            id: 'updated_by',
            numeric: false,
            disablePadding: false,
            label: t('Last modified by'),
            width: 150
        } ,
        {
            id: 'expected_energy',
            numeric: false,
            disablePadding: false,
            label: t('Expected Energy(per sqmt)'),
            width: 230
            

        },
        {
            id: 'moisture_in',
            numeric: false,
            disablePadding: false,
            label: t("Expected Moisture In"),
            width: 200
            
        },
        {
            id: 'moisture_out',
            numeric: false,
            disablePadding: false,
            label: t("Expected Moisture Out"),
            width: 200
            
        },
        {
            id: 'work_orders',
            numeric: false,
            disablePadding: false,
            label: t('WorkOrders'),
            hide: true,
            display : "none",
            width:110
        },

        {
            id: 'id',
            numeric: false,
            disablePadding: false,
            label: t('ID'),
            hide: true,
            display: "none",
            width: 100

        }


    ];
    useEffect(() => {
        if (!addproductswithoutIDLoading && !addproductswithoutIDError && addproductswithoutIDData) {
            // console.log(addproductswithoutIDData,"addproductswithoutIDData")
            if (addproductswithoutIDData.insert_neo_skeleton_prod_products_one) {
                
                handleDialogClose();
                SetMessage(t('Added a new product ') + productID)
                SetType("success")
                setOpenSnack(true);
                getProduct();
            } else {
                handleDialogClose();
                SetMessage(t('Failed to add a product ') + productID)
                SetType("error")
                setOpenSnack(true)
                
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addproductswithoutIDLoading, addproductswithoutIDError, addproductswithoutIDData])
    useEffect(() => {
        if (!delproductswithoutIDLoading && !delproductswithoutIDError && delproductswithoutIDData) {
            let delArr =[]
            // eslint-disable-next-line array-callback-return
            Object.keys(delproductswithoutIDData).forEach(val => {
                if (delproductswithoutIDData[val].affected_rows >= 1) {
                  delArr.push("1");
                }
              });
              
            if (delArr.length > 0) {
                SetMessage(t('Product ') + productID + " " + "deleted successfully")
                SetType("success")
                setOpenSnack(true)
                handleDialogClose();
                getProduct();
            } else {
                SetMessage(t('Failed to delete a product ') + productID)
                SetType("error")
                setOpenSnack(true)
                handleDialogClose();
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[delproductswithoutIDLoading, delproductswithoutIDData, delproductswithoutIDError])

    useEffect(() => {
        if (!editproductswithoutIDLoading && !editproductswithoutIDError && editproductswithoutIDData) {
            if (editproductswithoutIDData.update_neo_skeleton_prod_products.affected_rows >= 1) {
                SetMessage(t("Product ") + productID + " " + "updated Successfully")
                SetType("success")
                setOpenSnack(true)
                handleDialogClose();
                getProduct();
            } else {
                SetMessage(t('Failed to update a product ') + productID)
                SetType("error")
                setOpenSnack(true)
                handleDialogClose();
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editproductswithoutIDLoading, editproductswithoutIDError, editproductswithoutIDData])

    const handleDialogClose = () => {
        setProductDialog(false);
        // setEditValue('')
    }

    const handleCreateOrder = () => {
        setEditValue('')
        setProductDialog(true);
        setDialogMode('create');
    }

    const handleDialogEdit = (id, row) => {
    
        setEditValue(row)
        setWOID(row.id);
        setProductID(row.product_id);
        setName(row.name);
        setUnit(row.unit);
        setExpectedEnergy(row.expected_energy?row.expected_energy : 0)
        setProductDialog(true);
        setDialogMode('edit');
    }

    const handleProductID = (e) => {
        setProductID(e.target.value);
    }
    const handleName = (e) => {
        setName(e.target.value);
    }
    const handleUnit = (e) => {
        setUnit(e.target.value);
    }
    const createOrder = (e) => {
       
        let datas={
            product_id:e.productID,
            name:e.name,
            unit:e.unit,
            user_id:currUser.id,
            isMicroStop: e.isMicroStop,
            micStopFromTime: e.isMicroStop ? e.micStopFromTime : 0,
            micStopToTime: e.isMicroStop ? e.micStopToTime : 0,
        }
        getaddproductswithoutID(datas, headPlant.id,e.expected_energy,e.moistureIn,e.moistureOut,e.cycleUnit,e.energyUnit)
    }

    const deleteTaskfn = (id, val) => {
        setEditValue(val)
        setProductDialog(true);
        setDialogMode('delete')

    }
    const deleteTask = (val) => {
        getadelproductswithoutID(val.orderids,val.product_id)
    }

    const updateOrder = (e) => {
       
        let datas1={
           id:e.WOID,
           product_id:e.productID,
           name:e.name,
           unit:e.unit,
           isMicroStop: e.isMicroStop,
           micStopFromTime: e.isMicroStop ? e.micStopFromTime : 0,
           micStopToTime: e.isMicroStop ? e.micStopToTime : 0,
        }
        geteditproductswithoutID(datas1, currUser.id,e.expected_energy,e.moistureIn,e.moistureOut,e.cycleUnit,e.energyUnit)
    }
  
    const processedrows = () => {
        var temptabledata = []
        if (outGPData && !outGPError && !outGPLoading) {
            setProducts(outGPData)
            temptabledata = temptabledata.concat(outGPData.map((val, index) => {
            
           
             return  [ index+1,val.product_id, val.name, val.unit.match(/^-?\d+(?:\.\d{0,2})?/) ? val.unit.match(/^-?\d+(?:\.\d{0,2})?/)[0] :"-", val.user.name,
                moment(val.created_ts).format("DD/MM/YYYY "+HF.HM),
                moment(val.updated_ts).format("DD/MM/YYYY "+HF.HM),
                val.userByUpdatedBy.name,val.expected_energy,
                val.moisture_in,val.moisture_out,
                val.prod_orders.map(vals=>vals.id).toString(),
                val.id
                      ]
            })
            )
        }
        setTableData(temptabledata)

    }
    


    return (
        
        <React.Fragment>
            <Addproduct
                productDialog={productDialog}
                dialogMode={dialogMode}
                Editedvalue={editValue}
                handleDialogClose={() => handleDialogClose()}
                handleProductID={(e) => handleProductID(e)}
                handleName={(e) => handleName(e)}
                handleUnit={(e) => handleUnit(e)}
                createOrder={(e) => { createOrder(e) }}
                updateOrder={(e) => updateOrder(e)}
                deleteselected={(value) => deleteTask(value)}
            />
            <Grid container spacing={3}  >
                <Grid item xs={12}>
                <div className="h-[48px] py-3 px-4 border-b bg-Background-bg-primary dark:bg-Background-bg-primary-dark border-Border-border-50 dark:border-Border-border-dark-50">
                            <TypographyNDL value='Products' variant='heading-02-xs'  />
                        </div>
                        <div className="p-4 bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark">
                    <EnhancedTable
                        headCells={headCells.filter(c => !c.hide)}
                        data={tabledata}
                        buttonpresent={t("Add Product")}
                        onClickbutton={handleCreateOrder}
                        actionenabled={true}
                        rawdata={outGPData}
                        handleEdit={(id, value) => handleDialogEdit(id, value)}
                        handleDelete={(id, value) => deleteTaskfn(id, value)} 
                        enableDelete={true}
                        enableEdit={true}
                        search={true}
                        download={true}
                        Buttonicon={Plus}
                        rowSelect={true}
                        checkBoxId={"sno"}
                        FilterCol
                        verticalMenu={true}
                        groupBy={'products'}
                        
                        />
                        </div>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}