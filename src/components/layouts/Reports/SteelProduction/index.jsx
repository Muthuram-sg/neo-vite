import React, { useState ,useEffect} from "react";
import { useRecoilState } from "recoil";
import moment from 'moment';
import EnhancedTable from "components/Table/Table";
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import { useTranslation } from 'react-i18next';
import CircularProgress  from 'components/Core/ProgressIndicators/ProgressIndicatorNDL';
import useGetSteelAssetConfig from "./hooks/useGetSteelAssetConfig";
import useGetAssetSteelData from "./hooks/useGetAssetSteelData";
import usePartsProduction from "../QualityReport/hooks/useGetPartsProduction";
import useParameterList from "../hooks/useParameterList";
import usePartMetricsData from "./hooks/usePartsMetricsData"
import {selectedPlant,stdDowntimeAsset,oeereportgroupby,customdates,snackMessage,snackType,snackToggle,userData} from 'recoilStore/atoms'
import commonReports from '../components/common';
import Typography from 'components/Core/Typography/TypographyNDL'
import ButtonNDL from 'components/Core/ButtonNDL';
import useGenerateRawReport from 'components/layouts/Reports/hooks/useGenerateRawReport';
import * as momentZone from 'moment-timezone';


export default function SteelProduction() {
  const { t } = useTranslation();
  const [headPlant] = useRecoilState(selectedPlant);
  const [tabledata, setTableData] = useState([])
  const [PerPage] = useState(10)
  const [Page] = useState(0)
  const [groupby] = useRecoilState(oeereportgroupby)
  const [selectedColNames, setSelectedColNames] = useState([])
  const [steelData,setSteelData]=useState([])
  const [steelAsset,] = useRecoilState(stdDowntimeAsset);
  const [customdatesval,] = useRecoilState(customdates); 
  const [assetList,setAssetList]=useState([])
  const [metricData,setMetricData]=useState([])
  const [filteredMetricValue,setFilteredMetricValue]=useState([])
  const [partMetrics,setPartMetrics]=useState([])
  const [steelProdFormData,setSteelProdFormData]=useState([])
  const [fieldNames,setFieldNames]=useState([])
  const [currUser] = useRecoilState(userData); 

  const { partProductionLoading, partProductionData, partProductionError, getPartsProduction } = usePartsProduction()
  const { SteelAssetConfigLoading, SteelAssetConfigData, SteelAssetConfigError, getSteelAssetConfig } = useGetSteelAssetConfig();
  const { SteelAssetDataLoading, SteelAssetData, SteelAssetDataError, getSteelAssetData } = useGetAssetSteelData();
  const { ParameterListLoading, ParameterListData, ParameterListError, getParameterList } = useParameterList();
 const {partMetricsDataLoading, partMetricsData, partMetricsDataError, getPartMetricsData} =usePartMetricsData()
 const { GenerateRawReportLoading, GenerateRawReportData, GenerateRawReportError, getGenerateRawReport } = useGenerateRawReport();
 const [rawData,setRawData]=useState([])


 let janOffset = moment({ M: 0, d: 1 }).utcOffset(); //checking for Daylight offset
 let julOffset = moment({ M: 6, d: 1 }).utcOffset(); //checking for Daylight offset
 let stdOffset = Math.min(janOffset, julOffset);// Then we can make a Moment object with the current time at that fixed offset 
 let TZone = moment().utcOffset(stdOffset).format('Z') // Time Zone without Daylight 

  const AllTypeHeadCells = [{
    id: 'sno',
    numeric: false,
    disablePadding: false,
    label: t('S.No'),
    hide: false
  },
  {
    id: 'assetName',
    numeric: false,
    disablePadding: false,
    label: t('AssetName'),
    hide: false
  },
  {
    id: 'PartCount',
    numeric: false,
    disablePadding: false,
    label: t('PartCount'),
    hide: false
  },
  {
    id: 'Date',
    numeric: false,
    disablePadding: false,
    label: t('Date'),
    hide: false
  },
  {
    id: 'Time',
    numeric: false,
    disablePadding: false,
    label: t('Time'),
    hide: false
  },
  {
    id: 'Shift',
    numeric: false,
    disablePadding: false,
    label: t('shift'),
    hide: false
  }

  ]
  const daywiseHeadCells=[
    {
      id: 'sno',
      numeric: false,
      disablePadding: false,
      label: t('S.No'),
      hide: false
    },
    {
      id: 'AssetName',
      numeric: false,
      disablePadding: false,
      label: t('AssetName'),
      hide: false
    },
    {
      id: 'Date',
      numeric: false,
      disablePadding: false,
      label: t('Date'),
      hide: false
    },
    {
      id: 'ManufacturedQty',
      numeric: false,
      disablePadding: false,
      label: t('ManufacturedQty'),
      hide: false
    },
    {
      id: 'DefectiveQty',
      numeric: false,
      disablePadding: false,
      label: t('DefectiveQty'),
      hide: false
    },
    {
      id: 'QualifiedQty',
      numeric: false,
      disablePadding: false,
      label: t('QualifiedQty'),
      hide: false
    },

  ]
  const shiftwiseHeadcells=[
    {
      id: 'sno',
      numeric: false,
      disablePadding: false,
      label: t('S.No'),
      hide: false
    },
    {
      id: 'AssetName',
      numeric: false,
      disablePadding: false,
      label: t('AssetName'),
      hide: false
    },
    {
      id: 'Date',
      numeric: false,
      disablePadding: false,
      label: t('Date'),
      hide: false
    },
    {
      id: 'shift',
      numeric: false,
      disablePadding: false,
      label: t('Shift'),
      hide: false
    },
    {
      id: 'ManufacturedQty',
      numeric: false,
      disablePadding: false,
      label: t('ManufacturedQty'),
      hide: false
    },
    {
      id: 'DefectiveQty',
      numeric: false,
      disablePadding: false,
      label: t('DefectiveQty'),
      hide: false
    },
    {
      id: 'QualifiedQty',
      numeric: false,
      disablePadding: false,
      label: t('QualifiedQty'),
      hide: false
    }
  ]
  const defaultHeadcells=[ {
    id: 'sno',
    numeric: false,
    disablePadding: false,
    label: t('S.No'),
    hide: false
  },
  {
    id: 'operatorName',
    numeric: false,
    disablePadding: false,
    label: t('Operator Name'),
    hide: false
  },
  {
    id: 'Date',
    numeric: false,
    disablePadding: false,
    label: t('Date'),
    hide: false
  },
  {
    id: 'WorkOrder',
    numeric: false,
    disablePadding: false,
    label: t('WorkOrder'),
    hide: false
  },{
    id: 'PartCount',
    numeric: false,
    disablePadding: false,
    label: t('PartCount'),
    hide: false

  }]
  const [headCells, setheadCells] = useState(defaultHeadcells);
  const [isBulkDownload,setisBulkDownload] = useState(false)
  const [cancelText,setcancelText] = useState(false)
  const [bulkJsonobj,setbulkJsonobj] = useState({})
  const [, setSnackMessage] = useRecoilState(snackMessage);
  const [, setType] = useRecoilState(snackType);
  const [, setOpenSnack] = useRecoilState(snackToggle);
  const [successMessage,setsuccessMessage] = useState(false)
  const [FailedMessage,setFailedMessage] = useState(false)
 
  //Hard coding Parts data
  useEffect(()=>{
    let from =moment(customdatesval.StartDate)
    let to = moment(customdatesval.EndDate)
    if (to.diff(from, 'hours') > 168 && steelAsset.length > 0) {
      setisBulkDownload(true)
      setcancelText(false)
      setsuccessMessage(false)
      setFailedMessage(false)
    } else {
      setisBulkDownload(false)
      setcancelText(false)
      setsuccessMessage(false)
      setFailedMessage(false)

    }
    
  },[customdatesval,steelAsset])

  useEffect(() => {
    if(!GenerateRawReportLoading && GenerateRawReportData && !GenerateRawReportError){ 
        if(GenerateRawReportData.id){ 
          setOpenSnack(true)
          setType("success")
          setSnackMessage("Bulk report generation Started Successfuly")
          setFailedMessage(false)
          setsuccessMessage(true)


        }else{ 
            setOpenSnack(true)
            setType("warning")
            setSnackMessage("Unable To Run Bulk Report Please Try Again")
            setsuccessMessage(false)
            setFailedMessage(true)


        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [GenerateRawReportLoading, GenerateRawReportData, GenerateRawReportError]);

  useEffect(() => { 
    let selectedDate =moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ssZ")
    let to = moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ssZ")
      try{
       
        
        const assetSelected=steelData.filter(entity => entity.entity_id === steelAsset)
        const modifiedAssetArray = assetSelected.map(obj => {

          if (obj.entity && obj.entity.prod_asset_oee_configs && obj.entity.prod_asset_oee_configs.length > 0) {
              // Extract the metric object
          
              const metricObject = obj.entity.prod_asset_oee_configs[0].metric;
              const instrumentObject=obj.entity.prod_asset_oee_configs[0].entity.entity_instruments[0].instrument_id;
              const partSignal=obj.entity.prod_asset_oee_configs[0].part_signal;
              const partSignalInstrument=obj.entity.prod_asset_oee_configs[0].part_signal_instrument;
              const plannedDowntime=obj.entity.prod_asset_oee_configs[0].planned_downtime
              const setUpTime=obj.entity.prod_asset_oee_configs[0].setup_time;
              const isPartCountBinary=obj.entity.prod_asset_oee_configs[0].is_part_count_binary;
              const isPartCountdownfall=obj.entity.prod_asset_oee_configs[0].is_part_count_downfall;
              const isStatusSignalAvailable=obj.entity.prod_asset_oee_configs[0].is_status_signal_available;
    
      
              // Remove prod_asset_oee_configs from entity
              delete obj.entity.prod_asset_oee_configs;
      
              // Add the metric object at the root level
              obj.metric = metricObject;
              obj.instrument_id=instrumentObject;
              obj.part_signal=partSignal;
              obj.part_signal_instrument=partSignalInstrument;
              obj.planned_downtime=plannedDowntime;
              obj.setup_time=setUpTime;
              obj.is_part_count_binary=isPartCountBinary;
              obj.is_part_count_downfall=isPartCountdownfall;
              obj.is_status_signal_available=isStatusSignalAvailable;
          }
      
          return obj;
      });
      const modifiedAssetNewArray=modifiedAssetArray.slice(0,1); 
     
      const formulaArray = [];
      modifiedAssetNewArray.forEach((item) => {
        item.calculations.forEach((calc) => {
          formulaArray.push(calc.Formula);
        });
      });
      const instrumentID=modifiedAssetNewArray.map(val => val.instrument_id)
  
      const variableNames = extractVariableNamesFromFormulas(formulaArray);
      const filteredMetricData = metricData.filter((metricObject) => {
        return variableNames.includes(metricObject.title);
      });
      setFilteredMetricValue(filteredMetricData)
      const filteredMetricName = filteredMetricData.map((val) => val.name); 
    if (moment(to).diff(moment(selectedDate), 'hours') <= 168) {
      getPartMetricsData(headPlant.schema,instrumentID,filteredMetricName.join(','),selectedDate, to)
      getPartsProduction(headPlant,modifiedAssetNewArray, {From: selectedDate, To:to},'all','',0,groupby) 
    }
      if(selectedDate && to){
        setbulkJsonobj({
          schema:headPlant.schema,
          line_id:headPlant.id,
          from:selectedDate,
          to:to,
          instrumentid:instrumentID.join(','),
          metricid: filteredMetricName.join(','),
          filteredMetricData:filteredMetricData,
          groupby:groupby,
          user_id:currUser.id,
          modifiedAssetNewArray:modifiedAssetNewArray,
          currPage:0,
          type:"all",
          steelAsset: steelAsset,
          shift:headPlant.shift
        })
  
      }
  
      }
      catch(err){
        console.log('err',err)
        setTableData([])
      }
    
   
   
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[steelAsset,customdatesval,headPlant,groupby,steelData])

  useEffect(() => {
    if(!partMetricsDataLoading && partMetricsData&& !partMetricsDataError){
   
      setPartMetrics(partMetricsData.data);
    }

  },[partMetricsDataLoading, partMetricsData, partMetricsDataError])
  
      useEffect(() => {
        getSteelAssetConfig(headPlant.id)
        getParameterList()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant])
   useEffect(() => {
    getSteelAssetData(steelAsset);
   // eslint-disable-next-line react-hooks/exhaustive-deps
   },[steelAsset])

    useEffect(() => {
      if(!partProductionLoading && partProductionData&& !partProductionError){
      
          setSelectedColNames(headCells.filter(val => !val.hide))
          processedrows(groupby)
      }
      else{
        setTableData([])
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[partProductionLoading, partProductionData, partProductionError,groupby])


  useEffect(() => {
     if (!SteelAssetConfigLoading && !SteelAssetConfigError && SteelAssetConfigData) {
    
            setSteelData(SteelAssetConfigData)
        }
 }, [SteelAssetConfigLoading ,SteelAssetConfigError , SteelAssetConfigData])

useEffect(() => {
  if(!SteelAssetDataLoading && SteelAssetData && !SteelAssetDataError){

    setSteelProdFormData(SteelAssetData)
  }
},[SteelAssetDataLoading, SteelAssetData, SteelAssetDataError])
useEffect(() => {
  if(!ParameterListLoading && ParameterListData && !ParameterListError){

    setMetricData(ParameterListData)
  }
},[ParameterListLoading, ParameterListData, ParameterListError,])
    useEffect(() => {

      const steelAssetData=steelData.filter(entity => entity.entity_id === steelAsset)
      const steelAssetNewData=steelAssetData.slice(0,1);
      setAssetList(steelAssetNewData)
      
      setTableData([])
      if(groupby === 1){
         // eslint-disable-next-line eqeqeq
         setheadCells(AllTypeHeadCells);
      
        //Dynamic Addition of Fieldnames and FormulaNames as Field
        let formLayoutString=steelAssetNewData[0]?steelAssetNewData[0].form_layout:'';
        let formLayoutArray;
        try {
             formLayoutArray = JSON.parse(formLayoutString);
            
            } catch (error) {
              formLayoutArray=formLayoutString;
             console.error("Error parsing JSON:", error);
            }

            if (Array.isArray(steelAssetNewData) && steelAssetNewData.length > 0) {
              // Access the first element and update the form_layout property
              steelAssetNewData[0].form_layout = formLayoutArray;
            } 
      

        const fieldNamesArray=steelAssetNewData.flatMap((item) => {
          return item.form_layout
            ? item.form_layout.map((field) => {
                return {
                  id: field.FieldName, 
                  numeric: false,
                  disablePadding: false,
                  label: field.FieldName,
                  hide: false,
                };
              })
            : [];
        });
        setFieldNames(fieldNamesArray)
        const formulaNamesArray = steelAssetNewData.flatMap((item) => {
          return item.calculations
            ? item.calculations.map((calculation) => {
                return {
                  id: calculation.FieldName, 
                  numeric: false,
                  disablePadding: false,
                  label: calculation.FieldName,
                  hide: false,
                };
              })
            : [];
        });
   
      setheadCells((prevHeadCells) => [...prevHeadCells,...fieldNamesArray, ...formulaNamesArray]);
      }
      else if(groupby === 2){
        setheadCells(daywiseHeadCells);
      }
      else if(groupby === 3){
        setheadCells(shiftwiseHeadcells)
      }
      else{
        setheadCells(defaultHeadcells)
      }
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[steelAsset,steelData,groupby])
   
    const formatTime = (time) => {
      const date = new Date(time);
      return date.toISOString();
  };

 
  


  const calculateFormulas = (formulas, values) => {
    const calculatedValues = [];
  
    formulas.forEach((formula, index) => {
      // eslint-disable-next-line no-unused-vars
      const replacedFormula = formula.replace(/\b([a-zA-Z0-9_ ]+)\b/g, (match, variable) => {
        const trimmedVariable = variable.trim();
              // eslint-disable-next-line array-callback-return
        return values.hasOwnProperty(trimmedVariable) ? (!isNaN(values[trimmedVariable]) ? values[trimmedVariable] : 0 ) : match;
      });
  
     
      try {
         // eslint-disable-next-line no-eval
        const result = eval(replacedFormula);
  
        if (typeof result === 'number' && !isNaN(result)) {
          // Check if the result is a decimal number
          const resultWithTwoDecimalPoints = Number.isInteger(result) ? result : result.toFixed(2);
          calculatedValues[index] = parseFloat(resultWithTwoDecimalPoints);
        } else {
          calculatedValues[index] = '-';
        }
      } catch (error) {
        console.error(`Error in evaluating formula at index ${index}:`, error);
        calculatedValues[index] = '-';
      }
    });
  
    return calculatedValues;
  };
  


  const extractVariableNamesFromFormulas = (formulas) => {
    const variableNames = new Set();
  
    formulas.forEach((formula) => {
            // eslint-disable-next-line array-callback-return
      const matches = formula.match(/[a-zA-Z0-9_]+(?: [a-zA-Z0-9_]+)*/g);
  
      const filteredMatches = matches.filter((match) => isNaN(Number(match)));
  
      filteredMatches.forEach((variable) => {
        variableNames.add(variable);
      });
    });
  
    return Array.from(variableNames);
};

  function filterValueDataByLabels(FieldArrayOfObjects, valueData) {
    const filteredValueData = {};

    for (const obj of FieldArrayOfObjects) {
        const fieldName = obj.label;
        if (valueData.hasOwnProperty(fieldName)) {
            filteredValueData[fieldName] = valueData[fieldName];
        }
    }

    return filteredValueData;
}


    const processedrows = async (aggregate) => { 
     
      let data = [...partProductionData.Data];
      if(data && data.length > 0){ 
          try{ 
              let temptabledata = []
              let partData = [];

             
                  partData = [...data];
           
              if(aggregate === 2){
                  temptabledata = temptabledata.concat(partData.map((val, index) => {
                      return [index+1,val.entity,moment(val.date).format('DD-MM-YYYY'),val.total,val.defect,val.qualified]
                  })
                  ) 
              }else if(aggregate === 3){
                  temptabledata = temptabledata.concat(partData.map((val, index) => {
                      return [index+1,val.entity,moment(val.date).subtract(moment(val.date).isDST() ? 1 : 0,'hour').format('DD-MM-YYYY HH:mm:ss'),val.shift,val.total,val.defect,val.qualified]
                  }))
              }else if(aggregate === 4 || aggregate === 5){
                temptabledata = temptabledata.concat(partData.map((val, index) => {
                    return [index+1,val.operatorName,moment(val.date).subtract(moment(val.date).isDST() ? 1 : 0,'hour').format('DD-MM-YYYY HH:mm:ss'),val.WorkOrder,val.total,val.defect,val.qualified]
                }))
              }else{
                
                let modifiedSteelData = steelProdFormData.map((obj) => ({
                  ...obj,
                  time: formatTime(obj.time),
              })); 
              setSteelProdFormData(modifiedSteelData)
              let shifts = commonReports.getShiftBetweenDates2(
                moment(moment(customdatesval.StartDate).startOf('day').utcOffset(stdOffset).format("YYYY-MM-DDTHH:mm:ss" + TZone)),
                moment(moment(customdatesval.EndDate).endOf('day').utcOffset(stdOffset).format("YYYY-MM-DDTHH:mm:ss" + TZone)),
                headPlant.shift)
                
                  temptabledata = temptabledata.concat(partData.map((val, index) => {
                    const matchingTimeData = modifiedSteelData.find((steelIndex) => formatTime(steelIndex.time) === formatTime(val.time));
                    // shift filtering based on part produced time
                    const shiftName = shifts.filter(shift=>moment(val.time).isBetween(moment(shift.start),moment(shift.end),null,'[]'));
                 
            
                    if(matchingTimeData){
                     
                      const valueData = matchingTimeData.value;
                      let filteredData = filterValueDataByLabels(fieldNames, valueData);
                   
                      fieldNames.forEach((field) => {
                        if (!(field.id in filteredData)) {
                            // If not present, add it with value '-' at the corresponding index
                            filteredData[field.id] = '-';
                            // Reorder the fields to match the original order
                            filteredData = Object.fromEntries(Object.entries(filteredData).sort(([key1], [key2]) => {
                                return fieldNames.findIndex(f => f.id === key1) - fieldNames.findIndex(f => f.id === key2);
                            }));
                        }
                    });
                 
                      const valueFieldData=Object.values(filteredData)
                      const clonedValueData = JSON.parse(JSON.stringify(filteredData));
                 
                      const formulaArray=[];
                     
                      assetList.forEach(item => {
                        item.calculations.forEach(calc => {
                            formulaArray.push(calc.Formula);
                        })
                      })
                 
                    partMetrics.forEach((partMetric) => {
                      // Find the corresponding metric in filteredMetricValue array
                      const matchingMetric = filteredMetricValue.find(
                        (filteredMetric) => partMetric.key === filteredMetric.name && matchingTimeData.time === partMetric.time
                      );
                    
                      // If a matching metric is found, use its title in valueData
                      if (matchingMetric) {
                        const title = matchingMetric.title;
                        clonedValueData[title] = partMetric.value;
                      }
                    });
                 
                    
                   const result=calculateFormulas(formulaArray,clonedValueData)
                
                  
                          let partCnt = partProductionData.count - (index + (Page * PerPage))
                          let Sno = partProductionData.count - (partProductionData.count - (index + (Page * PerPage)))
                          let PartNum = val['instrument_type']===9 ? val.value : partCnt
                      return [Sno+1,val["entity"]?val["entity"]:"",val.part_number?val.part_number:PartNum,moment(val.time).format('DD/MM/YYYY'),moment(val.time).subtract(moment(val.time).isDST() ? 1 : 0,'hour').format('HH:mm:ss'),shiftName.length>0?shiftName[0].name:'-',...valueFieldData,...result]
                    }
                    else{

                      const formulaArray=[];
                     
                      assetList.forEach(item => {
                        item.calculations.forEach(calc => {
                            formulaArray.push(calc.Formula);
                        })
                      })
                 

                      let result = {};

                    
                        fieldNames.forEach(item => {
                            result[item.id] = '-';
                        });
                        const valueFieldData=Object.values(result)
                
                      partMetrics.forEach((partMetric) => {
                        // Find the corresponding metric in filteredMetricValue array
                        const matchingMetric = filteredMetricValue.find(
                          (filteredMetric) => partMetric.key === filteredMetric.name && val.time === partMetric.time
                        );
                      
                        // If a matching metric is found, use its title in valueData
                        if (matchingMetric) {
                          const title = matchingMetric.title;
                          result[title] = partMetric.value;
                        }
                      });

                      const resultant=calculateFormulas(formulaArray,result)
                      let partCnt = partProductionData.count - (index + (Page * PerPage))
                          let Sno = partProductionData.count - (partProductionData.count - (index + (Page * PerPage)))
                          let PartNum = val['instrument_type']===9 ? val.value : partCnt
                      return [Sno+1,val["entity"]?val["entity"]:"",val.part_number?val.part_number:PartNum,moment(val.time).format('DD/MM/YYYY'),moment(val.time).subtract(moment(val.time).isDST() ? 1 : 0,'hour').format('HH:mm:ss'),shiftName.length>0?shiftName[0].name:'-',...valueFieldData,...resultant]

                    }
                  })
                  ) 
              }  
              setRawData(partData)
        
              setTableData(temptabledata)
          }catch(err){

              setTableData([])
          }
      }else{
          setTableData([])
      }
  } 
   
    const handleColChange = (e, props) => {
        const value = e.map(x => x.id);
        // unchecked = deselected = not  
        let newCell = []
        // eslint-disable-next-line array-callback-return
        headCells.forEach(p => {
            let index = value.findIndex(v => p.id === v)
            if (index >= 0) {
                newCell.push({ ...p, display: 'block' })
            } else {
                newCell.push({ ...p, display: 'none' })
            }
        })
       
        setheadCells(newCell)
        setSelectedColNames(e);
    }
     
   return ( 
       <div className="p-4">
        {
          isBulkDownload ? 
          <React.Fragment>
           
          {!successMessage && !FailedMessage && 
          <React.Fragment>
            <div className='flex justify-center items-center'>
            <Typography value={"If the selected time range exceeds Seven days, you'll need to download the data as a raw report."}  variant={"label-02-m"} />
        </div>
            <div className='flex justify-center gap-2 items-center'>
         <ButtonNDL
         type="primary"
          onClick={() =>getGenerateRawReport(momentZone.tz.guess(),"3ea8b976-c2bc-4a12-b9eb-6164bdd3f2ba",currUser.id,bulkJsonobj.from,bulkJsonobj.to,headPlant.id,bulkJsonobj,true)}
          value={"Continue"}
        />
         <ButtonNDL
         type="secondary"
         onClick={() =>{setcancelText(true);setisBulkDownload(false)}}
          value={"Cancel"}
        />
        </div>
        </React.Fragment>
}
{
  successMessage && 
  <div className='flex justify-center items-center'>
  <Typography  value={"You can check the Status of the bulk report in Generate Bulk Report"} variant={"label-02-m"}  />

</div>
}
{
  FailedMessage && 
  <div className='flex justify-center items-center'>
  <Typography  value={"Something went wrong please try with different date selection"} variant={"label-02-m"}  />

</div>
}

          </React.Fragment>
          :
          <React.Fragment>
             {
                            cancelText && 
                            <div className='flex justify-center items-center'>
                            <Typography  value={"To view the Steel Production report, please choose a time range of less than Seven days."} variant={"label-02-m"}  />
                       
                        </div>
                        }
                        {
                          !cancelText &&
          <React.Fragment>

                          <div style={{ float: "right", marginTop:"10px",marginRight:"10px" }}>
           
                          <SelectBox
                              labelId="Role"
                              options={headCells.filter(x => !x.hide)}
                              isMArray={true}
                              multiple
                              checkbox={false}
                              value={selectedColNames}
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
                      <div style={{display: "flex"}}>
                       {partProductionLoading && <CircularProgress style={{ float: 'right'}} disableShrink size={15} color="primary" />}
                       </div>
                      <EnhancedTable
                          headCells={headCells}
                          data={tabledata}
                          search={true}
                          download={true}
                          rawdata={rawData}
                          count={(partProductionData && (tabledata.length>0)) ? partProductionData.count : 0}
                          
                        
                      />
                      </React.Fragment>
                        }
                      </React.Fragment>

      
        }
          
       </div>
 
   );
}




