import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import AddProductionData from "../ProductionDAQ/AddProductionData";
import useTheme from "TailwindTheme";
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import DeleteDialouge from "components/layouts/OfflineDAQ/ProductionDAQ/DeleteDialouge";
import useGetProductFormTableData from "../ProductionHooks/GetOfflineProductsTableData";
import useProductUnit from "Hooks/useGetProductUnit";
import useGetProductExec from "../ProductionHooks/GetProductExec";
import { selectedPlant,customdates } from "recoilStore/atoms";
import { useRecoilState } from "recoil";
import AddOfflineProduct from "./AddOfflineProduct";
import ProductDeleteDialouge from "./DeleteProdectExecDialouge";
import Breadcrumbs from "components/Core/Bredcrumbs/BredCrumbsNDL";
import DateRangeSelect from "../ProductionDAQ/DateRangeSelect";
import moment from "moment";
import Grid from 'components/Core/GridNDL'
const EnhancedTable = React.lazy(() => import("components/Table/Table"));

const Production = (props) => {
  const { t } = useTranslation();
  const addFormdRef = useRef();
  const deleteDialogRef = useRef();
  const deleteProductExce = useRef(null);
  const theme = useTheme();
  const offlineRef = useRef();
  const [isDataView, setIsDataView] = useState(false);
  const [headPlant] = useRecoilState(selectedPlant);
  const [prodTableData, setProdTableData] = useState([]);
  const [currentProduct, setCurrentProduct] = useState("");
  const [productExcTableData, setProductExecTableData] = useState([]);
  const [, setOptionDeleteMode] = useState(false);
  const [, setProductExecId] = useState(0);
  const [productExecVal, setProductExecVal] = useState([]);
  const [selectRowId, setSelectedRowId] = useState("");
  const [formEditExec, setEditExec] = useState(false)
  const [pageidx,setPageidx] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [listArray, setListArray] = useState([
    { index: "Production", name: "" },
  ]);


  const [Customdatesval] = useRecoilState(customdates);
  const {
    offlineProductsLoading,
    getofflineProductData,
    offlineProductsError,
    GetOfflineTableData,
  } = useGetProductFormTableData();
  const {
    ProductUnitsLoading,//NOSONAR
    ProductUnitsData,//NOSONAR
    ProductUnitsError,//NOSONAR
    getProductUnit,
  } = useProductUnit();
  const {
    offlineProductExecLoading,
    getofflineProductExecData,
    offlineProductsExecError,
    GetProductExecTableData,
  } = useGetProductExec();

  const [dataCells, setDataCells] = useState([
    {
      id: "Sno",
      numeric: false,
      disablePadding: true,
      label: t("SNo"),
      width:100
    },
    {
      id: "ProductionDate",
      numeric: false,
      disablePadding: true,
      label: t("Production Date"),
      width:170
    },
    {
      id: "value",
      numeric: false,
      disablePadding: true,
      label: t("Value"),
      width:150
    },
    {
      id: "Unit",
      numeric: false,
      disablePadding: true,
      label: t("Unit"),
      width:100
    },
    {
      id: "Last Updated by",
      numeric: false,
      disablePadding: false,
      label: t("UpdatedBy"),
      width:100

    },

    {
      id: "Last Updated on",
      numeric: false,
      disablePadding: false,
      label: t("Updatedon"),
      width:120
    },
    {
      id: 'id',
      numeric: false,
      disablePadding: false,
      label: t('Alert ID'),
      hide: true,
      display: "none",
      width: 100

  }

  ]);
 
  const headCells = [
    {
      id: "S.NO",
      numeric: false,
      disablePadding: true,
      label: t("SNo"),
      width:"100"
    },
    {
      id: "Form Name",
      numeric: false,
      disablePadding: true,
      label: t("Form Name"),
      width:"150"
    },
    {
      id: "Asset",
      numeric: false,
      disablePadding: false,
      label: t("Asset"),
      width:"100"
    },
    {
      id: "Product",
      numeric: false,
      disablePadding: false,
      label: t("Product"),
      width:"100"
    },
    {
      id: "Unit",
      numeric: false,
      disablePadding: false,
      label: t("Unit"),
      width:"100"
    },

    {
      id: "FREQUENCY",
      numeric: false,
      disablePadding: false,
      label: t("Frequency"),
      width:"150"
    },
    {
      id: "Last Updated by",
      numeric: false,
      disablePadding: false,
      label: t("UpdatedBy"),
      width:"150"
    },
    {
      id: "Last Updated on",
      numeric: false,
      disablePadding: false,
      label: t("Updatedon"),
      width:"150"
    },
    {
      id: 'id',
      numeric: false,
      disablePadding: false,
      label: t('Alert ID'),
      hide: true,
      display: "none",
      width: 100

  }
  ];

  useEffect(() => {
    GetOfflineTableData(headPlant.id);
    getProductUnit();
  }, [headPlant]);

  useEffect(()=>{
    // console.log(isDataView,Customdatesval,"getofflineProductExecData2")
if(isDataView===true ){
  GetProductExecTableData(headPlant.id, productExecVal.id,Customdatesval.StartDate,Customdatesval.EndDate );
}else{
  GetProductExecTableData(headPlant.id, '',Customdatesval.StartDate,Customdatesval.EndDate );
}
  },[Customdatesval,isDataView])

  useEffect(() => {
    console.log("getofflineProductData",getofflineProductData)
    processedrows();
  }, [getofflineProductData]);

  useEffect(() => {
    if(isDataView){
      processedrows1(productExecVal);
    } 
    // console.log(isDataView,getofflineProductExecData,"getofflineProductExecData",productExecVal)
  }, [getofflineProductExecData,Customdatesval.StartDate, Customdatesval.EndDate]);

  const handleFormOpen = () => {
    setTimeout(() => {
      addFormdRef.current.openDialog();
    });
  };
  const handleEdit = (id, value) => {
    setEditExec(true);
    offlineRef.current.openEditDialog(value);
  };
  const handleAdd = (id, value) => { 
    offlineRef.current.openDialog("add", value);
    setEditExec(false);
    setSelectedRowId(value.id)
    setCurrentProduct(value);
    
    GetProductExecTableData(headPlant.id, value.id,moment().subtract(30, 'days').format("YYYY-MM-DD HH:mm:ss"),moment(new Date()).format("YYYY-MM-DD HH:mm:ss"));
 
  };

  const offLineTableData = () => {
    console.log("callingDelete")
    GetOfflineTableData(headPlant.id);
  };

  const handleDialogEdit = (row, id) => {
    addFormdRef.current.handleEditEnitytDialogOpen(row);
  };
  const DeleteProdRow = (id, value) => {
    deleteDialogRef.current.openDialog(value);
  };

  const handleView = (id, value) => {
    setProductExecVal(value);
    setProductExecId(value.id);
    setIsDataView(true);
    props.hideTab("disable");
    setListArray([
      { index: "Production", name: "Production" },
      { index: "Production1", name: value.form_name },
    ]);

  };
  const producExecTableData = () => {
    GetProductExecTableData(headPlant.id, productExecVal.id,moment().subtract(30, 'days').format("YYYY-MM-DD HH:mm:ss"),moment(new Date()).format("YYYY-MM-DD HH:mm:ss"));
  };
  const processedrows = () => {
    let temptabledata = [];
    if (
      getofflineProductData &&
      !offlineProductsError &&
      !offlineProductsLoading
    ) {
      temptabledata = temptabledata.concat(
        getofflineProductData.map((val, index) => {
          return [
            index + 1,
            val.form_name,
            val.entity.name ? val.entity.name : "",
            val.prod_product && val.prod_product.name
              ? val.prod_product.name
              : "",
            val.prod_product && val.prod_product.metric_unit
              ? val.prod_product.metric_unit["unit"]
              : "",
            "Daily",
            val.userByUpdatedBy.name,
            moment(val.updated_ts).format("DD/MM/YYYY"),
            val.id
          ];
        })
      );
    }
  console.log("temptabledata",temptabledata)
    setProdTableData(temptabledata);
  };

  const handleDelete = (id, value) => {
    if (deleteProductExce.current) {
      deleteProductExce.current.openProductExecDialog(value);
    }
    setOptionDeleteMode(true);
  };

  const processedrows1 = (data) => {
    let temptabledata = [];
    if (
      getofflineProductExecData && getofflineProductExecData.length &&
      !offlineProductsExecError &&
      !offlineProductExecLoading
    ) {

      const sortedData = getofflineProductExecData.sort((a, b) => {
        const dateA = moment(a.info.shitfdate);
        const dateB = moment(b.info.shitfdate);

        return dateB - dateA;
      });
      temptabledata = sortedData.map((val, index) => {
        return [
          index + 1,
          moment(val.info.shitfdate).format("DD/MM/YYYY"),
          val.info ? val.info.Value : "",
          data.prod_product?.metric_unit?.unit || "",
          val.userByUpdatedBy.name,
          val.updated_ts
            ? moment(val.updated_ts).format("DD/MM/YYYY")
            : "",
            val.id
        ];
      });
    }

    setProductExecTableData(temptabledata);
  };





  const handleActiveIndex = (index) => {
    if (index === 0) {
      setProductExecTableData([])
      setIsDataView(false); 
      props.hideTab("enable")  
    }
  };

  return (
    <React.Fragment>
      <AddProductionData
        ref={addFormdRef}
        offLineTableData={offLineTableData}
      />
      <DeleteDialouge
        ref={deleteDialogRef}
        offLineTableData={offLineTableData}
      />

      <ProductDeleteDialouge
        ref={deleteProductExce}
        offLineTableData={producExecTableData}
      />

      <AddOfflineProduct
        ref={offlineRef}
        currentProduct={currentProduct}
        producExecTableData={producExecTableData}
        selectRowId={selectRowId}
        formEditExec={formEditExec}
        offlineProductExecData={getofflineProductExecData}
      />

{isDataView && (
    <Grid container alignItems="center" justifyContent="space-between" style={{marginTop:10}}>
      <Grid item lg={8} md={8} style={{paddingLeft:15}}>
        <Breadcrumbs
          breadcrump={listArray}
          onActive={(index) => handleActiveIndex(index)}
        />
      </Grid>
      <Grid item lg={4} md={4} style={{ marginRight: 20 }}>
        <DateRangeSelect />
      </Grid>
    </Grid>
  )}

<div className="p-4 bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark ">

      {isDataView ? (
        <EnhancedTable
          download={true}
          // search={true}
          headCells={dataCells}
          name="dataTable2"
          data={productExcTableData}
          actionenabled={true}
          rawdata={getofflineProductExecData ? getofflineProductExecData : []}
          handleEdit={(id, value) => handleEdit(id, value)}
          enableEdit={true}
          enableDelete={true}
          handleDelete={(id, value) => handleDelete(id, value)}
          enableCreateTask={true}
          rowSelect={true}
          checkBoxId={"id"}
          FilterCol
          verticalMenu={true}
          groupBy={"offilineProductionDACDetail"}
          
        />
      ) : (
        <EnhancedTable
          headCells={headCells}
          name="dataTable"
          buttonpresent={t("New Form")}
          download={true}
          search={true}
          onClickbutton={handleFormOpen}
          data={prodTableData}
          actionenabled={true}
          rawdata={
            getofflineProductData &&
              !offlineProductsError &&
              !offlineProductsLoading
              ? getofflineProductData
              : []
          }
          enableAdd={true}
          enableView={true}
          enableEdit={true}
          enableDelete={true}
          enableCreateTask={true}
          Buttonicon={Plus}
          handleAdd={(id, value) => handleAdd(id, value)}
          handleView={(id, value) => handleView(id, value)}
          handleEdit={(id, value) => handleDialogEdit(value, id)}
          handleDelete={(id, value) => DeleteProdRow(id, value)}
          rowSelect={true} 
          checkBoxId={"id"}
          FilterCol
          verticalMenu={true}
          groupBy={'offilineProductionDAC'}
          onPageChange={(p,r)=>{setPageidx(p);setRowsPerPage(r)}}
          page={pageidx}
          rowsPerPage={rowsPerPage}
        />
      )}
</div>
  
    </React.Fragment>
  );
};

export default Production;
