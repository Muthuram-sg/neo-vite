import React, { useState, useEffect } from "react";
import EnhancedTable from "components/Table/Table";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { editExec, editExecVal, snackMessage, snackType, snackToggle, selectedPlant, oeereportgroupby } from "recoilStore/atoms";
import ToolTip from "components/Core/ToolTips/TooltipNDL";
import Button from "components/Core/ButtonNDL"
import useDeleteReport from "../hooks/useDelWorkOrder";
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import ModalNDL from 'components/Core/ModalNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import commonReports from "../../components/common";


const ProductionWorkOrders = (props) => {
  const { t } = useTranslation();
  const [headPlant] = useRecoilState(selectedPlant);
  const [, SetMessage] = useRecoilState(snackMessage);
  const [, SetType] = useRecoilState(snackType);
  const [, setOpenSnack] = useRecoilState(snackToggle);
  const [tabledata, setTableData] = useState([]);
  const [open,] = useState(false);
  const [editExecute, setEditExec] = useRecoilState(editExec);
  const [, setEditExecVal] = useRecoilState(editExecVal);
  const [formulaDialog, setFormulaDialog] = useState(false);
  const [delValue, setDelValue] = useState([]);
  const [headCells, setheadCells] = useState(props.headcell);
  const { deleteReportLoading, deleteReportData, deleteReportError, getDeleteReport } = useDeleteReport();
  const [groupby] = useRecoilState(oeereportgroupby)
  const [downloadabledata, setdownloadabledata] = useState([])
  const [, setCompleteTableData] = useState([]);
  const [selectedcolnames, setselectedcolnames] = useState([])
  const [, setcurrentstatus] = useState(-1)

  useEffect(() => {
     
    setheadCells(props.headcell)
    setselectedcolnames(props.headcell.filter(val => val.display !== 'none'))
  }, [props.headcell])

  useEffect(() => {
    setcurrentstatus(-1)
  }, [groupby])


  const getShift = (startrange, endrange) => {
    const shifts = headPlant.shift.shifts;
    const day = moment(startrange).format("YYYY-MM-DD")
    let shiftName = ''
    if (Object.keys(shifts).length > 0) {
      if (headPlant.shift.ShiftType === "Weekly") {
        let td = new Date(startrange).getDay() === 0 ? 6 : new Date(startrange).getDay() - 1;
        for (let j = 0; j < shifts[td].length; j++) {
          if (j === 0) {
            const previousShift = td === 0 ? shifts[Object.keys(shifts).length - 1] : shifts[td - 1];
            const lastshift = j === 0 ? previousShift[previousShift.length - 1] : shifts[td][j - 1];
            let day1 = moment(startrange).subtract(1, 'day').format("YYYY-MM-DD")
            let starttime = new Date(moment().format(day1 + "T" + lastshift.startDate) + "Z");
            let endtime = new Date(moment().format(day1 + "T" + lastshift.endDate) + "Z");
            if (endtime.getTime() < starttime.getTime()) {
              if (endtime.getDay() === new Date(day1).getDay() && endtime.getDay() === starttime.getDay()) {
                endtime = new Date(moment(endtime).add(1, 'day'))
              } else {
                starttime = new Date(moment(starttime).subtract(1, 'day'))
              }

            }
            
            if ((new Date(startrange).getTime() >= starttime.getTime()) && (endtime.getTime() >= new Date(endrange).getTime())) {
              shiftName = lastshift.name
              return shiftName;
            }
          }
         let starttime = new Date(moment().format(day + "T" + shifts[t][j].startDate) + "Z");
         let endtime = new Date(moment().format(day + "T" + shifts[t][j].endDate) + "Z");
          if (endtime.getTime() < starttime.getTime()) {
            if (endtime.getDay() === new Date(day).getDay() && endtime.getDay() === starttime.getDay()) {
              endtime = new Date(moment(endtime).add(1, 'day'))
            } else {
              starttime = new Date(moment(starttime).subtract(1, 'day'))
            }
          }
          if ((new Date(startrange).getTime() >= starttime.getTime()) && (endtime.getTime() >= new Date(endrange).getTime())) {
            shiftName = shifts[td][j].name
            return shiftName;
          }
        }

      } else {
        for (let i = 0; i < shifts.length; i++) {
          if (i === 0) {
            const lastshift = i === 0 ? shifts[shifts.length - 1] : shifts[i - 1];
         let   day1 = moment(startrange).subtract(1, 'day').format("YYYY-MM-DD")
          let  starttime = new Date(moment().format(day1 + "T" + lastshift.startDate) + "Z");
         let   endtime = new Date(moment().format(day1 + "T" + lastshift.endDate) + "Z");
            if (endtime.getTime() < starttime.getTime()) {
              if (endtime.getDay() === new Date(day1).getDay() && endtime.getDay() === starttime.getDay()) {
                endtime = new Date(moment(endtime).add(1, 'day'))
              } else {
                starttime = new Date(moment(starttime).subtract(1, 'day'))
              }

            }
             if ((new Date(startrange).getTime() >= starttime.getTime()) && (endtime.getTime() >= new Date(endrange).getTime())) {
              shiftName = lastshift.name
               return shiftName;
            }
          }

        let  starttime = new Date(moment().format(day + "T" + shifts[i].startDate) + "Z");
        let  endtime = new Date(moment().format(day + "T" + shifts[i].endDate) + "Z");
          if (endtime.getTime() < starttime.getTime()) {
            if (endtime.getDay() === new Date(day).getDay() && endtime.getDay() === starttime.getDay()) {
              endtime = new Date(moment(endtime).add(1, 'day'))
            } else {
              starttime = new Date(moment(starttime).subtract(1, 'day'))
            }
          }

           if ((new Date(startrange).getTime() >= starttime.getTime()) && (endtime.getTime() >= new Date(endrange).getTime())) {
            shiftName = shifts[i].name
             return shiftName;
          }
        }

      }



    }

  }
  const processedrows = () => {
    let temptabledata = [];
    let tempdownloadabledata = []
    console.log(props.outTableData,"props.outTableData")
    
    if (props.outTableData !== null && props.outTableData.length > 0) {

      temptabledata = temptabledata.concat(

        props.outTableData.map((val, index) => {

          if (groupby !== 3) {
            var shiftName = getShift(val.startrange, val.endrange)

          }


          let DSTrange= moment(val.startrange).isDST() ? 1 : 0
          let Operator = Array.isArray(val.operator) ? [[...new Set(val.operator)].toString()] : [val.operator.toString()]
          let ProdID = val.product_id ? [val.product_id] : [" - "]
          tempdownloadabledata.push(
            [index + 1,

            ...groupby !== 3 ? [val.assetName] : [],

            ...groupby === 4 ? [val.order_id ?

              val.order_id

              : " - "] : [],
            
            ...groupby !== 3 && val.startrange ? [moment(val.startrange).subtract(DSTrange,'hour').format('DD/MM/YYYY HH:mm:ss')] : [],

            ...groupby === 4 && val.endrange ? [moment(val.endrange).subtract(DSTrange,'hour').format('DD/MM/YYYY HH:mm:ss')] : [],

            ...(groupby === 2) ? [shiftName] : [],

            ...(groupby === 3 || groupby === 4) && val.operator ? Operator : [],

            ...groupby === 4 ? ProdID : [],

            ...(groupby !== 3 && headPlant.appTypeByAppType && headPlant.appTypeByAppType.id === 2 && val.dressingCount) ? [val.dressingCount] : "0",

            val.downTime ? commonReports.formattime(val.downTime, false) : "00:00:00",

            val.expParts ? Math.floor(val.expParts) : "0",

            val.actParts ? Math.floor(val.actParts) : "0",

            val.qualdefects ? Math.floor(val.qualdefects) : "0",

            val.goodParts ? val.goodParts : "0",

            val.OEE !== 0  ? val.OEE + " %" : "0 %",

            val.ME ? Math.round(val.ME) + " %" : "0 %",

            val.EE ? Math.round(val.EE) + " %" : "0 %",

            val.elect ? Number(val.elect).toFixed(2) + " kwh" : "0 kwh ",

            val.gas ? Number(val.gas).toFixed(2) + " kwh" : "0 kwh"])
          let Operatorstr = Array.isArray(val.operator) ? [[...new Set(val.operator)].toString()] : val.operator.toString() 
          let expParts;

              if (val.expParts && typeof (val.expParts) === 'number') {
                expParts = `${Math.floor(val.expParts)}`;
                  
                  if (val.isDryer) {
                    expParts += " Ton";
                  }
              } else {
                expParts = "0";
              }
          let actParts;

              if (val.actParts && typeof (val.actParts) === 'number') {
                actParts = `${Math.floor(val.actParts)}`;
                  
                  if (val.isDryer) {
                    actParts += " Ton";
                  }
              } else {
                actParts = "0";
              }
          let qualDef;

              if (val.qualdefects && typeof(val.qualdefects) === 'number') {
                qualDef = `${Math.floor(val.qualdefects)}`;
                  
                  if (val.isDryer) {
                    qualDef += " Ton";
                  }
              } else {
                qualDef = "0";
              }

         let goodParts;

              if (val.goodParts && typeof(val.goodParts) === 'number') {
                  goodParts = `${val.goodParts.toFixed(2)}`;
                  
                  if (val.isDryer) {
                    goodParts += " Ton";
                  }
              } else {
                goodParts = "0";
              }

                  

                  

          return [

            (index + 1),

            val.assetName,

            val.order_id ?

              val.order_id

              : " - ",
      // eslint-disable-next-line array-callback-return

            val.startrange ? moment(val.startrange).subtract(DSTrange,'hour').format(groupby === 1 ? 'DD/MM/YYYY':'DD/MM/YYYY HH:mm:ss') : moment(val.startrange).format('DD/MM/YYYY'),

            val.endrange ? moment(val.endrange).subtract(DSTrange,'hour').format('DD/MM/YYYY HH:mm:ss') : "",

            shiftName,

            val.operator ? Operatorstr : "-",

            val.product_id ?

              val.product_id

              : " - ",

            val.dressingCount,
                  // eslint-disable-next-line array-callback-return


            
            <TypographyNDL style={{ fontWeight: "400", fontSize: "0.875rem", width: "70%" }} value={val.downTime ? commonReports.formattime(val.downTime, false) : "00:00:00"} />,
               

            expParts,

            actParts,

            qualDef,

            goodParts,

            val.OEE ? val.OEE.toFixed(4) + " %" : "0 %",

            val.ME ? Math.round(val.ME) + " %" : "0 %",

            val.EE ? Math.round(val.EE) + " %" : "0 %",

            val.elect && typeof (val.elect) === 'number' ? Number(val.elect).toFixed(2) + " kwh" : "0 kwh ",

            val.gas && typeof (val.gas) === 'number' ? Number(val.gas).toFixed(2) + " kwh" : "0 kwh",
          ]

        })

      );

    }
    console.log(tempdownloadabledata,"tempdownloadabledata")

    setdownloadabledata(tempdownloadabledata)
    setTableData(temptabledata);
    setCompleteTableData(temptabledata)

  }; 
  

  useEffect(() => {
    if (!deleteReportLoading && deleteReportData && !deleteReportError) {
      if (deleteReportData > 0) {

        SetMessage(t("Deleted the w/o execution "));
        SetType("success");
        setOpenSnack(true);
        props.triggerOEE()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteReportData]);

  useEffect(() => {

    props.triggerOEE()


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editExecute])

  
  const editExecution = (id, value) => {

    setEditExec(true);

    setEditExecVal(value);

  };

  useEffect(() => {
    processedrows();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.outTableData]);
  const onClose = () => {
    setFormulaDialog(false);
  }

  const deleteExecution = () => {
    setFormulaDialog(false);
    let id = delValue.execid;
    getDeleteReport(id);

  };
  const onOpenConfirm = (id, val) => {
    setFormulaDialog(true);
    setDelValue(val);
  }


 

  const handleColChange = (e, prop) => {
    const value = e.map(x => x.id);
   
    let newCell = []
    // eslint-disable-next-line array-callback-return
    headCells.map(p => {
        let index = value.findIndex(v => p.id === v)
        if (index >= 0) {
            newCell.push({ ...p, display: 'block' })
        } else {
            newCell.push({ ...p, display: 'none' })
        }
    })
    setheadCells(newCell)
    setselectedcolnames(e);
}

  return (
    <React.Fragment>
      <ModalNDL open={formulaDialog} onClose={props.handleFormulaDialogClose} > 
        <ModalHeaderNDL>
          <TypographyNDL variant="heading-02-s" model value={t('Delete Work Order')}/>           
        </ModalHeaderNDL>
        <ModalContentNDL>
          <TypographyNDL variant="lable-01-s" color="secondary" value={
            (<b>{t("Note:")} </b>) +
            (<font color="red">{t("Are You Soure Want to Delete Production Work order")}</font>)} /> 

         
        </ModalContentNDL>
        <ModalFooterNDL>
          <Button id='reason-update' type="primary" danger={true} value={t('YesDelete')} onClick={() => { deleteExecution() }}>
          </Button>
          <Button id='reason-update' type={"secondary"} danger value={t('Cancel')} onClick={onClose}>
          </Button>
        </ModalFooterNDL>
    </ModalNDL> 


      <div style={{ float: "right", marginTop:"10px",marginRight:"10px" }}>
        <SelectBox
            labelId="Role"
            options={headCells.filter(x => !x.hide)}
            isMArray={true}
            multiple
            checkbox={false}
            value={selectedcolnames}
            placeholder={t("Select column")}
            disabledName={t("FilterColumn")}
            onChange={handleColChange}
            keyValue="label"
            keyId="id"
            id="ColSelect"
            selectAll={true}
            selectAllText={"Select All"}
            
            
            />

      </div>
     
      <EnhancedTable
        headCells={headCells}
        search={true}
        download={true}
        data={tabledata}
        rawdata={props.outTableData ? props.outTableData : []}
        open={open}
        handleEdit={(id, value) => editExecution(id, value)}
        handleDelete={(id, value) => onOpenConfirm(id, value)}
        actionenabled={false}
        enableDelete={true}
        enableEdit={true}
        downloadabledata={downloadabledata}
        // downloadHeadCells={headCells.filter(h=> h.display === 'block')}
        verticalMenu={true}
        tagKey={["downtime"]}

            groupBy={'production_work_order_report'}
      />
    </React.Fragment>

  );
};

export default ProductionWorkOrders;
