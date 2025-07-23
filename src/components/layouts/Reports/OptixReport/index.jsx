import React, { useState, useEffect,useRef } from 'react';
import Grid from 'components/Core/GridNDL'
import Typography from 'components/Core/Typography/TypographyNDL'
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import { useTranslation } from 'react-i18next';
import EnhancedTable from "components/Table/Table2"; 
import LoadingScreenNDL from 'LoadingScreenNDL';
import moment from 'moment';  
import DefectCard from './components/DefectCard'; 
import Expand from 'assets/neo_icons/Arrows/Expand.svg?react';
import Collapse from 'assets/neo_icons/Arrows/Colapse.svg?react';
import useGetOptixData from './hooks/useGetOptixData';
import useGetServerSidePagination from './hooks/useGetServerSidePagination';
import { useRecoilState } from "recoil";
import {
  selectedPlant,
  customdates,
  optixOptions,
  optixServerityOption,
  selectedOptixAsserts,
  defTypes,selecteddefectType,userData,snackType,snackToggle,snackMessage
} from "recoilStore/atoms";
import useGenerateRawReport from 'components/layouts/Reports/hooks/useGenerateRawReport';
import DownloadPopupModal from './components/DownloadDataPopup';
import useGetDefectImage from './hooks/useGetDefectImage';

import * as momentZone from 'moment-timezone';

export default function OptixReport(props){
  const downloadModalRef = useRef();
  const [currUser] = useRecoilState(userData);
    const { t } = useTranslation();
    const [headPlant] = useRecoilState(selectedPlant)
    const [customVals] = useRecoilState(customdates)
    const [optixOption] = useRecoilState(optixOptions)
  const [SeverityLevel] = useRecoilState(optixServerityOption)
  const [sdeftype, setsdeftype] = useRecoilState(selecteddefectType)
  const [rawData,setrawData] = useState([])
  const [selectedTableCol,setselectedTableCol] = useState(null)
  const [SelectedOptixAsset] = useRecoilState(selectedOptixAsserts)
  const [ImagePath,setImagePath] = useState('')
  const [selectedDefect,setSelectedDefect] = useState([])
  const [CloseAccordian,setCloseAccordian] = useState(false)
  const [, setDefTypes]= useRecoilState(defTypes)
  const [filteredData, setfilteredData]= useState([])
    const [tableheadCells,settableheadCells] = useState([
        {
            id: 'S.No',
            numeric: false,
            disablePadding: true,
            label: t('S.No'),
        },
        {
            id: 'Date',
            numeric: false,
            disablePadding: true,
            label: t('Date'),
        },
        {
            id: 'Time',
            numeric: false,
            disablePadding: true,
            label: t('Time'),
        },
        {
            id: 'Defect Length (mm)',
            numeric: false,
            disablePadding: true,
            label: t('Defect Length (mm)'),
        },
        {
            id: 'Defect Width(mm)',
            numeric: false,
            disablePadding: true,
            label: t('Defect Width(mm)'),
        },
        {
            id: 'Defect Depth (Intensity)',
            numeric: false,
            disablePadding: true,
            label: t('Defect Depth (Intensity)'),
        },
        {
            id: 'Severity',
            numeric: false,
            disablePadding: true,
            label: t('Severity'),
        },
        {
            id: 'Side',
            numeric: false,
            disablePadding: true,
            label: t('Side'),
        },
        {
            id: 'Defect Type',
            numeric: false,
            disablePadding: true,
            label: t('Defect Type'),
        },
      
       
     
       
    ])
    const [selectedcolnames,setselectedcolnames] = useState([])
    const [downloadFormatedData, setDownlaodFormatedData] = useState([])
    const [tableData,settableData]=useState([])
    // const [ChartData,setChartData] = useState({left:[],right : []})
    const [ChartData,setChartData] = useState({})
    const [totalDefect,setTotalDefect] = useState('')
    const [baseimage,setbaseimage] = useState('')
    const [selectedImageTime,setselectedImageTime] = useState({})
    const [isMorethanDay,setisMorethanDay] = useState(false)
    const [tileurl,settileurl] = useState('')
    const [Asset,setAsset] = useState({});
    const [Page,setPage] = useState(0)
    const [PerPage,setPerPage] = useState(100);
    const[initial,setInitial]=useState(true);
    const [readyToOpenModal, setReadyToOpenModal] = useState(false);
    const [instrumentid, setInstrumentid] = useState('');
    const [defCount,setDefcount]=useState(0);
    const [dataSets,setDatasets]=useState([]);
    const [lastTimeData,setLastTimeData]=useState("");
    const [overAllcount,setOverAllCount]=useState(0);
    const[enableModal,setEnableModal]=useState(false);
    const [, setType] = useRecoilState(snackType);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, setSnackMessage] = useRecoilState(snackMessage);
    const [showLoading, setShowLoading] = useState(false);
    const [formatJson, setFormatJson] = useState({});
