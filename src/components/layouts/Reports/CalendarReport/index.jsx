import React, { useState, useEffect, useRef } from 'react';
import {useParams} from "react-router-dom"
import Grid from 'components/Core/GridNDL'
import Typography from 'components/Core/Typography/TypographyNDL'
import { useRecoilState } from "recoil";
import {  selectedPlant, triggerFileUpload, themeMode,CalenderYear,CalendarCurrentPage,SelectedReportType,selectedReportTypeMultiple,lineEntity,downlaodRawData } from "recoilStore/atoms";
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import EnhancedTable from "components/Table/Table";
import Button from 'components/Core/ButtonNDL';
import LoadingScreenNDL from "LoadingScreenNDL";
import GateWayIcon from "assets/neo_icons/Dashboard/GateWay.svg"
import SearchIcon from 'assets/neo_icons/Menu/newTableIcons/search_table.svg?react';
import PDF from 'assets/neo_icons/Explore/pdf.svg?react';
import CalendarFileUploadModel from './components/CalendarFileUploadModel';
import useGetCalendarData from './hooks/useGetCalendarData';
import InputFieldNDL from "components/Core/InputFieldNDL";
import ClickAwayListener from "react-click-away-listener"
import Clear from 'assets/neo_icons/Menu/ClearSearch.svg?react';
import useGetSelectedAssetCalendarData from './hooks/useGetSelectedCalendarData';
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import Tag from 'components/Core/Tags/TagNDL';
import BredCrumbsNDL from "components/Core/Bredcrumbs/BredCrumbsNDL";
import DeleteCalendarReport from './components/DeleteCalendarReport';
import useViewPdfFiles from './hooks/useViewPdfFile';
import CalendarPreviewModel from './components/CalenderPreviewModel';
import Toast from "components/Core/Toast/ToastNDL";
import TooltipNDL from 'components/Core/ToolTips/TooltipNDL';
import HorizontalLineNDL from 'components/Core/HorizontalLine/HorizontalLineNDL';


