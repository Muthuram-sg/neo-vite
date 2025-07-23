/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { exploreRange, customdates, selectedPlant, lineEntity, instrumentsArry, userLine, snackMessage, snackType, snackToggle } from "recoilStore/atoms";

import Dialog from 'components/Core/ModalNDL';
import DialogTitle from 'components/Core/ModalNDL/ModalHeaderNDL';
import DialogContent from 'components/Core/ModalNDL/ModalContentNDL';
import ToolTip from "components/Core/ToolTips/TooltipNDL";
import EnhancedTable from "components/Table/Table";
import Typography from "components/Core/Typography/TypographyNDL";
import moment from "moment";
import FFTPlot from 'assets/neo_icons/Menu/3DPlot.svg?react';
import TrendsChart from "../Trends/components/TrendsGraph/components/TrendsChart";
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import useDefectInfo from "./hooks/useGetDefectInfo";
import useDefectSeverity from "./hooks/useGetDefectSeverity";
import useTrends from "../Trends/hooks/useTrends";
import Close from 'assets/neo_icons/close.svg?react';
import LinearProgress  from 'components/Core/ProgressIndicators/ProgressIndicatorNDL';
import { useAuth } from "components/Context";
import commonexplore from "../../commonExplore";
import CustomTextField from "components/Core/InputFieldNDL";
import useGetFaultInfo from "./hooks/useGetFaultInfo";
import useUpdateFaultInfo from "./hooks/useUpdateFaults";
import useFaultRecommendations from "./hooks/useGetFaultRecommendations";
import useGetSensorDetails from "./hooks/useGetSensorDetails";
import Bulb from 'assets/neo_icons/Notification/Lightbulb.svg?react';
import { t } from "i18next";