const [pageTimestamps, setPageTimestamps] = useState({});
    // Secondary table columns
    // This table is used to show the defect details in a collapsible row
    const secondaryTable = [
        {
            id: 'S.No',
            numeric: false,
            disablePadding: true,
            label: t('S.No'),
        },
        {
            id: 'Defect Length (mm)',
            numeric: false,
            disablePadding: true,
            label: t('Defect Length (mm)'),
        },
        {
            id: 'Defect Width (mm)',
            numeric: false,
            disablePadding: true,
            label: t('Defect Width (mm)'),
        },{
            id: 'Defect Depth (Intensity)',
            numeric: false,
            disablePadding: true,
            label: t('Defect Depth (Intensity)'),
        },{
            id: 'Quadrant',
            numeric: false,
            disablePadding: true,
            label: t('Quadrant'),
        },{
            id: 'Coords',
            numeric: false,
            disablePadding: true,
            label: t('Coords')
        },{
            id: 'Severity',
            numeric: false,
            disablePadding: true,
            label: t('Severity'),
        },
        {
            id: 'Defect Type',
            numeric: false,
            disablePadding: true,
            label: t('Defect Type'),
        },
    ]
    const {OptixdataLoading, OptixdataData, OptixdataError, getOptixData } =useGetOptixData()
    const { DefectImageLoading, DefectImageData, DefectImageError, getDefectImage } = useGetDefectImage();
    const {AIdataLoading, AIdataData, AIdataError, getAIcameraData } =useGetServerSidePagination();

    const { GenerateRawReportLoading, GenerateRawReportData, GenerateRawReportError, getGenerateRawReport } = useGenerateRawReport();


    useEffect(() => {
      if (enableModal) {
        setShowLoading(true);
        setReadyToOpenModal(true);  
      }
    }, [enableModal]);

useEffect(() => {
  if (!GenerateRawReportLoading && GenerateRawReportData && !GenerateRawReportError) {
    if (GenerateRawReportData.id) {
      setEnableModal(true);
      setOpenSnack(false); 
   
    } 
      else{
        setOpenSnack(true)
        setType("warning")
        setSnackMessage("Unable To Run Bulk Report Please Try Again")
      }
    }
  
}, [GenerateRawReportLoading, GenerateRawReportData, GenerateRawReportError]);


useEffect(() => {
  if (readyToOpenModal) {
    const timer = setTimeout(() => {
      if (downloadModalRef.current?.handleAlarmDownloadModal) {
    
        downloadModalRef.current.handleAlarmDownloadModal(true);
      } else {
        console.warn("Modal ref or method not ready yet.")
      }
      setShowLoading(false);
      setReadyToOpenModal(false);
    }, 200); 

    return () => clearTimeout(timer);
  }
}, [readyToOpenModal]);




  useEffect(() => {
  if (
    !AIdataLoading &&
    AIdataData &&
    !AIdataError &&
    Array.isArray(AIdataData.data) &&
    AIdataData.data.length > 0
  ) {
    setDatasets(AIdataData.data);

    const currentTimestamp = AIdataData.pagination?.nextTimestamp || "";

   

    setPageTimestamps((prev) => ({
      ...prev,
      [Page]: currentTimestamp,
    }));

    if (AIdataData.defect_count) setDefcount(AIdataData.defect_count || 0);
    if (AIdataData.data_count) setOverAllCount(AIdataData.data_count);
  }
}, [AIdataData, AIdataLoading, AIdataError, Page,instrumentid]);