export default function CalendarReport(props) {//NOSONAR
  let {moduleName,subModule1,subModule2} = useParams()

  const [TriggerFileUpload] = useRecoilState(triggerFileUpload)
  const [skipEffect, setskipEffect] = useState(false)
  const [customdateval] = useRecoilState(CalenderYear)
  const [headPlant] = useRecoilState(selectedPlant)
  const [selectedReportType] = useRecoilState(SelectedReportType)
  const [SelectedReportTypeMultiple] = useRecoilState(selectedReportTypeMultiple)
  const [,setDownlaodRawData] = useRecoilState(downlaodRawData)
  const [EntityList] = useRecoilState(lineEntity);
  const [currTheme] = useRecoilState(themeMode);

  const DialogOpenRef = useRef()
  const SearchRef = useRef()
  const DeleteRef = useRef()
  const previewRef = useRef()
  const [AssetData, setAssetData] = useState([])
  const [SearchAssetData, setSearchAssetData] = useState([])
  const [openSnack, setOpenSnack] = useState(false);
  const [message, SetMessage] = useState('');
  const [type, SetType] = useState('');
  const [rawCalendarData,setrawCalendarData] = useState([])
  const { GetCalendarDataLoading, GetCalendarDatadata, GetCalendarDataerror, getGetCalendarData } = useGetCalendarData()
  const { GetSelectedAssetCalendarDataLoading, GetSelectedAssetCalendarDatadata, GetSelectedAssetCalendarDataerror, getGetSelectedAssetCalendarData } =useGetSelectedAssetCalendarData()
  const {ViewPdfFilesLoading, ViewPdfFilesData, ViewPdfFilesError, getViewPdfFiles} =useViewPdfFiles()
  const [searchColapse, setsearchColapse] = useState(false)
  const [assetPage,setassetPage] = useRecoilState(CalendarCurrentPage)
  const [tableData,settableData] = useState([])
  const [assetName,setassetName] = useState('')
  const [assetDetail,setassetDetail] = useState('')
  const [quater1Count,setquater1Count] = useState(0)
  const [quater2Count,setquater2Count] = useState(0)
  const [quater3Count,setquater3Count] = useState(0)
  const [quater4Count,setquater4Count] = useState(0)
  const [quater1,setquater1] = useState(true)
  const [quater2,setquater2] = useState(true)
  const [quater3,setquater3] = useState(true)
  const [quater4,setquater4] = useState(true)

  


  const headCells = [
    {
      id: 'S.No',
      numeric: false,
      disablePadding: true,
      label: 'S.No' ,
    },
    {
      id: 'Date',
      numeric: false,
      disablePadding: true,
      label: 'Date' ,
    },
    {
      id: 'File',
      numeric: false,
      disablePadding: true,
      label: 'File',
    },
    {
      id: 'Report Type',
      numeric: false,
      disablePadding: true,
      label: 'Report Type',
    },
    {
      id: 'Updated By',
      numeric: false,
      disablePadding: true,
      label: 'Updated By',
    },
    {
      id: 'Updated On',
      numeric: false,
      disablePadding: true,
      label:'Updated On' ,
    },
    {
      id: 'Last Modified by',
      numeric: false,
      disablePadding: true,
      label:'Last Modified by' ,
    },
    {
      id: 'Last Modified On',
      numeric: false,
      disablePadding: true,
      label:'Last Modified On' ,
    },


  ];

  let startDate = moment(customdateval ? customdateval : new Date()).startOf("year").format("YYYY-MM-DDT00:00:00Z")
  let endDate = moment(customdateval ? customdateval : new Date()).endOf("year").format("YYYY-MM-DDT00:00:00Z")

  useEffect(() => {
   if(moduleName === 'calendar' && subModule1 === 'upload' && subModule2){
    if(props.asset && props.range && props.technique && props.moduleFlag){
      setTimeout(() => {
        DialogOpenRef.current.openDialog('',props.asset,props.range,props.technique,props.moduleFlag)
      }, 500)
    }
   
   }
  
      triggerCalendar()
      if(assetDetail){
        getGetSelectedAssetCalendarData(assetDetail.id,startDate,endDate)
    }

  }, [headPlant, customdateval])

  useEffect(() => {
    if (!GetCalendarDataLoading && GetCalendarDatadata && !GetCalendarDataerror) {
      setrawCalendarData(GetCalendarDatadata)
      let filteredData = [...GetCalendarDatadata]
      filteredData = GetCalendarDatadata.filter(x=>x.report_type === selectedReportType)
      setDownlaodRawData(filteredData)
      let asset = []
      asset = EntityList.filter(x=>x.entity_type === 3).map(o=>{
        return{
            "id": o.id,
            "name": o.name,
            "lastUploaded": '-',
            files: { January: false, February: false, March: false, April: false, May: false, June: false, July: false, August: false, September: false, October: false, November: false, December: false },
            selectedYear:moment(startDate).format('YYYY')
            
        }
        
      })
      filteredData.forEach((x, i) => {
        const fieldIndex = asset.findIndex(k => k.id === x.entity_id)
        let uploadMonth = moment(x.upload_date).format('MMM')
        if (fieldIndex !== -1) {
          let dateStr1 = asset[fieldIndex].lastUploaded
          let dateStr2 = moment(x.upload_date).format('YYYY-MM-DD')
          const date1 = new Date(dateStr1);
          const date2 = new Date(dateStr2);
          const latestDate = date1 > date2 ? date1 : date2;
          asset[fieldIndex].lastUploaded = latestDate ?  moment(latestDate).format('YYYY-MM-DD') : '-'
          asset[fieldIndex].files[uploadMonth] = true
          asset[fieldIndex].selectedYear =x.upload_date ?   moment(x.upload_date).format('YYYY') : '-'

          

        } else {
          let body = {
            id: x.entity_id, name: x.entity.name, lastUploaded: moment(x.upload_date).format('YYYY-MM-DD'), files: { January: false, February: false, March: false, April: false, May: false, June: false, July: false, August: false, September: false, October: false, November: false, December: false },selectedYear:moment(x.upload_date).format('YYYY')}
          body.files[uploadMonth] = true
          asset.push(body)
        }

      })
      console.log(asset, "asset")
      setAssetData(asset)
      setSearchAssetData(asset)

    } else {
      setAssetData([])
      setrawCalendarData([])
      setSearchAssetData([])


    }
  }, [GetCalendarDataLoading, GetCalendarDatadata, GetCalendarDataerror,selectedReportType])


  useEffect(()=>{
    if(!GetSelectedAssetCalendarDataLoading &&  GetSelectedAssetCalendarDatadata && !GetSelectedAssetCalendarDataerror){
      // console.log(GetSelectedAssetCalendarDatadata,'GetSelectedAssetCalendarDatadata')

      if(GetSelectedAssetCalendarDatadata.length > 0){
        let filteredId = SelectedReportTypeMultiple.map(x=>x.id)
        let formatedData = [...GetSelectedAssetCalendarDatadata]
        formatedData = formatedData.map(item => {
          return {...item,Quarter: getQuarter(item.upload_date)}
        });
        formatedData = formatedData.filter(x=>filteredId.includes(x.report_type))
        setquater1Count(formatedData.filter(x=>x.Quarter === 1).length)
        setquater2Count(formatedData.filter(x=>x.Quarter === 2).length)
        setquater3Count(formatedData.filter(x=>x.Quarter === 3).length)
        setquater4Count(formatedData.filter(x=>x.Quarter === 4).length)
          if(!quater1){
            formatedData = formatedData.filter(x=>x.Quarter !== 1)
          }
          if(!quater2){
            formatedData = formatedData.filter(x=>x.Quarter !== 2)
  
          } 
          if(!quater3){
            formatedData = formatedData.filter(x=>x.Quarter !== 3)
          } 
          if(!quater4){
            formatedData = formatedData.filter(x=>x.Quarter !== 4)
          }
          
        processedRow(formatedData)
      }else{
        processedRow([])
        setquater1Count(0)
        setquater2Count(0)
        setquater3Count(0)
        setquater4Count(0)
      }
      

    }

  },[GetSelectedAssetCalendarDataLoading, GetSelectedAssetCalendarDatadata, GetSelectedAssetCalendarDataerror,SelectedReportTypeMultiple,quater1,quater2,quater3,quater4,assetPage])

  
  useEffect(() => {
    if (skipEffect) {
      handleUploadFile()
    }
    setskipEffect(true)
  }, [TriggerFileUpload])

  useEffect(()=>{
    if(!ViewPdfFilesLoading &&  ViewPdfFilesData &&  !ViewPdfFilesError){
      if("isDownload" in ViewPdfFilesData ){
        const pdfBlob = base64ToBlob(ViewPdfFilesData.baseImage, 'application/pdf');
        // Create a URL for the Blob
        const pdfUrl = URL.createObjectURL(pdfBlob);
        // Create an anchor element and trigger a download
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = ViewPdfFilesData.path_name;
        document.body.appendChild(link);
        link.click();
        // Clean up and remove the link
        document.body.removeChild(link);
        URL.revokeObjectURL(pdfUrl);
      }else{
        const pdfBlob = base64ToBlob(ViewPdfFilesData.baseImage, 'application/pdf');
      // Create a URL for the Blob
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
      }
    
    }

  },[ViewPdfFilesLoading, ViewPdfFilesData, ViewPdfFilesError])

 

  const getQuarter = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1; // getMonth() returns month from 0-11
  
    if (month >= 1 && month <= 3) {
      return 1;
    } else if (month >= 4 && month <= 6) {
      return 2;
    } else if (month >= 7 && month <= 9) {
      return 3;
    } else if (month >= 10 && month <= 12) {
      return 4;
    }
  }
  const base64ToBlob = (base64, contentType) => {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const triggerCalendar = () => {
  
    getGetCalendarData(headPlant.id, startDate, endDate)
  }

  const clickAwaySearch = () => {
    if (SearchRef.current && SearchRef.current.value  === '')
        setsearchColapse(false)
    else
        setsearchColapse(true)
}

const handleAssetClick =(asset,duplicate = {},isTable)=>{
  console.log(asset,duplicate)
  if(!isTable){
    setassetPage(true)
    setassetName(asset.name)
  }
 
  setassetDetail(asset)
  console.log(asset,'asset')
  getGetSelectedAssetCalendarData(asset.id,startDate,endDate)

}
const handleUploadFile =(assetNames) =>{
  setTimeout(() => {
    DialogOpenRef.current.openDialog(assetNames)
  }, 500)
}

const processedRow=(rawData)=>{
  let tempTableData = []
  if(rawData.length > 0){
    rawData.forEach((x,i)=>{
      tempTableData.push([i+1,moment(x.upload_date).format('YYYY-MM-DD'),x.path_name,x.reportTypeByReportType.name,x.user.name,moment(x.created_ts).format("DD-MM-YYYY"),x.userByUpdatedBy.name,moment(x.updated_ts).format("DD-MM-YYYY")])
    })
  }
  
  settableData(tempTableData)
}
const handleFormulaCrudDialogEdit=(id, value)=>{
    DialogOpenRef.current.EditDialog(value)

}

const handleFormulaCrudDialogDelete=(id, value)=>{
  DeleteRef.current.openDialog(value.id)

}
const breadcrump = [
  {id:1,name:"Calendar View"},
  {id:2,name:assetName},

]

const handleActiveIndex=(index)=>{
  if(index === 0){
    setassetPage(false)
    triggerCalendar()
  }

}

const handleViewPDF=(id,value,download)=>{
  getViewPdfFiles(value.id,value.path_name,download)
}
const handleMonthClick=(month,asset)=>{
  previewRef.current.openDialog(month,asset)
}
const handleTagFilter=(quater)=>{
  console.log(quater,"quater")
  if(quater === 'q1'){
    setquater1(!quater1)

  }
  if(quater === 'q2'){
    setquater2(!quater2)

  }
  if(quater === 'q3'){
    setquater3(!quater3)

  }
  if(quater === 'q4'){
    setquater4(!quater4)

  }


}

const searchfilter=()=>{
  const filterValue = SearchRef.current.value.toLowerCase();
  if(filterValue.length > 0){
    setAssetData(SearchAssetData.filter(item => item.name.toLowerCase().includes(filterValue)) );
  }else{
    setAssetData(SearchAssetData)
  }
 
}
const handleSnackBar = (type, message) => {
  SetType(type); SetMessage(message); setOpenSnack(true);
}
  return (
    <React.Fragment>
      {
        GetCalendarDataLoading && <LoadingScreenNDL />
      }
      <Toast type={type} message={message} toastBar={openSnack}  handleSnackClose={() => setOpenSnack(false)} timer={2000} ></Toast>

      {
        assetPage ?
        <React.Fragment>
 <div className='h-12 p-4 flex bg-Background-bg-primary dark:bg-Background-bg-primary-dark'>
        <BredCrumbsNDL breadcrump={breadcrump} onActive={handleActiveIndex} />
        </div>
        <HorizontalLineNDL variant='divider1' />
        <Grid container spacing={2} style={{padding:'16px'}}>
          <Grid sm={12}>
          
          <div className ={"float-right w-auto py-2 pr-2"}> 
          <div className='flex gap-3  justify-end'>
          <div className='flex gap-2'>
            <Tag  name={`Q1:   ${quater1Count}`} stroke={'#E0E0E0'} style={{ color: quater1 ? "#000000" : "#E0E0E0", backgroundColor: quater1 ? "#E0E0E0" : (currTheme === 'dark' ? "#111111" : "#FFF"), cursor: "pointer",textAlign:'center' }} onClick={()=>handleTagFilter("q1")} />
            <Tag  name={`Q2:   ${quater2Count}`} stroke={'#E0E0E0'} style={{ color: quater2 ? "#000000" : "#E0E0E0", backgroundColor: quater2 ? "#E0E0E0" : (currTheme === 'dark' ? "#111111" : "#FFF"), cursor: "pointer" ,textAlign:'center'}}  onClick={()=>handleTagFilter("q2")} />
            <Tag  name={`Q3:   ${quater3Count}`} stroke={'#E0E0E0'}  style={{ color: quater3 ? "#000000" : "#E0E0E0", backgroundColor: quater3 ? "#E0E0E0" : (currTheme === 'dark' ? "#111111" : "#FFF"), cursor: "pointer" ,textAlign:'center'}} onClick={()=>handleTagFilter("q3")} />
            <Tag  name={`Q4:   ${quater4Count}`} stroke={'#E0E0E0'}  style={{ color: quater4 ? "#000000" : "#E0E0E0", backgroundColor: quater4 ? "#E0E0E0" : (currTheme === 'dark' ? "#111111" : "#FFF"), cursor: "pointer",textAlign:'center' }} onClick={()=>handleTagFilter("q4")} />
            </div>
            <Button type={'tertiary'} value='Upload File' onClick={()=>{handleUploadFile(assetName)}} icon={Plus} />
            </div>
            </div>
          <EnhancedTable
                    headCells={headCells}
                    data={tableData}
                    download={true}
                    search={true}
                    actionenabled={true}
                    rawdata={!GetSelectedAssetCalendarDataLoading &&  GetSelectedAssetCalendarDatadata && !GetSelectedAssetCalendarDataerror ? GetSelectedAssetCalendarDatadata : []}
                    handleEdit={(id, value) => handleFormulaCrudDialogEdit(id, value)}
                    handleDelete={(id, value) => handleFormulaCrudDialogDelete(id, value)}
                    handleViews={(id,value)=>handleViewPDF(id,value)}
                    enableDelete={true}
                    enableViews={true}
                    enableEdit={true}
                />
          </Grid>
        </Grid>
        </React.Fragment>
       

         :
<div className="overflow-x-auto p-4">
<div className="relative overflow-x-auto">
            <div className="overflow-y-auto max-h-[89vh] border   border-Border-border-50  dark:border-Border-border-dark-50 rounded-xl "> {/* Adjust max height as needed */}
                <table className="min-w-full border-collapse  ">
                    <thead className="bg-Background-bg-secondary   dark:bg-Background-bg-secondary-dark sticky top-[-2px]">
                        <tr>
                            <th className="py-2 px-4 text-left  font-geist-sans text-xs font-medium text-primary-text dark:text-primary-text-dark tracking-wider leading-6">
                                <div className='flex justify-between items-center'>
                                    <span className='text-[16px] leading-[18px] font-medium text-Text-text-primary dark:text-Text-text-primary-dark font-geist-sans'>Assets</span>
                                    {searchColapse ? (
                                        <ClickAwayListener onClickAway={clickAwaySearch}>
                                            <div className='w-[76%] h-[40px]'>
                                                <InputFieldNDL
                                                    id="assetSearch"
                                                    inputRef={SearchRef}
                                                    placeholder="Search"
                                                    endAdornment={<Clear style={{ padding: '4px' }} onClick={() => { setsearchColapse(true); setAssetData(SearchAssetData); }} />}
                                                    onChange={searchfilter}
                                                />
                                            </div>
                                        </ClickAwayListener>
                                    ) : (
                                        <SearchIcon onClick={() => { setsearchColapse(true); setTimeout(() => { document.getElementById("assetSearch").focus(); }, 200); }} />
                                    )}
                                </div>
                            </th>
                            {months.map((month) => (
                                <th key={month} className="p-4 text-center font-geist-sans text-[16px] font-medium text-Text-text-primary dark:text-Text-text-primary-dark tracking-wider leading-[18px] ">{month}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {AssetData.length > 0 ? (
                            AssetData.map((asset, index) => (
                                <tr key={asset.id} className={`border border-Border-border-50 dark:border-Border-border-dark-50 ${(index + 1) % 2 === 0 ? 'bg-Background-bg-tertiary dark:bg-Background-bg-tertiary-dark' : 'bg-Background-bg-primary dark:bg-Background-bg-primary-dark'} `}>
                                    <td className="py-2 px-4 hover:bg-Seconary_Button-secondary-button-hover dark:hover:bg-Secondary_Button-secondary-button-hover-dark whitespace-nowrap  cursor-pointer" onClick={() => { handleAssetClick(asset,{id:""}); }}>
                                        <div className="flex items-center">
                                            <img src={GateWayIcon} alt="Asset" className="w-10 h-10 mr-2" />
                                            <div>
                                              <TooltipNDL title={asset.name} placement="bottom" arrow   >
                                              <p className="text-left text-[14px] leading-4 font-geist-sans font-semibold truncate w-[200px] text-Text-text-primary dark:text-Text-text-primary-dark">{asset.name}</p>
                                                </TooltipNDL>
                                                <div className="text-[12px] font-geist-sans text-Text-text-secondary dark:text-Text-text-secondary-dark">Last file uploaded at {asset.lastUploaded} </div>
                                            </div>
                                        </div>
                                    </td>
                                    {months.map((month) => (
                                        <td key={month} className="px-4 hover:bg-Seconary_Button-secondary-button-hover dark:hover:bg-Secondary_Button-secondary-button-hover-dark py-2 whitespace-nowrap text-center  font-geist-sans  cursor-pointer" onClick={() => { handleMonthClick(month, asset); }}>
                                            {asset.files[month] ? <PDF /> : null}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={months.length + 1} className="px-6 py-4 whitespace-nowrap text-center">
                                 {
                                  !GetCalendarDataLoading && 
                                  <Typography value="No Reports Available for this Year" variant="lable-01-m" />

                                 }
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
      } 

      <CalendarPreviewModel ref={previewRef} handleViewPDF={handleViewPDF} handleSnackBar ={handleSnackBar} selectedReportType={selectedReportType} />
      <DeleteCalendarReport ref={DeleteRef}  handleAssetClick={handleAssetClick} assetDetail={assetDetail} handleSnackBar ={handleSnackBar} />
      <CalendarFileUploadModel ref={DialogOpenRef}  triggerCalendar={triggerCalendar} rawCalendarData={rawCalendarData} handleAssetClick={handleAssetClick} handleSnackBar ={handleSnackBar} />
    </React.Fragment>
  )
} 