export default function FaultHistory(props) {
  const [selectedRange] = useRecoilState(exploreRange);
  const [customdatesval,] = useRecoilState(customdates);
  const [headPlant] = useRecoilState(selectedPlant);
  const [entityList] = useRecoilState(lineEntity);
  const [tabledata, setTableData] = useState([])
  const [faultsdata, setfaultsdata] = useState([])
  const [filteredfaultsdata, setFilteredFaultsData] = useState([])
  const [FaultFilterBy, setFaultFilterBy] = useState([]);
  const [assetselected, setAsset] = useState('')
  const [fftDialog, setfftDialog] = useState(false);
  const [graphdata, setGraphData] = useState({ 'data': [], 'annotation': [], 'charttype': "fft" })
  const [,setDialogTitle] = useState('')
  const [instrumentList] = useRecoilState(instrumentsArry);
  const [loading, setLoading] = useState(null);
  const [defects, setDefects] = useState([])
  const [faultselected, setselectedFault] = useState('');
  const [faultseverityselected, setselectedFaultSeverity] = useState('');
  const [collapsedrow, setcollapsedrowid] = useState([])
  const [users] = useRecoilState(userLine);
  const [defectseverity, setDefectsSeverity] = useState([])
  const [downloadablecolumn, setdownloadabledata] = useState();
  const { defetcsinfoLoading, defectsinfodata, defectsinfoerror, getDefectInfo } = useDefectInfo();
  const { defetcsseverityLoading, defectsseveritydata, defectsseverityerror, getDefectSeverity } = useDefectSeverity();
  const { trendsdataLoading, trendsdataData, trendsdataError, getTrends } = useTrends();
  const { faultInfoLoading, faultInfoData, faultInfoError, getFaultInfo } = useGetFaultInfo();
  const { faultupdateLoading, faultupdateData, faultupdateError, getUpdateFaultInfo } = useUpdateFaultInfo()
  const { faultrecommendationsLoading, faultrecommendationsdata, faultrecommendationserror, getFaultRecommendations } = useFaultRecommendations()
  const { sensordetailsLoading, sensordetailsdata, sensordetailserror, getSensorDetails } = useGetSensorDetails()
  const { HF } = useAuth();
  const [, setSnackMessage] = useRecoilState(snackMessage);
  const [, setType] = useRecoilState(snackType);
  const [, setOpenSnack] = useRecoilState(snackToggle);
  const [faultactions, setfaultactions] = useState([])
  const [sensorsdata, setsensordata] = useState([])
  const headCells = [

    {
      id: 'Asset',
      numeric: false,
      disablePadding: false,
      label: t('Asset'),
      align: 'left'
    },
    
    {
      id: 'Sensor',
      numeric: false,
      disablePadding: true,
      label: t('Sensors'),
      align: 'left'
    },
    {
      id: 'SensorAxis',
      numeric: false,
      disablePadding: true,
      label: t('Axis'),
      align: 'left'
    },
    {
      id: 'Time',
      numeric: false,
      disablePadding: true,
      label: t('Time'),
      align: 'left'
    },
    {
      id: 'Fault',
      numeric: false,
      disablePadding: true,
      label: t('Fault'),
      align: 'left'
    },
    {
      id: 'Fault Severity',
      numeric: false,
      disablePadding: true,
      label: t('Severity'),
      align: 'left'
    },
   
    {
      id: 'Remarks',
      numeric: false,
      disablePadding: false,
      label: t('remarks'),
      align: 'left'
    },
    {
      id: 'Analyst',
      numeric: false,
      disablePadding: false,
      label: 'Analyst',
      align: 'left'
    },
    {
      id: 'Fault_ID',
      numeric: false,
      disablePadding: true,
      label: t('Fault_id'),
      align: 'left',
      display: 'none'
    },
    {
      id: 'Fault_severity_id',
      numeric: false,
      disablePadding: true,
      label: t('FaultSeverity'),
      align: 'left',
      display: 'none'
    },
    {
      id: 'Fault_action_recommended',
      numeric: false,
      disablePadding: true,
      label: t('ActionRecommended'),
      align: 'left',
      display: 'none'
    },
    {
      id: 'Data_received',
      numeric: false,
      disablePadding: true,
      label: t('Latest Data Recorded'),
      align: 'left',
    },
    {
      id: 'Fault_processed',
      numeric: false,
      disablePadding: true,
      label: t('Last Defect Processed'),
      align: 'left',
    }

  ];

  const subtableheadCells = [

    

    {
      id: 'Sensor-Axis',
      numeric: false,
      disablePadding: true,
      label: t('Axis'),
      align: 'center'
    },
    {
      id: 'Time',
      numeric: false,
      disablePadding: true,
      label: t('Time'),
      align: 'center'
    },
    {
      id: 'Fault',
      numeric: false,
      disablePadding: true,
      label: t('Fault'),
      align: 'center'
    },
    {
      id: 'Fault Severity',
      numeric: false,
      disablePadding: true,
      label: t('Severity'),
      align: 'center'
    },

    {
      id: 'Remarks',
      numeric: false,
      disablePadding: false,
      label: t('remarks'),
      align: 'center'
    },
    {
      id: 'Analyst',
      numeric: false,
      disablePadding: false,
      label: t('Analyst'),
      align: 'center'
    },
    {
      id: 'Fault_action_recommended',
      numeric: false,
      disablePadding: true,
      label: t('ActionRecommended'),
      align: 'left',
      display: 'none'
    }

  ];
  const Faults = [{ "key": 1, "value": "Asset" }, { "key": 2, "value": "Fault" }, { "key": 3, "value": "Fault Severity" }]

  const getNotifications = (message, type) => {
    setSnackMessage(message)
    setType(type)
    setOpenSnack(true)
  }

  useEffect(() => {

    getDefectInfo()
    getDefectSeverity()
    getFaultRecommendations()
    getSensorDetails(headPlant.id)
    setTableData([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headPlant.id])


  useEffect(() => {
    if ((!defetcsinfoLoading && defectsinfodata && !defectsinfoerror) ||
      (!defetcsseverityLoading && defectsseveritydata && !defectsseverityerror) ||
      (!faultrecommendationsLoading && faultrecommendationsdata && !faultrecommendationserror) ||
      (!sensordetailsLoading && sensordetailsdata && !sensordetailserror)) {
      if (defectsinfodata) {
        let tempdefects = [...[{ "defect_id": -1, "defect_name": "All" }], ...defectsinfodata]
        setDefects(tempdefects)
      }
      if (defectsseveritydata) {
        let tempseverity = [...[{ "id": -1, "severity_type": "All" }], ...defectsseveritydata]
        setDefectsSeverity(tempseverity)
      }
      if (sensordetailsdata) {
        setsensordata(sensordetailsdata)
      }

      setfaultactions(faultrecommendationsdata)

      setLoading(true)
      fetchfaults()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defetcsinfoLoading, defectsinfodata, defectsinfoerror, selectedRange, defetcsseverityLoading, defectsseveritydata, defectsseverityerror, customdatesval, faultrecommendationsLoading, faultrecommendationsdata, faultrecommendationserror, sensordetailsLoading, sensordetailsdata, sensordetailserror])

  useEffect(() => {
    if (!trendsdataLoading && trendsdataData && !trendsdataError) {
      let fftdata = trendsdataData.data.flat(1)
      if (fftdata.length > 0) {
        let finalDataArr = { 'data': [], 'annotation': [], 'charttype': "timeseries" }
        let tempObj = {
          name: fftdata[0].key + " (" + fftdata[0].iid + ")",
          id: fftdata[0].iid,
          color: "#0F6FFF",
          data: [],
          time: ""
        }
        JSON.parse(fftdata[0].value).map((fft, i) => {
          let obj1 = {
            x: 0.625 * i,
            y: fft
          }
          tempObj.data.push(obj1)
        })
        tempObj.time = fftdata[0].key.time
        finalDataArr.charttype = "fft"
        let key = finalDataArr.data.findIndex(d => d.name === fftdata[0].key + " (" + fftdata[0].key.id + ")")
        if (key >= 0) {
          finalDataArr.data[key].data.push(tempObj)
        } else {
          finalDataArr.data.push({ "name": fftdata[0].key.metric_title + " (" + fftdata[0].key.id + ")", data: [tempObj], "selectedIndex": 0 })
        }

        setfftDialog(true);
        setGraphData(finalDataArr)
      }

    }
    setLoading(false)

  }, [trendsdataLoading, trendsdataData, trendsdataError])

  useEffect(() => {
    if (!faultInfoLoading && faultInfoData && faultInfoData.length > 0 && !faultInfoError) {
      let entity_instruments = entityList.map((val =>
        val.entity_instruments
      )).flat(1)
      let tempfinaldata = []
      entity_instruments.map((val) => {
        tempfinaldata = tempfinaldata.concat(
          faultInfoData.map((item) => {
            if (item.iid === val.instrument_id) {
              return Object.assign({}, item, { "entity_id": val.entity_id })
            } else return []
          }
          ).flat(1))
      })



      let finaldata = tempfinaldata.map((val) => {
        let defect_index = defectsinfodata ? defectsinfodata.findIndex(d => Number(d.defect_id) === Number(val.defect)) : -1
        let severity_index = defectsseveritydata ? defectsseveritydata.findIndex(s => Number(s.id) === Number(val.severity)) : -1
        let entity_index = entityList ? entityList.findIndex(e => e.id === val.entity_id) : -1
        let action_index = faultactions ? faultactions.findIndex(f => (Number(f.defect_id) === Number(val.defect)) && (Number(f.severity_id) === Number(val.severity))) : -1

        return Object.assign({}, val, {
          "defect_name": defect_index >= 0 ? defectsinfodata[defect_index].defect_name : "",
          "severity_name": severity_index >= 0 ? defectsseveritydata[severity_index].severity_type : "",
          "asset": entity_index >= 0 ? entityList[entity_index].name : "",
          "collapse": false,
          "showremarks": false,
          "action_recommended": action_index >= 0 ? faultactions[action_index].action_recommended : 'No action recommended'
        })
      })

      let tempdownloadabledata = []
      let accordiandata = []

      finaldata.forEach(d => {
        let index = accordiandata.findIndex(a => a.iid === d.iid && a.entity_id === d.entity_id && a.defect === d.defect && a.key === d.key);
      
        if (index >= 0) {
          if (new Date(accordiandata[index].time).getTime() === new Date(d.time).getTime()) {
            //same axis - same time - same asset - same fault
            if (Number(accordiandata[index].severity) < Number(d.severity)) {
              accordiandata.splice(index, 1, Object.assign({}, d, { "subset": [] }));
            }
          } else {
            if (accordiandata[index].subset) {
              let subindex = accordiandata[index].subset.findIndex(a1 => new Date(a1.time).getTime() === new Date(d.time).getTime());
              if (subindex >= 0) {
                //same axis - same time - same asset - same fault
                if (Number(accordiandata[index].subset[subindex].severity) < Number(d.severity)) {
                  accordiandata[index].subset.splice(subindex, 1, d);
                }
              } else {
                accordiandata[index].subset.push(d);
              }
            }
          }
        } else {
          accordiandata.push(Object.assign({}, d, { "subset": [] }));
        }
      });
      
      accordiandata = accordiandata.map(val => {
        let sensorindex = sensorsdata.findIndex(s => s.iid === val.iid && s.axis === val.key)
        if (sensorindex >= 0) {
          return Object.assign({}, val, { "updated_at": sensorsdata[sensorindex].updated_at, "defect_processed_at": sensorsdata[sensorindex].defect_processed_at })
        } else {
          return Object.assign({}, val, { "updated_at": '', "defect_processed_at": '' })
        }
      })
      accordiandata.forEach(a => {
        let instrumentindex = instrumentList.findIndex(v => v.id === a.iid);
        let userIndex = users.findIndex(v => v.user_id === a.updated_by);
        let username = '-';
        if(userIndex >= 0)
          username = users[userIndex].userByUserId ? users[userIndex].userByUserId.name : '-' ;
        tempdownloadabledata.push([
          a.asset,
          instrumentindex >= 0 ? instrumentList[instrumentindex].name : '-',
          a.key,
          a.time ? moment(a.time).format("DD/MM/YYYY HH:mm:ss") : '-',
          a.defect_name.charAt(0).toUpperCase() + a.defect_name.slice(1),
          a.severity_name.charAt(0).toUpperCase() + a.severity_name.slice(1),
          a.remarks,
          username,
          a.updated_at ? moment(a.updated_at).format("DD/MM/YYYY HH:mm:ss") : '-',
          a.defect_processed_at ? moment(a.defect_processed_at).format("DD/MM/YYYY HH:mm:ss") : '-'
        ]);
      
        a.subset.forEach(s => {
          tempdownloadabledata.push([
            s.asset,
            instrumentindex >= 0 ? instrumentList[instrumentindex].name : '-',
            s.key,
            s.time ? moment(s.time).format("DD/MM/YYYY HH:mm:ss") : '-',
            s.defect_name.charAt(0).toUpperCase() + s.defect_name.slice(1),
            s.severity_name.charAt(0).toUpperCase() + s.severity_name.slice(1),
            s.remarks,
            username,
            a.updated_at ? moment(a.updated_at).format("DD/MM/YYYY HH:mm:ss") : '-',
            a.defect_processed_at ? moment(a.defect_processed_at).format("DD/MM/YYYY HH:mm:ss") : '-'
          ]);
        });
      });
      
     
      if (accordiandata.length === 0) {
        getNotifications(t("Fault Data is not available for the selected range."), "warning")
      } else {
        setdownloadabledata(tempdownloadabledata)
        setfaultsdata(accordiandata)
        if(filteredfaultsdata.length > 0){
          let tempfiltereddata = accordiandata.filter(a => filteredfaultsdata.some(b => a.iid === b.iid && a.entity_id === b.entity_id && new Date(a.time).getTime() === new Date(b.time).getTime() && a.defect === b.defect));  
          setFilteredFaultsData(tempfiltereddata)
          setTableData(processedrows(tempfiltereddata))
        } else {
          setFilteredFaultsData(accordiandata)
          setTableData(processedrows(accordiandata))
        }
        
       
      }

      setLoading(false)

    } else if (!faultInfoLoading && ((faultInfoData && faultInfoData.length === 0) || faultInfoLoading)) {
      getNotifications(t("Fault Data is not available for the selected range."), "warning")
      setLoading(false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faultInfoLoading, faultInfoData, faultInfoError])


  useEffect(() => {
    let filtereddata = [...faultsdata]
    if (FaultFilterBy.includes(1) && assetselected) {
      if (Number(assetselected) !== -1) {
        filtereddata = filtereddata.filter(val => val.entity_id === assetselected)
      }

    }
    if (FaultFilterBy.includes(2) && faultselected) {
      if (Number(faultselected) !== -1) {
        filtereddata = filtereddata.filter(val => Number(val.defect) === Number(faultselected))
      }

    }
    if (FaultFilterBy.includes(3) && faultseverityselected) {
      if (Number(faultseverityselected) !== -1) {
        filtereddata = filtereddata.filter(val => Number(val.severity) === Number(faultseverityselected))
      }

    }
    setFilteredFaultsData(filtereddata)
    setTableData(processedrows(filtereddata))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetselected, faultselected, faultseverityselected, FaultFilterBy])



  useEffect(() => {
    if (!faultupdateLoading && faultupdateData && !faultupdateError) {
      if (faultupdateData.length > 0 && faultupdateData[0] > 0) {
        fetchfaults()
      }
      else {
        setLoading(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faultupdateLoading, faultupdateData, faultupdateError])

  const addOrUpdateRemarks = (e, val) => {
    if (e.key === 'Enter') {
      setLoading(true)
      getUpdateFaultInfo(headPlant.schema, val.time, val.iid, val.key, val.severity, val.defect, e.target.value)
    }
  }

  const getTypoContent = (val) => {
    if(Number(val.severity) === 3){
      return <Typography variant={"Body2Reg"} className={{ backgroundColor: "#F3AFB4", borderRadius: "20px", width: "100px", marginLeft: "auto", marginRight: "auto" }} align="center" value={val.severity_name.charAt(0).toUpperCase() + val.severity_name.slice(1)} color={"#A2171D"} /> 
     } 
     else if(Number(val.severity) === 2 ){
        return <Typography variant={"Body2Reg"} className={{ backgroundColor: "#FFC0AE", borderRadius: "20px", width: "100px", marginLeft: "auto", marginRight: "auto" }} align="center" value={val.severity_name.charAt(0).toUpperCase() + val.severity_name.slice(1)} color={"#9E3614"} /> 
     }
     else{
        return <Typography variant={"Body2Reg"} className={{ backgroundColor: "#FFEDA5", borderRadius: "20px", width: "100px", marginLeft: "auto", marginRight: "auto" }} align="center" value={val.severity_name.charAt(0).toUpperCase() + val.severity_name.slice(1)} color={"#BF9600"} />
     }
  }

  const subtableprocessedrows = (data, id) => {
    let temptabledata = []
    if (data && data.length > 0) {
      data.map((val, index) => {
        let userIndex = users.findIndex(v => v.user_id === val.updated_by)
        let username = '-';
        if(userIndex >= 0)
          username = users[userIndex].userByUserId ? users[userIndex].userByUserId.name : '-';
        if (val) {
          temptabledata.push([
           
            val.key,
            val.time ? moment(val.time).format("DD/MM/YYYY HH:mm:ss") : '-',
            val.defect_name.charAt(0).toUpperCase() + val.defect_name.slice(1),
            getTypoContent(val),
            val.showremarks ?
              <CustomTextField
                defaultValue={val.remarks}
                placeholder={t("Enter a Remark")}
                onKeyPress={e => {
                  if (e.code.toLowerCase() === "enter") {

                    addOrUpdateRemarks(e, val)
                  }
                }} /> : val.remarks,
            username,
            val.action_recommended
          ]
          )
        }

      })

    }
    // setLoading(false)
    return temptabledata
  }






  const processedrows = (data) => {
    let temptabledata = []
    if (data && data.length > 0) {
      data.map((val, index) => {
        let instrumentindex = instrumentList.findIndex(v => v.id === val.iid)
        let userIndex = users.findIndex(v => v.user_id === val.updated_by)
        let username = '-';
        if(userIndex >= 0)
          username = users[userIndex].userByUserId ? users[userIndex].userByUserId.name : '-';
        if (val) {
          temptabledata.push([
            val.asset,
            instrumentindex >= 0 ? instrumentList[instrumentindex].name : '-',
            val.key,
            val.time ? moment(val.time).format("DD/MM/YYYY HH:mm:ss") : '-',
            <div key={index+1} style={{ display: "flex", alignItems: "center" }}>
              <div >
                <Typography className={{
                  backgroundColor: "#E0E0E0",
                  borderRadius: "20px",
                  padding: "4px 8px",
                  width: "35px",
                  height: "26px",
                  marginRight: "10px",
                  display: "flex",
                  flexDIrection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: "700",
                }} color={"#161616"} value={val.subset ? val.subset.length + 1 : 1} />
              </div>
              <Typography style={{ textAlign: "left", fontWeight: "400", fontSize: "0.875rem", width: "70%" }}
                value={val.defect_name.charAt(0).toUpperCase() + val.defect_name.slice(1)} />
              <ToolTip title={val.action_recommended} placement="bottom" >
                <div style={{ width: "10%", cursor: "pointer" }}><Bulb /></div>
              </ToolTip>
            </div>,
            getTypoContent(val),
            val.showremarks ? <CustomTextField
              defaultValue={val.remarks}
              placeholder={t("Enter a Remark")}
              onKeyPress={e => {
                if (e.code.toLowerCase() === "enter") {
                  addOrUpdateRemarks(e, val);
                  e.target.blur()
                }
              }}
            /> : val.remarks,
            username,
            val.defect,
            val.severity,
            val.action_recommended,
            val.updated_at ? moment(val.updated_at).format("DD/MM/YYYY HH:mm:ss") : '-',
            val.defect_processed_at ? moment(val.defect_processed_at).format("DD/MM/YYYY HH:mm:ss") : '-'

          ]
          )
        }

      })

    }
    setLoading(false)
    return temptabledata
  }
  async function fetchfaults() {
    let dates = commonexplore.getFromandToDate(selectedRange, customdatesval.StartDate, customdatesval.EndDate, headPlant)
    getFaultInfo(headPlant.schema, dates.frmDate, dates.toDate)

  }


  function handleFaultFilter(e) {
    setFaultFilterBy(e)
  }

  function handleAssetChange(e) {
    setAsset(e.target.value)
  }

  function handleFaultChange(e) {
    setselectedFault(e.target.value)
  }

  function handleFaultSeverityChange(e) {
    setselectedFaultSeverity(e.target.value)
  }

  const getfft = (value) => {
    setLoading(true)
    let ffttrends = []
    setDialogTitle(moment(value.time).format("DD/MM/YYYY HH:mm:ss") + " - " + value.severity_name + " " + value.defect_name + " - " + value.asset)
    ffttrends.push({
      "frmDate": value.time,
      "toDate": value.time,
      "interval": 30,
      "id": value.iid,
      "metric_val": "fft_" + value.key.toLowerCase(),
    })
    getTrends(ffttrends, headPlant.schema)
  }

  const timeFormat = (val) => {
    return moment(val).format("DD-MM-YYYY " + HF.HMS);
  }
  const createtask = (id, value) => {
    const Title = ' ' // title is needed.Do not modify this
    const Description = `${tabledata[id][1]}- ${value.key} - ${value.severity_name} - ${value.defect_name} @ ${timeFormat(value.time)}`
    props.createtask(Title, Description, value.time, { entity_id: value.entity_id, entity_name: value.asset, analysis_type_id: 8, analysis_type_name: "Online Vibration" })
  }


  const handlesubsetremarks = (id, index) => {
    let data = [...filteredfaultsdata]
    if (collapsedrow.length > 0 && data[index].subset) {
      data[index].subset[id].showremarks = true
      setTableData(processedrows(data))
    }

  }

  const GetCollapsibleRow = (value, id) => {
    let data = []
    let index = filteredfaultsdata.findIndex(f => (f.severity === value.Fault_severity_id) && (value.Fault_ID === f.defect) &&
      (value.Asset === f.asset) && (value.SensorAxis === f.key) && (new Date(moment(value.Time, "DD/MM/YYYY HH:mm:ss")).getTime() === new Date(f.time).getTime()))
    if (index >= 0) {
      data = subtableprocessedrows(filteredfaultsdata[index].subset, id)
    }


    return (
      <div style={{ width: "100%" }}>
        <EnhancedTable
          headCells={subtableheadCells}
          data={data}
          disabledbutton={[]}
          collapsibleTable={false}
          actionenabled={true}
          customAction={{ icon: FFTPlot, name: 'Locate in Graph', stroke: '#0F6FFF' }}
          customhandle={getfft}
          rawdata={index >= 0 ? filteredfaultsdata[index].subset : []}
          enableButton={"Create Task"}
          handleCreateTask={(iid, values) => { createtask(iid, values) }}
          buttontype={"tertiary"}
          enableEdit={true}
          handleEdit={(iid, indexs) => handlesubsetremarks(iid, indexs)}

        />
      </div>

    )

  }


  const handlesupersetremarks = (id,value) => {
    let temptabledata = [...filteredfaultsdata]
    temptabledata[id].showremarks = true
    setTableData(processedrows(temptabledata))
  }

  return (
    <React.Fragment>
      <Dialog
        maxWidth="lg"
        fullWidth
        onClose={() => setfftDialog(false)} aria-labelledby="fft-dialog-title" open={fftDialog}>
        <DialogTitle id="fft-dialog-title" >
          <div style={{ display: "flex", alignItems: "center" }}>
            <FFTPlot stroke={"black"} />
            {"FFT - SPECTRUM"}
            <Close stroke="black" style={{ marginLeft: "auto" }} onClick={() => setfftDialog(false)} />
          </div>
        </DialogTitle>
        <DialogContent>
          <TrendsChart yData={graphdata} disableMeter={true} />

        </DialogContent>


      </Dialog>
      {loading && <LinearProgress />}
      <div style={{ marginTop: "10px" }}>
        <Typography variant="Body" value="Fault History" style={{ float: "left", marginLeft: "16px" }}></Typography>
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", float: "right" }}>
            <div style={{ marginRight: "10px",width:'175px' }}>
              <SelectBox
                id="fault-history-filter"
                onChange={handleFaultFilter}
                value={FaultFilterBy}
                options={Faults}
                keyId="key"
                keyValue="value"
                multiple
                placeholder={t("SelectFilterBy")}
                />
            </div>
            <div style={{ marginRight: "10px", marginLeft: "10px", display: "flex" }}>
              {FaultFilterBy.map(f=> f.key).includes(1) &&
                <div style={{ marginRight: "10px", marginLeft: "10px",width:'175px' }}>
                  <SelectBox
                    id="asset-select"
                    options={[...[{ "id": -1, "name": "All" }], ...entityList]}
                    keyId="id"
                    keyValue="name"
                    isMArray={"true"}
                    value={assetselected}
                    onChange={handleAssetChange}
                    placeholder={t("SelectFilterBy")}
                  />
                </div>
              }
              {
                FaultFilterBy.map(f=> f.key).includes(2) &&
                <div style={{ marginRight: "10px", marginLeft: "10px",width:'175px' }}>
                  <SelectBox
                    id="defect-select"
                    options={defects}
                    keyId="defect_id"
                    keyValue="defect_name"
                    isMArray={"true"}
                    value={faultselected}
                    onChange={handleFaultChange}
                    placeholder={t("SelectFilterBy")}
                  />
                </div>
              }
              {
                FaultFilterBy.map(f=> f.key).includes(3) &&
                <div style={{ marginRight: "10px", marginLeft: "10px",width:'175px' }}>
                  <SelectBox
                    id="severity-select"
                    options={defectseverity}
                    keyId="id"
                    keyValue="severity_type"
                    isMArray={"true"}
                    value={faultseverityselected}
                    onChange={handleFaultSeverityChange}
                    placeholder={t("SelectFilterBy")}
                  />
                </div>
              }

            </div>
          </div>

          <EnhancedTable
            headCells={headCells}
            data={tabledata}
            download={true}
            search={true}
            rawdata={faultsdata}
            enableButton={"Create Task"}
            actionenabled={true}
            disabledbutton={[]}
            customAction={{ icon: FFTPlot, name: 'Locate in Graph', stroke: '#0F6FFF' }}
            customhandle={getfft}
            handleCreateTask={(id, value) => { createtask(id, value) }}
            buttontype={"tertiary"}
            collapsibleTable={true}
            GetCollapsibleRow={(value, id) => GetCollapsibleRow(value, id)}
            enableEdit={true}
            handleEdit={(id, value) => handlesupersetremarks(id,value)}
            setOpenedIndex={(indices) => { indices.length > 0 ? setcollapsedrowid(indices) : setcollapsedrowid([]) }}
            downloadabledata={downloadablecolumn}
          />



        </div>
      </div>
    </React.Fragment >

  );
}