useEffect(() => {
  if (instrumentid) {
    setPage(0);  
  }
}, [instrumentid]);
  
    useEffect(() => {
      if (
        instrumentid &&
        customVals?.StartDate &&
        customVals?.EndDate
      ) {
        setFormatJson({})
          setPage(0)
          setDefcount(0);
          setOverAllCount(0)
        getAIcameraData(
          headPlant.schema,
          instrumentid,
          moment(customVals.StartDate).format("YYYY-MM-DDTHH:mm:ss"),
          moment(customVals.EndDate).format("YYYY-MM-DDTHH:mm:ss"),
          100,
          true
        );


      }
    }, [instrumentid, customVals]);
    
    // useEffect(() => {
    //   if (PerPage > 100) {
    //     getAIcameraData(
    //       headPlant.schema,
    //       instrumentid,
    //       moment(customVals.StartDate).format("YYYY-MM-DDTHH:mm:ss"),
    //       moment(customVals.EndDate).format("YYYY-MM-DDTHH:mm:ss"),
    //       PerPage,
    //       true
    //     );
    //   }
    // }, [PerPage]);
  

    useEffect(()=>{

        if(optixOption.length > 0){
            let selectedAssert = optixOption.filter(x=>x.id === SelectedOptixAsset)
            setAsset(selectedAssert)
            if(selectedAssert.length > 0 ){
                let instrumentids = selectedAssert[0].entity_instruments.map(x=>x.instrument_id).join(',');
                setInstrumentid(instrumentids)
                const startTime = new Date(customVals.StartDate).getTime();
                const endTime = new Date(customVals.EndDate).getTime();
  
                // Calculate the difference in milliseconds
                const timeDifference = endTime - startTime;
    
                // Convert milliseconds to hours
                const hoursDifference = timeDifference / (1000 * 60 * 60);
                if(hoursDifference > 24){
                    setisMorethanDay(true)
                }else{
                    setisMorethanDay(false)
    
                }
                setImagePath(selectedAssert[0].info.ImageURL)
                setCloseAccordian(!CloseAccordian)
                // getOptixData(headPlant.schema,instrumentid,moment(customVals.StartDate).format("YYYY-MM-DDTHH:mm:ss"),moment(customVals.EndDate).format("YYYY-MM-DDTHH:mm:ss"))
            
            }
           
        }
        
       
    },[headPlant,customVals,optixOption])





    useEffect(()=>{
        if(!DefectImageLoading &&  DefectImageData &&  !DefectImageError){
            if(DefectImageData.img){
                setbaseimage(`data:image/jpeg;base64,${DefectImageData.img}`)
            }else{
                setbaseimage('No Image Found')

            }
        }

    },[DefectImageLoading, DefectImageData, DefectImageError])

    useEffect(()=>{
        if(sdeftype && sdeftype.length > 0){
        setSelectedDefect(sdeftype)
        }
    },[sdeftype])

    useEffect(() => {
      try {
        // ------------------------------------------------------------------
        // 1. Pull raw data safely
        // ------------------------------------------------------------------
        const rawData = AIdataData?.data ?? [];
        if (AIdataLoading || AIdataError || !Array.isArray(rawData) || rawData.length === 0) {
          processedRow([]);          // ← reset parent state
          setbaseimage('');          // ← clear image
          return;                    // ← bail out early
        }
    
        // ------------------------------------------------------------------
        // 2. Normalise category keys and filter by severity
        // ------------------------------------------------------------------
        const severityIds = (SeverityLevel ?? []).map(s => s.id?.toLowerCase?.() ?? '');
     
        const normalised = rawData.map(item =>
          item?.category
            ? { ...item, category: item.category.toLowerCase() }
            : item
        );

      
    
        let filteredData = normalised
          .filter(item => severityIds.includes(item.category))
          .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
    
        // ------------------------------------------------------------------
        // 3. Parse defect‑details string → JSON, pull max length/width/depth
        // ------------------------------------------------------------------
        filteredData = filteredData.map(item => {
          const detailsStr = item?.def_details?.slice?.(1, -1) ?? '';
          const detailsArr = detailsStr
            ? detailsStr.split(',').map(rec => {
                const parts = rec.split('x');
                return {
                  length: parseFloat(parts[0] ?? 0),
                  width:  parseFloat(parts[1] ?? 0),
                  xcoord: parseInt(parts[2] ?? 0, 10),
                  ycoord: parseInt(parts[3] ?? 0, 10),
                  depth:  parseInt(parts[4] ?? 0, 10),
                  type:   parts[5] ?? ''
                };
              })
            : [];
    
          let defectLength = '-';
          let defectWidth  = '-';
          let defectDepth  = '-';
    
          if (detailsArr.length > 0) {
            const maxDims = findMaxDimensions(detailsArr);
            defectLength = maxDims.maxLength;
            defectWidth  = maxDims.maxWidth;
            defectDepth  = detailsArr.reduce(
              (max, o) => (o.depth > max ? o.depth : max),
              detailsArr[0].depth
            );
          }
    
          return {
            ...item,
            def_details_json: detailsArr,
            Defect_length: defectLength,
            Defect_width:  defectWidth,
            Defect_depth:  defectDepth,
            isOpen: false
          };
        });
        setfilteredData(filteredData);
    
        // ------------------------------------------------------------------
        // 4. Build the download‑ready flat array
        // ------------------------------------------------------------------
        const downloadData = [];
        let serialNo = 1;
    
        rawData
          .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
          .forEach(rec => {
            const dimsArr      = rec?.def_details?.slice?.(1, -1)?.split(',') ?? [];
            const quadrantsArr = rec?.quadrants?.slice?.(1, -1)?.split(',') ?? [];
    
            dimsArr.forEach((dim, idx) => {
              const parts = dim.split('x');
              downloadData.push({
                'S.No':                serialNo++,
                'Date':                moment(rec.time).format('YYYY-MM-DD'),
                'Time':                moment(rec.time).format('HH:mm:ss'),
                'Defect Length (mm)':  parts[0] ?? '-',
                'Defect Width(mm)':    parts[1] ?? '-',
                'Defect Depth (Intensity)': parts[4] ?? '-',
                'Quadrant':            quadrantsArr[idx] ?? '-',
                'Coords(mm)':          `(${parts[2] ?? '-'}, ${parts[3] ?? '-'})`,
                'Severity':            rec.category ?? '-',
                'Side':                rec.board_side ?? '-',
                'Defect Type':         parts[5] ?? '-'
              });
            });
          });
    
        setDownlaodFormatedData(downloadData);

      } catch (err) {
        console.error('Error while processing AI data →', err);
        // fail‑safe resets so UI doesn’t break
        processedRow([]);
        setbaseimage('');
        setfilteredData([]);
        setDownlaodFormatedData([]);
      }
    }, [AIdataLoading, AIdataData, AIdataError, SeverityLevel]);

      // const handleChangeIsopen = (index,jsonIndex) => {
      //   // console.log("index",index)
      //   // const filterAccordionarray = rawData.map((x, i) => {
      //   //   console.log("x___I",i)
      //   //     console.log("i === index",i === index)  
      //   //   if (i === index) {
            
      //   //     return { ...x, isOpen: !(x.isOpen ?? false) }; 
      //   //   } else {
      //   //     return x;
      //   //   }
      //   // });

      //   // setrawData(filterAccordionarray);
      //   setFormatJson(prev=> ({
      //     ...prev,
      //     [index]: !jsonIndex
      //   }));
        
      // };

const handleChangeIsopen = (globalIndex, sno) => {
  setFormatJson(prev => ({
    ...prev,
    [sno]: !prev[sno]  // Use S.No as key
  }));
};



      useEffect(() => {
        const rawData = AIdataData?.data || [];
        const distinctDefTypes = [
            ...new Set(
              rawData && Array.isArray(rawData) && rawData.length > 0
                ? rawData&& rawData.map(item => item.def_type)
                : []
            ),
          ];     
          

        
        const convertedDefTypes = distinctDefTypes.map(defType => ({
          id: defType && defType.length > 0 && defType.toLowerCase(),
          name: defType,
        }));
        setDefTypes(convertedDefTypes);
        setsdeftype(convertedDefTypes)
      }, [AIdataData]);      

      useEffect(() => {
      
        const selectedDefectTypes = selectedDefect.map(def => def.name);

        const filteredResults = filteredData.filter(item => 
          selectedDefectTypes.includes(item.def_type ? item.def_type : "--")
        );

        processedRow(filteredResults);
      
      }, [filteredData, selectedDefect]);      
    
    useEffect(() => {
        settableheadCells(tableheadCells)
        setselectedcolnames(tableheadCells)
      }, [])
    

      useEffect(()=>{
          
        if(rawData.length > 0 && optixOption.length > 0){
            const ImageHolder = rawData[0]
            setselectedImageTime(ImageHolder)
            setselectedTableCol(0)
            if (headPlant.plant_name==='mirror_chennai'){
              const img_name = ImageHolder.img_name.replace(/\.[^/.]+$/, ".dzi");
              settileurl(ImagePath +'/cvimg/tiles/'+img_name)
          
            }
            else{
              getDefectImage(headPlant.schema,ImageHolder.img_name,ImagePath)

            }

        }
        else if (rawData.length == 0 && headPlant.plant_name==='mirror_chennai'){
          settileurl(ImagePath +'/cvimg/tiles/'+null)

        }
        else if (rawData.length == 0 && headPlant.plant_name==='mirror_chennai'){//NOSONAR
          settileurl(ImagePath +'/cvimg/tiles/'+null)
        }
       

      },[rawData,ImagePath,Asset])

      useEffect(() => {
        if (selectedImageTime.img_name) {
          const img_name = selectedImageTime.img_name.replace(/\.[^/.]+$/, ".dzi");
          settileurl(`${ImagePath}/cvimg/tiles/${img_name}`);
        }
      }, [ImagePath,setselectedImageTime.img_name]);

const normalizeBoardSide = (val) => {
  const trimmed = typeof val === 'string' ? val.trim() : '';
  return trimmed || '--'; 
};
      const processedRow=(Optix_data)=>{
        let tempTableData = [];
        const boardSideGroups = {}; 
        // const  TotalDefect = Optix_data.map(x=>x.no_of_defects);
        // const sum = TotalDefect.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        // setTotalDefect(sum)
        
        Optix_data.forEach((x, i) => {
          // Push to tempTableData
          tempTableData.push([
            (Page * PerPage) + (i + 1),
            moment(x.time).format("YYYY-MM-DD"),
            moment(x.time).format("HH:mm:ss"),
            x.Defect_length || '-',
            x.Defect_width || "-",
            x.Defect_depth || '-',
            x.category || "-",
            x.board_side || "-",
            x.def_type || '-'
          ]);
        
          // Group dynamically by board_side
          const side = normalizeBoardSide(x.board_side);
            // console.log("side", side);
        
         if (!boardSideGroups[side]) {
      boardSideGroups[side] = []; 
    }
          boardSideGroups[side].push(x);
        });

        setChartData(boardSideGroups)
        settableData(tempTableData)
        setrawData(Optix_data)
      }

 

      function findMaxDimensions(objects) {
        let maxLength = -Infinity;
        let maxWidth = -Infinity;
        let maxObject = null;
    
        for (const obj of objects) {
            if (obj.hasOwnProperty('length') && obj.hasOwnProperty('width')) {
                if (obj.length > maxLength) {
                    maxLength = obj.length;
                    maxWidth = obj.width;
                    maxObject = obj;
                } else if (obj.length === maxLength && obj.width > maxWidth) {
                    maxWidth = obj.width;
                    maxObject = obj;
                }
            }
        }
    
        return maxObject ? { maxLength,maxWidth } : null;
    }
    const handleColChange = (e, prop) => {
        const value = e.map(x => x.id);
       
        let newCell = []
        // eslint-disable-next-line array-callback-return
        tableheadCells.map(p => {
            var index = value.findIndex(v => p.id === v)
            if (index >= 0) {
                newCell.push({ ...p, display: 'block' })
            } else {
                newCell.push({ ...p, display: 'none' })
            }
        })
        settableheadCells(newCell)
        setselectedcolnames(e);
    }

    const QuadrantCalculation = (x_val,y_val)=>{
       const  y_slap = (y_val/200)
       const  x_slap = (x_val/128)+1
       const  ans = (y_slap*4)+x_slap
       return ans ? ans.toFixed(2) : "-"
    }

    const GetCollapsibleRow=(value,id)=>{
       const rowIndex = id;
       const rowData = rawData && rawData[rowIndex] ? rawData[rowIndex] : null;
       const ChildTableData = rowData && rowData.def_details_json ? rowData.def_details_json : [];
       const Severity = value.Severity;
       let quadrantData = rowData && rowData.quadrants ? rowData.quadrants : [];
       let getTime = rowData && rowData.time ? rowData.time : null;

      if (typeof quadrantData === "string") {
        try {
          quadrantData = JSON.parse(quadrantData).map(Number); 
        } catch (error) {
          console.error("Error parsing quadrants:", quadrantData, error);
          quadrantData = []; 
        }
      }
    
       const date1 = moment('2025-02-25 11:00:00'); 
        const date2 = moment(getTime);

      let tempTableData = []
      ChildTableData.forEach((x,i)=>{
        let quadrantValue = "-";//NOSONAR
        if (moment(date1).isBefore(moment(date2))) {
          quadrantValue = Array.isArray(quadrantData) && quadrantData[i] !== undefined ? quadrantData[i] : "-";
      } else {
          quadrantValue = QuadrantCalculation(x.xcoord, x.ycoord);
      }
        tempTableData.push([i+1,x.length,x.width,x.depth, quadrantValue,"("+x.xcoord+","+x.ycoord+")",Severity,x.type ? x.type : '-',])


      })


        return(
            <div style={{ width: "100%"}}>
            <EnhancedTable 
            headCells={selectedcolnames.length > 0 ? secondaryTable : []}
            data={selectedcolnames.length > 0 ?  tempTableData : []}
            rawdata={[]}
            hidePagination
            rowsPerPage={selectedcolnames.length > 0 ?  tempTableData.length : 10}
            backgroundColorChild = {'#E0E0E0'}

            />

            
            </div>
        )
    }
    const RenderImageChange=(id)=>{
        const ImageHolder = rawData[id]
        setselectedImageTime(ImageHolder)
        setselectedTableCol(id)
        
        if (headPlant.plant_name==='mirror_chennai' && ImageHolder.img_name && ImagePath){
          const img_name = ImageHolder.img_name.replace(/\.[^/.]+$/, ".dzi");
            settileurl(ImagePath +'/cvimg/tiles/'+img_name)
          
        }
        else{
          getDefectImage(headPlant.schema,ImageHolder.img_name,ImagePath)
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });


    }



   function onChangePage(e, perpage) {


  if (!instrumentid) {
    console.warn("Instrument ID not set yet!");
    return;
  }

  const formattedStart = moment(customVals.StartDate).format("YYYY-MM-DDTHH:mm:ss");
  const formattedEnd = moment(customVals.EndDate).format("YYYY-MM-DDTHH:mm:ss");

  // ✅ Use the timestamp of the *previous page*
  const timestampToUse = e === 0 ? null : pageTimestamps[e - 1] || "";

  const isFirstPage = e === 0;

  getAIcameraData(
    headPlant.schema,
    instrumentid,
    formattedStart,
    formattedEnd,
    perpage,
    isFirstPage,
    timestampToUse
  );

  setPage(e);
  setPerPage(perpage);
}

    
  
  const handleDownloadDialog = async () => {
    const startDate = moment(new Date(customVals.StartDate)).format("YYYY-MM-DDTHH:mm:ssZ");
    const endDate = moment(new Date(customVals.EndDate)).format("YYYY-MM-DDTHH:mm:ssZ");
  
    try {
      const assetObj = {
        schema:headPlant.schema,
        asset_id: Asset.map(x => x.id).join(","),      
        asset_name: Asset.map(x => x.name).join(","),  
        instrument_id: instrumentid                  
      }

    
      await getGenerateRawReport(
        momentZone.tz.guess(),
        "5ae212e5-b818-4fa4-9496-575f188955e2",
        currUser.id,
        startDate,
        endDate,
        headPlant.id,
        assetObj,
        true,
        null
  
        
      );
    } catch (error) {
      console.error("Error while generating report", error);
    }
  };

  
    return(
        <div className='p-4'>
    {showLoading && <LoadingScreenNDL />}
        <DownloadPopupModal
                ref={downloadModalRef} 
                setEnableModal={setEnableModal}
                forwardBulkRef={props.forwardBulkRef}

            />
         
            {
                (AIdataLoading  || DefectImageLoading )&&
                < LoadingScreenNDL />
            }
         <div >
         <DefectCard 
         ChartData ={ChartData}
         AIdataData={dataSets}
         isMorethanDay = {isMorethanDay}
         selectedImageTime=  {selectedImageTime}
         baseimage={baseimage}
         tileurl={tileurl}
         SeverityLevel = {SeverityLevel.map(x=>x.id)}
         />
         </div>
         <br></br>
         <Grid container spacing={2}>
         <Grid item xs={12} sm={12}>
         <div className ={"float-left"}>
         <div className='flex gap-6 items-center p-4'>
        <Typography value={'Defect Details'} variant='heading-01-xs'
                    color='secondary' />
        {/* <Typography value={`Total Defect Count :${totalDefect ? totalDefect : "--" }`} color='secondary' variant="label-02-m"/> */}
        <Typography value={`Total Defect Count :${defCount ? defCount : "--" }`} color='secondary' variant="label-02-m"/>
        </div>
        </div>
        <div className ={"float-right w-[200px] p-2.5"}> 
                                <SelectBox
                                        labelId="tablefilter"
                                        id={"contract-tablefilter"}
                                        auto={false}
                                        multiple={true}
                                        options={tableheadCells}
                                        isMArray={true}
                                        checkbox={false}
                                        value={selectedcolnames}
                                        onChange={(e) => handleColChange(e)}
                                        keyValue="label"
                                        keyId="id"
                                        selectAll={true}
                                        selectAllText={"Select All"}
                                        placeholder={t("Select column")}

                                    />
                                </div>
        
        
                                  <EnhancedTable
                                        headCells={tableheadCells}
                                        data={tableData}
                                        rawdata={downloadFormatedData}
                                        search={true}
                                        download={Number(overAllcount) < 100}
                                        bulkEnable={Number(overAllcount) > 100}
                                        actionenabled={true}
                                        collapsibleTable={true}
                                        multitable={true}
                                        GetCollapsibleRow={(value, id) => GetCollapsibleRow(value, id)}
                                        expandIcon={Expand}
                                        actionButton ={'View Image'}
                                        collapsibleIcon ={Collapse}
                                        selectedTableCol={selectedTableCol}
                                        rowsPerPage={PerPage}
                                       PerPageOption={[10,50,100]}
                                       onPageChange={onChangePage}
                                       page={Page}
                                       serverside={true}
                                       count={overAllcount ? overAllcount : 0}
                                       hidePageSelection={true}
                                        ActionButtonClick={RenderImageChange}
                                        closeAccordian = {CloseAccordian}
                                        verticalMenu={true}
                                        groupBy={'sda_report'}
                                        handleChangeIsopen={handleChangeIsopen}
                                        formatJson={formatJson}
                                     unFormatedData={()=> console.log("unformated data")}
                                        downloadFormatedData={downloadFormatedData}
                                        handleDownloadDialog={handleDownloadDialog}
                                     
                                    />
        
       
            </Grid>


         </Grid>

        </div>
    )
}